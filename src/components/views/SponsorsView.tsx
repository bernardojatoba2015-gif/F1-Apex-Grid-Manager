import React, { useState } from 'react';
import { Award, Handshake, X } from 'lucide-react';
import { formatMoney, getConstructorStandings } from '../../engine/simulation';
import { CareerState, SponsorContract } from '../../types/game';

interface SponsorsViewProps {
  career: CareerState;
  onSignSponsor: (sponsor: SponsorContract) => void;
  onTerminateSponsor: (sponsorId: string) => void;
}

export const SponsorsView: React.FC<SponsorsViewProps> = ({
  career,
  onSignSponsor,
  onTerminateSponsor,
}) => {
  const [negotiating, setNegotiating] = useState<SponsorContract | null>(null);
  const [askedIncreasePct, setAskedIncreasePct] = useState(10);
  const [negFeedback, setNegFeedback] = useState<string | null>(null);
  const [negFailed, setNegFailed] = useState(false);

  const team = career.teams.find((t) => t.id === career.playerTeamId)!;
  const currency = career.settings.currency;
  const rank = getConstructorStandings(career).findIndex((t) => t.id === team.id) + 1;

  const activeNames = new Set(team.sponsors.map((s) => s.name));
  const offers = career.availableSponsors.filter((s) => !activeNames.has(s.name));

  const openNegotiation = (sp: SponsorContract) => {
    setNegotiating({ ...sp });
    setAskedIncreasePct(10);
    setNegFeedback(null);
    setNegFailed(false);
  };

  const handleNegotiateSubmit = () => {
    if (!negotiating) return;
    // Higher team reputation improves acceptance chance of higher payout
    const repAdvantage = (team.reputation - negotiating.minReputation) * 0.8;
    const successChance = Math.max(15, Math.min(92, 82 - askedIncreasePct * 2.3 + repAdvantage));
    if (Math.random() * 100 <= successChance) {
      const boosted: SponsorContract = {
        ...negotiating,
        id: `sp_${Date.now()}`,
        perRacePayout: Math.round(negotiating.perRacePayout * (1 + askedIncreasePct / 100)),
        signingBonus: Math.round(negotiating.signingBonus * (1 + askedIncreasePct / 150)),
        remainingRaces: negotiating.durationRaces,
      };
      onSignSponsor(boosted);
      setNegotiating(null);
    } else {
      setNegFailed(true);
      setNegFeedback(
        `A diretoria da ${negotiating.name} recusou o pedido de +${askedIncreasePct}% e encerrou a rodada comercial atual.`
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-white">Patrocinadores & Comercial</h2>
          <p className="text-xs text-slate-400">
            Sua reputação ({Math.round(team.reputation)}/100) e posição ({rank}º) atraem marcas maiores para o carro.
          </p>
        </div>
        <div className="text-xs text-slate-300 font-mono-tabular">
          Contratos ativos: {team.sponsors.length}/4
        </div>
      </div>

      {/* Active Sponsors */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-base text-white">Contratos Vigentes</h3>
        {team.sponsors.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#121722] border border-dashed border-white/15 text-xs text-slate-400 text-center">
            Nenhum patrocinador ativo no momento. Assine com propostas abaixo.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {team.sponsors.map((sp) => {
              const meetingGoal = rank <= sp.minConstructorRank;
              return (
                <div key={sp.id} className="bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-10 rounded-full shrink-0" style={{ backgroundColor: sp.primaryColor }} />
                      <div>
                        <div className="text-[11px] text-slate-400">
                          {sp.tier === 'title' ? 'Patrocinador Máster' : 'Patrocinador Oficial'} · {sp.industry}
                        </div>
                        <h4 className="font-display font-bold text-lg text-white">{sp.name}</h4>
                      </div>
                    </div>
                    <span className="font-mono-tabular text-xs text-slate-300">{sp.remainingRaces} GPs rest.</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-[#0D111A]">
                      <div className="text-slate-400 text-[10px]">Por GP</div>
                      <div className="font-mono-tabular font-bold text-white">{formatMoney(sp.perRacePayout, currency, true)}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0D111A]">
                      <div className="text-slate-400 text-[10px]">Bônus Meta</div>
                      <div className="font-mono-tabular font-bold text-emerald-400">{formatMoney(sp.goalBonus, currency, true)}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0D111A]">
                      <div className="text-slate-400 text-[10px]">Meta Exigida</div>
                      <div className={`font-semibold ${meetingGoal ? 'text-emerald-400' : 'text-amber-400'}`}>
                        Top {sp.minConstructorRank} ({meetingGoal ? 'Ok' : 'Abaixo'})
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onTerminateSponsor(sp.id)}
                      className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      Encerrar contrato
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Offers */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Propostas Comerciais Disponíveis
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {offers.map((sp) => {
            const eligible = team.reputation >= sp.minReputation;
            const slotsFull = team.sponsors.length >= 4;
            return (
              <div key={sp.id} className="p-4 rounded-xl bg-[#0D111A] border border-white/8 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{sp.tier === 'title' ? 'Máster' : 'Secundário'} · {sp.industry}</span>
                    <span>Rep. mín: {sp.minReputation}</span>
                  </div>
                  <div className="font-display font-bold text-base text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sp.primaryColor }} />
                    {sp.name}
                  </div>
                  <div className="text-xs text-slate-300 space-y-1 pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Assinatura imediata:</span>
                      <span className="font-mono-tabular font-semibold text-emerald-400">{formatMoney(sp.signingBonus, currency, true)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Valor por GP:</span>
                      <span className="font-mono-tabular font-semibold text-white">{formatMoney(sp.perRacePayout, currency, true)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Exigência:</span>
                      <span>Top {sp.minConstructorRank} · {sp.durationRaces} GPs</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={!eligible || slotsFull}
                    onClick={() => onSignSponsor({ ...sp, id: `sp_${Date.now()}_${sp.id}`, remainingRaces: sp.durationRaces })}
                    className="py-2 rounded-lg bg-white text-[#0B0E14] hover:bg-slate-200 disabled:opacity-35 text-xs font-bold cursor-pointer"
                  >
                    {eligible ? 'Assinar' : `Rep. ${sp.minReputation}+`}
                  </button>
                  <button
                    disabled={!eligible || slotsFull}
                    onClick={() => openNegotiation(sp)}
                    className="py-2 rounded-lg bg-white/10 hover:bg-white/15 disabled:opacity-35 text-xs font-semibold text-white cursor-pointer"
                  >
                    Negociar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sponsor Negotiation Modal */}
      {negotiating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121722] border border-white/15 rounded-2xl p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Handshake className="w-5 h-5 text-white" />
                <h3 className="font-display font-bold text-lg text-white">Negociar: {negotiating.name}</h3>
              </div>
              <button onClick={() => setNegotiating(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Pedir aumento no valor por GP</span>
                <span className="font-mono-tabular font-bold text-emerald-400">+{askedIncreasePct}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={35}
                step={5}
                value={askedIncreasePct}
                disabled={negFailed}
                onChange={(e) => setAskedIncreasePct(Number(e.target.value))}
                className="w-full accent-[#E10600] cursor-pointer"
              />
              <div className="p-3 rounded-xl bg-[#0D111A] border border-white/8 flex justify-between">
                <span className="text-slate-400">Novo valor pretendido/GP:</span>
                <span className="font-mono-tabular font-bold text-white">
                  {formatMoney(negotiating.perRacePayout * (1 + askedIncreasePct / 100), currency, true)}
                </span>
              </div>
            </div>

            {negFeedback && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200">
                {negFeedback}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNegotiating(null)}
                className="px-4 py-2 rounded-lg bg-white/10 text-xs text-slate-300 cursor-pointer"
              >
                Fechar
              </button>
              {!negFailed && (
                <button
                  onClick={handleNegotiateSubmit}
                  className="px-4 py-2 rounded-lg bg-[#E10600] hover:bg-[#c80500] text-xs font-bold text-white cursor-pointer"
                >
                  Enviar Contraproposta
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
