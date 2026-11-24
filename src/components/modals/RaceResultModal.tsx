import React, { useState } from 'react';
import { Award, CloudRain, Flag, Sun, X } from 'lucide-react';
import { RaceWeekend } from '../../types/game';

interface RaceResultModalProps {
  race: RaceWeekend;
  playerTeamId: string;
  onClose: () => void;
}

export const RaceResultModal: React.FC<RaceResultModalProps> = ({ race, playerTeamId, onClose }) => {
  const [tab, setTab] = useState<'race' | 'qualifying'>('race');
  const results = race.results ?? [];
  const qualifying = race.qualifying ?? [];
  const podium = results.slice(0, 3);
  const playerResults = results.filter((r) => r.teamId === playerTeamId);
  const playerPoints = playerResults.reduce((acc, r) => acc + r.points, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#111620] border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Banner */}
        <div className="relative h-36 sm:h-40 shrink-0 overflow-hidden">
          <img
            src="/src/assets/images/f1_circuit_night_1795450822344.jpg"
            alt={race.circuit}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111620] via-[#111620]/70 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Fechar resumo do GP"
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/60 hover:bg-black/80 text-white border border-white/15 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-300 flex items-center gap-2">
                <span>Etapa {race.round}/24</span>
                <span>·</span>
                <span>{race.circuit}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  {race.weather.includes('Chuva') || race.weather === 'Tempestade' ? (
                    <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  {race.weather}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-0.5">{race.name}</h2>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-300">Sua Equipe no GP</div>
              <div className="font-mono-tabular text-lg font-bold text-white">
                +{playerPoints} pts ({playerResults.map((r) => (r.dnf ? 'DNF' : `${r.position}º`)).join(' / ')})
              </div>
            </div>
          </div>
        </div>

        {/* Podium strip */}
        <div className="px-5 py-4 border-b border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 bg-[#0D1119]">
          {podium.map((entry, idx) => (
            <div
              key={entry.driverId}
              className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#141A25] border border-white/8"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-1.5 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: entry.teamColor }}
                />
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Award className={`w-3.5 h-3.5 ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : 'text-amber-700'}`} />
                    <span>{idx + 1}º Lugar</span>
                  </div>
                  <div className="font-display font-bold text-sm text-white truncate">{entry.driverName}</div>
                  <div className="text-[11px] text-slate-400 truncate">{entry.teamName}</div>
                </div>
              </div>
              <span className="font-mono-tabular text-xs font-bold text-white shrink-0">+{entry.points}</span>
            </div>
          ))}
        </div>

        {/* Tab Toggle & Notes */}
        <div className="px-5 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 bg-[#0B0E14] rounded-lg border border-white/10">
            <button
              onClick={() => setTab('race')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                tab === 'race' ? 'bg-white text-[#0B0E14]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Resultado da Corrida
            </button>
            <button
              onClick={() => setTab('qualifying')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer ${
                tab === 'qualifying' ? 'bg-white text-[#0B0E14]' : 'text-slate-400 hover:text-white'
              }`}
            >
              Classificação (Grid)
            </button>
          </div>
          {race.summaryNotes && race.summaryNotes.length > 0 && (
            <div className="text-xs text-slate-400 truncate max-w-md">{race.summaryNotes[0]}</div>
          )}
        </div>

        {/* Table body */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {tab === 'race' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400">
                  <th className="py-2 pr-3">Pos</th>
                  <th className="py-2 pr-3">Piloto</th>
                  <th className="py-2 pr-3">Equipe</th>
                  <th className="py-2 pr-3 text-right">Grid</th>
                  <th className="py-2 pr-3 text-right">Tempo / Status</th>
                  <th className="py-2 text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {results.map((r) => {
                  const isPlayer = r.teamId === playerTeamId;
                  return (
                    <tr key={r.driverId} className={isPlayer ? 'bg-white/[0.06]' : 'hover:bg-white/[0.02]'}>
                      <td className="py-2.5 pr-3 font-mono-tabular font-bold text-white">
                        {r.dnf ? 'NC' : `${r.position}º`}
                      </td>
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-4 rounded-full" style={{ backgroundColor: r.teamColor }} />
                          <span className="font-semibold text-white">{r.driverName}</span>
                          {r.fastestLap && (
                            <span className="text-[10px] font-mono-tabular text-fuchsia-400 font-semibold">VR</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-slate-400">{r.teamName}</td>
                      <td className="py-2.5 pr-3 text-right font-mono-tabular text-slate-400">{r.gridPosition}º</td>
                      <td className="py-2.5 pr-3 text-right font-mono-tabular">
                        {r.dnf ? (
                          <span className="text-red-400">{r.dnfReason || 'Abandono'}</span>
                        ) : (
                          <span className="text-slate-200">{r.gapFormatted}</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right font-mono-tabular font-bold text-white">
                        {r.points > 0 ? `+${r.points}` : '0'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400">
                  <th className="py-2 pr-3">Pos</th>
                  <th className="py-2 pr-3">Piloto</th>
                  <th className="py-2 pr-3">Equipe</th>
                  <th className="py-2 pr-3 text-right">Melhor Volta</th>
                  <th className="py-2 text-right">Diferença</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {qualifying.map((q) => {
                  const isPlayer = q.teamId === playerTeamId;
                  return (
                    <tr key={q.driverId} className={isPlayer ? 'bg-white/[0.06]' : 'hover:bg-white/[0.02]'}>
                      <td className="py-2.5 pr-3 font-mono-tabular font-bold text-white">{q.position}º</td>
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="w-1 h-4 rounded-full" style={{ backgroundColor: q.teamColor }} />
                          <span className="font-semibold text-white">{q.driverName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-slate-400">{q.teamName}</td>
                      <td className="py-2.5 pr-3 text-right font-mono-tabular text-slate-200">{q.lapTimeFormatted}</td>
                      <td className="py-2.5 text-right font-mono-tabular text-slate-400">{q.gapFormatted}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between gap-3 bg-[#0D1119] shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Flag className="w-3.5 h-3.5" />
            <span>Simulação oficial concluída e salva automaticamente.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-[#0B0E14] hover:bg-slate-200 text-xs font-bold cursor-pointer"
          >
            Continuar Carreira
          </button>
        </div>
      </div>
    </div>
  );
};
