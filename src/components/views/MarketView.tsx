import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { formatMoney, getDriverOverall } from '../../engine/simulation';
import { CareerState, Driver } from '../../types/game';
import { NegotiationModal } from '../modals/NegotiationModal';

interface MarketViewProps {
  career: CareerState;
  onSignDriver: (
    driverId: string,
    salary: number,
    years: number,
    role: 'starter_1' | 'starter_2' | 'reserve',
    buyoutFee: number
  ) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({ career, onSignDriver }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'f2' | 'young' | 'contracted'>('all');
  const [sortBy, setSortBy] = useState<'ovr' | 'potential' | 'salary' | 'age'>('ovr');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const currency = career.settings.currency;

  const filteredDrivers = useMemo(() => {
    return career.drivers
      .filter((d) => d.teamId !== career.playerTeamId)
      .filter((d) => {
        if (filter === 'free') return d.teamId === null;
        if (filter === 'f2') return d.originSeries === 'F2';
        if (filter === 'young') return d.age <= 23;
        if (filter === 'contracted') return d.teamId !== null;
        return true;
      })
      .filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.nationality.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'potential') return b.potential - a.potential;
        if (sortBy === 'salary') return a.salary - b.salary;
        if (sortBy === 'age') return a.age - b.age;
        return getDriverOverall(b) - getDriverOverall(a);
      });
  }, [career.drivers, career.playerTeamId, filter, search, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-white">Mercado de Pilotos</h2>
        <p className="text-xs text-slate-400">
          Analise atributos, potencial de jovens talentos, salários e negocie contratos realistas.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'free', label: 'Sem Equipe' },
            { id: 'f2', label: 'Pilotos da F2' },
            { id: 'young', label: 'Jovens Talentos (<=23)' },
            { id: 'contracted', label: 'Sob Contrato' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as typeof filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                filter === f.id ? 'bg-white text-[#0B0E14] font-semibold' : 'bg-[#0D111A] text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar piloto ou país..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0D111A] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 rounded-lg bg-[#0D111A] border border-white/10 text-xs text-white"
          >
            <option value="ovr">Ordenar: Maior OVR</option>
            <option value="potential">Ordenar: Maior Potencial</option>
            <option value="age">Ordenar: Mais Jovens</option>
            <option value="salary">Ordenar: Menor Salário</option>
          </select>
        </div>
      </div>

      {/* Market Table */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 bg-[#0E121B]">
                <th className="py-3 px-4">Piloto</th>
                <th className="py-3 px-3">Equipe Atual</th>
                <th className="py-3 px-3 text-right">Idade</th>
                <th className="py-3 px-3 text-right">Vel</th>
                <th className="py-3 px-3 text-right">Tal</th>
                <th className="py-3 px-3 text-right">Cons</th>
                <th className="py-3 px-3 text-right">Pot</th>
                <th className="py-3 px-3 text-right">OVR</th>
                <th className="py-3 px-3 text-right">Salário</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredDrivers.map((d) => {
                const currentTeam = career.teams.find((t) => t.id === d.teamId);
                return (
                  <tr key={d.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{d.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {d.nationality} · #{d.number}
                        {d.originSeries === 'F2'
                          ? ' · Fórmula 2'
                          : d.originSeries === 'Base'
                          ? ' · Revelação'
                          : d.teamId === null
                          ? ' · Sem Equipe F1'
                          : ''}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {currentTeam ? (
                        <span className="inline-flex items-center gap-1.5 text-slate-300">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTeam.primaryColor }} />
                          {currentTeam.shortName} ({d.contractYears}a)
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">Livre</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{d.age}</td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{d.speed}</td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{d.talent}</td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">{d.consistency}</td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-sky-300">{d.potential}</td>
                    <td className="py-3 px-3 text-right font-mono-tabular font-bold text-white">{getDriverOverall(d)}</td>
                    <td className="py-3 px-3 text-right font-mono-tabular text-slate-300">
                      {formatMoney(d.salary, currency, true)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedDriver(d)}
                        className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white cursor-pointer"
                      >
                        Negociar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDriver && (
        <NegotiationModal
          career={career}
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
          onSignDriver={(driverId, salary, years, role, buyoutFee) => {
            onSignDriver(driverId, salary, years, role, buyoutFee);
            setSelectedDriver(null);
          }}
        />
      )}
    </div>
  );
};
