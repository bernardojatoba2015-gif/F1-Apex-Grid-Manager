import React, { useState } from 'react';
import { Briefcase, UserCheck } from 'lucide-react';
import { formatMoney, STAFF_ROLE_LABELS } from '../../engine/simulation';
import { CareerState, StaffRole } from '../../types/game';

interface StaffViewProps {
  career: CareerState;
  onHireStaff: (staffId: string) => void;
}

const ROLE_IMPACT: Record<StaffRole, string> = {
  technical_director: 'Acelera projetos de desenvolvimento e eleva eficiência geral.',
  aero_chief: 'Aumenta carga aerodinâmica efetiva em todos os circuitos.',
  strategy_chief: 'Melhora decisões automáticas em corrida e chuva.',
  sporting_director: 'Reduz exigências salariais em negociações com pilotos.',
  lead_engineer: 'Aumenta o ritmo de evolução dos componentes do carro.',
  head_mechanic: 'Reduz risco de falhas mecânicas e abandonos na pista.',
};

export const StaffView: React.FC<StaffViewProps> = ({ career, onHireStaff }) => {
  const [roleFilter, setRoleFilter] = useState<'all' | StaffRole>('all');
  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;
  const currency = career.settings.currency;

  const currentStaff = career.staff.filter((s) => s.teamId === playerTeam.id);
  const marketStaff = career.staff
    .filter((s) => s.teamId === null && (roleFilter === 'all' || s.role === roleFilter))
    .sort((a, b) => b.quality - a.quality);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Funcionários e Corpo Técnico</h2>
        <p className="text-xs text-slate-400">
          Contrate especialistas para acelerar o desenvolvimento do carro, estratégia e confiabilidade.
        </p>
      </div>

      {/* Current Team Staff */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {currentStaff.map((st) => (
          <div key={st.id} className="bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-medium text-slate-400">{STAFF_ROLE_LABELS[st.role]}</div>
                <div className="font-display font-bold text-lg text-white mt-0.5">{st.name}</div>
                <div className="text-xs text-slate-400">
                  {st.nationality} · {st.age} anos · {st.contractYears}a contrato
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono-tabular text-xl font-extrabold text-white">{st.quality}</div>
                <div className="text-[10px] text-slate-400">Qualidade</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{ROLE_IMPACT[st.role]}</p>
            <div className="pt-2 border-t border-white/8 flex items-center justify-between text-xs">
              <span className="text-slate-400">Experiência: <strong className="font-mono-tabular text-white">{st.experience}</strong></span>
              <span className="font-mono-tabular text-slate-200">{formatMoney(st.salary, currency, true)}/ano</span>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Market */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400" />
            <h3 className="font-display font-bold text-lg text-white">Mercado de Profissionais</h3>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                roleFilter === 'all' ? 'bg-white text-[#0B0E14] font-semibold' : 'bg-[#0D111A] text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            {(Object.keys(STAFF_ROLE_LABELS) as StaffRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  roleFilter === role ? 'bg-white text-[#0B0E14] font-semibold' : 'bg-[#0D111A] text-slate-400 hover:text-white'
                }`}
              >
                {STAFF_ROLE_LABELS[role]}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400">
                <th className="py-2.5 pr-3">Profissional</th>
                <th className="py-2.5 pr-3">Cargo</th>
                <th className="py-2.5 pr-3 text-right">Qualidade</th>
                <th className="py-2.5 pr-3 text-right">Experiência</th>
                <th className="py-2.5 pr-3 text-right">Salário/Ano</th>
                <th className="py-2.5 text-right">Contratação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {marketStaff.map((candidate) => {
                const signingCost = Math.round(candidate.salary * 0.25);
                const canAfford = playerTeam.budget >= signingCost;
                const currentInRole = currentStaff.find((c) => c.role === candidate.role);
                return (
                  <tr key={candidate.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 pr-3">
                      <div className="font-semibold text-white">{candidate.name}</div>
                      <div className="text-[11px] text-slate-400">{candidate.nationality} · {candidate.age} anos</div>
                    </td>
                    <td className="py-3 pr-3 text-slate-300">{STAFF_ROLE_LABELS[candidate.role]}</td>
                    <td className="py-3 pr-3 text-right font-mono-tabular font-bold text-white">{candidate.quality}</td>
                    <td className="py-3 pr-3 text-right font-mono-tabular text-slate-300">{candidate.experience}</td>
                    <td className="py-3 pr-3 text-right font-mono-tabular text-slate-300">
                      {formatMoney(candidate.salary, currency, true)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        disabled={!canAfford}
                        onClick={() => onHireStaff(candidate.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-35 text-xs font-semibold text-white cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        {currentInRole ? `Substituir (${formatMoney(signingCost, currency, true)})` : 'Contratar'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
