import React, { useState } from 'react';
import { getCarOverall, getConstructorStandings, getDriverStandings } from '../../engine/simulation';
import { CareerState } from '../../types/game';
import { SimpleAreaChart } from '../visuals/MiniCharts';
import { TeamLogo } from '../visuals/TeamLogo';

interface StandingsViewProps {
  career: CareerState;
}

export const StandingsView: React.FC<StandingsViewProps> = ({ career }) => {
  const [tab, setTab] = useState<'drivers' | 'constructors'>('drivers');
  const driverStandings = getDriverStandings(career);
  const constructorStandings = getConstructorStandings(career);
  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;

  const playerPointsSeries = career.pointsProgression.map((p) => ({
    label: p.round === 0 ? 'Pré' : `GP${p.round}`,
    value: p.standings[playerTeam.id] ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Classificação do Campeonato — {career.currentSeason}
          </h2>
          <p className="text-xs text-slate-400">
            Pontuação oficial da Fórmula 1 (25-18-15-12-10-8-6-4-2-1{career.settings.fastestLapPoint ? ' +1 Volta Rápida' : ''}).
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#121722] rounded-xl border border-white/10">
          <button
            onClick={() => setTab('drivers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'drivers' ? 'bg-white text-[#0B0E14]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mundial de Pilotos
          </button>
          <button
            onClick={() => setTab('constructors')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
              tab === 'constructors' ? 'bg-white text-[#0B0E14]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mundial de Construtores
          </button>
        </div>
      </div>

      {tab === 'drivers' ? (
        <div className="bg-[#121722] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 bg-[#0E121B]">
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-3">Piloto</th>
                  <th className="py-3 px-3">Equipe</th>
                  <th className="py-3 px-3 text-right">Vitórias</th>
                  <th className="py-3 px-3 text-right">Pódios</th>
                  <th className="py-3 px-3 text-right">Poles</th>
                  <th className="py-3 px-3 text-right">V. Rápidas</th>
                  <th className="py-3 px-3 text-right">DNF</th>
                  <th className="py-3 px-4 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {driverStandings.map((d, idx) => {
                  const team = career.teams.find((t) => t.id === d.teamId);
                  const isPlayer = d.teamId === career.playerTeamId;
                  return (
                    <tr key={d.id} className={isPlayer ? 'bg-white/[0.06]' : 'hover:bg-white/[0.02]'}>
                      <td className="py-3 px-4 font-mono-tabular font-bold text-white">{idx + 1}º</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-1 h-4 rounded-full" style={{ backgroundColor: team?.primaryColor ?? '#64748B' }} />
                          <span className="font-semibold text-white">{d.name}</span>
                          <span className="text-slate-500 font-mono-tabular">#{d.number}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{team?.name ?? 'Sem equipe'}</td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{d.seasonStats.wins}</td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{d.seasonStats.podiums}</td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{d.seasonStats.poles}</td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{d.seasonStats.fastestLaps}</td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-400">{d.seasonStats.dnfs}</td>
                      <td className="py-3 px-4 text-right font-mono-tabular font-extrabold text-white text-sm">
                        {d.seasonStats.points}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#121722] border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 bg-[#0E121B]">
                  <th className="py-3 px-4">Pos</th>
                  <th className="py-3 px-3">Escuderia</th>
                  <th className="py-3 px-3 text-right">Carro</th>
                  <th className="py-3 px-3 text-right">Vitórias</th>
                  <th className="py-3 px-3 text-right">Pódios</th>
                  <th className="py-3 px-3 text-right">Poles</th>
                  <th className="py-3 px-4 text-right">Pontos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {constructorStandings.map((team, idx) => {
                  const isPlayer = team.id === career.playerTeamId;
                  return (
                    <tr key={team.id} className={isPlayer ? 'bg-white/[0.06]' : 'hover:bg-white/[0.02]'}>
                      <td className="py-3 px-4 font-mono-tabular font-bold text-white">{idx + 1}º</td>
                      <td className="py-3 px-3">
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
                            size={30}
                          />
                          <div>
                            <div className="font-semibold text-white">{team.name}</div>
                            <div className="text-[11px] text-slate-400">Rep. {Math.round(team.reputation)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{getCarOverall(team.car)}</td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{team.seasonWins}</td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{team.seasonPodiums}</td>
                      <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{team.seasonPoles}</td>
                      <td className="py-3 px-4 text-right font-mono-tabular font-extrabold text-white text-sm">
                        {team.seasonPoints}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Points Progression */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-3">
        <h3 className="font-display font-bold text-base text-white">
          Progressão de Pontos da {playerTeam.name}
        </h3>
        <SimpleAreaChart
          data={playerPointsSeries}
          color={playerTeam.primaryColor}
          height={175}
          formatValue={(v) => `${Math.round(v)} pts`}
        />
      </div>
    </div>
  );
};
