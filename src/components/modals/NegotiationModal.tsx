import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Handshake, X } from 'lucide-react';
import {
  evaluateDriverNegotiation,
  formatMoney,
  getDriverOverall,
  NegotiationResponse,
} from '../../engine/simulation';
import { CareerState, Driver } from '../../types/game';

interface NegotiationModalProps {
  career: CareerState;
  driver: Driver;
  isRenewal?: boolean;
  initialRole?: 'starter_1' | 'starter_2' | 'reserve';
  onClose: () => void;
  onSignDriver: (
    driverId: string,
    salary: number,
    years: number,
    role: 'starter_1' | 'starter_2' | 'reserve',
    buyoutFee: number
  ) => void;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  career,
  driver,
  isRenewal = false,
  initialRole,
  onClose,
  onSignDriver,
}) => {
  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;
  const currency = career.settings.currency;

  const isUnderOtherContract = !isRenewal && driver.teamId !== null && driver.teamId !== playerTeam.id && driver.contractYears > 0;
  const buyoutFee = isUnderOtherContract ? driver.contractValue : 0;

  const [offeredSalary, setOfferedSalary] = useState(
    Math.max(1000000, Math.round((driver.salary * 1.05) / 100000) * 100000)
  );
  const [offeredYears, setOfferedYears] = useState(driver.age >= 35 ? 1 : 2);
  const [offeredRole, setOfferedRole] = useState<'starter_1' | 'starter_2' | 'reserve'>(
    initialRole ?? (driver.role === 'reserve' ? 'reserve' : 'starter_2')
  );
  const [attempt, setAttempt] = useState(1);
  const [response, setResponse] = useState<NegotiationResponse | null>(null);

  const canAffordBuyout = playerTeam.budget >= buyoutFee;

  const handleSubmitOffer = () => {
    if (!canAffordBuyout) return;
    const res = evaluateDriverNegotiation(career, {
      driverId: driver.id,
      offeredSalary,
      offeredYears,
      offeredRole,
      roundAttempt: attempt,
    });
    setResponse(res);
    setAttempt((a) => a + 1);

    if (res.status === 'counter') {
      if (res.counterSalary) setOfferedSalary(res.counterSalary);
      if (res.counterYears) setOfferedYears(res.counterYears);
      if (res.counterRole) setOfferedRole(res.counterRole);
    }
  };

  const handleAcceptCounterAndFinalize = () => {
    onSignDriver(driver.id, offeredSalary, offeredYears, offeredRole, buyoutFee);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-[#121722] border border-white/15 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Handshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-white">
                {isRenewal ? `Renovar Contrato: ${driver.name}` : `Negociar com ${driver.name}`}
              </h3>
              <p className="text-xs text-slate-400">
                {driver.nationality} · {driver.age} anos · OVR {getDriverOverall(driver)} · Potencial {driver.potential}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar negociação"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {buyoutFee > 0 && (
          <div className={`p-3 rounded-xl border text-xs ${canAffordBuyout ? 'bg-amber-500/10 border-amber-500/25 text-amber-200' : 'bg-red-500/10 border-red-500/25 text-red-200'}`}>
            Piloto sob contrato atual. Multa rescisória imediata ao assinar:{' '}
            <strong className="font-mono-tabular">{formatMoney(buyoutFee, currency, true)}</strong>
            {!canAffordBuyout && ' — Saldo insuficiente para cobrir a multa.'}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Salário Anual Proposto</span>
              <span className="font-mono-tabular font-bold text-white">
                {formatMoney(offeredSalary, currency, true)} / temporada
              </span>
            </div>
            <input
              type="range"
              min={800000}
              max={Math.max(40000000, driver.salary * 2)}
              step={100000}
              value={offeredSalary}
              onChange={(e) => setOfferedSalary(Number(e.target.value))}
              disabled={response?.status === 'accepted' || response?.status === 'rejected'}
              className="w-full accent-[#E10600] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Atual/Base: {formatMoney(driver.salary, currency, true)}</span>
              <span>Por GP: {formatMoney(offeredSalary / 24, currency, true)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Duração do Contrato</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    disabled={response?.status === 'accepted' || response?.status === 'rejected'}
                    onClick={() => setOfferedYears(yr)}
                    className={`py-2 rounded-lg border text-xs font-mono-tabular font-semibold cursor-pointer ${
                      offeredYears === yr
                        ? 'bg-white text-[#0B0E14] border-white'
                        : 'bg-[#0D1119] text-slate-300 border-white/10'
                    }`}
                  >
                    {yr}a
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Posição na Equipe</label>
              <select
                value={offeredRole}
                disabled={response?.status === 'accepted' || response?.status === 'rejected'}
                onChange={(e) => setOfferedRole(e.target.value as 'starter_1' | 'starter_2' | 'reserve')}
                className="w-full px-3 py-2 rounded-lg bg-[#0D1119] border border-white/10 text-xs text-white"
              >
                <option value="starter_1">Titular 1 (Líder)</option>
                <option value="starter_2">Titular 2</option>
                <option value="reserve">Piloto Reserva</option>
              </select>
            </div>
          </div>
        </div>

        {response && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
              response.status === 'accepted'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                : response.status === 'counter'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-red-500/10 border-red-500/30 text-red-200'
            }`}
          >
            {response.status === 'accepted' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-white mb-0.5">
                {response.status === 'accepted'
                  ? 'Proposta Aceita!'
                  : response.status === 'counter'
                  ? 'Contraproposta do Piloto'
                  : 'Negociação Encerrada'}
              </div>
              <p>{response.message}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 cursor-pointer"
          >
            Fechar
          </button>

          {response?.status === 'accepted' ? (
            <button
              onClick={handleAcceptCounterAndFinalize}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer"
            >
              Assinar Contrato Oficial
            </button>
          ) : response?.status === 'rejected' ? null : (
            <button
              onClick={handleSubmitOffer}
              disabled={!canAffordBuyout}
              className="px-5 py-2.5 rounded-xl bg-[#E10600] hover:bg-[#c80500] disabled:opacity-40 text-xs font-bold text-white cursor-pointer"
            >
              {response?.status === 'counter' ? 'Enviar Nova Oferta' : 'Enviar Proposta'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
