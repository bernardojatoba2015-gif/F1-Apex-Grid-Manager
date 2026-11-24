import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  FolderOpen,
  ImagePlus,
  Play,
  Plus,
  Search,
  Settings as SettingsIcon,
  Shield,
  Sliders,
  Trash2,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import {
  buildBaseTeams,
  buildInitialDrivers,
  buildInitialStaff,
  buildObjectivesForTeam,
  createCareerFromCustom,
  createCareerFromExisting,
  ENGINE_SUPPLIERS,
} from '../data/f1Data';
import { formatMoney, getCarOverall, getDriverOverall, STAFF_ROLE_LABELS } from '../engine/simulation';
import {
  clearAllCareers,
  deleteCareerById,
  getSavedCareerSummaries,
  loadCareerById,
  saveGlobalSettings,
  SavedCareerSummary,
} from '../storage/careerStorage';
import {
  CareerSettings,
  CareerState,
  CrestIcon,
  CrestShape,
  LiveryPattern,
  SeasonBase,
} from '../types/game';
import { processLogoImageFile } from '../utils/imageUpload';
import { DriverAvatar } from './visuals/DriverAvatar';
import { F1CarLivery } from './visuals/F1CarLivery';
import { TeamLogo } from './visuals/TeamLogo';

interface StartMenuProps {
  settings: CareerSettings;
  onUpdateSettings: (s: CareerSettings) => void;
  onStartCareer: (career: CareerState) => void;
  latestCareerSummary: SavedCareerSummary | null;
}

type MenuScreen = 'home' | 'new_mode' | 'pick_existing' | 'create_custom' | 'load' | 'settings';

const CREST_SHAPES: { id: CrestShape; label: string }[] = [
  { id: 'shield', label: 'Escudo' },
  { id: 'hexagon', label: 'Hexágono' },
  { id: 'diamond', label: 'Diamante' },
  { id: 'wing', label: 'Asa' },
  { id: 'circle', label: 'Circular' },
  { id: 'crest', label: 'Brasão' },
];

const CREST_ICONS: { id: CrestIcon; label: string }[] = [
  { id: 'wing', label: 'Asa Aero' },
  { id: 'apex', label: 'Apex' },
  { id: 'bolt', label: 'Raio' },
  { id: 'crown', label: 'Coroa' },
  { id: 'flame', label: 'Chama' },
  { id: 'star', label: 'Estrela' },
  { id: 'target', label: 'Alvo' },
  { id: 'compass', label: 'Bússola' },
];

const LIVERY_PATTERNS: { id: LiveryPattern; label: string }[] = [
  { id: 'aero', label: 'Aero Split' },
  { id: 'classic', label: 'Clássica' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'stripe', label: 'Faixa Dupla' },
  { id: 'stealth', label: 'Carbono Stealth' },
];

const COLOR_PRESETS = [
  { name: 'Vermelho Corsa', primary: '#DC0000', secondary: '#14171F', accent: '#FACC15' },
  { name: 'Verde Britânico', primary: '#006F62', secondary: '#091B18', accent: '#CEDC00' },
  { name: 'Azul Elétrico', primary: '#005AFF', secondary: '#0A1328', accent: '#38BDF8' },
  { name: 'Laranja Papaya', primary: '#FF7A00', secondary: '#151821', accent: '#38BDF8' },
  { name: 'Prata Titânio', primary: '#94A3B8', secondary: '#0F131A', accent: '#E10600' },
  { name: 'Dourado Lotus', primary: '#18181B', secondary: '#09090B', accent: '#EAB308' },
];

export const StartMenu: React.FC<StartMenuProps> = ({
  settings,
  onUpdateSettings,
  onStartCareer,
  latestCareerSummary,
}) => {
  const [screen, setScreen] = useState<MenuScreen>('home');
  const [savedList, setSavedList] = useState<SavedCareerSummary[]>(() => getSavedCareerSummaries());
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Mode A state
  const [seasonBase, setSeasonBase] = useState<SeasonBase>(2026);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('ferrari');
  const [principalName, setPrincipalName] = useState<string>('Alex Silva');
  const [customizeExistingLineup, setCustomizeExistingLineup] = useState(false);
  const [existingDriver1Id, setExistingDriver1Id] = useState<string>('');
  const [existingDriver2Id, setExistingDriver2Id] = useState<string>('');

  // Mode B state
  const [customName, setCustomName] = useState('Apex Brasil Racing');
  const [customShort, setCustomShort] = useState('APX');
  const [customPrincipal, setCustomPrincipal] = useState('Alex Silva');
  const [customPrimary, setCustomPrimary] = useState('#005AFF');
  const [customSecondary, setCustomSecondary] = useState('#0A1328');
  const [customAccent, setCustomAccent] = useState('#CEDC00');
  const [customPattern, setCustomPattern] = useState<LiveryPattern>('aero');
  const [customShape, setCustomShape] = useState<CrestShape>('shield');
  const [customIcon, setCustomIcon] = useState<CrestIcon>('apex');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | undefined>(undefined);
  const [customLogoError, setCustomLogoError] = useState<string | null>(null);
  const [uploadingCustomLogo, setUploadingCustomLogo] = useState(false);
  const customLogoInputRef = useRef<HTMLInputElement | null>(null);
  const [customEngineId, setCustomEngineId] = useState('mercedes');
  const [customBudget, setCustomBudget] = useState(35000000);
  const [customTier, setCustomTier] = useState<'top' | 'midfield' | 'backmarker'>('midfield');
  const [customObjective, setCustomObjective] = useState<'title' | 'top5' | 'points'>('top5');
  const [customDriver1Id, setCustomDriver1Id] = useState<string>('ricciardo');
  const [customDriver2Id, setCustomDriver2Id] = useState<string>('camara');

  // Shared Driver Picker Modal state
  const [driverPickerTarget, setDriverPickerTarget] = useState<{
    mode: 'custom' | 'existing';
    slot: 1 | 2;
  } | null>(null);
  const [driverPickerFilter, setDriverPickerFilter] = useState<'all' | 'f2' | 'f1_free'>('all');
  const [driverPickerSearch, setDriverPickerSearch] = useState('');

  const previewTeams = useMemo(() => buildBaseTeams(seasonBase), [seasonBase]);
  const previewDrivers = useMemo(() => buildInitialDrivers(seasonBase), [seasonBase]);
  const previewStaff = useMemo(() => buildInitialStaff(previewTeams), [previewTeams]);

  const selectedTeam = previewTeams.find((t) => t.id === selectedTeamId) ?? previewTeams[0];
  const selectedTeamDrivers = previewDrivers.filter((d) => d.teamId === selectedTeam.id);
  const selectedTeamStaff = previewStaff.filter((s) => s.teamId === selectedTeam.id);
  const selectedTeamObjectives = buildObjectivesForTeam(selectedTeam, previewTeams.length);
  const selectedEngine = ENGINE_SUPPLIERS.find((e) => e.id === selectedTeam.engineSupplierId);

  const freeAndF2Drivers = useMemo(
    () =>
      previewDrivers
        .filter((d) => d.role === 'free_agent' && d.teamId === null)
        .sort((a, b) => getDriverOverall(b) - getDriverOverall(a)),
    [previewDrivers]
  );

  const resolvedCustomDriver1 =
    freeAndF2Drivers.find((d) => d.id === customDriver1Id) ?? freeAndF2Drivers[0];
  const resolvedCustomDriver2 =
    freeAndF2Drivers.find((d) => d.id === customDriver2Id && d.id !== resolvedCustomDriver1?.id) ??
    freeAndF2Drivers.find((d) => d.id !== resolvedCustomDriver1?.id) ??
    freeAndF2Drivers[1];

  const defaultExisting1 =
    selectedTeamDrivers.find((d) => d.role === 'starter_1') ?? selectedTeamDrivers[0];
  const defaultExisting2 =
    selectedTeamDrivers.find((d) => d.role === 'starter_2') ?? selectedTeamDrivers[1];

  const existingSelectablePool = useMemo(() => {
    const teamPool = previewDrivers.filter((d) => d.teamId === selectedTeam.id);
    const seen = new Set(teamPool.map((d) => d.id));
    return [...teamPool, ...freeAndF2Drivers.filter((d) => !seen.has(d.id))];
  }, [previewDrivers, selectedTeam.id, freeAndF2Drivers]);

  const resolvedExistingDriver1 =
    (customizeExistingLineup
      ? existingSelectablePool.find((d) => d.id === existingDriver1Id)
      : undefined) ?? defaultExisting1;
  const resolvedExistingDriver2 =
    (customizeExistingLineup
      ? existingSelectablePool.find(
          (d) => d.id === existingDriver2Id && d.id !== resolvedExistingDriver1?.id
        )
      : undefined) ??
    (defaultExisting2?.id !== resolvedExistingDriver1?.id
      ? defaultExisting2
      : existingSelectablePool.find((d) => d.id !== resolvedExistingDriver1?.id));

  const pickerDriversList = useMemo(() => {
    if (!driverPickerTarget) return [];
    const baseList =
      driverPickerTarget.mode === 'existing' ? existingSelectablePool : freeAndF2Drivers;

    return baseList
      .filter((d) => {
        if (driverPickerFilter === 'f2') return d.originSeries === 'F2';
        if (driverPickerFilter === 'f1_free') {
          return d.originSeries !== 'F2' && d.originSeries !== 'Base';
        }
        return true;
      })
      .filter(
        (d) =>
          d.name.toLowerCase().includes(driverPickerSearch.toLowerCase()) ||
          d.nationality.toLowerCase().includes(driverPickerSearch.toLowerCase())
      )
      .sort((a, b) => {
        // Put current team drivers on top in existing mode when filter is 'all'
        if (driverPickerTarget.mode === 'existing' && driverPickerFilter === 'all') {
          const aOwned = a.teamId === selectedTeam.id ? 1 : 0;
          const bOwned = b.teamId === selectedTeam.id ? 1 : 0;
          if (aOwned !== bOwned) return bOwned - aOwned;
        }
        return getDriverOverall(b) - getDriverOverall(a);
      });
  }, [
    driverPickerTarget,
    existingSelectablePool,
    freeAndF2Drivers,
    driverPickerFilter,
    driverPickerSearch,
    selectedTeam.id,
  ]);

  const handleSelectPickerDriver = (driverId: string) => {
    if (!driverPickerTarget) return;
    if (driverPickerTarget.mode === 'custom') {
      if (driverPickerTarget.slot === 1) {
        if (driverId === resolvedCustomDriver2?.id && resolvedCustomDriver1) {
          setCustomDriver2Id(resolvedCustomDriver1.id);
        }
        setCustomDriver1Id(driverId);
      } else {
        if (driverId === resolvedCustomDriver1?.id && resolvedCustomDriver2) {
          setCustomDriver1Id(resolvedCustomDriver2.id);
        }
        setCustomDriver2Id(driverId);
      }
    } else {
      if (driverPickerTarget.slot === 1) {
        if (driverId === resolvedExistingDriver2?.id && resolvedExistingDriver1) {
          setExistingDriver2Id(resolvedExistingDriver1.id);
        }
        setExistingDriver1Id(driverId);
      } else {
        if (driverId === resolvedExistingDriver1?.id && resolvedExistingDriver2) {
          setExistingDriver1Id(resolvedExistingDriver2.id);
        }
        setExistingDriver2Id(driverId);
      }
    }
    setDriverPickerTarget(null);
  };

  const handleContinue = () => {
    if (!latestCareerSummary) return;
    const loaded = loadCareerById(latestCareerSummary.id);
    if (loaded) onStartCareer(loaded);
  };

  const handleLoadCareer = (id: string) => {
    const loaded = loadCareerById(id);
    if (loaded) onStartCareer(loaded);
  };

  const handleDeleteCareer = (id: string) => {
    deleteCareerById(id);
    setSavedList(getSavedCareerSummaries());
  };

  const handleStartExisting = () => {
    const career = createCareerFromExisting({
      careerName: `${selectedTeam.shortName} · Temporada ${seasonBase}`,
      seasonBase,
      teamId: selectedTeam.id,
      principalName: principalName.trim() || selectedTeam.principalName,
      starterDriver1Id: customizeExistingLineup ? resolvedExistingDriver1?.id : undefined,
      starterDriver2Id: customizeExistingLineup ? resolvedExistingDriver2?.id : undefined,
      settings,
    });
    onStartCareer(career);
  };

  const handleCustomLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setCustomLogoError(null);
    setUploadingCustomLogo(true);
    try {
      const dataUrl = await processLogoImageFile(file);
      setCustomLogoUrl(dataUrl);
    } catch (err) {
      setCustomLogoError(err instanceof Error ? err.message : 'Erro ao carregar imagem.');
    } finally {
      setUploadingCustomLogo(false);
    }
  };

  const handleStartCustom = () => {
    const career = createCareerFromCustom({
      careerName: `${customName.trim() || 'Minha Equipe'} · ${seasonBase}`,
      seasonBase,
      teamName: customName,
      shortName: customShort,
      principalName: customPrincipal,
      primaryColor: customPrimary,
      secondaryColor: customSecondary,
      accentColor: customAccent,
      liveryPattern: customPattern,
      crestShape: customShape,
      crestIcon: customIcon,
      customLogoUrl,
      engineSupplierId: customEngineId,
      startingBudget: customBudget,
      startingTier: customTier,
      customObjectiveTarget: customObjective,
      starterDriver1Id: resolvedCustomDriver1?.id,
      starterDriver2Id: resolvedCustomDriver2?.id,
      settings,
    });
    onStartCareer(career);
  };

  const refreshSaved = () => setSavedList(getSavedCareerSummaries());

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 relative overflow-x-hidden flex flex-col">
      {/* Paddock editorial backdrop */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="/src/assets/images/hero_f1_paddock_1795450822007.jpg"
          alt="Garagem de Fórmula 1 no paddock"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/90 to-[#0B0E14]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-[#0B0E14]/80" />
      </div>

      {/* Top minimal bar */}
      <header className="relative z-10 border-b border-white/10 px-6 lg:px-10 py-4 flex items-center justify-between gap-4 bg-[#0B0E14]/75 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#E10600] flex items-center justify-center font-display font-extrabold text-sm tracking-tight text-white">
            F1
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white whitespace-nowrap">
            Apex Grid Manager
          </span>
        </div>
        {screen !== 'home' && (
          <button
            onClick={() => setScreen('home')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Menu
          </button>
        )}
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-5 lg:p-10">
        {screen === 'home' && (
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-400 tracking-wide">
                  Simulador de Gerenciamento de Fórmula 1 · Temporadas 2025 e 2026
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.06] text-balance">
                  Comande sua escuderia do pit wall ao título mundial
                </h1>
                <p className="text-slate-300 text-base leading-relaxed max-w-xl">
                  Gerencie pilotos, contratos, diretoria, finanças, patrocinadores e desenvolvimento do carro.
                  Simule GPs completos de forma automática e construa uma dinastia ao longo de várias temporadas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl pt-2">
                {latestCareerSummary && (
                  <button
                    onClick={handleContinue}
                    className="sm:col-span-2 flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-[#E10600] hover:bg-[#c80500] text-white transition-colors text-left cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white/80">
                        Continuar carreira · Temporada {latestCareerSummary.currentSeason} · GP {Math.min(24, latestCareerSummary.currentRound)}/24
                      </div>
                      <div className="font-display font-bold text-lg truncate mt-0.5">
                        {latestCareerSummary.teamName}
                      </div>
                    </div>
                    <Play className="w-5 h-5 shrink-0 fill-current" />
                  </button>
                )}

                <button
                  onClick={() => setScreen('new_mode')}
                  className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-[#141A24] hover:bg-[#1B2331] border border-white/10 text-white transition-colors text-left cursor-pointer"
                >
                  <div>
                    <div className="font-display font-semibold text-base">Novo Jogo</div>
                    <div className="text-xs text-slate-400 mt-0.5">Assumir ou criar equipe</div>
                  </div>
                  <Plus className="w-5 h-5 text-slate-300 shrink-0" />
                </button>

                <button
                  onClick={() => {
                    refreshSaved();
                    setScreen('load');
                  }}
                  className="flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-[#141A24] hover:bg-[#1B2331] border border-white/10 text-white transition-colors text-left cursor-pointer"
                >
                  <div>
                    <div className="font-display font-semibold text-base">Carregar Carreira</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {savedList.length} {savedList.length === 1 ? 'carreira salva' : 'carreiras salvas'}
                    </div>
                  </div>
                  <FolderOpen className="w-5 h-5 text-slate-300 shrink-0" />
                </button>

                <button
                  onClick={() => setScreen('settings')}
                  className="sm:col-span-2 flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl bg-[#11161F] hover:bg-[#171E2A] border border-white/10 text-slate-200 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">Configurações da Simulação</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {settings.difficulty === 'normal' ? 'Normal' : settings.difficulty === 'hard' ? 'Difícil' : 'Lendário'} · {settings.currency}
                  </span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#121722]/90 border border-white/10 rounded-2xl p-6 space-y-5 backdrop-blur-md">
              <div className="text-xs font-medium text-slate-400">Prévia do Grid Oficial</div>
              <F1CarLivery
                primaryColor="#DC0000"
                secondaryColor="#16181F"
                accentColor="#FFF200"
                pattern="classic"
                shortName="FER"
                carNumber={16}
                sponsorLabel="APEX GRID"
              />
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10 text-center">
                <div>
                  <div className="font-mono-tabular text-xl font-bold text-white">24</div>
                  <div className="text-xs text-slate-400 mt-0.5">GPs Oficiais</div>
                </div>
                <div>
                  <div className="font-mono-tabular text-xl font-bold text-white">10+</div>
                  <div className="text-xs text-slate-400 mt-0.5">Equipes no Grid</div>
                </div>
                <div>
                  <div className="font-mono-tabular text-xl font-bold text-white">∞</div>
                  <div className="text-xs text-slate-400 mt-0.5">Temporadas</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'new_mode' && (
          <div className="w-full max-w-4xl space-y-6">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Escolha o formato da nova carreira</h2>
              <p className="text-sm text-slate-400 mt-1">
                Assuma o comando de uma escuderia tradicional ou funde a 11ª equipe do campeonato do zero.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <button
                onClick={() => setScreen('pick_existing')}
                className="group text-left p-6 rounded-2xl bg-[#131823] hover:bg-[#19202E] border border-white/10 hover:border-white/25 transition-all cursor-pointer flex flex-col justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Assumir uma Equipe Existente
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Escolha entre Ferrari, McLaren, Red Bull, Mercedes, Aston Martin, Williams, Alpine, Racing Bulls, Haas, Audi/Sauber ou Cadillac.
                    Visualize pilotos, orçamento, staff e objetivos antes de assinar.
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-white pt-4 border-t border-white/10">
                  <span>Selecionar escuderia oficial</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <button
                onClick={() => setScreen('create_custom')}
                className="group text-left p-6 rounded-2xl bg-[#131823] hover:bg-[#19202E] border border-white/10 hover:border-white/25 transition-all cursor-pointer flex flex-col justify-between gap-6"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-[#E10600]/15 border border-[#E10600]/30 flex items-center justify-center text-[#ff4d47]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Criar Minha Própria Equipe
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Defina nome, sigla de 3 letras, escudo personalizado, pintura do carro, fornecedor de motor,
                    orçamento inicial, nível competitivo e metas da diretoria.
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-white pt-4 border-t border-white/10">
                  <span>Fundar nova escuderia</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        )}

        {screen === 'pick_existing' && (
          <div className="w-full max-w-6xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Assumir Equipe da Fórmula 1</h2>
                <p className="text-sm text-slate-400">Analise pilotos, carro, finanças e metas antes de confirmar.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 p-1 bg-[#141A24] rounded-lg border border-white/10">
                  {([2025, 2026] as SeasonBase[]).map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSeasonBase(yr)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        seasonBase === yr ? 'bg-white text-[#0B0E14]' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Temporada {yr}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={principalName}
                  onChange={(e) => setPrincipalName(e.target.value)}
                  placeholder="Seu nome (Chefe de Equipe)"
                  className="px-3.5 py-2 text-sm bg-[#141A24] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Team list */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-[68vh] overflow-y-auto pr-1">
                {previewTeams.map((team) => {
                  const active = team.id === selectedTeam.id;
                  return (
                    <button
                      key={team.id}
                      onClick={() => {
                        setSelectedTeamId(team.id);
                        setExistingDriver1Id('');
                        setExistingDriver2Id('');
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-colors text-left cursor-pointer ${
                        active
                          ? 'bg-[#1A2232] border-white/30'
                          : 'bg-[#121722] border-white/8 hover:bg-[#171D2A]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <TeamLogo
                          teamId={team.id}
                          isCustom={team.isCustom}
                          shortName={team.shortName}
                          primaryColor={team.primaryColor}
                          secondaryColor={team.secondaryColor}
                          accentColor={team.accentColor}
                          shape={team.crestShape}
                          icon={team.crestIcon}
                          size={38}
                        />
                        <div className="min-w-0">
                          <div className="font-display font-semibold text-sm text-white truncate">{team.name}</div>
                          <div className="text-xs text-slate-400">
                            Carro {getCarOverall(team.car)} · Rep {team.reputation}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono-tabular text-xs font-semibold text-slate-300 shrink-0">
                        {formatMoney(team.budget, settings.currency, true)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Team detail briefing */}
              <div className="lg:col-span-7 bg-[#131823] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <TeamLogo
                      teamId={selectedTeam.id}
                      isCustom={selectedTeam.isCustom}
                      shortName={selectedTeam.shortName}
                      primaryColor={selectedTeam.primaryColor}
                      secondaryColor={selectedTeam.secondaryColor}
                      accentColor={selectedTeam.accentColor}
                      shape={selectedTeam.crestShape}
                      icon={selectedTeam.crestIcon}
                      size={56}
                    />
                    <div>
                      <h3 className="font-display text-2xl font-bold text-white">{selectedTeam.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Motor {selectedEngine?.manufacturer} · Títulos: {selectedTeam.history.titles} · Melhor pos: {selectedTeam.history.bestConstructorPos}º
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleStartExisting}
                    className="px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#c80500] text-white font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Assumir Equipe
                  </button>
                </div>

                <div className="bg-[#0E121B] rounded-xl p-4 border border-white/5">
                  <F1CarLivery
                    primaryColor={selectedTeam.primaryColor}
                    secondaryColor={selectedTeam.secondaryColor}
                    accentColor={selectedTeam.accentColor}
                    pattern={selectedTeam.liveryPattern}
                    shortName={selectedTeam.shortName}
                    carNumber={selectedTeamDrivers[0]?.number ?? 1}
                    sponsorLabel={selectedTeam.sponsors[0]?.name}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#0F141E] p-3 rounded-xl border border-white/8">
                    <div className="text-xs text-slate-400">Orçamento</div>
                    <div className="font-mono-tabular text-base font-bold text-white mt-0.5">
                      {formatMoney(selectedTeam.budget, settings.currency, true)}
                    </div>
                  </div>
                  <div className="bg-[#0F141E] p-3 rounded-xl border border-white/8">
                    <div className="text-xs text-slate-400">Reputação</div>
                    <div className="font-mono-tabular text-base font-bold text-white mt-0.5">{selectedTeam.reputation}/100</div>
                  </div>
                  <div className="bg-[#0F141E] p-3 rounded-xl border border-white/8">
                    <div className="text-xs text-slate-400">Média do Carro</div>
                    <div className="font-mono-tabular text-base font-bold text-white mt-0.5">{getCarOverall(selectedTeam.car)}/100</div>
                  </div>
                  <div className="bg-[#0F141E] p-3 rounded-xl border border-white/8">
                    <div className="text-xs text-slate-400">Instalações</div>
                    <div className="font-mono-tabular text-base font-bold text-white mt-0.5">Nível {selectedTeam.facilities.factory}/5</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-white/10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-slate-300">Pilotos & Contratos</div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = !customizeExistingLineup;
                          setCustomizeExistingLineup(next);
                          if (next) {
                            setExistingDriver1Id(defaultExisting1?.id ?? '');
                            setExistingDriver2Id(defaultExisting2?.id ?? '');
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors ${
                          customizeExistingLineup
                            ? 'bg-[#E10600]/20 border-[#E10600]/40 text-white'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        {customizeExistingLineup ? 'Usando Dupla Personalizada' : 'Escolher 2 Titulares'}
                      </button>
                    </div>

                    {!customizeExistingLineup ? (
                      selectedTeamDrivers.map((d) => (
                        <div key={d.id} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                          <div>
                            <span className="font-semibold text-white">{d.name}</span>
                            <span className="text-slate-400 ml-2">
                              {d.role === 'reserve' ? 'Reserva' : 'Titular'} · {d.age} anos
                            </span>
                          </div>
                          <span className="font-mono-tabular text-slate-200">
                            {getDriverOverall(d)} OVR · {d.contractYears}a
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="space-y-2">
                        {[
                          { slot: 1 as const, label: 'Titular 1', driver: resolvedExistingDriver1 },
                          { slot: 2 as const, label: 'Titular 2', driver: resolvedExistingDriver2 },
                        ].map((item) => (
                          <div
                            key={item.slot}
                            className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0D111A] border border-white/10"
                          >
                            <div className="min-w-0">
                              <div className="text-[10px] font-semibold text-slate-400">{item.label}</div>
                              <div className="text-xs font-bold text-white truncate">
                                {item.driver?.name ?? 'Selecionar'}
                              </div>
                              {item.driver && (
                                <div className="text-[11px] text-slate-400">
                                  {item.driver.originSeries === 'F2'
                                    ? 'F2'
                                    : item.driver.teamId === selectedTeam.id
                                    ? 'Da Equipe'
                                    : 'Sem Equipe'}{' '}
                                  · {getDriverOverall(item.driver)} OVR
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDriverPickerFilter('all');
                                setDriverPickerSearch('');
                                setDriverPickerTarget({ mode: 'existing', slot: item.slot });
                              }}
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white shrink-0 cursor-pointer"
                            >
                              Alterar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-slate-300">Objetivos da Diretoria</div>
                    <ul className="space-y-1.5">
                      {selectedTeamObjectives.map((obj) => (
                        <li key={obj.id} className="text-xs text-slate-300 flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{obj.label}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs font-semibold text-slate-300 pt-2">Direção Técnica</div>
                    <div className="space-y-1">
                      {selectedTeamStaff.slice(0, 3).map((st) => (
                        <div key={st.id} className="flex justify-between text-xs text-slate-400">
                          <span>{STAFF_ROLE_LABELS[st.role]}: <strong className="text-slate-200">{st.name}</strong></span>
                          <span className="font-mono-tabular">{st.quality} QLT</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'create_custom' && (
          <div className="w-full max-w-6xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Fundar Minha Própria Equipe</h2>
                <p className="text-sm text-slate-400">Personalize identidade visual, pintura do carro, motor, orçamento e objetivos.</p>
              </div>
              <button
                onClick={handleStartCustom}
                className="px-6 py-3 rounded-xl bg-[#E10600] hover:bg-[#c80500] text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Iniciar Carreira com Nova Escuderia
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Live preview */}
              <div className="lg:col-span-5 bg-[#131823] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <TeamLogo
                    isCustom={true}
                    customLogoUrl={customLogoUrl}
                    shortName={customShort || 'APX'}
                    primaryColor={customPrimary}
                    secondaryColor={customSecondary}
                    accentColor={customAccent}
                    shape={customShape}
                    icon={customIcon}
                    size={62}
                  />
                  <div className="min-w-0">
                    <div className="font-display text-xl font-bold text-white truncate">
                      {customName || 'Minha Escuderia'}
                    </div>
                    <div className="text-xs text-slate-400">
                      Chefe: {customPrincipal || 'Diretor'} · Motor {ENGINE_SUPPLIERS.find((e) => e.id === customEngineId)?.manufacturer}
                    </div>
                  </div>
                </div>

                {/* Custom Logo Image/File Upload */}
                <div className="p-3.5 rounded-xl bg-[#0D1119] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-300">
                      Logo Personalizada (Imagem / Arquivo)
                    </span>
                    {customLogoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomLogoUrl(undefined);
                          setCustomLogoError(null);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Usar Escudo Padrão
                      </button>
                    )}
                  </div>
                  <input
                    ref={customLogoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomLogoFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingCustomLogo}
                    onClick={() => customLogoInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-50 border border-white/10 text-xs font-semibold text-white cursor-pointer transition-colors"
                  >
                    <ImagePlus className="w-4 h-4" />
                    {uploadingCustomLogo
                      ? 'Processando imagem...'
                      : customLogoUrl
                      ? 'Trocar Imagem / Arquivo da Logo'
                      : 'Enviar Imagem ou Arquivo (PNG, JPG, SVG)'}
                  </button>
                  {customLogoError && (
                    <p className="text-[11px] text-red-400">{customLogoError}</p>
                  )}
                </div>

                <div className="bg-[#0D1119] rounded-xl p-4 border border-white/5">
                  <F1CarLivery
                    primaryColor={customPrimary}
                    secondaryColor={customSecondary}
                    accentColor={customAccent}
                    pattern={customPattern}
                    shortName={customShort || 'APX'}
                    carNumber={resolvedCustomDriver1?.number ?? 27}
                    sponsorLabel={customShort || 'APX'}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-400">Paletas Rápidas</div>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setCustomPrimary(p.primary);
                          setCustomSecondary(p.secondary);
                          setCustomAccent(p.accent);
                        }}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#0E121B] hover:bg-[#192030] border border-white/10 text-xs text-slate-200 cursor-pointer"
                      >
                        <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ backgroundColor: p.primary }} />
                        <span className="truncate">{p.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <label className="block text-xs text-slate-400">
                    Cor Primária
                    <input
                      type="color"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className="mt-1.5 w-full h-9 rounded cursor-pointer bg-transparent border border-white/10"
                    />
                  </label>
                  <label className="block text-xs text-slate-400">
                    Cor Secundária
                    <input
                      type="color"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                      className="mt-1.5 w-full h-9 rounded cursor-pointer bg-transparent border border-white/10"
                    />
                  </label>
                  <label className="block text-xs text-slate-400">
                    Detalhes
                    <input
                      type="color"
                      value={customAccent}
                      onChange={(e) => setCustomAccent(e.target.value)}
                      className="mt-1.5 w-full h-9 rounded cursor-pointer bg-transparent border border-white/10"
                    />
                  </label>
                </div>
              </div>

              {/* Config Form */}
              <div className="lg:col-span-7 bg-[#131823] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="sm:col-span-2 block text-xs font-medium text-slate-300">
                    Nome da Equipe
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      maxLength={32}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </label>
                  <label className="block text-xs font-medium text-slate-300">
                    Sigla (3 letras)
                    <input
                      type="text"
                      value={customShort}
                      onChange={(e) => setCustomShort(e.target.value.toUpperCase().slice(0, 3))}
                      maxLength={3}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm font-mono-tabular uppercase text-white focus:outline-none focus:border-white/30"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block text-xs font-medium text-slate-300">
                    Chefe de Equipe (Você)
                    <input
                      type="text"
                      value={customPrincipal}
                      onChange={(e) => setCustomPrincipal(e.target.value)}
                      className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm text-white focus:outline-none focus:border-white/30"
                    />
                  </label>
                  <div className="text-xs font-medium text-slate-300">
                    Temporada Inicial
                    <div className="mt-1.5 grid grid-cols-2 gap-2">
                      {([2025, 2026] as SeasonBase[]).map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setSeasonBase(yr)}
                          className={`py-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                            seasonBase === yr
                              ? 'bg-white text-[#0B0E14] border-white'
                              : 'bg-[#0D1119] text-slate-300 border-white/10 hover:border-white/25'
                          }`}
                        >
                          Grid {yr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="block text-xs font-medium text-slate-300">
                    Pintura do Carro
                    <select
                      value={customPattern}
                      onChange={(e) => setCustomPattern(e.target.value as LiveryPattern)}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm text-white"
                    >
                      {LIVERY_PATTERNS.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-medium text-slate-300">
                    Formato do Escudo
                    <select
                      value={customShape}
                      onChange={(e) => setCustomShape(e.target.value as CrestShape)}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm text-white"
                    >
                      {CREST_SHAPES.map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-xs font-medium text-slate-300">
                    Símbolo Central
                    <select
                      value={customIcon}
                      onChange={(e) => setCustomIcon(e.target.value as CrestIcon)}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm text-white"
                    >
                      {CREST_ICONS.map((ic) => (
                        <option key={ic.id} value={ic.id}>{ic.label}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-300">Fornecedor de Motor</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ENGINE_SUPPLIERS.map((eng) => (
                      <button
                        key={eng.id}
                        type="button"
                        onClick={() => setCustomEngineId(eng.id)}
                        className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                          customEngineId === eng.id
                            ? 'bg-[#1B2332] border-white/35'
                            : 'bg-[#0D1119] border-white/8 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-white">
                          <span>{eng.manufacturer}</span>
                          <span className="font-mono-tabular text-slate-300">{formatMoney(eng.annualCost, settings.currency, true)}/ano</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          Potência {eng.powerRating} · Confiabilidade {eng.reliabilityRating}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Escolher os 2 Pilotos Titulares (Sem Equipe & F2) */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <Users className="w-4 h-4 text-[#E10600]" />
                      <span>Escolher os 2 Pilotos Titulares (Sem Equipe & Fórmula 2)</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {freeAndF2Drivers.length} pilotos disponíveis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { slot: 1 as const, label: 'Titular 1 (Carro A)', driver: resolvedCustomDriver1 },
                      { slot: 2 as const, label: 'Titular 2 (Carro B)', driver: resolvedCustomDriver2 },
                    ].map((item) => (
                      <div
                        key={item.slot}
                        className="p-3.5 rounded-xl bg-[#0D1119] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {item.driver && (
                            <DriverAvatar
                              shortCode={item.driver.shortCode}
                              number={item.driver.number}
                              teamColor={customPrimary}
                              size={38}
                            />
                          )}
                          <div className="min-w-0">
                            <div className="text-[10px] font-semibold text-slate-400">{item.label}</div>
                            <div className="font-display font-bold text-sm text-white truncate">
                              {item.driver?.name ?? 'Selecionar piloto'}
                            </div>
                            {item.driver && (
                              <div className="text-[11px] text-slate-400">
                                {item.driver.originSeries === 'F2'
                                  ? 'Fórmula 2'
                                  : item.driver.originSeries === 'Base'
                                  ? 'Revelação'
                                  : 'Sem Equipe F1'}{' '}
                                · <span className="text-white font-mono-tabular font-semibold">{getDriverOverall(item.driver)} OVR</span> · Pot {item.driver.potential}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setDriverPickerFilter('all');
                            setDriverPickerSearch('');
                            setDriverPickerTarget({ mode: 'custom', slot: item.slot });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white shrink-0 cursor-pointer"
                        >
                          Escolher
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                  <label className="block text-xs font-medium text-slate-300">
                    Orçamento Inicial
                    <select
                      value={customBudget}
                      onChange={(e) => setCustomBudget(Number(e.target.value))}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm font-mono-tabular text-white"
                    >
                      <option value={22000000}>{formatMoney(22000000, settings.currency, true)} (Econômico)</option>
                      <option value={35000000}>{formatMoney(35000000, settings.currency, true)} (Padrão)</option>
                      <option value={50000000}>{formatMoney(50000000, settings.currency, true)} (Forte)</option>
                      <option value={68000000}>{formatMoney(68000000, settings.currency, true)} (Magnata)</option>
                    </select>
                  </label>
                  <label className="block text-xs font-medium text-slate-300">
                    Nível Inicial da Equipe
                    <select
                      value={customTier}
                      onChange={(e) => setCustomTier(e.target.value as 'top' | 'midfield' | 'backmarker')}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm text-white"
                    >
                      <option value="backmarker">Fundo do Grid (Desafio)</option>
                      <option value="midfield">Meio de Pelotão</option>
                      <option value="top">Candidata a Pódios</option>
                    </select>
                  </label>
                  <label className="block text-xs font-medium text-slate-300">
                    Objetivo da Diretoria
                    <select
                      value={customObjective}
                      onChange={(e) => setCustomObjective(e.target.value as 'title' | 'top5' | 'points')}
                      className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-[#0D1119] border border-white/10 text-sm text-white"
                    >
                      <option value="points">Top 9 & Jovens Talentos</option>
                      <option value="top5">Top 6 & Pódio</option>
                      <option value="title">Top 3 & Vitórias</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'load' && (
          <div className="w-full max-w-4xl bg-[#131823] border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Carreiras Salvas</h2>
                <p className="text-sm text-slate-400">O progresso é salvo automaticamente a cada ação e GP simulado.</p>
              </div>
              <button
                onClick={() => setScreen('new_mode')}
                className="px-4 py-2 rounded-lg bg-[#E10600] hover:bg-[#c80500] text-xs font-semibold text-white cursor-pointer"
              >
                Nova Carreira
              </button>
            </div>

            {savedList.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-white/10 rounded-xl space-y-3">
                <p className="text-sm text-slate-400">Nenhuma carreira salva encontrada neste navegador.</p>
                <button
                  onClick={() => setScreen('new_mode')}
                  className="px-4 py-2 rounded-lg bg-white text-[#0B0E14] text-xs font-semibold cursor-pointer"
                >
                  Iniciar Primeira Carreira
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedList.map((save) => (
                  <div
                    key={save.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0E121B] border border-white/8"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className="w-3 h-10 rounded-full shrink-0"
                        style={{ backgroundColor: save.primaryColor }}
                      />
                      <div className="min-w-0">
                        <div className="font-display font-bold text-white truncate">{save.careerName}</div>
                        <div className="text-xs text-slate-400">
                          {save.teamName} · Temporada {save.currentSeason} · GP {Math.min(24, save.currentRound)}/24 · {save.constructorRank}º lugar · {formatMoney(save.budget, settings.currency, true)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleLoadCareer(save.id)}
                        className="px-4 py-2 rounded-lg bg-white text-[#0B0E14] hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                      >
                        Carregar
                      </button>
                      <button
                        onClick={() => handleDeleteCareer(save.id)}
                        aria-label="Excluir carreira"
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {screen === 'settings' && (
          <div className="w-full max-w-2xl bg-[#131823] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-slate-300" />
              <div>
                <h2 className="font-display text-2xl font-bold text-white">Configurações</h2>
                <p className="text-sm text-slate-400">Preferências de dificuldade, eventos e exibição financeira.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Dificuldade Financeira e da Diretoria</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Normal' },
                    { id: 'hard', label: 'Difícil' },
                    { id: 'legend', label: 'Lendário' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => {
                        const updated = { ...settings, difficulty: d.id as CareerSettings['difficulty'] };
                        onUpdateSettings(updated);
                        saveGlobalSettings(updated);
                      }}
                      className={`py-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        settings.difficulty === d.id
                          ? 'bg-white text-[#0B0E14] border-white'
                          : 'bg-[#0E121B] text-slate-300 border-white/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Frequência de Eventos Aleatórios</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'low', label: 'Baixa' },
                    { id: 'normal', label: 'Equilibrada' },
                    { id: 'high', label: 'Intensa' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        const updated = { ...settings, eventFrequency: f.id as CareerSettings['eventFrequency'] };
                        onUpdateSettings(updated);
                        saveGlobalSettings(updated);
                      }}
                      className={`py-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                        settings.eventFrequency === f.id
                          ? 'bg-white text-[#0B0E14] border-white'
                          : 'bg-[#0E121B] text-slate-300 border-white/10'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Moeda de Exibição</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['USD', 'EUR'] as const).map((cur) => (
                      <button
                        key={cur}
                        onClick={() => {
                          const updated = { ...settings, currency: cur };
                          onUpdateSettings(updated);
                          saveGlobalSettings(updated);
                        }}
                        className={`py-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          settings.currency === cur
                            ? 'bg-white text-[#0B0E14] border-white'
                            : 'bg-[#0E121B] text-slate-300 border-white/10'
                        }`}
                      >
                        {cur === 'USD' ? 'Dólar ($)' : 'Euro (€)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Ponto Extra (Volta Mais Rápida)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { val: true, label: 'Ativo (+1 pt)' },
                      { val: false, label: 'Desativado' },
                    ].map((opt) => (
                      <button
                        key={String(opt.val)}
                        onClick={() => {
                          const updated = { ...settings, fastestLapPoint: opt.val };
                          onUpdateSettings(updated);
                          saveGlobalSettings(updated);
                        }}
                        className={`py-2.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                          settings.fastestLapPoint === opt.val
                            ? 'bg-white text-[#0B0E14] border-white'
                            : 'bg-[#0E121B] text-slate-300 border-white/10'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">Gerenciamento de dados locais no navegador</div>
                {!confirmClearAll ? (
                  <button
                    onClick={() => setConfirmClearAll(true)}
                    className="px-3.5 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 text-xs font-semibold cursor-pointer"
                  >
                    Limpar Todas as Carreiras
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        clearAllCareers();
                        refreshSaved();
                        setConfirmClearAll(false);
                      }}
                      className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Confirmar Exclusão
                    </button>
                    <button
                      onClick={() => setConfirmClearAll(false)}
                      className="px-3 py-2 rounded-lg bg-white/10 text-slate-300 text-xs cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Driver Selection Modal (Free Agents & F2) */}
      {driverPickerTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#121722] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Escolher Titular {driverPickerTarget.slot} — Sem Equipe & F2
                </h3>
                <p className="text-xs text-slate-400">
                  Selecione entre todos os pilotos sem equipe e o grid da Fórmula 2
                  {driverPickerTarget.mode === 'existing' ? ' ou pilotos já da escuderia' : ''}.
                </p>
              </div>
              <button
                onClick={() => setDriverPickerTarget(null)}
                aria-label="Fechar seletor de pilotos"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Todos Disponíveis' },
                  { id: 'f2', label: 'Fórmula 2 (F2)' },
                  { id: 'f1_free', label: 'Sem Equipe F1' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDriverPickerFilter(tab.id as typeof driverPickerFilter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      driverPickerFilter === tab.id
                        ? 'bg-white text-[#0B0E14] font-semibold'
                        : 'bg-[#0D111A] text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={driverPickerSearch}
                  onChange={(e) => setDriverPickerSearch(e.target.value)}
                  placeholder="Buscar piloto ou país..."
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0D111A] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {pickerDriversList.map((d) => {
                const isSelectedSlot1 =
                  driverPickerTarget.mode === 'custom'
                    ? resolvedCustomDriver1?.id === d.id
                    : resolvedExistingDriver1?.id === d.id;
                const isSelectedSlot2 =
                  driverPickerTarget.mode === 'custom'
                    ? resolvedCustomDriver2?.id === d.id
                    : resolvedExistingDriver2?.id === d.id;
                const isCurrentSlot =
                  (driverPickerTarget.slot === 1 && isSelectedSlot1) ||
                  (driverPickerTarget.slot === 2 && isSelectedSlot2);

                return (
                  <div
                    key={d.id}
                    className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border ${
                      isCurrentSlot
                        ? 'bg-[#1A2232] border-white/35'
                        : 'bg-[#0D111A] border-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <DriverAvatar
                        shortCode={d.shortCode}
                        number={d.number}
                        teamColor={
                          d.originSeries === 'F2'
                            ? '#0093CC'
                            : d.teamId === selectedTeam.id
                            ? selectedTeam.primaryColor
                            : '#64748B'
                        }
                        size={40}
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-white truncate">
                          {d.name}
                          {isSelectedSlot1 && (
                            <span className="ml-2 text-[11px] font-medium text-emerald-400">
                              (Titular 1)
                            </span>
                          )}
                          {isSelectedSlot2 && (
                            <span className="ml-2 text-[11px] font-medium text-sky-400">
                              (Titular 2)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {d.originSeries === 'F2'
                            ? 'Fórmula 2'
                            : d.originSeries === 'Base'
                            ? 'Revelação'
                            : d.teamId === selectedTeam.id
                            ? 'Elenco da Equipe'
                            : 'Sem Equipe F1'}{' '}
                          · {d.nationality} · {d.age} anos
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs">
                        <div className="font-mono-tabular font-bold text-white">
                          {getDriverOverall(d)} OVR · Pot {d.potential}
                        </div>
                        <div className="font-mono-tabular text-[11px] text-slate-400">
                          Vel {d.speed} · Tal {d.talent} · {formatMoney(d.salary, settings.currency, true)}/ano
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectPickerDriver(d.id)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                          isCurrentSlot
                            ? 'bg-white text-[#0B0E14]'
                            : 'bg-[#E10600] hover:bg-[#c80500] text-white'
                        }`}
                      >
                        {isCurrentSlot ? 'Selecionado' : 'Escolher'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
