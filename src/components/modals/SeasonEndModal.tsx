import React from 'react';
import { Award, DollarSign, Trophy } from 'lucide-react';
import { formatMoney } from '../../engine/simulation';
import { CareerSettings, SeasonHistoryEntry } from '../../types/game';

interface SeasonEndModalProps {
  summary: SeasonHistoryEntry;
  currency: CareerSettings['currency'];
  fired: boolean;
  onProceedTransferWindow: () => void;
  onReturnToMenu: () => void;
}

export const SeasonEndModal: React.FC<SeasonEndModalProps> = ({
  summary,
  currency,
  fired,
  onProceedTransferWindow,
  onReturnToMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#121722] border border-white/15 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="text-xs font-medium text-slate-400">Encerramento Oficial da Temporada {summary.season}</div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Resumo do Campeonato Mundial
            </h2>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

        {/* Champions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1119] border border-white/10 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Campeão de Pilotos
            </div>
            <div className="font-display text-xl font-bold text-white">{summary.driverChampionName}</div>
            <div className="text-xs text-slate-400">
              {summary.driverChampionTeam} · <span className="font-mono-tabular text-white">{summary.driverChampionPoints} pts</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1119] border border-white/10 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Campeã de Construtores
            </div>
            <div className="font-display text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: summary.constructorChampionColor }} />
              {summary.constructorChampionName}
            </div>
            <div className="text-xs text-slate-400">
              Total na temporada: <span className="font-mono-tabular text-white">{summary.constructorChampionPoints} pts</span>
            </div>
          </div>
        </div>

        {/* Player Team Summary */}
        <div className="p-5 rounded-xl bg-[#0E131D] border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-display font-bold text-lg text-white">{summary.playerTeamName}</div>
            <div className="font-mono-tabular text-sm font-bold text-white">
              {summary.playerRank}º Lugar · {summary.playerPoints} pts
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-lg bg-[#141A26] border border-white/5">
              <div className="font-mono-tabular text-lg font-bold text-white">{summary.playerWins}</div>
              <div className="text-[11px] text-slate-400">Vitórias</div>
            </div>
            <div className="p-3 rounded-lg bg-[#141A26] border border-white/5">
              <div className="font-mono-tabular text-lg font-bold text-white">{summary.playerPodiums}</div>
              <div className="text-[11px] text-slate-400">Pódios</div>
            </div>
            <div className="p-3 rounded-lg bg-[#141A26] border border-white/5">
              <div className="font-mono-tabular text-lg font-bold text-white">{summary.playerPoles}</div>
              <div className="text-[11px] text-slate-400">Poles</div>
            </div>
            <div className="p-3 rounded-lg bg-[#141A26] border border-white/5">
              <div className="font-mono-tabular text-lg font-bold text-emerald-400 flex items-center justify-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatMoney(summary.prizeMoneyEarned, currency, true)}
              </div>
              <div className="text-[11px] text-slate-400">Premiação FOM</div>
            </div>
          </div>

          <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${fired ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-white/[0.03] border-white/10 text-slate-300'}`}>
            <strong className="text-white block mb-0.5">Avaliação da Diretoria:</strong>
            {summary.boardVerdict}
          </div>
        </div>

        {/* Top 5 Drivers */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400">Top 5 do Mundial de Pilotos</div>
          <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-[#0D1119]">
            {summary.topDrivers.map((d, idx) => (
              <div key={d.name} className="px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono-tabular font-bold text-slate-400 w-5">{idx + 1}º</span>
                  <span className="font-semibold text-white">{d.name}</span>
                  <span className="text-slate-400">{d.teamName}</span>
                </div>
                <div className="font-mono-tabular text-slate-200">
                  {d.points} pts · {d.wins} vit.
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-white/10">
          {fired ? (
            <button
              onClick={onReturnToMenu}
              className="px-6 py-3 rounded-xl bg-[#E10600] hover:bg-[#c80500] text-white text-sm font-semibold cursor-pointer"
            >
              Voltar ao Menu Inicial
            </button>
          ) : (
            <button
              onClick={onProceedTransferWindow}
              className="px-6 py-3 rounded-xl bg-white text-[#0B0E14] hover:bg-slate-200 text-sm font-bold cursor-pointer"
            >
              Abrir Janela de Transferências ({summary.season + 1})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
