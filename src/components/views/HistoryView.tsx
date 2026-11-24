import React from 'react';
import { Award, CheckCircle2, Lock, Trophy } from 'lucide-react';
import { formatMoney } from '../../engine/simulation';
import { CareerState } from '../../types/game';

interface HistoryViewProps {
  career: CareerState;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ career }) => {
  const currency = career.settings.currency;
  const unlockedCount = career.achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Histórico da Carreira & Conquistas</h2>
        <p className="text-xs text-slate-400">
          Registro permanente de campeões, campanhas por temporada e marcos desbloqueados.
        </p>
      </div>

      {/* Achievements Grid */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Conquistas da Carreira
          </h3>
          <span className="font-mono-tabular text-xs font-semibold text-slate-300">
            {unlockedCount}/{career.achievements.length} desbloqueadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {career.achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border space-y-2 ${
                ach.unlocked
                  ? 'bg-[#17212F] border-emerald-500/35'
                  : 'bg-[#0D111A] border-white/8 opacity-65'
              }`}
            >
              <div className="flex items-center justify-between">
                {ach.unlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-500" />
                )}
                {ach.unlocked && ach.unlockedSeason && (
                  <span className="text-[10px] font-mono-tabular text-emerald-300">
                    Temp. {ach.unlockedSeason} · GP {ach.unlockedRound}
                  </span>
                )}
              </div>
              <div className="font-display font-bold text-sm text-white">{ach.title}</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{ach.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Past Seasons */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Arquivo de Temporadas Concluídas
        </h3>

        {career.seasonHistory.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#0D111A] border border-dashed border-white/10 text-center text-xs text-slate-400">
            Nenhuma temporada encerrada ainda. Complete as 24 etapas da Temporada {career.currentSeason} para gravar o primeiro capítulo.
          </div>
        ) : (
          <div className="space-y-3">
            {career.seasonHistory.map((h) => (
              <div key={h.season} className="p-4 rounded-xl bg-[#0D111A] border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 pb-2.5">
                  <div className="font-display font-bold text-base text-white">Temporada {h.season}</div>
                  <div className="text-xs font-mono-tabular text-slate-300">
                    Sua equipe ({h.playerTeamName}): <strong className="text-white">{h.playerRank}º</strong> · {h.playerPoints} pts · {h.playerWins} vit. · {formatMoney(h.prizeMoneyEarned, currency, true)}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Campeão de Pilotos: </span>
                    <strong className="text-white">{h.driverChampionName}</strong> ({h.driverChampionTeam} · {h.driverChampionPoints} pts)
                  </div>
                  <div>
                    <span className="text-slate-400">Campeã de Construtores: </span>
                    <strong className="text-white">{h.constructorChampionName}</strong> ({h.constructorChampionPoints} pts)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
