export type SeasonBase = 2025 | 2026;

export type DifficultyLevel = 'normal' | 'hard' | 'legend';

export type LiveryPattern = 'classic' | 'aero' | 'stealth' | 'stripe' | 'diagonal';
export type CrestShape = 'shield' | 'hexagon' | 'diamond' | 'wing' | 'circle' | 'crest';
export type CrestIcon = 'bolt' | 'flame' | 'crown' | 'wing' | 'star' | 'target' | 'compass' | 'apex';

export type DriverRole = 'starter_1' | 'starter_2' | 'reserve' | 'free_agent';

export interface Driver {
  id: string;
  name: string;
  shortCode: string;
  number: number;
  age: number;
  nationality: string;
  flag: string;
  speed: number; // 0-100
  talent: number; // 0-100
  experience: number; // 0-100
  consistency: number; // 0-100
  potential: number; // 0-100
  morale: number; // 0-100
  popularity: number; // 0-100
  salary: number; // per season in USD
  contractValue: number; // buyout/market value
  contractYears: number; // remaining years
  teamId: string | null;
  role: DriverRole;
  isReal: boolean;
  originSeries?: 'F1' | 'F2' | 'Reserva' | 'Base';
  retiringSoon?: boolean;
  seasonStats: {
    points: number;
    wins: number;
    podiums: number;
    poles: number;
    fastestLaps: number;
    dnfs: number;
    bestFinish: number;
  };
  careerStats: {
    titles: number;
    wins: number;
    podiums: number;
    poles: number;
    races: number;
  };
}

export type StaffRole =
  | 'technical_director'
  | 'aero_chief'
  | 'strategy_chief'
  | 'sporting_director'
  | 'lead_engineer'
  | 'head_mechanic';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  nationality: string;
  age: number;
  quality: number; // 0-100
  experience: number; // 0-100
  salary: number; // per season in USD
  contractYears: number;
  teamId: string | null;
}

export type CarComponentKey =
  | 'engine'
  | 'aero'
  | 'chassis'
  | 'suspension'
  | 'brakes'
  | 'reliability';

export interface CarSpecs {
  engine: number; // 0-100
  aero: number; // 0-100
  chassis: number; // 0-100
  suspension: number; // 0-100
  brakes: number; // 0-100
  reliability: number; // 0-100
}

export interface EngineSupplier {
  id: string;
  name: string;
  manufacturer: string;
  powerRating: number;
  reliabilityRating: number;
  annualCost: number;
  description: string;
}

export interface TeamFacilities {
  factory: number; // 1-5
  windTunnel: number; // 1-5
  simulator: number; // 1-5
}

export interface DevelopmentProject {
  id: string;
  component: CarComponentKey;
  intensity: 'standard' | 'intensive';
  cost: number;
  totalRaces: number;
  remainingRaces: number;
  expectedGain: number;
  startedAtRound: number;
}

export interface SponsorContract {
  id: string;
  name: string;
  industry: string;
  tier: 'title' | 'secondary';
  perRacePayout: number;
  signingBonus: number;
  goalBonus: number;
  minConstructorRank: number; // e.g. 5 means top 5
  minReputation: number;
  durationRaces: number;
  remainingRaces: number;
  primaryColor: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  principalName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  liveryPattern: LiveryPattern;
  crestShape: CrestShape;
  crestIcon: CrestIcon;
  customLogoUrl?: string;
  isCustom: boolean;
  engineSupplierId: string;
  budget: number;
  reputation: number; // 0-100
  car: CarSpecs;
  facilities: TeamFacilities;
  sponsors: SponsorContract[];
  seasonPoints: number;
  seasonWins: number;
  seasonPodiums: number;
  seasonPoles: number;
  history: {
    titles: number;
    bestConstructorPos: number;
  };
  aiStrategyProfile?: 'aggressive' | 'balanced' | 'conservative';
}

export type TrackCharacteristic = 'power' | 'aero' | 'street' | 'balanced';
export type WeatherCondition = 'Seco' | 'Nublado' | 'Chuva Leve' | 'Tempestade';

export interface QualifyingEntry {
  driverId: string;
  driverName: string;
  shortCode: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  position: number;
  lapTimeMs: number;
  lapTimeFormatted: string;
  gapFormatted: string;
}

export interface RaceFinishEntry {
  driverId: string;
  driverName: string;
  shortCode: string;
  number: number;
  teamId: string;
  teamName: string;
  teamColor: string;
  gridPosition: number;
  position: number;
  points: number;
  gapFormatted: string;
  dnf: boolean;
  dnfReason?: string;
  fastestLap: boolean;
}

export interface RaceWeekend {
  round: number;
  name: string;
  country: string;
  countryCode: string;
  circuit: string;
  date: string;
  laps: number;
  characteristic: TrackCharacteristic;
  weather: WeatherCondition;
  completed: boolean;
  qualifying?: QualifyingEntry[];
  results?: RaceFinishEntry[];
  fastestLapDriverId?: string;
  summaryNotes?: string[];
}

export interface BoardObjective {
  id: string;
  label: string;
  type: 'constructor_rank' | 'podiums' | 'wins' | 'positive_balance' | 'young_driver';
  targetValue: number;
  currentValue: number;
  completed: boolean;
}

export interface BoardState {
  confidence: number; // 0-100
  status: 'Segura' | 'Estável' | 'Atenção' | 'Risco de Demissão';
  objectives: BoardObjective[];
  meetingsHeldThisSeason: number;
  lastMeetingRound: number;
  ultimatumActive: boolean;
  fired: boolean;
}

export interface FinanceTransaction {
  id: string;
  round: number;
  season: number;
  category: 'prize' | 'sponsor' | 'salary' | 'development' | 'engine' | 'facility' | 'board' | 'buyout';
  description: string;
  amount: number; // positive = income, negative = expense
}

export interface FinanceSnapshot {
  round: number;
  label: string;
  balance: number;
  income: number;
  expense: number;
}

export interface RandomEventChoice {
  id: string;
  label: string;
  effectSummary: string;
}

export interface ActiveRandomEvent {
  id: string;
  title: string;
  description: string;
  category: 'driver' | 'sponsor' | 'staff' | 'finance' | 'technical' | 'rival';
  round: number;
  targetDriverId?: string;
  targetSponsorId?: string;
  targetStaffId?: string;
  targetTeamId?: string;
  amountDelta?: number;
  resolved: boolean;
  choices?: RandomEventChoice[];
}

export interface NewsItem {
  id: string;
  round: number;
  season: number;
  title: string;
  body: string;
  category: 'race' | 'market' | 'tech' | 'finance' | 'board' | 'event';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedSeason?: number;
  unlockedRound?: number;
}

export interface SeasonHistoryEntry {
  season: number;
  driverChampionName: string;
  driverChampionTeam: string;
  driverChampionPoints: number;
  constructorChampionName: string;
  constructorChampionColor: string;
  constructorChampionPoints: number;
  playerTeamName: string;
  playerRank: number;
  playerPoints: number;
  playerWins: number;
  playerPodiums: number;
  playerPoles: number;
  prizeMoneyEarned: number;
  boardVerdict: string;
  topDrivers: {
    name: string;
    teamName: string;
    points: number;
    wins: number;
  }[];
}

export interface CareerSettings {
  difficulty: DifficultyLevel;
  eventFrequency: 'low' | 'normal' | 'high';
  currency: 'USD' | 'EUR';
  fastestLapPoint: boolean;
}

export type CareerPhase = 'in_season' | 'transfer_window' | 'fired';

export interface CareerState {
  id: string;
  careerName: string;
  createdAt: string;
  updatedAt: string;
  seasonBase: SeasonBase;
  currentSeason: number;
  currentRound: number; // 1..24 (25 when all 24 completed)
  phase: CareerPhase;
  playerTeamId: string;
  startingTeamTier: 'top' | 'midfield' | 'backmarker';
  teams: Team[];
  drivers: Driver[];
  staff: StaffMember[];
  calendar: RaceWeekend[];
  devQueue: DevelopmentProject[];
  availableSponsors: SponsorContract[];
  board: BoardState;
  transactions: FinanceTransaction[];
  financeHistory: FinanceSnapshot[];
  carRatingHistory: { round: number; rating: number }[];
  pointsProgression: { round: number; standings: Record<string, number> }[];
  pendingEvent: ActiveRandomEvent | null;
  news: NewsItem[];
  achievements: Achievement[];
  seasonHistory: SeasonHistoryEntry[];
  settings: CareerSettings;
  lastRaceResult?: RaceWeekend | null;
  unreadNotifications: number;
}

export type NavTab =
  | 'overview'
  | 'my_team'
  | 'drivers'
  | 'staff'
  | 'development'
  | 'finances'
  | 'sponsors'
  | 'market'
  | 'board'
  | 'calendar'
  | 'standings'
  | 'history';
