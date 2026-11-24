import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Car,
  DollarSign,
  History,
  Home,
  LogOut,
  Menu,
  Play,
  Shield,
  ShoppingBag,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { formatMoney, getConstructorStandings } from '../engine/simulation';
import { CareerState, NavTab } from '../types/game';
import { TeamLogo } from './visuals/TeamLogo';

interface GameLayoutProps {
  career: CareerState;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onSimulateGP: () => void;
  onStartNewSeason: () => void;
  onClearNotifications: () => void;
  onExitToMenu: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Visão geral', icon: Home },
  { id: 'my_team', label: 'Minha equipe', icon: Car },
  { id: 'drivers', label: 'Pilotos', icon: Users },
  { id: 'staff', label: 'Funcionários', icon: Shield },
  { id: 'development', label: 'Desenvolvimento', icon: Wrench },
  { id: 'finances', label: 'Finanças', icon: DollarSign },
  { id: 'sponsors', label: 'Patrocinadores', icon: Award },
  { id: 'market', label: 'Mercado', icon: ShoppingBag },
  { id: 'board', label: 'Diretoria', icon: Building2 },
  { id: 'calendar', label: 'Calendário', icon: Calendar },
  { id: 'standings', label: 'Classificação', icon: BarChart3 },
  { id: 'history', label: 'Histórico', icon: History },
];

export const GameLayout: React.FC<GameLayoutProps> = ({
  career,
  activeTab,
  onSelectTab,
  onSimulateGP,
  onStartNewSeason,
  onClearNotifications,
  onExitToMenu,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;
  const rank = getConstructorStandings(career).findIndex((t) => t.id === playerTeam.id) + 1;
  const nextRace = career.calendar[career.currentRound - 1];
  const currency = career.settings.currency;

  const handleNav = (id: NavTab) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  const SidebarContent = (
    <div className="h-full flex flex-col bg-[#0F131C] border-r border-white/10">
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <TeamLogo
          teamId={playerTeam.id}
          isCustom={playerTeam.isCustom}
          customLogoUrl={playerTeam.customLogoUrl}
          shortName={playerTeam.shortName}
          primaryColor={playerTeam.primaryColor}
          secondaryColor={playerTeam.secondaryColor}
          accentColor={playerTeam.accentColor}
          shape={playerTeam.crestShape}
          icon={playerTeam.crestIcon}
          size={40}
        />
        <div className="min-w-0">
          <div className="font-display font-bold text-sm text-white truncate">{playerTeam.name}</div>
          <div className="text-[11px] text-slate-400">
            Temp. {career.currentSeason} · {rank}º Constr.
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              style={active ? { backgroundColor: `${playerTeam.primaryColor}24`, borderColor: `${playerTeam.primaryColor}66` } : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'text-white font-semibold'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={onExitToMenu}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Menu Inicial / Saves</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 sticky top-0 h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="w-64 h-full relative z-10">
            {SidebarContent}
          </div>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="flex-1 bg-black/70 backdrop-blur-xs"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0B0E14]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu lateral"
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {career.phase === 'transfer_window'
                  ? `Janela de Transferências · Pré-Temporada ${career.currentSeason + 1}`
                  : career.phase === 'fired'
                  ? 'Fim de Ciclo na Equipe'
                  : nextRace
                  ? `Próximo: ${nextRace.name} · Etapa ${nextRace.round}/24`
                  : `Temporada ${career.currentSeason} Concluída`}
              </div>
              <div className="text-[11px] text-slate-400 font-mono-tabular">
                Caixa: <span className={playerTeam.budget >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatMoney(playerTeam.budget, currency, true)}</span> · Confiança: {career.board.confidence}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Notifications button */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifOpen(!notifOpen);
                  if (!notifOpen) onClearNotifications();
                }}
                aria-label="Notificações"
                className="relative p-2.5 rounded-xl bg-[#131823] hover:bg-[#1B2231] border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {career.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E10600] text-[10px] font-mono-tabular font-bold text-white flex items-center justify-center">
                    {career.unreadNotifications > 9 ? '9+' : career.unreadNotifications}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#131823] border border-white/15 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-display font-bold text-sm text-white">Notificações & Paddock</span>
                    <button onClick={() => setNotifOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {career.news.slice(0, 8).map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-[#0D1119] border border-white/8 text-xs">
                        <div className="text-[10px] text-slate-400">Temp. {n.season} · GP {n.round}</div>
                        <div className="font-semibold text-white mt-0.5">{n.title}</div>
                        <p className="text-slate-400 mt-0.5 text-[11px]">{n.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {career.phase === 'in_season' && career.currentRound <= 24 && (
              <button
                onClick={onSimulateGP}
                style={{ backgroundColor: playerTeam.primaryColor }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:brightness-110 transition-all shadow-md whitespace-nowrap cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>SIMULAR GP</span>
              </button>
            )}

            {career.phase === 'transfer_window' && (
              <button
                onClick={onStartNewSeason}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white whitespace-nowrap cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Iniciar Temp. {career.currentSeason + 1}</span>
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
