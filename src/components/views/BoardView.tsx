import React, { useState } from 'react';
import { Building, CheckCircle2, Clock, MessageSquare, ShieldAlert } from 'lucide-react';
import { BoardMeetingOutcome, BoardMeetingTopic } from '../../engine/simulation';
import { CareerState } from '../../types/game';

interface BoardViewProps {
  career: CareerState;
  onHoldMeeting: (topic: BoardMeetingTopic) => BoardMeetingOutcome;
}

const MEETING_TOPICS: { id: BoardMeetingTopic; title: string; desc: string }[] = [
  {
    id: 'present_results',
    title: 'Apresentar Resultados e Relatório',
    desc: 'Mostre evolução esportiva e financeira para fortalecer a confiança do conselho.',
  },
  {
    id: 'request_budget',
    title: 'Pedir Aumento de Orçamento',
    desc: 'Solicite um aporte extraordinário de $4.5M para peças e desenvolvimento.',
  },
  {
    id: 'request_facility',
    title: 'Solicitar Investimento em Infraestrutura',
    desc: 'Peça financiamento direto da diretoria para evoluir o Túnel de Vento.',
  },
  {
    id: 'negotiate_goals',
    title: 'Negociar Flexibilização de Metas',
    desc: 'Tente suavizar a meta mínima de posição nos Construtores.',
  },
  {
    id: 'explain_results',
    title: 'Explicar Resultados Ruins',
    desc: 'Justifique quedas recentes por adaptação técnica ou confiabilidade.',
  },
  {
    id: 'request_time',
    title: 'Pedir Mais Tempo para Desenvolver o Carro',
    desc: 'Acalme ultimatos e garanta prazo para maturar atualizações na fábrica.',
  },
];

export const BoardView: React.FC<BoardViewProps> = ({ career, onHoldMeeting }) => {
  const [lastOutcome, setLastOutcome] = useState<BoardMeetingOutcome | null>(null);

  const canHoldMeeting =
    career.board.lastMeetingRound === 0 || career.currentRound - career.board.lastMeetingRound >= 3;
  const racesUntilNextMeeting = Math.max(0, 3 - (career.currentRound - career.board.lastMeetingRound));

  const statusColor =
    career.board.status === 'Segura'
      ? 'text-emerald-400'
      : career.board.status === 'Estável'
      ? 'text-sky-400'
      : career.board.status === 'Atenção'
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div className="space-y-6">
      {/* Boardroom Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#121722]">
        <img
          src="/src/assets/images/f1_boardroom_hq_1795450821983.jpg"
          alt="Sala da diretoria da equipe de Fórmula 1"
          referrerPolicy="no-referrer"
          className="w-full h-44 sm:h-52 object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/85 to-transparent" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              <span>Conselho Administrativo · Temporada {career.currentSeason}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Diretoria & Reuniões Executivas
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Mantenha a confiança da diretoria acima da zona crítica para evitar demissão e liberar novos recursos.
            </p>
          </div>
          <div className="bg-[#0D1119]/90 border border-white/10 rounded-xl px-5 py-3 text-right shrink-0">
            <div className="text-[11px] text-slate-400">Confiança na Gestão</div>
            <div className="font-mono-tabular text-2xl font-extrabold text-white">
              {career.board.confidence}%
            </div>
            <div className={`text-xs font-semibold ${statusColor}`}>{career.board.status}</div>
          </div>
        </div>
      </div>

      {career.board.ultimatumActive && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/35 flex items-center gap-3 text-xs text-red-200">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <strong className="text-white block">Aviso de Ultimato da Diretoria</strong>
            Os resultados recentes deixaram seu cargo em risco. Pontue com urgência ou convoque uma reunião para ganhar tempo.
          </div>
        </div>
      )}

      {/* Objectives & Meeting Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Objetivos da Temporada</h3>
          <div className="space-y-3">
            {career.board.objectives.map((obj) => (
              <div key={obj.id} className="p-3.5 rounded-xl bg-[#0D111A] border border-white/8 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {obj.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-white">{obj.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Atual: <span className="font-mono-tabular text-slate-200">{obj.currentValue}</span> · Meta:{' '}
                      <span className="font-mono-tabular text-slate-200">{obj.targetValue}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold shrink-0 ${obj.completed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {obj.completed ? 'Cumprida' : 'Pendente'}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 text-xs text-slate-400 flex justify-between">
            <span>Reuniões realizadas neste ano:</span>
            <span className="font-mono-tabular font-bold text-white">{career.board.meetingsHeldThisSeason}</span>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" />
              Convocar Reunião com o Conselho
            </h3>
            {!canHoldMeeting && (
              <span className="text-xs text-amber-400">
                Próxima reunião liberada em {racesUntilNextMeeting} GP(s)
              </span>
            )}
          </div>

          {lastOutcome && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                lastOutcome.approved
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-red-500/10 border-red-500/30 text-red-200'
              }`}
            >
              <div className="font-bold text-white mb-0.5">{lastOutcome.headline}</div>
              <p>{lastOutcome.reply}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MEETING_TOPICS.map((topic) => (
              <button
                key={topic.id}
                disabled={!canHoldMeeting}
                onClick={() => setLastOutcome(onHoldMeeting(topic.id))}
                className="p-4 rounded-xl bg-[#0D111A] hover:bg-[#192131] disabled:opacity-40 border border-white/10 text-left transition-colors cursor-pointer"
              >
                <div className="font-semibold text-xs text-white">{topic.title}</div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{topic.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
