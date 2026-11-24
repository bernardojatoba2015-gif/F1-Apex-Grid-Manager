import React, { useMemo, useState } from 'react';
import { ArrowUpDown, RefreshCw, Search, UserMinus, UserPlus, Users, X } from 'lucide-react';
import { formatMoney, getDriverOverall } from '../../engine/simulation';
import { CareerState, Driver, DriverRole } from '../../types/game';
import { NegotiationModal } from '../modals/NegotiationModal';
import { DriverAvatar } from '../visuals/DriverAvatar';

interface DriversViewProps {
  career: CareerState;
  onChangeDriverRole: (driverId: string, newRole: DriverRole) => void;
  onFireDriver: (driverId: string) => void;
  onSignDriver: (
    driverId: string,
    salary: number,
    years: number,
    role: 'starter_1' | 'starter_2' | 'reserve',
    buyoutFee: number
  ) => void;
  onGoToMarket: () => void;
}

export const DriversView: React.FC<DriversViewProps> = ({
  career,
  onChangeDriverRole,
  onFireDriver,
  onSignDriver,
  onGoToMarket,
}) => {
  const [renewDriver, setRenewDriver] = useState<Driver | null>(null);
  const [confirmFireId, setConfirmFireId] = useState<string | null>(null);

  // Quick picker for hiring Free Agents / F2 directly into Starter 1 or Starter 2
  const [pickSeatModal, setPickSeatModal] = useState<'starter_1' | 'starter_2' | null>(null);
  const [pickerFilter, setPickerFilter] = useState<'all' | 'f2' | 'f1_free'>('all');
  const [pickerSearch, setPickerSearch] = useState('');
  const [negotiateCandidate, setNegotiateCandidate] = useState<{
    driver: Driver;
    role: 'starter_1' | 'starter_2';
  } | null>(null);

  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;
  const currency = career.settings.currency;
  const teamDrivers = career.drivers
    .filter((d) => d.teamId === playerTeam.id)
    .sort((a, b) => {
      const order: Record<string, number> = { starter_1: 1, starter_2: 2, reserve: 3 };
      return (order[a.role] ?? 4) - (order[b.role] ?? 4);
    });

  const starter1 = teamDrivers.find((d) => d.role === 'starter_1') ?? null;
  const starter2 = teamDrivers.find((d) => d.role === 'starter_2') ?? null;

  const freeAndF2Pool = useMemo(() => {
    return career.drivers
      .filter((d) => d.teamId === null && d.role === 'free_agent')
      .filter((d) => {
        if (pickerFilter === 'f2') return d.originSeries === 'F2';
        if (pickerFilter === 'f1_free') return d.originSeries !== 'F2' && d.originSeries !== 'Base';
        return true;
      })
      .filter(
        (d) =>
          d.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
          d.nationality.toLowerCase().includes(pickerSearch.toLowerCase())
      )
      .sort((a, b) => getDriverOverall(b) - getDriverOverall(a));
  }, [career.drivers, pickerFilter, pickerSearch]);

  const roleLabel = (r: DriverRole) =>
    r === 'starter_1' ? 'Titular 1' : r === 'starter_2' ? 'Titular 2' : 'Reserva';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Pilotos da Equipe</h2>
          <p className="text-xs text-slate-400">
            Defina os 2 pilotos titulares, gerencie reservas, contratos ou contrate direto dos sem equipe e da F2.
          </p>
        </div>
        <button
          onClick={onGoToMarket}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0B0E14] hover:bg-slate-200 text-xs font-bold cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Abrir Mercado Completo
        </button>
      </div>

      {/* Dedicated 2 Starters Lineup Selector */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#E10600]" />
            <div>
              <h3 className="font-display text-sm font-bold text-white">
                Escalação dos 2 Pilotos Titulares
              </h3>
              <p className="text-[11px] text-slate-400">
                Escolha quem corre nos carros titulares ou contrate direto da lista de pilotos sem equipe e da Fórmula 2.
              </p>
            </div>
          </div>
          {starter1 && starter2 && (
            <button
              onClick={() => onChangeDriverRole(starter2.id, 'starter_1')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/14 text-xs font-medium text-slate-200 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              Inverter Titular 1 ↔ 2
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['starter_1', 'starter_2'] as const).map((seatRole, idx) => {
            const current = seatRole === 'starter_1' ? starter1 : starter2;
            const seatLabel = idx === 0 ? 'Titular 1 (Carro Principal)' : 'Titular 2 (Segundo Carro)';
            return (
              <div
                key={seatRole}
                className="p-4 rounded-xl bg-[#0D111A] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-300">{seatLabel}</span>
                  {current && (
                    <span className="font-mono-tabular text-xs font-bold text-white">
                      {getDriverOverall(current)} OVR
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={current?.id ?? ''}
                    onChange={(e) => {
                      if (e.target.value) onChangeDriverRole(e.target.value, seatRole);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#131926] border border-white/10 text-xs font-semibold text-white"
                  >
                    {!current && <option value="">Selecionar piloto do elenco...</option>}
                    {teamDrivers.map((td) => (
                      <option key={td.id} value={td.id}>
                        {td.name} ({getDriverOverall(td)} OVR · {roleLabel(td.role)})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => {
                      setPickerSearch('');
                      setPickerFilter('all');
                      setPickSeatModal(seatRole);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#E10600]/90 hover:bg-[#E10600] text-xs font-semibold text-white whitespace-nowrap cursor-pointer"
                  >
                    Sem Equipe & F2
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {teamDrivers.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#121722] border border-dashed border-white/15 text-center space-y-3">
          <p className="text-sm text-slate-300">Nenhum piloto sob contrato no momento.</p>
          <button
            onClick={() => setPickSeatModal('starter_1')}
            className="px-4 py-2 rounded-xl bg-[#E10600] text-white text-xs font-semibold cursor-pointer"
          >
            Escolher Titular nos Sem Equipe & F2
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {teamDrivers.map((d) => {
            const ovr = getDriverOverall(d);
            const buyout = Math.round(d.salary * Math.max(0.5, d.contractYears * 0.4));
            return (
              <div key={d.id} className="bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <DriverAvatar
                      shortCode={d.shortCode}
                      number={d.number}
                      teamColor={playerTeam.primaryColor}
                      size={52}
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-400">
                        {roleLabel(d.role)} · {d.nationality} · {d.age} anos
                      </div>
                      <h3 className="font-display text-xl font-bold text-white">{d.name}</h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Salário {formatMoney(d.salary, currency, true)}/ano · Restam{' '}
                        <strong className={d.contractYears <= 1 ? 'text-amber-400' : 'text-white'}>
                          {d.contractYears} ano(s)
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono-tabular text-2xl font-extrabold text-white">{ovr}</div>
                    <div className="text-[11px] text-slate-400">OVR · Pot {d.potential}</div>
                  </div>
                </div>

                {/* Attributes grid */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  {[
                    { label: 'Veloc.', val: d.speed },
                    { label: 'Talento', val: d.talent },
                    { label: 'Exper.', val: d.experience },
                    { label: 'Consist.', val: d.consistency },
                    { label: 'Moral', val: d.morale },
                    { label: 'Popul.', val: d.popularity },
                  ].map((st) => (
                    <div key={st.label} className="p-2 rounded-lg bg-[#0D111A] border border-white/6">
                      <div className="text-[10px] text-slate-400">{st.label}</div>
                      <div className="font-mono-tabular text-sm font-bold text-white mt-0.5">{st.val}</div>
                    </div>
                  ))}
                </div>

                {/* Season stats */}
                <div className="grid grid-cols-4 gap-2 py-2.5 border-y border-white/8 text-center text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">Pontos</div>
                    <div className="font-mono-tabular font-bold text-white">{d.seasonStats.points}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Vitórias</div>
                    <div className="font-mono-tabular font-bold text-white">{d.seasonStats.wins}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Pódios</div>
                    <div className="font-mono-tabular font-bold text-white">{d.seasonStats.podiums}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Poles</div>
                    <div className="font-mono-tabular font-bold text-white">{d.seasonStats.poles}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {d.role === 'reserve' ? (
                      <>
                        <button
                          onClick={() => onChangeDriverRole(d.id, 'starter_1')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          Promover a Titular 1
                        </button>
                        <button
                          onClick={() => onChangeDriverRole(d.id, 'starter_2')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
                        >
                          Promover a Titular 2
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            onChangeDriverRole(d.id, d.role === 'starter_1' ? 'starter_2' : 'starter_1')
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          {d.role === 'starter_1' ? 'Definir Titular 2' : 'Definir Titular 1'}
                        </button>
                        <button
                          onClick={() => onChangeDriverRole(d.id, 'reserve')}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/8 hover:bg-white/14 text-xs font-medium text-slate-300 cursor-pointer"
                        >
                          Mover para Reserva
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setRenewDriver(d)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Renovar / Negociar
                    </button>
                  </div>

                  {confirmFireId === d.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onFireDriver(d.id);
                          setConfirmFireId(null);
                        }}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs font-bold cursor-pointer"
                      >
                        Demitir (-{formatMoney(buyout, currency, true)})
                      </button>
                      <button
                        onClick={() => setConfirmFireId(null)}
                        className="px-2.5 py-2 rounded-lg bg-white/10 text-xs text-slate-300 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmFireId(d.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium cursor-pointer"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      Rescindir
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Pick from All Free Agents & F2 Drivers */}
      {pickSeatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-[#121722] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  Escolher {pickSeatModal === 'starter_1' ? 'Titular 1' : 'Titular 2'} — Sem Equipe & F2
                </h3>
                <p className="text-xs text-slate-400">
                  Todos os pilotos livres sem equipe e talentos da Fórmula 2 disponíveis sem multa rescisória.
                </p>
              </div>
              <button
                onClick={() => setPickSeatModal(null)}
                aria-label="Fechar lista"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: 'Todos Livres + F2' },
                  { id: 'f2', label: 'Fórmula 2 (F2)' },
                  { id: 'f1_free', label: 'Sem Equipe F1' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setPickerFilter(tab.id as typeof pickerFilter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                      pickerFilter === tab.id
                        ? 'bg-white text-[#0B0E14] font-semibold'
                        : 'bg-[#0D111A] text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Buscar piloto ou país..."
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-[#0D111A] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {freeAndF2Pool.map((d) => (
                <div
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#0D111A] border border-white/8 hover:border-white/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <DriverAvatar
                      shortCode={d.shortCode}
                      number={d.number}
                      teamColor={d.originSeries === 'F2' ? '#0093CC' : '#64748B'}
                      size={40}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-white truncate">{d.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {d.originSeries === 'F2'
                          ? 'Fórmula 2'
                          : d.originSeries === 'Base'
                          ? 'Revelação'
                          : 'Sem Equipe F1'}{' '}
                        · {d.nationality} · {d.age} anos
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-xs">
                      <div className="font-mono-tabular font-bold text-white">
                        {getDriverOverall(d)} OVR · Pot {d.potential}
                      </div>
                      <div className="font-mono-tabular text-[11px] text-slate-400">
                        Base {formatMoney(d.salary, currency, true)}/ano
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const targetRole = pickSeatModal;
                        setPickSeatModal(null);
                        setNegotiateCandidate({ driver: d, role: targetRole });
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#E10600] hover:bg-[#c80500] text-xs font-semibold text-white cursor-pointer"
                    >
                      Contratar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {negotiateCandidate && (
        <NegotiationModal
          career={career}
          driver={negotiateCandidate.driver}
          initialRole={negotiateCandidate.role}
          onClose={() => setNegotiateCandidate(null)}
          onSignDriver={(driverId, salary, years, role, buyoutFee) => {
            onSignDriver(driverId, salary, years, role, buyoutFee);
            setNegotiateCandidate(null);
          }}
        />
      )}

      {renewDriver && (
        <NegotiationModal
          career={career}
          driver={renewDriver}
          isRenewal={true}
          onClose={() => setRenewDriver(null)}
          onSignDriver={(driverId, salary, years, role, buyoutFee) => {
            onSignDriver(driverId, salary, years, role, buyoutFee);
            setRenewDriver(null);
          }}
        />
      )}
    </div>
  );
};
