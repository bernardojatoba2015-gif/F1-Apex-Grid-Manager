import React, { useState } from 'react';
import { Calendar, CloudRain, Eye, Play, Sun } from 'lucide-react';
import { CareerState, RaceWeekend } from '../../types/game';
import { RaceResultModal } from '../modals/RaceResultModal';

interface CalendarViewProps {
  career: CareerState;
  onSimulateGP: () => void;
}

const TRACK_LABELS: Record<RaceWeekend['characteristic'], string> = {
  power: 'Alta Velocidade',
  aero: 'Aerodinâmica',
  street: 'Urbano / Travado',
  balanced: 'Misto',
};

export const CalendarView: React.FC<CalendarViewProps> = ({ career, onSimulateGP }) => {
  const [inspectRace, setInspectRace] = useState<RaceWeekend | null>(null);
  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">
            Calendário Oficial — Temporada {career.currentSeason}
          </h2>
          <p className="text-xs text-slate-400">
            24 etapas mundiais. Clique em qualquer GP concluído para inspecionar classificação e corrida.
          </p>
        </div>
        {career.phase === 'in_season' && career.currentRound <= 24 && (
          <button
            onClick={onSimulateGP}
            style={{ backgroundColor: playerTeam.primaryColor }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white hover:brightness-110 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Simular Próximo GP (Etapa {career.currentRound}/24)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {career.calendar.map((race) => {
          const isNext = race.round === career.currentRound && career.phase === 'in_season';
          const winner = race.results?.[0];
          const pole = race.qualifying?.[0];

          return (
            <div
              key={race.round}
              className={`rounded-2xl p-4 border flex flex-col justify-between gap-3 ${
                isNext
                  ? 'bg-[#192131] border-white/30'
                  : race.completed
                  ? 'bg-[#10151F] border-white/8'
                  : 'bg-[#121722] border-white/10'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono-tabular font-semibold">
                    Etapa {race.round} · {race.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {race.weather.includes('Chuva') || race.weather === 'Tempestade' ? (
                      <CloudRain className="w-3 h-3 text-sky-400" />
                    ) : (
                      <Sun className="w-3 h-3 text-amber-400" />
                    )}
                    {race.weather}
                  </span>
                </div>
                <div className="font-display font-bold text-base text-white">{race.name}</div>
                <div className="text-xs text-slate-400">
                  {race.circuit} · {race.laps} voltas · {TRACK_LABELS[race.characteristic]}
                </div>
              </div>

              {race.completed && winner ? (
                <div className="pt-2.5 border-t border-white/8 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <div className="text-white font-semibold truncate">
                      1º {winner.driverName} ({winner.teamName})
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      Pole: {pole?.driverName} ({pole?.lapTimeFormatted})
                    </div>
                  </div>
                  <button
                    onClick={() => setInspectRace(race)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white shrink-0 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    Ver
                  </button>
                </div>
              ) : isNext ? (
                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Próxima etapa
                  </span>
                  <button
                    onClick={onSimulateGP}
                    className="px-3 py-1.5 rounded-lg bg-white text-[#0B0E14] text-xs font-bold cursor-pointer"
                  >
                    Simular GP
                  </button>
                </div>
              ) : (
                <div className="pt-2.5 border-t border-white/8 text-[11px] text-slate-500">
                  Aguardando realização
                </div>
              )}
            </div>
          );
        })}
      </div>

      {inspectRace && (
        <RaceResultModal
          race={inspectRace}
          playerTeamId={career.playerTeamId}
          onClose={() => setInspectRace(null)}
        />
      )}
    </div>
  );
};
