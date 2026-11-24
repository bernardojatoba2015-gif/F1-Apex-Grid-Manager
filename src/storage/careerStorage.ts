import { buildInitialDrivers } from '../data/f1Data';
import { CareerSettings, CareerState } from '../types/game';

const CAREERS_INDEX_KEY = 'f1_tm_careers_index_v1';
const CAREER_PREFIX = 'f1_tm_career_v1_';
const ACTIVE_CAREER_KEY = 'f1_tm_active_career_v1';
const GLOBAL_SETTINGS_KEY = 'f1_tm_settings_v1';

export interface SavedCareerSummary {
  id: string;
  careerName: string;
  teamName: string;
  teamShortName: string;
  primaryColor: string;
  currentSeason: number;
  currentRound: number;
  budget: number;
  constructorRank: number;
  updatedAt: string;
}

export const DEFAULT_SETTINGS: CareerSettings = {
  difficulty: 'normal',
  eventFrequency: 'normal',
  currency: 'USD',
  fastestLapPoint: true,
};

export function loadGlobalSettings(): CareerSettings {
  try {
    const raw = localStorage.getItem(GLOBAL_SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveGlobalSettings(settings: CareerSettings): void {
  try {
    localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage quota errors gracefully
  }
}

export function getSavedCareerSummaries(): SavedCareerSummary[] {
  try {
    const raw = localStorage.getItem(CAREERS_INDEX_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as SavedCareerSummary[];
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch {
    return [];
  }
}

export function saveCareer(career: CareerState): void {
  try {
    const updated: CareerState = {
      ...career,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`${CAREER_PREFIX}${updated.id}`, JSON.stringify(updated));
    localStorage.setItem(ACTIVE_CAREER_KEY, updated.id);

    const playerTeam = updated.teams.find((t) => t.id === updated.playerTeamId);
    const sortedTeams = [...updated.teams].sort((a, b) => b.seasonPoints - a.seasonPoints);
    const rank = sortedTeams.findIndex((t) => t.id === updated.playerTeamId) + 1;

    const summary: SavedCareerSummary = {
      id: updated.id,
      careerName: updated.careerName,
      teamName: playerTeam?.name ?? 'Equipe F1',
      teamShortName: playerTeam?.shortName ?? 'F1',
      primaryColor: playerTeam?.primaryColor ?? '#E10600',
      currentSeason: updated.currentSeason,
      currentRound: updated.currentRound,
      budget: playerTeam?.budget ?? 0,
      constructorRank: rank > 0 ? rank : 1,
      updatedAt: updated.updatedAt,
    };

    const existing = getSavedCareerSummaries().filter((c) => c.id !== updated.id);
    localStorage.setItem(CAREERS_INDEX_KEY, JSON.stringify([summary, ...existing]));
  } catch {
    // ignore storage quota errors gracefully
  }
}

export function loadCareerById(id: string): CareerState | null {
  try {
    const raw = localStorage.getItem(`${CAREER_PREFIX}${id}`);
    if (!raw) return null;
    localStorage.setItem(ACTIVE_CAREER_KEY, id);
    const parsed = JSON.parse(raw) as CareerState;
    const referenceDrivers = buildInitialDrivers(parsed.seasonBase ?? 2025);
    const referenceMap = new Map(referenceDrivers.map((d) => [d.id, d]));
    const existingIds = new Set(parsed.drivers.map((d) => d.id));

    const hydratedDrivers = parsed.drivers.map((d) => {
      if (d.originSeries) return d;
      const ref = referenceMap.get(d.id);
      return ref?.originSeries ? { ...d, originSeries: ref.originSeries } : d;
    });

    referenceDrivers.forEach((ref) => {
      if (!existingIds.has(ref.id) && ref.teamId === null && ref.role === 'free_agent') {
        hydratedDrivers.push(ref);
      }
    });

    return {
      ...parsed,
      drivers: hydratedDrivers,
    };
  } catch {
    return null;
  }
}

export function loadLastActiveCareer(): CareerState | null {
  try {
    const activeId = localStorage.getItem(ACTIVE_CAREER_KEY);
    if (activeId) {
      const found = loadCareerById(activeId);
      if (found) return found;
    }
    const summaries = getSavedCareerSummaries();
    if (summaries.length > 0) {
      return loadCareerById(summaries[0].id);
    }
    return null;
  } catch {
    return null;
  }
}

export function deleteCareerById(id: string): void {
  try {
    localStorage.removeItem(`${CAREER_PREFIX}${id}`);
    const filtered = getSavedCareerSummaries().filter((c) => c.id !== id);
    localStorage.setItem(CAREERS_INDEX_KEY, JSON.stringify(filtered));
    if (localStorage.getItem(ACTIVE_CAREER_KEY) === id) {
      if (filtered.length > 0) {
        localStorage.setItem(ACTIVE_CAREER_KEY, filtered[0].id);
      } else {
        localStorage.removeItem(ACTIVE_CAREER_KEY);
      }
    }
  } catch {
    // ignore
  }
}

export function clearAllCareers(): void {
  try {
    const summaries = getSavedCareerSummaries();
    summaries.forEach((s) => localStorage.removeItem(`${CAREER_PREFIX}${s.id}`));
    localStorage.removeItem(CAREERS_INDEX_KEY);
    localStorage.removeItem(ACTIVE_CAREER_KEY);
  } catch {
    // ignore
  }
}
