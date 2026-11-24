import { buildSeasonCalendar, ENGINE_SUPPLIERS, SPONSOR_CATALOG } from '../data/f1Data';
import {
  ActiveRandomEvent,
  CarComponentKey,
  CarSpecs,
  CareerState,
  Driver,
  DriverRole,
  FinanceTransaction,
  NewsItem,
  QualifyingEntry,
  RaceFinishEntry,
  RaceWeekend,
  SeasonHistoryEntry,
  SponsorContract,
  StaffMember,
  StaffRole,
  Team,
} from '../types/game';

const F1_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  technical_director: 'Diretor Técnico',
  aero_chief: 'Chefe de Aerodinâmica',
  strategy_chief: 'Chefe de Estratégia',
  sporting_director: 'Diretor Esportivo',
  lead_engineer: 'Engenheiro Chefe',
  head_mechanic: 'Chefe de Mecânicos',
};

export const COMPONENT_LABELS: Record<CarComponentKey, string> = {
  engine: 'Motor',
  aero: 'Aerodinâmica',
  chassis: 'Chassi',
  suspension: 'Suspensão',
  brakes: 'Freios',
  reliability: 'Confiabilidade',
};

export function getDriverOverall(d: Driver): number {
  return Math.round(d.speed * 0.36 + d.talent * 0.28 + d.consistency * 0.2 + d.experience * 0.16);
}

export function getCarOverall(car: CarSpecs): number {
  return Math.round(
    (car.engine + car.aero + car.chassis + car.suspension + car.brakes + car.reliability) / 6
  );
}

export function formatMoney(amount: number, currency: 'USD' | 'EUR' = 'USD', compact = false): string {
  const converted = currency === 'EUR' ? amount * 0.92 : amount;
  const symbol = currency === 'EUR' ? '€' : '$';
  const sign = converted < 0 ? '-' : '';
  const abs = Math.abs(converted);
  if (compact) {
    if (abs >= 1_000_000) {
      return `${sign}${symbol}${(abs / 1_000_000).toFixed(1)}M`;
    }
    if (abs >= 1_000) {
      return `${sign}${symbol}${(abs / 1_000).toFixed(0)}K`;
    }
  }
  return `${sign}${symbol}${Math.round(abs).toLocaleString('pt-BR')}`;
}

export function formatLapTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const millis = Math.floor(ms % 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

export function getTeamStaff(staff: StaffMember[], teamId: string): StaffMember[] {
  return staff.filter((s) => s.teamId === teamId);
}

export function getStaffModifiers(staff: StaffMember[], teamId: string) {
  const teamStaff = getTeamStaff(staff, teamId);
  const byRole = (role: StaffRole) => teamStaff.find((s) => s.role === role);

  const techDir = byRole('technical_director');
  const aeroChief = byRole('aero_chief');
  const strategy = byRole('strategy_chief');
  const sporting = byRole('sporting_director');
  const engineer = byRole('lead_engineer');
  const mechanic = byRole('head_mechanic');

  return {
    devSpeedBonus: ((techDir?.quality ?? 70) + (engineer?.quality ?? 70)) / 200, // ~0.70 - 0.95
    aeroBonus: ((aeroChief?.quality ?? 70) - 70) * 0.14,
    strategyWetBonus: ((strategy?.quality ?? 70) - 70) * 0.18,
    negotiationBonus: ((sporting?.quality ?? 70) - 70) * 0.25,
    reliabilityBonus: ((mechanic?.quality ?? 70) - 70) * 0.2,
  };
}

export function getConstructorStandings(career: CareerState): Team[] {
  return [...career.teams].sort((a, b) => {
    if (b.seasonPoints !== a.seasonPoints) return b.seasonPoints - a.seasonPoints;
    if (b.seasonWins !== a.seasonWins) return b.seasonWins - a.seasonWins;
    if (b.seasonPodiums !== a.seasonPodiums) return b.seasonPodiums - a.seasonPodiums;
    return getCarOverall(b.car) - getCarOverall(a.car);
  });
}

export function getDriverStandings(career: CareerState): Driver[] {
  return career.drivers
    .filter((d) => d.role === 'starter_1' || d.role === 'starter_2' || d.seasonStats.points > 0)
    .sort((a, b) => {
      if (b.seasonStats.points !== a.seasonStats.points) return b.seasonStats.points - a.seasonStats.points;
      if (b.seasonStats.wins !== a.seasonStats.wins) return b.seasonStats.wins - a.seasonStats.wins;
      if (b.seasonStats.podiums !== a.seasonStats.podiums) return b.seasonStats.podiums - a.seasonStats.podiums;
      return a.seasonStats.bestFinish - b.seasonStats.bestFinish;
    });
}

function getTrackCarScore(car: CarSpecs, characteristic: RaceWeekend['characteristic'], aeroBonus: number): number {
  const aero = car.aero + aeroBonus;
  switch (characteristic) {
    case 'power':
      return car.engine * 0.42 + aero * 0.24 + car.chassis * 0.14 + car.brakes * 0.12 + car.suspension * 0.08;
    case 'aero':
      return aero * 0.4 + car.chassis * 0.24 + car.suspension * 0.16 + car.engine * 0.12 + car.brakes * 0.08;
    case 'street':
      return car.chassis * 0.28 + car.suspension * 0.26 + car.brakes * 0.22 + aero * 0.14 + car.engine * 0.1;
    case 'balanced':
    default:
      return car.engine * 0.24 + aero * 0.26 + car.chassis * 0.2 + car.suspension * 0.15 + car.brakes * 0.15;
  }
}

function gaussianNoise(scale: number): number {
  const u1 = Math.max(0.0001, Math.random());
  const u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z * scale;
}

export function simulateGrandPrix(career: CareerState): CareerState {
  if (career.currentRound > career.calendar.length || career.phase !== 'in_season') {
    return career;
  }

  const next = structuredClone(career) as CareerState;
  const raceIndex = next.currentRound - 1;
  const race = next.calendar[raceIndex];
  const isWet = race.weather === 'Chuva Leve' || race.weather === 'Tempestade';
  const isStorm = race.weather === 'Tempestade';

  // Ensure every team has 2 starters (auto-promote reserve or emergency free agent if missing)
  next.teams.forEach((team) => {
    const teamDrivers = next.drivers.filter((d) => d.teamId === team.id);
    const starters = teamDrivers.filter((d) => d.role === 'starter_1' || d.role === 'starter_2');
    if (starters.length < 2) {
      const reserves = teamDrivers.filter((d) => d.role === 'reserve');
      while (starters.length < 2 && reserves.length > 0) {
        const res = reserves.shift()!;
        res.role = starters.some((s) => s.role === 'starter_1') ? 'starter_2' : 'starter_1';
        starters.push(res);
      }
      const freeAgents = next.drivers.filter((d) => d.role === 'free_agent');
      while (starters.length < 2 && freeAgents.length > 0) {
        const fa = freeAgents.shift()!;
        fa.teamId = team.id;
        fa.contractYears = 1;
        fa.role = starters.some((s) => s.role === 'starter_1') ? 'starter_2' : 'starter_1';
        starters.push(fa);
      }
    }
  });

  // Collect all active starters
  const activeEntries: { driver: Driver; team: Team; qualiScore: number; racePaceScore: number; dnfRisk: number }[] = [];

  next.teams.forEach((team) => {
    const mods = getStaffModifiers(next.staff, team.id);
    const carScore = getTrackCarScore(team.car, race.characteristic, mods.aeroBonus);
    const starters = next.drivers.filter(
      (d) => d.teamId === team.id && (d.role === 'starter_1' || d.role === 'starter_2')
    );

    starters.forEach((driver) => {
      const driverQuali =
        driver.speed * 0.55 +
        driver.talent * 0.3 +
        driver.consistency * 0.1 +
        driver.morale * 0.05;

      const driverRace =
        driver.speed * 0.34 +
        driver.talent * (isWet ? 0.34 : 0.25) +
        driver.consistency * 0.24 +
        driver.experience * (isWet ? 0.18 : 0.12) +
        driver.morale * 0.05;

      const wetStrategyBoost = isWet ? mods.strategyWetBonus : mods.strategyWetBonus * 0.35;
      const qualiNoise = gaussianNoise(isWet ? 2.4 : 1.55);
      const qualiScore = carScore * 0.64 + driverQuali * 0.36 + wetStrategyBoost * 0.4 + qualiNoise;

      const raceNoise = gaussianNoise(isStorm ? 3.2 : isWet ? 2.6 : 1.85);
      const racePaceScore = carScore * 0.6 + driverRace * 0.4 + wetStrategyBoost + raceNoise;

      // DNF risk per race (typically 2% to 11% depending on reliability & consistency)
      const rel = Math.min(99, team.car.reliability + mods.reliabilityBonus);
      const baseMechRisk = Math.max(0.012, (100 - rel) * 0.0024);
      const crashRisk = Math.max(0.008, (100 - driver.consistency) * 0.0014 * (isStorm ? 2.1 : isWet ? 1.5 : 1));
      const dnfRisk = Math.min(0.18, baseMechRisk + crashRisk);

      activeEntries.push({ driver, team, qualiScore, racePaceScore, dnfRisk });
    });
  });

  // Sort Qualifying
  const qualiSorted = [...activeEntries].sort((a, b) => b.qualiScore - a.qualiScore);
  const basePoleMs = race.characteristic === 'power' ? 79200 : race.characteristic === 'street' ? 72400 : 86500;
  const topQualiScore = qualiSorted[0]?.qualiScore ?? 90;

  const qualifying: QualifyingEntry[] = qualiSorted.map((entry, idx) => {
    const delta = Math.max(0, (topQualiScore - entry.qualiScore) * 145 + idx * 12);
    const lapTimeMs = Math.round(basePoleMs + delta);
    return {
      driverId: entry.driver.id,
      driverName: entry.driver.name,
      shortCode: entry.driver.shortCode,
      teamId: entry.team.id,
      teamName: entry.team.name,
      teamColor: entry.team.primaryColor,
      position: idx + 1,
      lapTimeMs,
      lapTimeFormatted: formatLapTime(lapTimeMs),
      gapFormatted: idx === 0 ? 'POLE' : `+${(delta / 1000).toFixed(3)}s`,
    };
  });

  // Pole stat
  const poleDriver = qualiSorted[0]?.driver;
  const poleTeam = qualiSorted[0]?.team;
  if (poleDriver && poleTeam) {
    poleDriver.seasonStats.poles += 1;
    poleDriver.careerStats.poles += 1;
    poleTeam.seasonPoles += 1;
  }

  // Compute Race Finish (combining Grid + RacePace + DNF checks)
  const mechReasons = ['Falha no Motor', 'Problema Hidráulico', 'Câmbio', 'Superaquecimento', 'Falha Elétrica'];
  const crashReasons = ['Acidente na Curva 3', 'Colisão em Disputa', 'Saída de Pista', 'Toque no Muro'];

  const raceSimulated = activeEntries.map((entry) => {
    const gridPos = qualifying.find((q) => q.driverId === entry.driver.id)?.position ?? 10;
    const dnfRoll = Math.random();
    const isDnf = dnfRoll < entry.dnfRisk;
    const isMech = Math.random() < 0.62;
    const dnfReason = isDnf
      ? isMech
        ? mechReasons[Math.floor(Math.random() * mechReasons.length)]
        : crashReasons[Math.floor(Math.random() * crashReasons.length)]
      : undefined;

    // Grid position advantage is higher on street circuits
    const gridWeight = race.characteristic === 'street' ? 0.55 : 0.28;
    const finalScore = entry.racePaceScore - gridPos * gridWeight;

    return {
      ...entry,
      gridPos,
      finalScore,
      dnf: isDnf,
      dnfReason,
    };
  });

  // Sort Finishers first, then DNFs
  const finishers = raceSimulated.filter((r) => !r.dnf).sort((a, b) => b.finalScore - a.finalScore);
  const dnfs = raceSimulated.filter((r) => r.dnf).sort((a, b) => b.finalScore - a.finalScore);
  const fullOrder = [...finishers, ...dnfs];

  // Pick Fastest Lap among top 12 finishers (weighted toward high car/speed)
  let fastestLapDriverId = finishers[0]?.driver.id;
  if (finishers.length > 0) {
    const flPool = finishers.slice(0, Math.min(10, finishers.length));
    const flWinner = flPool.reduce((best, cur) => {
      const scoreCur = cur.driver.speed + cur.team.car.aero + Math.random() * 14;
      const scoreBest = best.driver.speed + best.team.car.aero + Math.random() * 14;
      return scoreCur > scoreBest ? cur : best;
    }, flPool[0]);
    fastestLapDriverId = flWinner.driver.id;
  }

  const topRaceScore = finishers[0]?.finalScore ?? 90;
  const raceResults: RaceFinishEntry[] = fullOrder.map((entry, idx) => {
    const pos = idx + 1;
    const isFastest = !entry.dnf && entry.driver.id === fastestLapDriverId;
    let pts = !entry.dnf && pos <= 10 ? F1_POINTS[pos - 1] : 0;
    if (isFastest && next.settings.fastestLapPoint && pos <= 10 && !entry.dnf) {
      pts += 1;
    }

    // Update driver & team stats
    entry.driver.seasonStats.points += pts;
    entry.driver.careerStats.races += 1;
    if (!entry.dnf) {
      if (pos < entry.driver.seasonStats.bestFinish) entry.driver.seasonStats.bestFinish = pos;
      if (pos === 1) {
        entry.driver.seasonStats.wins += 1;
        entry.driver.careerStats.wins += 1;
        entry.team.seasonWins += 1;
      }
      if (pos <= 3) {
        entry.driver.seasonStats.podiums += 1;
        entry.driver.careerStats.podiums += 1;
        entry.team.seasonPodiums += 1;
      }
      if (isFastest) {
        entry.driver.seasonStats.fastestLaps += 1;
      }
      // Morale adjustment
      const expectedRank = Math.max(1, Math.min(next.teams.length * 2, Math.round(22 - getCarOverall(entry.team.car) / 5)));
      if (pos <= expectedRank - 2) entry.driver.morale = Math.min(100, entry.driver.morale + 4);
      else if (pos >= expectedRank + 4) entry.driver.morale = Math.max(30, entry.driver.morale - 3);
    } else {
      entry.driver.seasonStats.dnfs += 1;
      entry.driver.morale = Math.max(25, entry.driver.morale - 4);
    }

    entry.team.seasonPoints += pts;

    const gapSec = Math.max(0.2, (topRaceScore - entry.finalScore) * 3.1 + idx * 0.45);
    return {
      driverId: entry.driver.id,
      driverName: entry.driver.name,
      shortCode: entry.driver.shortCode,
      number: entry.driver.number,
      teamId: entry.team.id,
      teamName: entry.team.name,
      teamColor: entry.team.primaryColor,
      gridPosition: entry.gridPos,
      position: pos,
      points: pts,
      gapFormatted: entry.dnf ? 'DNF' : idx === 0 ? 'Vencedor' : `+${gapSec.toFixed(1)}s`,
      dnf: entry.dnf,
      dnfReason: entry.dnfReason,
      fastestLap: isFastest,
    };
  });

  // Store completed race weekend
  const summaryNotes: string[] = [];
  if (raceResults[0]) {
    summaryNotes.push(`${raceResults[0].driverName} (${raceResults[0].teamName}) venceu o ${race.name}.`);
  }
  if (poleDriver) {
    summaryNotes.push(`Pole position: ${poleDriver.name} (${poleTeam?.shortName}).`);
  }
  if (isWet) {
    summaryNotes.push(`Condições de ${race.weather.toLowerCase()} exigiram máxima precisão estratégica.`);
  }
  const dnfCount = raceResults.filter((r) => r.dnf).length;
  if (dnfCount > 0) {
    summaryNotes.push(`${dnfCount} piloto(s) abandonaram a prova.`);
  }

  race.completed = true;
  race.qualifying = qualifying;
  race.results = raceResults;
  race.fastestLapDriverId = fastestLapDriverId;
  race.summaryNotes = summaryNotes;
  next.lastRaceResult = structuredClone(race);

  // Financial settlements for ALL teams (and detailed ledger for player team)
  const newTransactions: FinanceTransaction[] = [];
  const constructorStandings = [...next.teams].sort((a, b) => b.seasonPoints - a.seasonPoints);

  next.teams.forEach((team) => {
    const teamDrivers = next.drivers.filter((d) => d.teamId === team.id);
    const teamStaff = next.staff.filter((s) => s.teamId === team.id);
    const engine = ENGINE_SUPPLIERS.find((e) => e.id === team.engineSupplierId) ?? ENGINE_SUPPLIERS[0];

    const driverSalariesPerRace = Math.round(teamDrivers.reduce((acc, d) => acc + d.salary, 0) / 24);
    const staffSalariesPerRace = Math.round(teamStaff.reduce((acc, s) => acc + s.salary, 0) / 24);
    const enginePerRace = Math.round(engine.annualCost / 24);

    // Prize payout per race based on race results
    const teamRaceFinishers = raceResults.filter((r) => r.teamId === team.id && !r.dnf);
    const racePointsEarned = teamRaceFinishers.reduce((acc, r) => acc + r.points, 0);
    const baseAppearance = 650000;
    const pointsPrize = racePointsEarned * 145000;
    const difficultyMult =
      team.id === next.playerTeamId
        ? next.settings.difficulty === 'legend'
          ? 0.85
          : next.settings.difficulty === 'hard'
          ? 0.92
          : 1
        : 1;
    const totalPrize = Math.round((baseAppearance + pointsPrize) * difficultyMult);

    // Sponsor payouts
    const rank = constructorStandings.findIndex((t) => t.id === team.id) + 1;
    let sponsorIncome = 0;
    const expiredSponsors: string[] = [];

    team.sponsors.forEach((sp) => {
      sponsorIncome += sp.perRacePayout;
      if (rank <= sp.minConstructorRank) {
        sponsorIncome += Math.round(sp.goalBonus / 24);
      }
      sp.remainingRaces -= 1;
      if (sp.remainingRaces <= 0) {
        expiredSponsors.push(sp.name);
      }
    });
    team.sponsors = team.sponsors.filter((sp) => sp.remainingRaces > 0);

    const netDelta = totalPrize + sponsorIncome - driverSalariesPerRace - staffSalariesPerRace - enginePerRace;
    team.budget += netDelta;

    // Reputation shift
    const expectedRank = Math.max(1, Math.round(12 - getCarOverall(team.car) / 10));
    if (rank < expectedRank) team.reputation = Math.min(100, team.reputation + 0.6);
    else if (rank > expectedRank + 2) team.reputation = Math.max(15, team.reputation - 0.5);

    if (team.id === next.playerTeamId) {
      newTransactions.push(
        {
          id: `tx_${race.round}_prize`,
          round: race.round,
          season: next.currentSeason,
          category: 'prize',
          description: `Premiação ${race.name} (${racePointsEarned} pts)`,
          amount: totalPrize,
        },
        {
          id: `tx_${race.round}_sp`,
          round: race.round,
          season: next.currentSeason,
          category: 'sponsor',
          description: `Patrocinadores — Etapa ${race.round}`,
          amount: sponsorIncome,
        },
        {
          id: `tx_${race.round}_sal`,
          round: race.round,
          season: next.currentSeason,
          category: 'salary',
          description: `Folha salarial (Pilotos e Funcionários)`,
          amount: -(driverSalariesPerRace + staffSalariesPerRace),
        },
        {
          id: `tx_${race.round}_eng`,
          round: race.round,
          season: next.currentSeason,
          category: 'engine',
          description: `Fornecimento de motor (${engine.manufacturer})`,
          amount: -enginePerRace,
        }
      );

      next.financeHistory.push({
        round: race.round,
        label: `GP${race.round}`,
        balance: team.budget,
        income: totalPrize + sponsorIncome,
        expense: driverSalariesPerRace + staffSalariesPerRace + enginePerRace,
      });

      if (expiredSponsors.length > 0) {
        next.news.unshift({
          id: `news_sp_exp_${race.round}`,
          round: race.round,
          season: next.currentSeason,
          title: `Contrato de patrocínio encerrado: ${expiredSponsors.join(', ')}`,
          body: `Visite a aba Patrocinadores para negociar novos acordos comerciais.`,
          category: 'finance',
        });
      }
    }
  });

  next.transactions = [...newTransactions, ...next.transactions].slice(0, 120);

  // Advance Player Car Development Queue
  const playerTeam = next.teams.find((t) => t.id === next.playerTeamId)!;
  const completedProjects: typeof next.devQueue = [];
  next.devQueue.forEach((proj) => {
    proj.remainingRaces -= 1;
    if (proj.remainingRaces <= 0) {
      completedProjects.push(proj);
      playerTeam.car[proj.component] = Math.min(100, playerTeam.car[proj.component] + proj.expectedGain);
    }
  });
  next.devQueue = next.devQueue.filter((p) => p.remainingRaces > 0);
  completedProjects.forEach((p) => {
    next.news.unshift({
      id: `news_dev_${p.id}`,
      round: race.round,
      season: next.currentSeason,
      title: `Atualização concluída: ${COMPONENT_LABELS[p.component]} (+${p.expectedGain})`,
      body: `A fábrica entregou o pacote de desenvolvimento para ${COMPONENT_LABELS[p.component]}, elevando o nível do carro para o próximo GP.`,
      category: 'tech',
    });
  });

  next.carRatingHistory.push({
    round: race.round,
    rating: getCarOverall(playerTeam.car),
  });

  // AI Team Evolution during season
  runAiInSeasonEvolution(next, race.round);

  // Points progression snapshot
  next.pointsProgression.push({
    round: race.round,
    standings: Object.fromEntries(next.teams.map((t) => [t.id, t.seasonPoints])),
  });

  // Update Board Confidence & Objectives
  updateBoardEvaluation(next);

  // Race headline
  next.news.unshift({
    id: `news_race_${race.round}`,
    round: race.round,
    season: next.currentSeason,
    title: `${raceResults[0]?.driverName ?? 'Vencedor'} vence o ${race.name}`,
    body: `${summaryNotes.join(' ')}`,
    category: 'race',
  });

  // Trigger Random Event (if none pending)
  if (!next.pendingEvent) {
    maybeTriggerRandomEvent(next, race.round);
  }

  // Check Achievements
  evaluateAchievements(next);

  next.currentRound += 1;
  next.unreadNotifications += 1 + completedProjects.length + (next.pendingEvent ? 1 : 0);

  return next;
}

function runAiInSeasonEvolution(career: CareerState, round: number) {
  const aiTeams = career.teams.filter((t) => t.id !== career.playerTeamId);
  const compKeys: CarComponentKey[] = ['engine', 'aero', 'chassis', 'suspension', 'brakes', 'reliability'];

  aiTeams.forEach((team) => {
    // AI invests in upgrades every ~3-4 races if budget permits
    const facilityBoost = (team.facilities.factory + team.facilities.windTunnel) / 10;
    const investChance = team.aiStrategyProfile === 'aggressive' ? 0.38 : team.aiStrategyProfile === 'conservative' ? 0.22 : 0.3;

    if (team.budget > 12000000 && Math.random() < investChance) {
      const comp = compKeys[Math.floor(Math.random() * compKeys.length)];
      if (team.car[comp] < 98) {
        const gain = Math.random() < 0.35 + facilityBoost * 0.2 ? 2 : 1;
        const cost = 2200000 + gain * 900000;
        team.budget -= cost;
        team.car[comp] = Math.min(99, team.car[comp] + gain);
      }
    }

    // Small chance AI upgrades facility or picks up a sponsor if empty
    if (team.sponsors.length < 2 && team.budget > 5000000 && Math.random() < 0.25) {
      const candidate = SPONSOR_CATALOG.find((s) => s.minReputation <= team.reputation + 5);
      if (candidate) {
        team.sponsors.push({ ...candidate, id: `ai_sp_${team.id}_${round}`, remainingRaces: 16 });
      }
    }

    // Occasional AI crisis or breakthrough to make championship dynamic
    if (round % 6 === 0 && Math.random() < 0.14) {
      const comp = compKeys[Math.floor(Math.random() * compKeys.length)];
      if (Math.random() < 0.62) {
        team.car[comp] = Math.min(99, team.car[comp] + 2);
      } else {
        team.car[comp] = Math.max(60, team.car[comp] - 2);
      }
    }
  });
}

function updateBoardEvaluation(career: CareerState) {
  const standings = getConstructorStandings(career);
  const playerRank = standings.findIndex((t) => t.id === career.playerTeamId) + 1;
  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;
  const playerDrivers = career.drivers.filter(
    (d) => d.teamId === career.playerTeamId && (d.role === 'starter_1' || d.role === 'starter_2')
  );
  const hasYoungDriver = playerDrivers.some((d) => d.age <= 23);

  let metCount = 0;
  career.board.objectives.forEach((obj) => {
    if (obj.type === 'constructor_rank') {
      obj.currentValue = playerRank;
      obj.completed = playerRank <= obj.targetValue;
    } else if (obj.type === 'wins') {
      obj.currentValue = playerTeam.seasonWins;
      obj.completed = playerTeam.seasonWins >= obj.targetValue;
    } else if (obj.type === 'podiums') {
      obj.currentValue = playerTeam.seasonPodiums;
      obj.completed = playerTeam.seasonPodiums >= obj.targetValue;
    } else if (obj.type === 'positive_balance') {
      obj.currentValue = playerTeam.budget >= 0 ? 1 : 0;
      obj.completed = playerTeam.budget >= 0;
    } else if (obj.type === 'young_driver') {
      obj.currentValue = hasYoungDriver ? 1 : 0;
      obj.completed = hasYoungDriver;
    }
    if (obj.completed) metCount += 1;
  });

  const rankObj = career.board.objectives.find((o) => o.type === 'constructor_rank');
  const targetRank = rankObj?.targetValue ?? 6;
  const rankDelta = targetRank - playerRank; // positive = exceeding expectations

  let delta = rankDelta * 1.4;
  if (playerTeam.budget < 0) delta -= 4;
  if (career.board.objectives.length > 0 && metCount === career.board.objectives.length) delta += 2;
  if (career.settings.difficulty === 'hard') delta -= 0.4;
  if (career.settings.difficulty === 'legend') delta -= 0.8;

  career.board.confidence = Math.max(5, Math.min(100, Math.round(career.board.confidence + delta)));

  if (career.board.confidence >= 68) {
    career.board.status = 'Segura';
    career.board.ultimatumActive = false;
  } else if (career.board.confidence >= 45) {
    career.board.status = 'Estável';
  } else if (career.board.confidence >= 25) {
    career.board.status = 'Atenção';
  } else {
    career.board.status = 'Risco de Demissão';
    career.board.ultimatumActive = true;
  }

  // Firing check mid-season if disastrous for too long
  if (career.currentRound >= 10 && career.board.confidence <= 10) {
    career.board.fired = true;
    career.phase = 'fired';
    career.news.unshift({
      id: `news_fired_${career.currentRound}`,
      round: career.currentRound,
      season: career.currentSeason,
      title: `URGENTE: ${playerTeam.name} demite chefe de equipe ${playerTeam.principalName}`,
      body: `Após sequência crítica de resultados e perda total de confiança da diretoria, o conselho decidiu encerrar o vínculo imediatamente.`,
      category: 'board',
    });
  }
}

function maybeTriggerRandomEvent(career: CareerState, round: number) {
  const prob =
    career.settings.eventFrequency === 'low' ? 0.16 : career.settings.eventFrequency === 'high' ? 0.42 : 0.27;
  if (Math.random() > prob || round < 2) return;

  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;
  const playerDrivers = career.drivers.filter(
    (d) => d.teamId === career.playerTeamId && (d.role === 'starter_1' || d.role === 'starter_2')
  );
  const rivals = career.teams.filter((t) => t.id !== career.playerTeamId);
  const rival = rivals[Math.floor(Math.random() * rivals.length)];
  const eventRoll = Math.floor(Math.random() * 8);

  if (eventRoll === 0 && playerDrivers.length > 0) {
    // Rival wants to poach player driver
    const targetDriver = playerDrivers[Math.floor(Math.random() * playerDrivers.length)];
    career.pendingEvent = {
      id: `ev_${round}_${Date.now()}`,
      title: `Assédio do Mercado: ${rival.name} sonda ${targetDriver.name}`,
      description: `A ${rival.name} apresentou uma pré-proposta salarial para atrair ${targetDriver.name}. Você pode oferecer um bônus de fidelidade para blindar o piloto ou recusar e arriscar perda de moral.`,
      category: 'driver',
      round,
      targetDriverId: targetDriver.id,
      targetTeamId: rival.id,
      amountDelta: 1500000,
      resolved: false,
      choices: [
        { id: 'match', label: 'Conceder bônus de fidelidade ($1.5M)', effectSummary: 'Moral +12 e garante foco total' },
        { id: 'hold', label: 'Exigir cumprimento do contrato', effectSummary: 'Economiza $1.5M, mas moral -10' },
      ],
    };
  } else if (eventRoll === 1 && playerTeam.sponsors.length > 0) {
    // Sponsor threatens or demands results / offers bonus extension
    const sp = playerTeam.sponsors[0];
    career.pendingEvent = {
      id: `ev_${round}_${Date.now()}`,
      title: `Revisão Comercial: ${sp.name}`,
      description: `O patrocinador ${sp.name} pede uma campanha de ativação extra no paddock ou ameaça reduzir repasses caso a equipe não melhore a exposição.`,
      category: 'sponsor',
      round,
      targetSponsorId: sp.id,
      amountDelta: 900000,
      resolved: false,
      choices: [
        { id: 'activate', label: 'Realizar evento de marca ($900K)', effectSummary: 'Reputação +4 e bônus de contrato +15%' },
        { id: 'decline', label: 'Focar 100% na pista', effectSummary: 'Preserva caixa, confiança comercial reduz' },
      ],
    };
  } else if (eventRoll === 2) {
    // Technical wind tunnel discovery
    career.pendingEvent = {
      id: `ev_${round}_${Date.now()}`,
      title: 'Descoberta Aerodinâmica no Túnel de Vento',
      description: 'Seus engenheiros encontraram um conceito promissor de assoalho que pode acelerar os ganhos aerodinâmicos imediatamente.',
      category: 'technical',
      round,
      amountDelta: 2000000,
      resolved: false,
      choices: [
        { id: 'produce', label: 'Produzir peças urgentes ($2.0M)', effectSummary: 'Aerodinâmica +3 imediato' },
        { id: 'save', label: 'Arquivar para o próximo ciclo', effectSummary: 'Sem custo; Aerodinâmica +1' },
      ],
    };
  } else if (eventRoll === 3) {
    // New sponsor opportunity
    const offer = SPONSOR_CATALOG.find(
      (s) => !playerTeam.sponsors.some((ps) => ps.name === s.name) && s.minReputation <= playerTeam.reputation + 10
    );
    if (offer) {
      career.pendingEvent = {
        id: `ev_${round}_${Date.now()}`,
        title: `Novo Patrocinador Interessado: ${offer.name}`,
        description: `A ${offer.name} (${offer.industry}) quer estampar sua marca no carro pagando ${formatMoney(offer.perRacePayout, career.settings.currency, true)} por GP e bônus de assinatura de ${formatMoney(offer.signingBonus, career.settings.currency, true)}.`,
        category: 'sponsor',
        round,
        amountDelta: offer.signingBonus,
        resolved: false,
        choices: [
          { id: 'sign', label: 'Assinar contrato agora', effectSummary: `Recebe ${formatMoney(offer.signingBonus, career.settings.currency, true)} de assinatura` },
          { id: 'pass', label: 'Recusar proposta', effectSummary: 'Mantém vagas comerciais livres' },
        ],
      };
    }
  } else if (eventRoll === 4) {
    // Veteran driver retirement rumor / young prospect surge
    const olderDriver = career.drivers.find((d) => d.age >= 37 && d.role !== 'free_agent' && !d.retiringSoon);
    if (olderDriver) {
      olderDriver.retiringSoon = true;
      career.news.unshift({
        id: `news_ret_${round}`,
        round,
        season: career.currentSeason,
        title: `${olderDriver.name} sinaliza possível aposentadoria ao fim da temporada`,
        body: `Aos ${olderDriver.age} anos, o veterano afirmou à imprensa que avalia encerrar sua carreira na F1 após o GP de Abu Dhabi.`,
        category: 'event',
      });
    }
  } else if (eventRoll === 5) {
    // Board extra investment or financial audit
    if (career.board.confidence >= 65) {
      playerTeam.budget += 3500000;
      career.transactions.unshift({
        id: `tx_ev_board_${round}`,
        round,
        season: career.currentSeason,
        category: 'board',
        description: 'Aporte extraordinário aprovado pela diretoria',
        amount: 3500000,
      });
      career.news.unshift({
        id: `news_ev_board_${round}`,
        round,
        season: career.currentSeason,
        title: 'Diretoria aprova aporte extra de $3.5M',
        body: 'Satisfeito com a gestão da equipe, o conselho liberou verba extra para acelerar o desenvolvimento.',
        category: 'board',
      });
    } else {
      playerTeam.budget -= 1400000;
      career.transactions.unshift({
        id: `tx_ev_fine_${round}`,
        round,
        season: career.currentSeason,
        category: 'development',
        description: 'Custos imprevistos de reposição de peças pós-GP',
        amount: -1400000,
      });
      career.news.unshift({
        id: `news_ev_cost_${round}`,
        round,
        season: career.currentSeason,
        title: 'Despesa extraordinária com chassi e peças de reposição',
        body: 'Danos acumulados no fim de semana exigiram fabricação emergencial de $1.4M.',
        category: 'finance',
      });
    }
  } else if (eventRoll === 6) {
    // Rival team makes big technical leap
    const luckyRival = rivals[Math.floor(Math.random() * rivals.length)];
    luckyRival.car.aero = Math.min(99, luckyRival.car.aero + 3);
    luckyRival.car.chassis = Math.min(99, luckyRival.car.chassis + 2);
    career.news.unshift({
      id: `news_rival_leap_${round}`,
      round,
      season: career.currentSeason,
      title: `${luckyRival.name} surpreende com grande pacote de evolução`,
      body: `Engenheiros rivais notaram ganhos expressivos de carga aerodinâmica no carro da ${luckyRival.shortName}.`,
      category: 'tech',
    });
  } else {
    // Young prospect emerges in F2 / Academy
    const young = career.drivers.find((d) => d.age <= 22 && (d.role === 'reserve' || d.role === 'free_agent'));
    if (young) {
      young.speed = Math.min(95, young.speed + 2);
      young.talent = Math.min(96, young.talent + 2);
      career.news.unshift({
        id: `news_young_${round}`,
        round,
        season: career.currentSeason,
        title: `Jovem talento em alta: ${young.name} impressiona em testes`,
        body: `Com apenas ${young.age} anos, ${young.name} registrou tempos de destaque e despertou interesse de várias equipes.`,
        category: 'market',
      });
    }
  }
}

export function resolveRandomEvent(career: CareerState, choiceId: string): CareerState {
  if (!career.pendingEvent) return career;
  const next = structuredClone(career) as CareerState;
  const ev = next.pendingEvent!;
  const playerTeam = next.teams.find((t) => t.id === next.playerTeamId)!;

  if (ev.category === 'driver' && ev.targetDriverId) {
    const drv = next.drivers.find((d) => d.id === ev.targetDriverId);
    if (drv) {
      if (choiceId === 'match') {
        playerTeam.budget -= ev.amountDelta ?? 1500000;
        drv.morale = Math.min(100, drv.morale + 12);
        next.transactions.unshift({
          id: `tx_ev_${Date.now()}`,
          round: ev.round,
          season: next.currentSeason,
          category: 'salary',
          description: `Bônus de fidelidade para ${drv.name}`,
          amount: -(ev.amountDelta ?? 1500000),
        });
      } else {
        drv.morale = Math.max(25, drv.morale - 10);
      }
    }
  } else if (ev.category === 'sponsor' && ev.targetSponsorId) {
    const sp = playerTeam.sponsors.find((s) => s.id === ev.targetSponsorId);
    if (choiceId === 'activate') {
      playerTeam.budget -= ev.amountDelta ?? 900000;
      playerTeam.reputation = Math.min(100, playerTeam.reputation + 4);
      if (sp) sp.perRacePayout = Math.round(sp.perRacePayout * 1.15);
      next.transactions.unshift({
        id: `tx_ev_${Date.now()}`,
        round: ev.round,
        season: next.currentSeason,
        category: 'sponsor',
        description: `Ativação comercial com ${sp?.name ?? 'Patrocinador'}`,
        amount: -(ev.amountDelta ?? 900000),
      });
    } else {
      next.board.confidence = Math.max(5, next.board.confidence - 4);
    }
  } else if (ev.category === 'sponsor' && !ev.targetSponsorId) {
    if (choiceId === 'sign') {
      const offer = SPONSOR_CATALOG.find(
        (s) => !playerTeam.sponsors.some((ps) => ps.name === s.name) && s.minReputation <= playerTeam.reputation + 10
      );
      if (offer && playerTeam.sponsors.length < 4) {
        playerTeam.sponsors.push({
          ...offer,
          id: `sp_ev_${Date.now()}`,
          tier: playerTeam.sponsors.some((s) => s.tier === 'title') ? 'secondary' : offer.tier,
          remainingRaces: offer.durationRaces,
        });
        playerTeam.budget += offer.signingBonus;
        next.transactions.unshift({
          id: `tx_ev_${Date.now()}`,
          round: ev.round,
          season: next.currentSeason,
          category: 'sponsor',
          description: `Bônus de assinatura: ${offer.name}`,
          amount: offer.signingBonus,
        });
      }
    }
  } else if (ev.category === 'technical') {
    if (choiceId === 'produce') {
      playerTeam.budget -= ev.amountDelta ?? 2000000;
      playerTeam.car.aero = Math.min(100, playerTeam.car.aero + 3);
      next.transactions.unshift({
        id: `tx_ev_${Date.now()}`,
        round: ev.round,
        season: next.currentSeason,
        category: 'development',
        description: 'Fabricação urgente de conceito aerodinâmico',
        amount: -(ev.amountDelta ?? 2000000),
      });
    } else {
      playerTeam.car.aero = Math.min(100, playerTeam.car.aero + 1);
    }
  }

  next.pendingEvent = null;
  return next;
}

function evaluateAchievements(career: CareerState) {
  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId)!;
  const standings = getConstructorStandings(career);
  const playerRank = standings.findIndex((t) => t.id === career.playerTeamId) + 1;
  const richestTeam = [...career.teams].sort((a, b) => b.budget - a.budget)[0];
  const bestCarTeam = [...career.teams].sort((a, b) => getCarOverall(b.car) - getCarOverall(a.car))[0];
  const driverLeader = getDriverStandings(career)[0];
  const rankObj = career.board.objectives.find((o) => o.type === 'constructor_rank');

  const unlock = (id: string) => {
    const a = career.achievements.find((x) => x.id === id);
    if (a && !a.unlocked) {
      a.unlocked = true;
      a.unlockedSeason = career.currentSeason;
      a.unlockedRound = career.currentRound;
      career.news.unshift({
        id: `news_ach_${id}`,
        round: career.currentRound,
        season: career.currentSeason,
        title: `Conquista desbloqueada: ${a.title}`,
        body: a.description,
        category: 'board',
      });
    }
  };

  if (playerTeam.seasonPodiums >= 1) unlock('ach_first_podium');
  if (playerTeam.seasonWins >= 1) unlock('ach_first_win');
  if (richestTeam?.id === playerTeam.id) unlock('ach_richest_team');
  if (bestCarTeam?.id === playerTeam.id) unlock('ach_best_car');
  if (driverLeader?.teamId === playerTeam.id && career.currentRound >= 5) unlock('ach_best_driver');
  if (rankObj && career.currentRound >= 12 && playerRank <= rankObj.targetValue - 2) unlock('ach_breakthrough');
}

export interface NegotiationProposal {
  driverId: string;
  offeredSalary: number;
  offeredYears: number;
  offeredRole: 'starter_1' | 'starter_2' | 'reserve';
  roundAttempt: number;
}

export interface NegotiationResponse {
  status: 'accepted' | 'counter' | 'rejected';
  message: string;
  counterSalary?: number;
  counterYears?: number;
  counterRole?: 'starter_1' | 'starter_2' | 'reserve';
}

export function evaluateDriverNegotiation(
  career: CareerState,
  proposal: NegotiationProposal
): NegotiationResponse {
  const driver = career.drivers.find((d) => d.id === proposal.driverId);
  const playerTeam = career.teams.find((t) => t.id === career.playerTeamId);
  if (!driver || !playerTeam) {
    return { status: 'rejected', message: 'Piloto não disponível para negociação.' };
  }

  const ovr = getDriverOverall(driver);
  const mods = getStaffModifiers(career.staff, playerTeam.id);
  const teamPower = (playerTeam.reputation + getCarOverall(playerTeam.car)) / 2;

  // Check competitiveness preference
  if (ovr >= 88 && teamPower < 68 && proposal.offeredSalary < driver.salary * 1.45) {
    return {
      status: 'rejected',
      message: `${driver.name} agradece o interesse, mas busca um carro imediatamente competitivo para disputar vitórias e pódios.`,
    };
  }

  // Starter guarantee check
  if (ovr >= 82 && proposal.offeredRole === 'reserve') {
    return {
      status: 'counter',
      message: `Com meu nível atual (${ovr} OVR), não aceito papel de piloto reserva. Exijo garantia de vaga titular.`,
      counterSalary: Math.max(proposal.offeredSalary, Math.round(driver.salary * 1.05)),
      counterYears: Math.max(2, proposal.offeredYears),
      counterRole: 'starter_2',
    };
  }

  // Expected salary calculation (influenced by OVR, popularity, competing offers, sporting director)
  const rivalCompetitionFactor = ovr >= 86 ? 1.12 : 1.04;
  const directorDiscount = Math.max(0.88, 1 - mods.negotiationBonus * 0.015);
  const baseExpected = Math.max(950000, driver.salary * rivalCompetitionFactor * directorDiscount);
  const desiredYears = driver.age >= 34 ? 1 : ovr >= 87 ? 3 : 2;

  if (proposal.roundAttempt >= 4 && proposal.offeredSalary < baseExpected * 0.94) {
    return {
      status: 'rejected',
      message: `As conversas esfriaram. ${driver.name} decidiu encerrar as negociações e avaliar propostas de equipes rivais.`,
    };
  }

  const salaryRatio = proposal.offeredSalary / baseExpected;
  const yearsOk = proposal.offeredYears >= desiredYears || proposal.offeredYears >= 2;

  if (salaryRatio >= 0.96 && yearsOk) {
    return {
      status: 'accepted',
      message: `Acordo fechado! ${driver.name} aceitou os termos de ${formatMoney(proposal.offeredSalary, career.settings.currency, true)}/ano por ${proposal.offeredYears} temporada(s).`,
    };
  }

  if (salaryRatio < 0.72) {
    return {
      status: 'rejected',
      message: `Proposta muito abaixo do valor de mercado de ${driver.name}. O empresário recusou abrir contraproposta.`,
    };
  }

  const counterSalary = Math.round((baseExpected * 1.04) / 50000) * 50000;
  return {
    status: 'counter',
    message: yearsOk
      ? `${driver.name} está interessado no projeto da ${playerTeam.shortName}, mas pede ajuste salarial para assinar considerando propostas de rivais.`
      : `${driver.name} gostou do projeto, porém exige estabilidade contratual de pelo menos ${desiredYears} ano(s) e ajuste no salário.`,
    counterSalary,
    counterYears: Math.max(desiredYears, proposal.offeredYears),
    counterRole: proposal.offeredRole,
  };
}

export type BoardMeetingTopic =
  | 'present_results'
  | 'request_budget'
  | 'request_facility'
  | 'negotiate_goals'
  | 'explain_results'
  | 'request_time';

export interface BoardMeetingOutcome {
  approved: boolean;
  headline: string;
  reply: string;
  career: CareerState;
}

export function processBoardMeeting(career: CareerState, topic: BoardMeetingTopic): BoardMeetingOutcome {
  const next = structuredClone(career) as CareerState;
  const playerTeam = next.teams.find((t) => t.id === next.playerTeamId)!;
  const standings = getConstructorStandings(next);
  const rank = standings.findIndex((t) => t.id === playerTeam.id) + 1;
  const conf = next.board.confidence;

  next.board.meetingsHeldThisSeason += 1;
  next.board.lastMeetingRound = next.currentRound;

  if (topic === 'present_results') {
    if (conf >= 55 || rank <= 6) {
      next.board.confidence = Math.min(100, conf + 7);
      return {
        approved: true,
        headline: 'Diretoria aprova relatório de desempenho',
        reply: `O conselho elogiou a transparência e a posição atual (${rank}º nos Construtores). A confiança na gestão subiu para ${next.board.confidence}%.`,
        career: next,
      };
    }
    next.board.confidence = Math.max(10, conf - 3);
    return {
      approved: false,
      headline: 'Conselho cobra evolução urgente',
      reply: 'Os diretores consideraram os números abaixo do investimento feito. Esperam reação nas próximas duas etapas.',
      career: next,
    };
  }

  if (topic === 'request_budget') {
    if (conf >= 62 && next.board.meetingsHeldThisSeason <= 3) {
      const grant = 4500000;
      playerTeam.budget += grant;
      next.board.confidence = Math.max(40, conf - 4);
      next.transactions.unshift({
        id: `tx_board_grant_${Date.now()}`,
        round: next.currentRound,
        season: next.currentSeason,
        category: 'board',
        description: 'Reforço orçamentário aprovado em reunião',
        amount: grant,
      });
      return {
        approved: true,
        headline: 'Aumento de orçamento aprovado (+$4.5M)',
        reply: 'A diretoria liberou $4.5M adicionais para acelerar o desenvolvimento do carro nesta temporada.',
        career: next,
      };
    }
    next.board.confidence = Math.max(10, conf - 6);
    return {
      approved: false,
      headline: 'Pedido de orçamento recusado',
      reply: 'O conselho financeiro vetou novos aportes no momento e pediu controle mais rígido das despesas.',
      career: next,
    };
  }

  if (topic === 'request_facility') {
    if (conf >= 68 && playerTeam.facilities.windTunnel < 5) {
      playerTeam.facilities.windTunnel += 1;
      next.board.confidence = Math.max(45, conf - 5);
      return {
        approved: true,
        headline: 'Investimento no Túnel de Vento aprovado',
        reply: `A diretoria financiou diretamente a modernização do Túnel de Vento para o Nível ${playerTeam.facilities.windTunnel}!`,
        career: next,
      };
    }
    return {
      approved: false,
      headline: 'Expansão de infraestrutura adiada',
      reply: 'A diretoria entende que a infraestrutura atual é suficiente para cumprir os objetivos deste ano.',
      career: next,
    };
  }

  if (topic === 'negotiate_goals') {
    const rankObj = next.board.objectives.find((o) => o.type === 'constructor_rank');
    if (rankObj && conf >= 50 && rankObj.targetValue < next.teams.length - 1) {
      rankObj.targetValue += 1;
      rankObj.label = `Terminar no Top ${rankObj.targetValue} de Construtores`;
      next.board.confidence = Math.max(30, conf - 6);
      return {
        approved: true,
        headline: 'Metas flexibilizadas pelo conselho',
        reply: `Após negociação, a meta mínima de construtores foi ajustada para Top ${rankObj.targetValue}.`,
        career: next,
      };
    }
    next.board.confidence = Math.max(10, conf - 5);
    return {
      approved: false,
      headline: 'Diretoria mantém metas originais',
      reply: 'Os patrocinadores e acionistas não aceitam reduzir a meta esportiva neste momento.',
      career: next,
    };
  }

  if (topic === 'explain_results') {
    if (conf >= 30) {
      next.board.confidence = Math.min(100, conf + 5);
      return {
        approved: true,
        headline: 'Explicação técnica aceita',
        reply: 'O conselho compreendeu os fatores de confiabilidade e transição do carro, concedendo voto de confiança.',
        career: next,
      };
    }
    return {
      approved: false,
      headline: 'Paciência da diretoria no limite',
      reply: 'A diretoria afirmou que justificativas não bastam mais; se não pontuar nas próximas corridas, haverá troca no comando.',
      career: next,
    };
  }

  // request_time
  if (conf >= 35) {
    next.board.ultimatumActive = false;
    next.board.confidence = Math.min(100, conf + 4);
    return {
      approved: true,
      headline: 'Prazo estendido para projeto técnico',
      reply: 'O conselho concordou em avaliar o projeto de longo prazo no fechamento da temporada.',
      career: next,
    };
  }
  return {
    approved: false,
    headline: 'Prazo adicional negado',
    reply: 'A pressão externa impede conceder mais tempo sem resultados imediatos.',
    career: next,
  };
}

export function finalizeSeasonToTransferWindow(career: CareerState): {
  career: CareerState;
  summary: SeasonHistoryEntry;
} {
  const next = structuredClone(career) as CareerState;
  const driverStandings = getDriverStandings(next);
  const constructorStandings = getConstructorStandings(next);
  const championDriver = driverStandings[0];
  const championTeam = constructorStandings[0];
  const playerTeam = next.teams.find((t) => t.id === next.playerTeamId)!;
  const playerRank = constructorStandings.findIndex((t) => t.id === next.playerTeamId) + 1;

  // FOM Constructors Prize Pool distribution
  let playerPrize = 0;
  constructorStandings.forEach((team, idx) => {
    const pos = idx + 1;
    const prize = Math.max(14000000, Math.round(78000000 - idx * 6200000));
    team.budget += prize;
    if (idx === 0) team.history.titles += 1;
    if (pos < team.history.bestConstructorPos) team.history.bestConstructorPos = pos;
    if (team.id === next.playerTeamId) playerPrize = prize;
  });

  if (championDriver) {
    championDriver.careerStats.titles += 1;
  }

  // Achievements check at end of season
  const unlock = (id: string) => {
    const a = next.achievements.find((x) => x.id === id);
    if (a && !a.unlocked) {
      a.unlocked = true;
      a.unlockedSeason = next.currentSeason;
      a.unlockedRound = 24;
    }
  };
  if (championTeam?.id === playerTeam.id || championDriver?.teamId === playerTeam.id) {
    unlock('ach_first_title');
    if (next.startingTeamTier !== 'top' && championTeam?.id === playerTeam.id) {
      unlock('ach_underdog_champ');
    }
  }
  if (championDriver?.teamId === playerTeam.id) unlock('ach_best_driver');

  // Board end-of-season verdict
  const rankObj = next.board.objectives.find((o) => o.type === 'constructor_rank');
  const metMain = !rankObj || playerRank <= rankObj.targetValue;
  let boardVerdict = 'Temporada aprovada pela diretoria.';
  if (!metMain && next.board.confidence < 22) {
    next.board.fired = true;
    next.phase = 'fired';
    boardVerdict = 'Demitido ao fim da temporada por não atingir as metas mínimas.';
  } else if (metMain) {
    next.board.confidence = Math.min(100, next.board.confidence + 10);
    boardVerdict = 'Excelente campanha! Diretoria renovou total confiança para o próximo ano.';
  } else {
    next.board.confidence = Math.max(25, next.board.confidence - 10);
    boardVerdict = 'Diretoria demonstrou insatisfação, mas manteve você no cargo para a próxima temporada.';
  }

  const summary: SeasonHistoryEntry = {
    season: next.currentSeason,
    driverChampionName: championDriver?.name ?? 'Campeão',
    driverChampionTeam: next.teams.find((t) => t.id === championDriver?.teamId)?.name ?? '',
    driverChampionPoints: championDriver?.seasonStats.points ?? 0,
    constructorChampionName: championTeam?.name ?? '',
    constructorChampionColor: championTeam?.primaryColor ?? '#E10600',
    constructorChampionPoints: championTeam?.seasonPoints ?? 0,
    playerTeamName: playerTeam.name,
    playerRank,
    playerPoints: playerTeam.seasonPoints,
    playerWins: playerTeam.seasonWins,
    playerPodiums: playerTeam.seasonPodiums,
    playerPoles: playerTeam.seasonPoles,
    prizeMoneyEarned: playerPrize,
    boardVerdict,
    topDrivers: driverStandings.slice(0, 5).map((d) => ({
      name: d.name,
      teamName: next.teams.find((t) => t.id === d.teamId)?.shortName ?? 'FA',
      points: d.seasonStats.points,
      wins: d.seasonStats.wins,
    })),
  };

  next.seasonHistory.unshift(summary);
  next.transactions.unshift({
    id: `tx_fom_${next.currentSeason}`,
    round: 24,
    season: next.currentSeason,
    category: 'prize',
    description: `Premiação oficial de Construtores (${playerRank}º lugar)`,
    amount: playerPrize,
  });

  if (!next.board.fired) {
    next.phase = 'transfer_window';
  }

  return { career: next, summary };
}

const REGEN_FIRST_NAMES = ['Luca', 'Theo', 'Mateo', 'Arthur', 'Noah', 'Gabriel', 'Soren', 'Kaito', 'Liam', 'Rafael', 'Julian', 'Nico'];
const REGEN_LAST_NAMES = ['Moreau', 'Costa', 'Lindqvist', 'Sato', 'Richter', 'Almeida', 'Bianchi', 'Vandenberg', 'Kowalski', 'Mercer'];
const REGEN_NATS = [
  { nat: 'Brasil', flag: 'BRA' },
  { nat: 'Reino Unido', flag: 'GBR' },
  { nat: 'Itália', flag: 'ITA' },
  { nat: 'França', flag: 'FRA' },
  { nat: 'Alemanha', flag: 'GER' },
  { nat: 'Japão', flag: 'JPN' },
  { nat: 'Holanda', flag: 'NED' },
];

export function startNewSeasonFromTransferWindow(career: CareerState): CareerState {
  const next = structuredClone(career) as CareerState;
  next.currentSeason += 1;
  next.currentRound = 1;
  next.phase = 'in_season';
  next.calendar = buildSeasonCalendar();
  next.lastRaceResult = null;
  next.pendingEvent = null;

  // Aging, growth, retirements, contract expiration
  const retiredNames: string[] = [];
  next.drivers.forEach((d) => {
    d.age += 1;
    // Skill progression or decline
    if (d.age <= 25 && d.speed < d.potential) {
      d.speed = Math.min(d.potential, d.speed + (Math.random() < 0.7 ? 2 : 1));
      d.consistency = Math.min(96, d.consistency + 2);
      d.experience = Math.min(99, d.experience + 4);
    } else if (d.age >= 36) {
      d.speed = Math.max(70, d.speed - 1);
    }

    // Reset season stats
    d.seasonStats = { points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, dnfs: 0, bestFinish: 99 };

    // Contract countdown
    if (d.teamId) {
      d.contractYears -= 1;
      if (d.contractYears <= 0) {
        d.teamId = null;
        d.role = 'free_agent';
      }
    }

    // Retirements
    if ((d.retiringSoon || d.age >= 42) && d.age >= 37) {
      retiredNames.push(d.name);
      d.teamId = null;
      d.role = 'free_agent';
    }
  });

  // Remove retired drivers and spawn fresh young rookies
  next.drivers = next.drivers.filter((d) => !retiredNames.includes(d.name));
  for (let i = 0; i < 3; i++) {
    const fn = REGEN_FIRST_NAMES[Math.floor(Math.random() * REGEN_FIRST_NAMES.length)];
    const ln = REGEN_LAST_NAMES[Math.floor(Math.random() * REGEN_LAST_NAMES.length)];
    const natObj = REGEN_NATS[Math.floor(Math.random() * REGEN_NATS.length)];
    const pot = 85 + Math.floor(Math.random() * 12);
    const spd = 74 + Math.floor(Math.random() * 8);
    next.drivers.push({
      id: `regen_${next.currentSeason}_${i}_${Date.now()}`,
      name: `${fn} ${ln}`,
      shortCode: ln.slice(0, 3).toUpperCase(),
      number: 50 + Math.floor(Math.random() * 48),
      age: 18 + Math.floor(Math.random() * 3),
      nationality: natObj.nat,
      flag: natObj.flag,
      speed: spd,
      talent: spd + 4,
      experience: 55 + Math.floor(Math.random() * 10),
      consistency: 72 + Math.floor(Math.random() * 10),
      potential: pot,
      morale: 80,
      popularity: 55 + Math.floor(Math.random() * 15),
      salary: 1100000,
      contractValue: 1100000,
      contractYears: 0,
      teamId: null,
      role: 'free_agent',
      isReal: false,
      seasonStats: { points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, dnfs: 0, bestFinish: 99 },
      careerStats: { titles: 0, wins: 0, podiums: 0, poles: 0, races: 0 },
    });
  }

  // AI off-season driver signings & regulation evolution
  next.teams.forEach((team) => {
    team.seasonPoints = 0;
    team.seasonWins = 0;
    team.seasonPodiums = 0;
    team.seasonPoles = 0;

    if (team.id !== next.playerTeamId) {
      // Off-season car evolution / regulation shift
      const facilityBonus = (team.facilities.factory + team.facilities.windTunnel) / 2;
      const shift = Math.round((Math.random() - 0.35) * 4 + facilityBonus * 0.45);
      (Object.keys(team.car) as CarComponentKey[]).forEach((k) => {
        team.car[k] = Math.max(66, Math.min(99, team.car[k] + shift + Math.round((Math.random() - 0.5) * 3)));
      });

      // Renew or sign drivers to fill 2 starter seats
      const currentStarters = next.drivers.filter(
        (d) => d.teamId === team.id && (d.role === 'starter_1' || d.role === 'starter_2')
      );
      while (currentStarters.length < 2) {
        const candidates = next.drivers
          .filter((d) => d.teamId === null && d.role === 'free_agent')
          .sort((a, b) => getDriverOverall(b) - getDriverOverall(a));
        const picked = candidates[0];
        if (!picked) break;
        picked.teamId = team.id;
        picked.role = currentStarters.some((s) => s.role === 'starter_1') ? 'starter_2' : 'starter_1';
        picked.contractYears = 2;
        currentStarters.push(picked);
      }
    }
  });

  // Reset board objectives for new season
  const playerTeam = next.teams.find((t) => t.id === next.playerTeamId)!;
  const avgCar = getCarOverall(playerTeam.car);
  next.board.meetingsHeldThisSeason = 0;
  next.board.lastMeetingRound = 0;
  next.board.objectives =
    avgCar >= 88
      ? [
          { id: 'obj_rank', label: 'Terminar no Top 3 de Construtores', type: 'constructor_rank', targetValue: 3, currentValue: next.teams.length, completed: false },
          { id: 'obj_wins', label: 'Conquistar pelo menos 3 vitórias', type: 'wins', targetValue: 3, currentValue: 0, completed: false },
          { id: 'obj_bal', label: 'Manter saldo positivo ao fim do ano', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
        ]
      : avgCar >= 80
      ? [
          { id: 'obj_rank', label: 'Terminar no Top 6 de Construtores', type: 'constructor_rank', targetValue: 6, currentValue: next.teams.length, completed: false },
          { id: 'obj_podiums', label: 'Conquistar pelo menos 1 pódio', type: 'podiums', targetValue: 1, currentValue: 0, completed: false },
          { id: 'obj_bal', label: 'Manter saúde financeira positiva', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
        ]
      : [
          { id: 'obj_rank', label: `Terminar no Top ${Math.max(7, next.teams.length - 1)} de Construtores`, type: 'constructor_rank', targetValue: Math.max(7, next.teams.length - 1), currentValue: next.teams.length, completed: false },
          { id: 'obj_bal', label: 'Controlar gastos e fechar no positivo', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
        ];

  next.financeHistory = [{ round: 0, label: 'Pré', balance: playerTeam.budget, income: 0, expense: 0 }];
  next.carRatingHistory = [{ round: 0, rating: avgCar }];
  next.pointsProgression = [{ round: 0, standings: Object.fromEntries(next.teams.map((t) => [t.id, 0])) }];

  next.news.unshift({
    id: `news_new_season_${next.currentSeason}`,
    round: 1,
    season: next.currentSeason,
    title: `Temporada ${next.currentSeason} da Fórmula 1 pronta para a largada!`,
    body: retiredNames.length > 0
      ? `Aposentadorias confirmadas (${retiredNames.join(', ')}), novos talentos no grid e carros atualizados para as 24 etapas.`
      : `Equipes apresentaram os novos carros e alinhamentos oficiais para as 24 etapas do campeonato.`,
    category: 'board',
  });

  return next;
}
