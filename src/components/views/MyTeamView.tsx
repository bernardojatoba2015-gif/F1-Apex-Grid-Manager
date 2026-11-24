import React, { useRef, useState } from 'react';
import { Building2, Cpu, Gauge, ImagePlus, Palette, Trash2, Zap } from 'lucide-react';
import { ENGINE_SUPPLIERS } from '../../data/f1Data';
import { formatMoney, getCarOverall } from '../../engine/simulation';
import { CareerState, LiveryPattern } from '../../types/game';
import { processLogoImageFile } from '../../utils/imageUpload';
import { F1CarLivery } from '../visuals/F1CarLivery';
import { TeamLogo } from '../visuals/TeamLogo';

interface MyTeamViewProps {
  career: CareerState;
  onUpgradeFacility: (key: 'factory' | 'windTunnel' | 'simulator') => void;
  onUpdateLivery: (primary: string, secondary: string, accent: string, pattern: LiveryPattern) => void;
  onUpdateLogo: (customLogoUrl?: string) => void;
  onChangeEngine: (engineId: string) => void;
}

const FACILITY_INFO = [
  {
    key: 'factory' as const,
    name: 'Fábrica e Produção',
    desc: 'Reduz tempo de fabricação de peças e melhora capacidade geral de atualização.',
    icon: Building2,
  },
  {
    key: 'windTunnel' as const,
    name: 'Túnel de Vento & CFD',
    desc: 'Aumenta o ganho aerodinâmico por projeto de desenvolvimento.',
    icon: Gauge,
  },
  {
    key: 'simulator' as const,
    name: 'Simulador de Corrida',
    desc: 'Acelera adaptação dos pilotos e melhora consistência em fins de semana difíceis.',
    icon: Cpu,
  },
];

export const MyTeamView: React.FC<MyTeamViewProps> = ({
  career,
  onUpgradeFacility,
  onUpdateLivery,
  onUpdateLogo,
  onChangeEngine,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const team = career.teams.find((t) => t.id === career.playerTeamId)!;
  const currency = career.settings.currency;
  const currentEngine = ENGINE_SUPPLIERS.find((e) => e.id === team.engineSupplierId) ?? ENGINE_SUPPLIERS[0];

  const facilityCost = (level: number) => level * 4500000;

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setLogoError(null);
    setUploadingLogo(true);
    try {
      const dataUrl = await processLogoImageFile(file);
      onUpdateLogo(dataUrl);
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : 'Erro ao enviar imagem.');
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <TeamLogo
            teamId={team.id}
            isCustom={team.isCustom}
            customLogoUrl={team.customLogoUrl}
            shortName={team.shortName}
            primaryColor={team.primaryColor}
            secondaryColor={team.secondaryColor}
            accentColor={team.accentColor}
            shape={team.crestShape}
            icon={team.crestIcon}
            size={56}
          />
          <div>
            <h2 className="font-display text-2xl font-bold text-white">{team.name}</h2>
            <p className="text-xs text-slate-400">
              Sigla {team.shortName} · Chefe de Equipe: {team.principalName} · Títulos Construtores: {team.history.titles}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Média Geral do Carro</div>
          <div className="font-mono-tabular text-2xl font-bold text-white">{getCarOverall(team.car)}/100</div>
        </div>
      </div>

      {/* Livery Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white">Pintura Oficial do Carro</h3>
            <span className="text-xs text-slate-400">Temporada {career.currentSeason}</span>
          </div>
          <div className="bg-[#0B0E14] rounded-xl p-5 border border-white/5">
            <F1CarLivery
              primaryColor={team.primaryColor}
              secondaryColor={team.secondaryColor}
              accentColor={team.accentColor}
              pattern={team.liveryPattern}
              shortName={team.shortName}
              sponsorLabel={team.sponsors[0]?.name}
            />
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-400" />
            Personalização Visual
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs text-slate-400 block">
              Primária
              <input
                type="color"
                value={team.primaryColor}
                onChange={(e) => onUpdateLivery(e.target.value, team.secondaryColor, team.accentColor, team.liveryPattern)}
                className="mt-1.5 w-full h-10 rounded bg-transparent border border-white/10 cursor-pointer"
              />
            </label>
            <label className="text-xs text-slate-400 block">
              Secundária
              <input
                type="color"
                value={team.secondaryColor}
                onChange={(e) => onUpdateLivery(team.primaryColor, e.target.value, team.accentColor, team.liveryPattern)}
                className="mt-1.5 w-full h-10 rounded bg-transparent border border-white/10 cursor-pointer"
              />
            </label>
            <label className="text-xs text-slate-400 block">
              Detalhes
              <input
                type="color"
                value={team.accentColor}
                onChange={(e) => onUpdateLivery(team.primaryColor, team.secondaryColor, e.target.value, team.liveryPattern)}
                className="mt-1.5 w-full h-10 rounded bg-transparent border border-white/10 cursor-pointer"
              />
            </label>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-slate-400">Estilo da Pintura</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  { id: 'aero', label: 'Aero Split' },
                  { id: 'classic', label: 'Clássica' },
                  { id: 'diagonal', label: 'Diagonal' },
                  { id: 'stripe', label: 'Faixa Dupla' },
                  { id: 'stealth', label: 'Stealth' },
                ] as { id: LiveryPattern; label: string }[]
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onUpdateLivery(team.primaryColor, team.secondaryColor, team.accentColor, p.id)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium cursor-pointer ${
                    team.liveryPattern === p.id
                      ? 'bg-white text-[#0B0E14] border-white font-semibold'
                      : 'bg-[#0D111A] text-slate-300 border-white/10 hover:border-white/25'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-slate-300 font-medium">Logo Personalizada (Imagem / Arquivo)</div>
              {team.customLogoUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setLogoError(null);
                    onUpdateLogo(undefined);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Remover
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-3">
              <TeamLogo
                teamId={team.id}
                isCustom={team.isCustom}
                customLogoUrl={team.customLogoUrl}
                shortName={team.shortName}
                primaryColor={team.primaryColor}
                secondaryColor={team.secondaryColor}
                accentColor={team.accentColor}
                shape={team.crestShape}
                icon={team.crestIcon}
                size={44}
              />
              <button
                type="button"
                disabled={uploadingLogo}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-50 border border-white/10 text-xs font-semibold text-white cursor-pointer transition-colors"
              >
                <ImagePlus className="w-4 h-4" />
                {uploadingLogo
                  ? 'Processando imagem...'
                  : team.customLogoUrl
                  ? 'Trocar Imagem / Arquivo'
                  : 'Enviar Imagem ou Arquivo'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Aceita PNG, JPG, SVG ou WebP da galeria ou arquivos. Fica salva automaticamente na sua carreira.
            </p>
            {logoError && (
              <p className="text-[11px] text-red-400">{logoError}</p>
            )}
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-lg text-white">Infraestrutura da Sede</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FACILITY_INFO.map((fac) => {
            const Icon = fac.icon;
            const level = team.facilities[fac.key];
            const cost = facilityCost(level);
            const canAfford = team.budget >= cost && level < 5;
            return (
              <div key={fac.key} className="bg-[#121722] border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-white font-display font-bold text-base">
                      <Icon className="w-4 h-4 text-slate-400" />
                      {fac.name}
                    </div>
                    <span className="font-mono-tabular text-xs font-bold text-white">Nível {level}/5</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{fac.desc}</p>
                  <div className="flex gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div
                        key={n}
                        className="h-1.5 flex-1 rounded-full"
                        style={{ backgroundColor: n <= level ? team.primaryColor : 'rgba(255,255,255,0.1)' }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  disabled={!canAfford}
                  onClick={() => onUpgradeFacility(fac.key)}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:opacity-40 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  {level >= 5 ? 'Nível Máximo Atingido' : `Expandir (${formatMoney(cost, currency, true)})`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engine Supplier */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Fornecedor de Unidade de Potência
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Contrato atual: <strong className="text-white">{currentEngine.name}</strong> ({currentEngine.manufacturer}) · Custo anual {formatMoney(currentEngine.annualCost, currency, true)}
            </p>
          </div>
          {career.phase !== 'transfer_window' && career.currentRound > 1 && (
            <span className="text-xs text-slate-400">Trocas de motor disponíveis na janela entre temporadas</span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {ENGINE_SUPPLIERS.map((eng) => {
            const isCurrent = eng.id === team.engineSupplierId;
            const canSwitch = !isCurrent && (career.phase === 'transfer_window' || career.currentRound === 1);
            return (
              <div
                key={eng.id}
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                  isCurrent ? 'bg-[#1A2232] border-white/30' : 'bg-[#0D111A] border-white/8'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-display font-bold text-sm text-white">{eng.manufacturer}</div>
                  <div className="text-[11px] text-slate-400">{eng.name}</div>
                  <div className="text-xs font-mono-tabular text-slate-200 pt-1">
                    Pot {eng.powerRating} · Conf {eng.reliabilityRating}
                  </div>
                  <div className="text-xs font-mono-tabular text-slate-400">
                    {formatMoney(eng.annualCost, currency, true)}/ano
                  </div>
                </div>
                <button
                  disabled={!canSwitch}
                  onClick={() => onChangeEngine(eng.id)}
                  className={`w-full py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/10 hover:bg-white/15 disabled:opacity-35 text-white'
                  }`}
                >
                  {isCurrent ? 'Em Uso' : 'Selecionar'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
