import React from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';
import { ENGINE_SUPPLIERS } from '../../data/f1Data';
import { formatMoney } from '../../engine/simulation';
import { CareerState } from '../../types/game';
import { SimpleAreaChart } from '../visuals/MiniCharts';

interface FinancesViewProps {
  career: CareerState;
}

export const FinancesView: React.FC<FinancesViewProps> = ({ career }) => {
  const team = career.teams.find((t) => t.id === career.playerTeamId)!;
  const currency = career.settings.currency;

  const teamDrivers = career.drivers.filter((d) => d.teamId === team.id);
  const teamStaff = career.staff.filter((s) => s.teamId === team.id);
  const engine = ENGINE_SUPPLIERS.find((e) => e.id === team.engineSupplierId) ?? ENGINE_SUPPLIERS[0];

  const driverPayrollAnnual = teamDrivers.reduce((acc, d) => acc + d.salary, 0);
  const staffPayrollAnnual = teamStaff.reduce((acc, s) => acc + s.salary, 0);
  const sponsorPerRace = team.sponsors.reduce((acc, s) => acc + s.perRacePayout, 0);

  const totalSeasonIncome = career.transactions
    .filter((t) => t.season === career.currentSeason && t.amount > 0 && t.round > 0)
    .reduce((acc, t) => acc + t.amount, 0);
  const totalSeasonExpense = career.transactions
    .filter((t) => t.season === career.currentSeason && t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const fixedPerRaceExpense = Math.round((driverPayrollAnnual + staffPayrollAnnual + engine.annualCost) / 24);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Gestão Financeira</h2>
        <p className="text-xs text-slate-400">
          Fluxo de caixa, receitas comerciais, premiações, folha salarial e custos de desenvolvimento.
        </p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Saldo Bancário Atual</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className={`font-mono-tabular text-2xl font-extrabold mt-2 ${team.budget >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatMoney(team.budget, currency, true)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono-tabular">
            {formatMoney(team.budget, currency, false)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Receitas na Temporada</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono-tabular text-2xl font-extrabold text-white mt-2">
            {formatMoney(totalSeasonIncome, currency, true)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Patrocínios fixos: {formatMoney(sponsorPerRace, currency, true)}/GP
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Despesas na Temporada</span>
            <ArrowDownRight className="w-4 h-4 text-red-400" />
          </div>
          <div className="font-mono-tabular text-2xl font-extrabold text-white mt-2">
            {formatMoney(totalSeasonExpense, currency, true)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Custo operacional fixo: {formatMoney(fixedPerRaceExpense, currency, true)}/GP
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
          <div className="text-xs text-slate-400">Folha Anual + Motor</div>
          <div className="font-mono-tabular text-2xl font-extrabold text-white mt-2">
            {formatMoney(driverPayrollAnnual + staffPayrollAnnual + engine.annualCost, currency, true)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pilotos {formatMoney(driverPayrollAnnual, currency, true)} · Staff {formatMoney(staffPayrollAnnual, currency, true)}
          </div>
        </div>
      </div>

      {/* Balance Evolution Chart */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-3">
        <h3 className="font-display font-bold text-base text-white">Evolução do Saldo Bancário (Por GP)</h3>
        <SimpleAreaChart
          data={career.financeHistory.map((pt) => ({ label: pt.label, value: pt.balance }))}
          color="#10B981"
          height={200}
          formatValue={(v) => formatMoney(v, currency, true)}
        />
      </div>

      {/* Cost breakdown + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4 bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="font-display font-bold text-base text-white">Estrutura de Custos Anuais</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-white/8">
              <span className="text-slate-400">Salários dos Pilotos</span>
              <span className="font-mono-tabular font-semibold text-white">{formatMoney(driverPayrollAnnual, currency, true)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/8">
              <span className="text-slate-400">Salários dos Funcionários</span>
              <span className="font-mono-tabular font-semibold text-white">{formatMoney(staffPayrollAnnual, currency, true)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/8">
              <span className="text-slate-400">Motor ({engine.manufacturer})</span>
              <span className="font-mono-tabular font-semibold text-white">{formatMoney(engine.annualCost, currency, true)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-300 font-semibold">Receita garantida de Patrocinadores (24 GPs)</span>
              <span className="font-mono-tabular font-bold text-emerald-400">{formatMoney(sponsorPerRace * 24, currency, true)}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
          <h3 className="font-display font-bold text-base text-white">Extrato de Movimentações</h3>
          <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
            {career.transactions.slice(0, 35).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-medium text-white truncate">{tx.description}</div>
                  <div className="text-[11px] text-slate-500">
                    Temporada {tx.season} · Etapa {tx.round}
                  </div>
                </div>
                <span
                  className={`font-mono-tabular font-bold shrink-0 ${
                    tx.amount >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {tx.amount >= 0 ? '+' : ''}
                  {formatMoney(tx.amount, currency, true)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
