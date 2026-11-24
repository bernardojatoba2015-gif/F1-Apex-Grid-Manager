import React from 'react';
import { Clock, FlaskConical, Wrench } from 'lucide-react';
import {
  COMPONENT_LABELS,
  formatMoney,
  getCarOverall,
  getStaffModifiers,
} from '../../engine/simulation';
import { CarComponentKey, CareerState } from '../../types/game';
import { SimpleAreaChart } from '../visuals/MiniCharts';

interface DevelopmentViewProps {
  career: CareerState;
  onStartDevelopment: (component: CarComponentKey, intensity: 'standard' | 'intensive') => void;
}

const COMPONENT_DESC: Record<CarComponentKey, string> = {
  engine: 'Potência máxima em retas e eficiência do sistema híbrido.',
  aero: 'Carga aerodinâmica em curvas de média/alta velocidade e eficiência de DRS.',
  chassis: 'Rigidez torcional, distribuição de peso e agilidade em mudanças de direção.',
  suspension: 'Tração na saída de curva, absorção de zebras e controle de desgaste.',
  brakes: 'Estabilidade em frenagens fortes e recuperação cinética de energia.',
  reliability: 'Resistência térmica e mecânica para reduzir abandonos durante os GPs.',
};

export const DevelopmentView: React.FC<DevelopmentViewProps> = ({ career, onStartDevelopment }) => {
  const team = career.teams.find((t) => t.id === career.playerTeamId)!;
  const currency = career.settings.currency;
  const mods = getStaffModifiers(career.staff, team.id);
  const avgCar = getCarOverall(team.car);

  const maxQueueSlots = 2 + Math.floor(team.facilities.factory / 2);

  const getProjectParams = (comp: CarComponentKey, intensity: 'standard' | 'intensive') => {
    const level = team.car[comp];
    const baseCost = intensity === 'intensive' ? 3600000 : 2100000;
    const cost = Math.round(baseCost + Math.max(0, level - 75) * 45000);
    const windBonus = comp === 'aero' && team.facilities.windTunnel >= 4 ? 1 : 0;
    const expectedGain = (intensity === 'intensive' ? 3 : 2) + (mods.devSpeedBonus > 0.85 ? 1 : 0) + windBonus;
    const rawRaces = intensity === 'intensive' ? 2 : 3;
    const totalRaces = Math.max(1, rawRaces - (team.facilities.factory >= 5 ? 1 : 0));
    return { cost, expectedGain, totalRaces };
  };

  return (
    <div className="space-y-6">
      {/* Wind Tunnel Header */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#121722]">
        <img
          src="/src/assets/images/f1_windtunnel_aero_1795450823048.jpg"
          alt="Túnel de vento aerodinâmico de Fórmula 1"
          referrerPolicy="no-referrer"
          className="w-full h-44 sm:h-52 object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-300">
              Departamento Técnico · Fábrica Nível {team.facilities.factory} · Túnel de Vento Nível {team.facilities.windTunnel}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Desenvolvimento do Carro
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              As melhorias custam orçamento, levam GPs para serem fabricadas e impactam diretamente classificação e ritmo de corrida.
            </p>
          </div>
          <div className="bg-[#0D1119]/90 border border-white/10 rounded-xl px-4 py-3 text-right shrink-0">
            <div className="text-[11px] text-slate-400">Performance Global</div>
            <div className="font-mono-tabular text-2xl font-extrabold text-white">{avgCar}/100</div>
          </div>
        </div>
      </div>

      {/* Active Queue */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-slate-400" />
            Projetos em Produção ({career.devQueue.length}/{maxQueueSlots} vagas)
          </h3>
          <span className="text-xs text-slate-400">Caixa disponível: {formatMoney(team.budget, currency, true)}</span>
        </div>

        {career.devQueue.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#0D111A] border border-dashed border-white/10 text-xs text-slate-400 text-center">
            Nenhum componente em desenvolvimento. Escolha um setor abaixo para iniciar um pacote de atualização.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {career.devQueue.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-[#0D111A] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{COMPONENT_LABELS[p.component]}</span>
                  <span className="font-mono-tabular text-emerald-400 font-semibold">+{p.expectedGain} pts</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{p.intensity === 'intensive' ? 'Desenvolvimento Focado' : 'Desenvolvimento Padrão'}</span>
                  <span className="inline-flex items-center gap-1 font-mono-tabular text-slate-200">
                    <Clock className="w-3 h-3" />
                    {p.remainingRaces} GP(s)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(12, Math.round(((p.totalRaces - p.remainingRaces) / p.totalRaces) * 100))}%`,
                      backgroundColor: team.primaryColor,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6 Car Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(Object.keys(COMPONENT_LABELS) as CarComponentKey[]).map((key) => {
          const val = team.car[key];
          const inQueue = career.devQueue.some((p) => p.component === key);
          const queueFull = career.devQueue.length >= maxQueueSlots;
          const std = getProjectParams(key, 'standard');
          const foc = getProjectParams(key, 'intensive');
          const maxed = val >= 100;

          return (
            <div key={key} className="bg-[#121722] border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-lg text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-slate-400" />
                    {COMPONENT_LABELS[key]}
                  </h4>
                  <span className="font-mono-tabular text-xl font-extrabold text-white">{val}/100</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${val}%`, backgroundColor: team.primaryColor }}
                  />
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{COMPONENT_DESC[key]}</p>
              </div>

              {maxed ? (
                <div className="text-xs font-semibold text-emerald-400 py-2 text-center bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  Componente no Nível Máximo (100)
                </div>
              ) : inQueue ? (
                <div className="text-xs font-semibold text-amber-300 py-2.5 text-center bg-amber-500/10 rounded-xl border border-amber-500/20">
                  Atualização em Andamento
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/8">
                  <button
                    disabled={queueFull || team.budget < std.cost}
                    onClick={() => onStartDevelopment(key, 'standard')}
                    className="p-2.5 rounded-xl bg-[#0D111A] hover:bg-[#192131] disabled:opacity-35 border border-white/10 text-left cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-white">Padrão (+{std.expectedGain})</div>
                    <div className="text-[11px] font-mono-tabular text-slate-400 mt-0.5">
                      {formatMoney(std.cost, currency, true)} · {std.totalRaces} GPs
                    </div>
                  </button>
                  <button
                    disabled={queueFull || team.budget < foc.cost}
                    onClick={() => onStartDevelopment(key, 'intensive')}
                    className="p-2.5 rounded-xl bg-[#1A2130] hover:bg-[#232D42] disabled:opacity-35 border border-white/15 text-left cursor-pointer"
                  >
                    <div className="text-xs font-semibold text-white">Focado (+{foc.expectedGain})</div>
                    <div className="text-[11px] font-mono-tabular text-slate-300 mt-0.5">
                      {formatMoney(foc.cost, currency, true)} · {foc.totalRaces} GPs
                    </div>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Historical Car Rating Chart */}
      <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-3">
        <h3 className="font-display font-bold text-base text-white">Evolução Técnica do Carro na Temporada</h3>
        <SimpleAreaChart
          data={career.carRatingHistory.map((pt) => ({
            label: pt.round === 0 ? 'Pré' : `GP${pt.round}`,
            value: pt.rating,
          }))}
          color={team.primaryColor}
          height={170}
          formatValue={(v) => `${Math.round(v)}`}
        />
      </div>
    </div>
  );
};
