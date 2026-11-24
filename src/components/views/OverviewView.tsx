import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CloudRain,
  Play,
  Sun,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import {
  COMPONENT_LABELS,
  formatMoney,
  getCarOverall,
  getConstructorStandings,
  getDriverOverall,
  getDriverStandings,
} from '../../engine/simulation';
import { CareerState, NavTab } from '../../types/game';
import { DriverAvatar } from '../visuals/DriverAvatar';
import { F1CarLivery } from '../visuals/F1CarLivery';
import { TeamLogo } from '../visuals/TeamLogo';

interface OverviewViewProps {
  career: CareerState;
  onSimulateGP: () => void;
  onResolveEvent: (choiceId: string) => void;
  onNavigate: (tab: NavTab) => void;
  onStartNewSeason: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  career,
  onSimulateGP,
  onResolveEvent,
  onNavigate,
  onStartNewSeason,
}) => {
  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;
  const constructorStandings = getConstructorStandings(career);
  const driverStandings = getDriverStandings(career);
  const constructorRank = constructorStandings.findIndex((t) => t.id === playerTeam.id) + 1;
  const teamDrivers = career.drivers.filter(
    (d) => d.teamId === playerTeam.id && (d.role === 'starter_1' || d.role === 'starter_2')
  );
  const nextRace = career.calendar[career.currentRound - 1];
  const carAvg = getCarOverall(playerTeam.car);
  const currency = career.settings.currency;

  const trackLabel: Record<string, string> = {
    power: 'Alta Velocidade',
    aero: 'Carga Aerodinâmica',
    street: 'Circuito Urbano / Travado',
    balanced: 'Equilibrado',
  };

  return (
    <div className="space-y-6">
      {/* Transfer Window Banner if between seasons */}
      {career.phase === 'transfer_window' && (
        <div className="p-5 rounded-2xl bg-[#161D2B] border border-amber-500/35 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-amber-400">Janela de Transferências Aberta</div>
            <h2 className="font-display text-xl font-bold text-white">
              Prepare sua dupla e o carro para a Temporada {career.currentSeason + 1}
            </h2>
            <p className="text-xs text-slate-300">
              Renove contratos, contrate pilotos no Mercado, ajuste funcionários e inicie a próxima temporada quando estiver pronto.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('market')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
            >
              Ir ao Mercado
            </button>
            <button
              onClick={onStartNewSeason}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
            >
              Iniciar Temporada {career.currentSeason + 1}
            </button>
          </div>
        </div>
      )}

      {/* Pending Random Event Decision Card */}
      {career.pendingEvent && !career.pendingEvent.resolved && (
        <div className="p-5 rounded-2xl bg-[#181E2B] border border-amber-500/40 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-amber-300">Decisão Pendente · Etapa {career.pendingEvent.round}</div>
              <h3 className="font-display text-lg font-bold text-white mt-0.5">{career.pendingEvent.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{career.pendingEvent.description}</p>
            </div>
          </div>
          {career.pendingEvent.choices && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {career.pendingEvent.choices.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => onResolveEvent(ch.id)}
                  className="p-3.5 rounded-xl bg-[#0F141D] hover:bg-[#1E2738] border border-white/15 text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-white">{ch.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{ch.effectSummary}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Hero Grid: Next GP + Car Showcase */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* Next GP Banner */}
        <div className="xl:col-span-5 relative rounded-2xl overflow-hidden border border-white/10 bg-[#121722] flex flex-col justify-between min-h-[250px]">
          <img
            src="/src/assets/images/f1_circuit_night_1795450822344.jpg"
            alt={nextRace ? nextRace.circuit : 'Circuito F1'}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1119] via-[#0D1119]/80 to-[#0D1119]/40" />

          <div className="relative z-10 p-6 flex-1 flex flex-col justify-between gap-5">
            {nextRace && career.phase === 'in_season' ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-slate-300 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Etapa {nextRace.round} de 24 · {nextRace.date}</span>
                    </div>
                    <h2 className="font-display text-2xl font-extrabold text-white mt-1">{nextRace.name}</h2>
                    <p className="text-xs text-slate-300">{nextRace.circuit} · {nextRace.laps} voltas</p>
                  </div>
                  <div className="text-right text-xs text-slate-200 flex items-center gap-1.5 bg-black/45 px-2.5 py-1.5 rounded-lg border border-white/10">
                    {nextRace.weather.includes('Chuva') || nextRace.weather === 'Tempestade' ? (
                      <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                    ) : (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{nextRace.weather}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-slate-300">
                    Perfil da pista: <strong className="text-white">{trackLabel[nextRace.characteristic]}</strong>
                  </div>
                  <button
                    onClick={onSimulateGP}
                    style={{ backgroundColor: playerTeam.primaryColor }}
                    className="w-full py-3.5 px-5 rounded-xl font-display font-bold text-sm text-white hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Simular GP ({nextRace.name})
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col justify-center h-full space-y-3">
                <div className="text-xs text-slate-400">Temporada {career.currentSeason}</div>
                <h2 className="font-display text-2xl font-bold text-white">Campeonato Concluído</h2>
                <p className="text-xs text-slate-300">
                  Revise sua equipe e avance para a próxima temporada na barra superior.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Team Car & KPI Strip */}
        <div className="xl:col-span-7 bg-[#121722] border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
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
                size={46}
              />
              <div>
                <h3 className="font-display text-xl font-bold text-white">{playerTeam.name}</h3>
                <div className="text-xs text-slate-400">
                  Chefe: {playerTeam.principalName} · Reputação {Math.round(playerTeam.reputation)}/100
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate('my_team')}
              className="text-xs font-medium text-slate-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              Gerenciar equipe <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#0C1018] rounded-xl p-4 border border-white/5">
            <F1CarLivery
              primaryColor={playerTeam.primaryColor}
              secondaryColor={playerTeam.secondaryColor}
              accentColor={playerTeam.accentColor}
              pattern={playerTeam.liveryPattern}
              shortName={playerTeam.shortName}
              carNumber={teamDrivers[0]?.number ?? 1}
              sponsorLabel={playerTeam.sponsors[0]?.name}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[#0D111A] border border-white/8">
              <div className="text-[11px] text-slate-400">Construtores</div>
              <div className="font-mono-tabular text-lg font-bold text-white mt-0.5">
                {constructorRank}º · {playerTeam.seasonPoints} pts
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D111A] border border-white/8">
              <div className="text-[11px] text-slate-400">Saldo em Caixa</div>
              <div className={`font-mono-tabular text-lg font-bold mt-0.5 ${playerTeam.budget >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatMoney(playerTeam.budget, currency, true)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D111A] border border-white/8">
              <div className="text-[11px] text-slate-400">Nível do Carro</div>
              <div className="font-mono-tabular text-lg font-bold text-white mt-0.5">{carAvg}/100</div>
            </div>
            <div className="p-3 rounded-xl bg-[#0D111A] border border-white/8">
              <div className="text-[11px] text-slate-400">Confiança Diretoria</div>
              <div className="font-mono-tabular text-lg font-bold text-white mt-0.5">
                {career.board.confidence}% · <span className="text-xs font-sans font-medium text-slate-300">{career.board.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Drivers + R&D + Board Objectives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Starters */}
        <div className="bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white">Dupla de Pilotos</h3>
            <button onClick={() => onNavigate('drivers')} className="text-xs text-slate-400 hover:text-white cursor-pointer">
              Detalhes
            </button>
          </div>
          <div className="space-y-3">
            {teamDrivers.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0D111A] border border-white/8">
                <div className="flex items-center gap-3 min-w-0">
                  <DriverAvatar shortCode={d.shortCode} number={d.number} teamColor={playerTeam.primaryColor} />
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{d.name}</div>
                    <div className="text-xs text-slate-400">
                      {getDriverOverall(d)} OVR · Moral {d.morale}% · {d.contractYears}a
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono-tabular text-sm font-bold text-white">{d.seasonStats.points} pts</div>
                  <div className="text-[11px] text-slate-400">{d.seasonStats.podiums} pód.</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active R&D & Car Specs */}
        <div className="bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-slate-400" />
              Desenvolvimento (P&D)
            </h3>
            <button onClick={() => onNavigate('development')} className="text-xs text-slate-400 hover:text-white cursor-pointer">
              Investir
            </button>
          </div>
          {career.devQueue.length === 0 ? (
            <div className="p-4 rounded-xl bg-[#0D111A] border border-dashed border-white/10 text-center space-y-2">
              <p className="text-xs text-slate-400">Nenhum pacote de atualização em produção no momento.</p>
              <button
                onClick={() => onNavigate('development')}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
              >
                Iniciar Projeto
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {career.devQueue.map((proj) => (
                <div key={proj.id} className="p-3 rounded-xl bg-[#0D111A] border border-white/8 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">
                      {COMPONENT_LABELS[proj.component]} (+{proj.expectedGain})
                    </span>
                    <span className="font-mono-tabular text-slate-400">
                      {proj.remainingRaces} GP(s) restante(s)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(((proj.totalRaces - proj.remainingRaces) / proj.totalRaces) * 100)}%`,
                        backgroundColor: playerTeam.primaryColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
            <div className="p-2 rounded-lg bg-[#0D111A]">
              <div className="text-slate-400 text-[10px]">Motor</div>
              <div className="font-mono-tabular font-bold text-white">{playerTeam.car.engine}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#0D111A]">
              <div className="text-slate-400 text-[10px]">Aero</div>
              <div className="font-mono-tabular font-bold text-white">{playerTeam.car.aero}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#0D111A]">
              <div className="text-slate-400 text-[10px]">Chassi</div>
              <div className="font-mono-tabular font-bold text-white">{playerTeam.car.chassis}</div>
            </div>
          </div>
        </div>

        {/* Board Objectives */}
        <div className="bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white">Metas da Diretoria</h3>
            <button onClick={() => onNavigate('board')} className="text-xs text-slate-400 hover:text-white cursor-pointer">
              Reunião
            </button>
          </div>
          <div className="space-y-2.5">
            {career.board.objectives.map((obj) => (
              <div key={obj.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0D111A] border border-white/8 text-xs">
                <span className="text-slate-200">{obj.label}</span>
                <span className={`font-semibold shrink-0 ${obj.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {obj.completed ? 'Cumprida' : 'Em curso'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top 5 Standings + Latest News */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              Mundial de Pilotos (Top 5)
            </h3>
            <button onClick={() => onNavigate('standings')} className="text-xs text-slate-400 hover:text-white cursor-pointer">
              Tabela completa
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {driverStandings.slice(0, 5).map((drv, idx) => {
              const t = career.teams.find((tm) => tm.id === drv.teamId);
              return (
                <div key={drv.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono-tabular font-bold text-slate-400 w-4">{idx + 1}</span>
                    <span className="w-1.5 h-4 rounded-full shrink-0" style={{ backgroundColor: t?.primaryColor ?? '#64748B' }} />
                    <span className="font-semibold text-white truncate">{drv.name}</span>
                    <span className="text-slate-500">{t?.shortName}</span>
                  </div>
                  <span className="font-mono-tabular font-bold text-white shrink-0">{drv.seasonStats.points} pts</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="font-display font-bold text-base text-white">Notícias do Paddock</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {career.news.slice(0, 6).map((n) => (
              <div key={n.id} className="p-3 rounded-xl bg-[#0D111A] border border-white/8">
                <div className="text-[11px] text-slate-400">
                  Temporada {n.season} · Etapa {n.round}
                </div>
                <div className="font-semibold text-xs text-white mt-0.5">{n.title}</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
