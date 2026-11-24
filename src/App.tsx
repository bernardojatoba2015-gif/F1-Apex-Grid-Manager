import React, { useEffect, useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { GameLayout } from './components/GameLayout';
import { RaceResultModal } from './components/modals/RaceResultModal';
import { SeasonEndModal } from './components/modals/SeasonEndModal';
import { StartMenu } from './components/StartMenu';
import { BoardView } from './components/views/BoardView';
import { CalendarView } from './components/views/CalendarView';
import { DevelopmentView } from './components/views/DevelopmentView';
import { DriversView } from './components/views/DriversView';
import { FinancesView } from './components/views/FinancesView';
import { HistoryView } from './components/views/HistoryView';
import { MarketView } from './components/views/MarketView';
import { MyTeamView } from './components/views/MyTeamView';
import { OverviewView } from './components/views/OverviewView';
import { SponsorsView } from './components/views/SponsorsView';
import { StaffView } from './components/views/StaffView';
import { StandingsView } from './components/views/StandingsView';
import { ENGINE_SUPPLIERS } from './data/f1Data';
import {
  BoardMeetingOutcome,
  BoardMeetingTopic,
  COMPONENT_LABELS,
  finalizeSeasonToTransferWindow,
  getStaffModifiers,
  processBoardMeeting,
  resolveRandomEvent,
  simulateGrandPrix,
  STAFF_ROLE_LABELS,
  startNewSeasonFromTransferWindow,
} from './engine/simulation';
import {
  getSavedCareerSummaries,
  loadGlobalSettings,
  saveCareer,
  SavedCareerSummary,
} from './storage/careerStorage';
import {
  CarComponentKey,
  CareerSettings,
  CareerState,
  DriverRole,
  LiveryPattern,
  NavTab,
  RaceWeekend,
  SeasonHistoryEntry,
  SponsorContract,
} from './types/game';

export function App() {
  const [settings, setSettings] = useState<CareerSettings>(() => loadGlobalSettings());
  const [career, setCareer] = useState<CareerState | null>(null);
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [latestSummary, setLatestSummary] = useState<SavedCareerSummary | null>(
    () => getSavedCareerSummaries()[0] ?? null
  );

  const [raceModalData, setRaceModalData] = useState<RaceWeekend | null>(null);
  const [seasonEndSummary, setSeasonEndSummary] = useState<SeasonHistoryEntry | null>(null);

  // Dynamic canonical and OpenGraph URL resolution for SEO
  useEffect(() => {
    const canonicalUrl = window.location.origin + window.location.pathname;
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    const setMeta = (selector: string, attrName: 'property' | 'name', attrVal: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(selector);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const ogImageUrl = `${window.location.origin}/og-cover.jpg`;
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', ogImageUrl);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', ogImageUrl);
  }, []);

  // Auto-save whenever career updates
  useEffect(() => {
    if (career) {
      saveCareer(career);
      setLatestSummary(getSavedCareerSummaries()[0] ?? null);
    }
  }, [career]);

  const updateCareer = (updater: (prev: CareerState) => CareerState) => {
    setCareer((prev) => (prev ? updater(prev) : null));
  };

  const handleStartCareer = (newCareer: CareerState) => {
    saveCareer(newCareer);
    setCareer(newCareer);
    setActiveTab('overview');
    setRaceModalData(null);
    setSeasonEndSummary(null);
    setLatestSummary(getSavedCareerSummaries()[0] ?? null);
  };

  const handleSimulateGP = () => {
    if (!career || career.phase !== 'in_season' || career.currentRound > 24) return;
    const simulated = simulateGrandPrix(career);
    setCareer(simulated);
    if (simulated.lastRaceResult) {
      setRaceModalData(simulated.lastRaceResult);
    }
  };

  const handleCloseRaceModal = () => {
    setRaceModalData(null);
    if (career && career.currentRound > 24 && career.phase === 'in_season') {
      const { career: finalized, summary } = finalizeSeasonToTransferWindow(career);
      setCareer(finalized);
      setSeasonEndSummary(summary);
    }
  };

  const handleStartNewSeason = () => {
    if (!career) return;
    const nextSeasonCareer = startNewSeasonFromTransferWindow(career);
    setCareer(nextSeasonCareer);
    setSeasonEndSummary(null);
    setActiveTab('overview');
  };

  const handleResolveEvent = (choiceId: string) => {
    updateCareer((prev) => resolveRandomEvent(prev, choiceId));
  };

  const handleUpgradeFacility = (key: 'factory' | 'windTunnel' | 'simulator') => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      const level = team.facilities[key];
      const cost = level * 4500000;
      if (level >= 5 || team.budget < cost) return prev;
      team.budget -= cost;
      team.facilities[key] += 1;
      const label = key === 'factory' ? 'Fábrica' : key === 'windTunnel' ? 'Túnel de Vento' : 'Simulador';
      next.transactions.unshift({
        id: `tx_fac_${Date.now()}`,
        round: next.currentRound,
        season: next.currentSeason,
        category: 'facility',
        description: `Expansão de ${label} para Nível ${team.facilities[key]}`,
        amount: -cost,
      });
      return next;
    });
  };

  const handleUpdateLivery = (
    primary: string,
    secondary: string,
    accent: string,
    pattern: LiveryPattern
  ) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      team.primaryColor = primary;
      team.secondaryColor = secondary;
      team.accentColor = accent;
      team.liveryPattern = pattern;
      return next;
    });
  };

  const handleUpdateTeamLogo = (customLogoUrl?: string) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      team.customLogoUrl = customLogoUrl;
      return next;
    });
  };

  const handleChangeEngine = (engineId: string) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      const eng = ENGINE_SUPPLIERS.find((e) => e.id === engineId);
      if (!eng) return prev;
      team.engineSupplierId = eng.id;
      team.car.engine = Math.round((team.car.engine + eng.powerRating) / 2);
      return next;
    });
  };

  const handleChangeDriverRole = (driverId: string, newRole: DriverRole) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const target = next.drivers.find((d) => d.id === driverId);
      if (!target || target.teamId !== next.playerTeamId) return prev;

      if (newRole === 'starter_1' || newRole === 'starter_2') {
        const currentHolder = next.drivers.find(
          (d) => d.teamId === next.playerTeamId && d.role === newRole && d.id !== driverId
        );
        if (currentHolder) {
          currentHolder.role = target.role === 'reserve' ? 'reserve' : target.role;
        }
      }
      target.role = newRole;
      return next;
    });
  };

  const handleFireDriver = (driverId: string) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const target = next.drivers.find((d) => d.id === driverId);
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      if (!target || target.teamId !== team.id) return prev;

      const buyout = Math.round(target.salary * Math.max(0.5, target.contractYears * 0.4));
      team.budget -= buyout;
      target.teamId = null;
      target.role = 'free_agent';
      target.contractYears = 0;

      next.transactions.unshift({
        id: `tx_fire_${Date.now()}`,
        round: next.currentRound,
        season: next.currentSeason,
        category: 'buyout',
        description: `Rescisão contratual de ${target.name}`,
        amount: -buyout,
      });
      return next;
    });
  };

  const handleSignDriver = (
    driverId: string,
    salary: number,
    years: number,
    role: 'starter_1' | 'starter_2' | 'reserve',
    buyoutFee: number
  ) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      const target = next.drivers.find((d) => d.id === driverId);
      if (!target) return prev;

      const isRenewal = target.teamId === team.id;

      // Move current seat holder if signing/promoting to starter_1 or starter_2
      const occupant = next.drivers.find(
        (d) => d.teamId === team.id && d.role === role && d.id !== target.id
      );
      if (occupant) {
        occupant.role = 'reserve';
      }

      if (buyoutFee > 0 && !isRenewal) {
        team.budget -= buyoutFee;
        next.transactions.unshift({
          id: `tx_buyout_${Date.now()}`,
          round: next.currentRound,
          season: next.currentSeason,
          category: 'buyout',
          description: `Multa rescisória para contratar ${target.name}`,
          amount: -buyoutFee,
        });
      }

      target.teamId = team.id;
      target.role = role;
      target.salary = salary;
      target.contractYears = years;
      target.contractValue = Math.round(salary * years * 0.65);
      target.morale = Math.min(100, target.morale + 10);

      next.news.unshift({
        id: `news_sign_${Date.now()}`,
        round: next.currentRound,
        season: next.currentSeason,
        title: isRenewal
          ? `${team.name} renova contrato de ${target.name} por ${years} ano(s)`
          : `Contratação oficial: ${target.name} assina com a ${team.name}`,
        body: `O piloto assumirá a função de ${role === 'reserve' ? 'Reserva' : 'Titular'} pelas próximas ${years} temporada(s).`,
        category: 'market',
      });
      return next;
    });
  };

  const handleHireStaff = (staffId: string) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      const candidate = next.staff.find((s) => s.id === staffId);
      if (!candidate) return prev;

      const signingCost = Math.round(candidate.salary * 0.25);
      if (team.budget < signingCost) return prev;

      const oldHolder = next.staff.find(
        (s) => s.teamId === team.id && s.role === candidate.role
      );
      if (oldHolder) {
        oldHolder.teamId = null;
        oldHolder.contractYears = 0;
      }

      team.budget -= signingCost;
      candidate.teamId = team.id;
      candidate.contractYears = 3;

      next.transactions.unshift({
        id: `tx_staff_${Date.now()}`,
        round: next.currentRound,
        season: next.currentSeason,
        category: 'buyout',
        description: `Contratação de ${candidate.name} (${STAFF_ROLE_LABELS[candidate.role]})`,
        amount: -signingCost,
      });
      return next;
    });
  };

  const handleStartDevelopment = (component: CarComponentKey, intensity: 'standard' | 'intensive') => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      const mods = getStaffModifiers(next.staff, team.id);
      const level = team.car[component];
      const baseCost = intensity === 'intensive' ? 3600000 : 2100000;
      const cost = Math.round(baseCost + Math.max(0, level - 75) * 45000);
      if (team.budget < cost) return prev;

      const windBonus = component === 'aero' && team.facilities.windTunnel >= 4 ? 1 : 0;
      const expectedGain = (intensity === 'intensive' ? 3 : 2) + (mods.devSpeedBonus > 0.85 ? 1 : 0) + windBonus;
      const rawRaces = intensity === 'intensive' ? 2 : 3;
      const totalRaces = Math.max(1, rawRaces - (team.facilities.factory >= 5 ? 1 : 0));

      team.budget -= cost;
      next.devQueue.push({
        id: `dev_${Date.now()}`,
        component,
        intensity,
        cost,
        totalRaces,
        remainingRaces: totalRaces,
        expectedGain,
        startedAtRound: next.currentRound,
      });

      next.transactions.unshift({
        id: `tx_dev_${Date.now()}`,
        round: next.currentRound,
        season: next.currentSeason,
        category: 'development',
        description: `Projeto ${COMPONENT_LABELS[component]} (${intensity === 'intensive' ? 'Focado' : 'Padrão'})`,
        amount: -cost,
      });
      return next;
    });
  };

  const handleSignSponsor = (sponsor: SponsorContract) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      if (team.sponsors.length >= 4) return prev;

      team.sponsors.push(sponsor);
      team.budget += sponsor.signingBonus;
      next.transactions.unshift({
        id: `tx_sp_sign_${Date.now()}`,
        round: next.currentRound,
        season: next.currentSeason,
        category: 'sponsor',
        description: `Bônus de assinatura: ${sponsor.name}`,
        amount: sponsor.signingBonus,
      });
      next.news.unshift({
        id: `news_sp_${Date.now()}`,
        round: next.currentRound,
        season: next.currentSeason,
        title: `${team.name} fecha patrocínio com ${sponsor.name}`,
        body: `O acordo garante ${sponsor.durationRaces} etapas de exposição e reforço imediato no caixa.`,
        category: 'finance',
      });
      return next;
    });
  };

  const handleTerminateSponsor = (sponsorId: string) => {
    updateCareer((prev) => {
      const next = structuredClone(prev) as CareerState;
      const team = next.teams.find((t) => t.id === next.playerTeamId)!;
      team.sponsors = team.sponsors.filter((s) => s.id !== sponsorId);
      return next;
    });
  };

  const handleHoldMeeting = (topic: BoardMeetingTopic): BoardMeetingOutcome => {
    const outcome = processBoardMeeting(career!, topic);
    setCareer(outcome.career);
    return outcome;
  };

  if (!career) {
    return (
      <StartMenu
        settings={settings}
        onUpdateSettings={(s) => setSettings(s)}
        onStartCareer={handleStartCareer}
        latestCareerSummary={latestSummary}
      />
    );
  }

  return (
    <>
      <GameLayout
        career={career}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onSimulateGP={handleSimulateGP}
        onStartNewSeason={handleStartNewSeason}
        onClearNotifications={() => updateCareer((prev) => ({ ...prev, unreadNotifications: 0 }))}
        onExitToMenu={() => {
          setCareer(null);
          setLatestSummary(getSavedCareerSummaries()[0] ?? null);
        }}
      >
        {activeTab === 'overview' && (
          <OverviewView
            career={career}
            onSimulateGP={handleSimulateGP}
            onResolveEvent={handleResolveEvent}
            onNavigate={setActiveTab}
            onStartNewSeason={handleStartNewSeason}
          />
        )}
        {activeTab === 'my_team' && (
          <MyTeamView
            career={career}
            onUpgradeFacility={handleUpgradeFacility}
            onUpdateLivery={handleUpdateLivery}
            onUpdateLogo={handleUpdateTeamLogo}
            onChangeEngine={handleChangeEngine}
          />
        )}
        {activeTab === 'drivers' && (
          <DriversView
            career={career}
            onChangeDriverRole={handleChangeDriverRole}
            onFireDriver={handleFireDriver}
            onSignDriver={handleSignDriver}
            onGoToMarket={() => setActiveTab('market')}
          />
        )}
        {activeTab === 'staff' && <StaffView career={career} onHireStaff={handleHireStaff} />}
        {activeTab === 'development' && (
          <DevelopmentView career={career} onStartDevelopment={handleStartDevelopment} />
        )}
        {activeTab === 'finances' && <FinancesView career={career} />}
        {activeTab === 'sponsors' && (
          <SponsorsView
            career={career}
            onSignSponsor={handleSignSponsor}
            onTerminateSponsor={handleTerminateSponsor}
          />
        )}
        {activeTab === 'market' && (
          <MarketView career={career} onSignDriver={handleSignDriver} />
        )}
        {activeTab === 'board' && (
          <BoardView career={career} onHoldMeeting={handleHoldMeeting} />
        )}
        {activeTab === 'calendar' && (
          <CalendarView career={career} onSimulateGP={handleSimulateGP} />
        )}
        {activeTab === 'standings' && <StandingsView career={career} />}
        {activeTab === 'history' && <HistoryView career={career} />}
      </GameLayout>

      {raceModalData && (
        <RaceResultModal
          race={raceModalData}
          playerTeamId={career.playerTeamId}
          onClose={handleCloseRaceModal}
        />
      )}

      {seasonEndSummary && (
        <SeasonEndModal
          summary={seasonEndSummary}
          currency={career.settings.currency}
          fired={career.board.fired}
          onProceedTransferWindow={() => setSeasonEndSummary(null)}
          onReturnToMenu={() => {
            setSeasonEndSummary(null);
            setCareer(null);
          }}
        />
      )}

      {/* Mid-season firing overlay */}
      {career.phase === 'fired' && !seasonEndSummary && !raceModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#131823] border border-red-500/40 rounded-2xl p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-white">Demitido pela Diretoria</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                O conselho administrativo decidiu encerrar seu comando imediatamente após a queda crítica de confiança e resultados abaixo das metas.
              </p>
            </div>
            <button
              onClick={() => {
                setCareer(null);
                setLatestSummary(getSavedCareerSummaries()[0] ?? null);
              }}
              className="w-full py-3 rounded-xl bg-[#E10600] hover:bg-[#c80500] text-xs font-bold text-white cursor-pointer"
            >
              Voltar ao Menu Inicial
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
