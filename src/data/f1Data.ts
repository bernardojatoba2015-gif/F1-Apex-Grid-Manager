import {
  Achievement,
  BoardObjective,
  CareerSettings,
  CareerState,
  CrestIcon,
  CrestShape,
  Driver,
  EngineSupplier,
  LiveryPattern,
  RaceWeekend,
  SeasonBase,
  SponsorContract,
  StaffMember,
  StaffRole,
  Team,
} from '../types/game';

export const ENGINE_SUPPLIERS: EngineSupplier[] = [
  {
    id: 'ferrari',
    name: 'Ferrari 066/12',
    manufacturer: 'Scuderia Ferrari',
    powerRating: 93,
    reliabilityRating: 90,
    annualCost: 14500000,
    description: 'Unidade de potência com excelente entrega em média e alta rotação e ótima tração.',
  },
  {
    id: 'mercedes',
    name: 'Mercedes-AMG F1 M16',
    manufacturer: 'Mercedes HPP',
    powerRating: 92,
    reliabilityRating: 94,
    annualCost: 15000000,
    description: 'Referência em confiabilidade e eficiência elétrica no grid.',
  },
  {
    id: 'honda_rbpt',
    name: 'Honda RBPT RBPTH002',
    manufacturer: 'Honda / Red Bull Powertrains',
    powerRating: 94,
    reliabilityRating: 89,
    annualCost: 15500000,
    description: 'Motor agressivo de altíssima potência máxima e rápida resposta de turbo.',
  },
  {
    id: 'renault',
    name: 'Renault E-Tech RE25',
    manufacturer: 'Renault Sport',
    powerRating: 84,
    reliabilityRating: 86,
    annualCost: 10500000,
    description: 'Opção econômica e leve, ideal para equipes em reconstrução orçamentária.',
  },
  {
    id: 'audi',
    name: 'Audi F1 Power Unit',
    manufacturer: 'Audi Motorsport',
    powerRating: 88,
    reliabilityRating: 87,
    annualCost: 12800000,
    description: 'Projeto moderno de fábrica com foco em recuperação de energia e equilíbrio térmico.',
  },
];

export const OFFICIAL_CALENDAR_24: Omit<RaceWeekend, 'completed' | 'weather'>[] = [
  { round: 1, name: 'GP da Austrália', country: 'Austrália', countryCode: 'AUS', circuit: 'Albert Park, Melbourne', date: '16 Mar', laps: 58, characteristic: 'balanced' },
  { round: 2, name: 'GP da China', country: 'China', countryCode: 'CHN', circuit: 'Shanghai International Circuit', date: '23 Mar', laps: 56, characteristic: 'aero' },
  { round: 3, name: 'GP do Japão', country: 'Japão', countryCode: 'JPN', circuit: 'Suzuka Circuit', date: '06 Abr', laps: 53, characteristic: 'aero' },
  { round: 4, name: 'GP do Bahrein', country: 'Bahrein', countryCode: 'BHR', circuit: 'Bahrain International Circuit', date: '13 Abr', laps: 57, characteristic: 'power' },
  { round: 5, name: 'GP da Arábia Saudita', country: 'Arábia Saudita', countryCode: 'KSA', circuit: 'Jeddah Corniche Circuit', date: '20 Abr', laps: 50, characteristic: 'power' },
  { round: 6, name: 'GP de Miami', country: 'Estados Unidos', countryCode: 'USA', circuit: 'Miami International Autodrome', date: '04 Mai', laps: 57, characteristic: 'balanced' },
  { round: 7, name: 'GP da Emília-Romanha', country: 'Itália', countryCode: 'ITA', circuit: 'Autodromo Enzo e Dino Ferrari', date: '18 Mai', laps: 63, characteristic: 'aero' },
  { round: 8, name: 'GP de Mônaco', country: 'Mônaco', countryCode: 'MON', circuit: 'Circuit de Monaco', date: '25 Mai', laps: 78, characteristic: 'street' },
  { round: 9, name: 'GP da Espanha', country: 'Espanha', countryCode: 'ESP', circuit: 'Circuit de Barcelona-Catalunya', date: '01 Jun', laps: 66, characteristic: 'aero' },
  { round: 10, name: 'GP do Canadá', country: 'Canadá', countryCode: 'CAN', circuit: 'Circuit Gilles-Villeneuve', date: '15 Jun', laps: 70, characteristic: 'power' },
  { round: 11, name: 'GP da Áustria', country: 'Áustria', countryCode: 'AUT', circuit: 'Red Bull Ring', date: '29 Jun', laps: 71, characteristic: 'power' },
  { round: 12, name: 'GP da Grã-Bretanha', country: 'Reino Unido', countryCode: 'GBR', circuit: 'Silverstone Circuit', date: '06 Jul', laps: 52, characteristic: 'aero' },
  { round: 13, name: 'GP da Bélgica', country: 'Bélgica', countryCode: 'BEL', circuit: 'Spa-Francorchamps', date: '27 Jul', laps: 44, characteristic: 'power' },
  { round: 14, name: 'GP da Hungria', country: 'Hungria', countryCode: 'HUN', circuit: 'Hungaroring', date: '03 Ago', laps: 70, characteristic: 'street' },
  { round: 15, name: 'GP da Holanda', country: 'Holanda', countryCode: 'NED', circuit: 'Circuit Zandvoort', date: '31 Ago', laps: 72, characteristic: 'aero' },
  { round: 16, name: 'GP da Itália', country: 'Itália', countryCode: 'ITA', circuit: 'Autodromo Nazionale Monza', date: '07 Set', laps: 53, characteristic: 'power' },
  { round: 17, name: 'GP do Azerbaijão', country: 'Azerbaijão', countryCode: 'AZE', circuit: 'Baku City Circuit', date: '21 Set', laps: 51, characteristic: 'street' },
  { round: 18, name: 'GP de Singapura', country: 'Singapura', countryCode: 'SGP', circuit: 'Marina Bay Street Circuit', date: '05 Out', laps: 62, characteristic: 'street' },
  { round: 19, name: 'GP dos EUA', country: 'Estados Unidos', countryCode: 'USA', circuit: 'Circuit of the Americas', date: '19 Out', laps: 56, characteristic: 'balanced' },
  { round: 20, name: 'GP da Cidade do México', country: 'México', countryCode: 'MEX', circuit: 'Autódromo Hermanos Rodríguez', date: '26 Out', laps: 71, characteristic: 'balanced' },
  { round: 21, name: 'GP de São Paulo', country: 'Brasil', countryCode: 'BRA', circuit: 'Autódromo de Interlagos', date: '09 Nov', laps: 71, characteristic: 'balanced' },
  { round: 22, name: 'GP de Las Vegas', country: 'Estados Unidos', countryCode: 'USA', circuit: 'Las Vegas Strip Circuit', date: '22 Nov', laps: 50, characteristic: 'power' },
  { round: 23, name: 'GP do Catar', country: 'Catar', countryCode: 'QAT', circuit: 'Lusail International Circuit', date: '30 Nov', laps: 57, characteristic: 'aero' },
  { round: 24, name: 'GP de Abu Dhabi', country: 'Emirados Árabes', countryCode: 'UAE', circuit: 'Yas Marina Circuit', date: '07 Dez', laps: 58, characteristic: 'balanced' },
];

function generateInitialWeather(round: number): RaceWeekend['weather'] {
  const wetTracks = [1, 12, 13, 15, 21];
  const roll = (round * 37) % 100;
  if (wetTracks.includes(round)) {
    if (roll < 28) return 'Chuva Leve';
    if (roll < 42) return 'Tempestade';
    if (roll < 70) return 'Nublado';
    return 'Seco';
  }
  if (roll < 15) return 'Chuva Leve';
  if (roll < 40) return 'Nublado';
  return 'Seco';
}

export function buildSeasonCalendar(): RaceWeekend[] {
  return OFFICIAL_CALENDAR_24.map((race) => ({
    ...race,
    completed: false,
    weather: generateInitialWeather(race.round),
  }));
}

export const SPONSOR_CATALOG: Omit<SponsorContract, 'remainingRaces'>[] = [
  {
    id: 'sp_hp_apex',
    name: 'Apex Cloud Technologies',
    industry: 'Computação & IA',
    tier: 'title',
    perRacePayout: 2100000,
    signingBonus: 6500000,
    goalBonus: 8000000,
    minConstructorRank: 3,
    minReputation: 78,
    durationRaces: 24,
    primaryColor: '#0096D6',
  },
  {
    id: 'sp_oracle_quantum',
    name: 'Quantum Systems Corp',
    industry: 'Software Corporativo',
    tier: 'title',
    perRacePayout: 2350000,
    signingBonus: 7200000,
    goalBonus: 9500000,
    minConstructorRank: 2,
    minReputation: 84,
    durationRaces: 24,
    primaryColor: '#F80000',
  },
  {
    id: 'sp_petron_energy',
    name: 'Petronas Global Lubricants',
    industry: 'Energia & Combustíveis',
    tier: 'title',
    perRacePayout: 1950000,
    signingBonus: 5500000,
    goalBonus: 7000000,
    minConstructorRank: 4,
    minReputation: 72,
    durationRaces: 24,
    primaryColor: '#00A19B',
  },
  {
    id: 'sp_aramco_fuel',
    name: 'Vortex Aramco Fuels',
    industry: 'Petroquímica',
    tier: 'title',
    perRacePayout: 1750000,
    signingBonus: 4800000,
    goalBonus: 5800000,
    minConstructorRank: 5,
    minReputation: 64,
    durationRaces: 24,
    primaryColor: '#00843D',
  },
  {
    id: 'sp_horizon_fintech',
    name: 'Horizon Global Bank',
    industry: 'Finanças Digitais',
    tier: 'title',
    perRacePayout: 1350000,
    signingBonus: 3500000,
    goalBonus: 4200000,
    minConstructorRank: 7,
    minReputation: 48,
    durationRaces: 24,
    primaryColor: '#3B82F6',
  },
  {
    id: 'sp_atlas_logistics',
    name: 'Atlas Cargo Express',
    industry: 'Logística Mundial',
    tier: 'title',
    perRacePayout: 980000,
    signingBonus: 2200000,
    goalBonus: 2800000,
    minConstructorRank: 9,
    minReputation: 30,
    durationRaces: 24,
    primaryColor: '#F59E0B',
  },
  {
    id: 'sp_veloce_watches',
    name: 'Chronos Geneve',
    industry: 'Relojoaria de Luxo',
    tier: 'secondary',
    perRacePayout: 680000,
    signingBonus: 1400000,
    goalBonus: 2000000,
    minConstructorRank: 5,
    minReputation: 62,
    durationRaces: 16,
    primaryColor: '#D4AF37',
  },
  {
    id: 'sp_carbon_aero',
    name: 'KevlarPro Composites',
    industry: 'Materiais Aeroespaciais',
    tier: 'secondary',
    perRacePayout: 520000,
    signingBonus: 950000,
    goalBonus: 1500000,
    minConstructorRank: 7,
    minReputation: 45,
    durationRaces: 16,
    primaryColor: '#94A3B8',
  },
  {
    id: 'sp_pulse_crypto',
    name: 'NovaChain Exchange',
    industry: 'Fintech & Ativos',
    tier: 'secondary',
    perRacePayout: 610000,
    signingBonus: 1300000,
    goalBonus: 1800000,
    minConstructorRank: 6,
    minReputation: 55,
    durationRaces: 12,
    primaryColor: '#10B981',
  },
  {
    id: 'sp_nordic_tele',
    name: 'Nordic 5G Telecom',
    industry: 'Telecomunicações',
    tier: 'secondary',
    perRacePayout: 440000,
    signingBonus: 800000,
    goalBonus: 1200000,
    minConstructorRank: 8,
    minReputation: 35,
    durationRaces: 16,
    primaryColor: '#38BDF8',
  },
  {
    id: 'sp_volt_energy',
    name: 'VoltZero Drinks',
    industry: 'Bebidas Energéticas',
    tier: 'secondary',
    perRacePayout: 360000,
    signingBonus: 650000,
    goalBonus: 900000,
    minConstructorRank: 10,
    minReputation: 22,
    durationRaces: 12,
    primaryColor: '#EAB308',
  },
  {
    id: 'sp_titan_tools',
    name: 'Titan Precision Tools',
    industry: 'Ferramentaria Industrial',
    tier: 'secondary',
    perRacePayout: 310000,
    signingBonus: 500000,
    goalBonus: 750000,
    minConstructorRank: 11,
    minReputation: 15,
    durationRaces: 12,
    primaryColor: '#EF4444',
  },
];

export function buildBaseTeams(seasonBase: SeasonBase): Team[] {
  const is2026 = seasonBase === 2026;
  const teams: Team[] = [
    {
      id: 'mclaren',
      name: 'McLaren Formula 1 Team',
      shortName: 'MCL',
      principalName: 'Andrea Stella',
      primaryColor: '#FF8000',
      secondaryColor: '#14171C',
      accentColor: '#47C7FC',
      liveryPattern: 'aero',
      crestShape: 'wing',
      crestIcon: 'wing',
      isCustom: false,
      engineSupplierId: 'mercedes',
      budget: 58000000,
      reputation: 92,
      car: { engine: 92, aero: 94, chassis: 93, suspension: 91, brakes: 90, reliability: 92 },
      facilities: { factory: 5, windTunnel: 5, simulator: 5 },
      sponsors: [
        { ...SPONSOR_CATALOG[0], id: 'mcl_sp1', name: 'OKX & Google Chrome', remainingRaces: 24 },
        { ...SPONSOR_CATALOG[6], id: 'mcl_sp2', name: 'Mastercard Motorsport', remainingRaces: 16 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 9, bestConstructorPos: 1 },
      aiStrategyProfile: 'aggressive',
    },
    {
      id: 'ferrari',
      name: 'Scuderia Ferrari HP',
      shortName: 'FER',
      principalName: 'Frédéric Vasseur',
      primaryColor: '#DC0000',
      secondaryColor: '#18181B',
      accentColor: '#FFF200',
      liveryPattern: 'classic',
      crestShape: 'shield',
      crestIcon: 'crown',
      isCustom: false,
      engineSupplierId: 'ferrari',
      budget: 64000000,
      reputation: 96,
      car: { engine: 93, aero: 92, chassis: 91, suspension: 90, brakes: 92, reliability: 90 },
      facilities: { factory: 5, windTunnel: 5, simulator: 5 },
      sponsors: [
        { ...SPONSOR_CATALOG[0], id: 'fer_sp1', name: 'HP Enterprise Racing', remainingRaces: 24 },
        { ...SPONSOR_CATALOG[6], id: 'fer_sp2', name: 'Shell V-Power', remainingRaces: 18 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 16, bestConstructorPos: 1 },
      aiStrategyProfile: 'aggressive',
    },
    {
      id: 'redbull',
      name: 'Oracle Red Bull Racing',
      shortName: 'RBR',
      principalName: 'Christian Horner',
      primaryColor: '#1E41FF',
      secondaryColor: '#0A1024',
      accentColor: '#FCD700',
      liveryPattern: 'diagonal',
      crestShape: 'diamond',
      crestIcon: 'bolt',
      isCustom: false,
      engineSupplierId: 'honda_rbpt',
      budget: 62000000,
      reputation: 94,
      car: { engine: 93, aero: 91, chassis: 92, suspension: 91, brakes: 90, reliability: 89 },
      facilities: { factory: 5, windTunnel: 4, simulator: 5 },
      sponsors: [
        { ...SPONSOR_CATALOG[1], id: 'rbr_sp1', name: 'Oracle Cloud Racing', remainingRaces: 24 },
        { ...SPONSOR_CATALOG[8], id: 'rbr_sp2', name: 'Tag Heuer Timing', remainingRaces: 16 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 6, bestConstructorPos: 1 },
      aiStrategyProfile: 'aggressive',
    },
    {
      id: 'mercedes',
      name: 'Mercedes-AMG Petronas',
      shortName: 'MER',
      principalName: 'Toto Wolff',
      primaryColor: '#00D2BE',
      secondaryColor: '#11151B',
      accentColor: '#C8CED6',
      liveryPattern: 'stripe',
      crestShape: 'circle',
      crestIcon: 'star',
      isCustom: false,
      engineSupplierId: 'mercedes',
      budget: 60000000,
      reputation: 91,
      car: { engine: 92, aero: 89, chassis: 90, suspension: 89, brakes: 91, reliability: 93 },
      facilities: { factory: 5, windTunnel: 5, simulator: 5 },
      sponsors: [
        { ...SPONSOR_CATALOG[2], id: 'mer_sp1', name: 'Petronas Syntium', remainingRaces: 24 },
        { ...SPONSOR_CATALOG[7], id: 'mer_sp2', name: 'INEOS Automotive', remainingRaces: 16 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 8, bestConstructorPos: 1 },
      aiStrategyProfile: 'balanced',
    },
    {
      id: 'aston_martin',
      name: 'Aston Martin Aramco F1',
      shortName: 'AMR',
      principalName: 'Andy Cowell',
      primaryColor: '#006F62',
      secondaryColor: '#07221E',
      accentColor: '#CEDC00',
      liveryPattern: 'classic',
      crestShape: 'wing',
      crestIcon: 'wing',
      isCustom: false,
      engineSupplierId: is2026 ? 'honda_rbpt' : 'mercedes',
      budget: 48000000,
      reputation: 74,
      car: { engine: is2026 ? 91 : 88, aero: is2026 ? 87 : 82, chassis: 83, suspension: 82, brakes: 84, reliability: 87 },
      facilities: { factory: 5, windTunnel: 4, simulator: 4 },
      sponsors: [
        { ...SPONSOR_CATALOG[3], id: 'amr_sp1', name: 'Aramco Energy', remainingRaces: 24 },
        { ...SPONSOR_CATALOG[9], id: 'amr_sp2', name: 'Cognizant Tech', remainingRaces: 14 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 0, bestConstructorPos: 5 },
      aiStrategyProfile: 'aggressive',
    },
    {
      id: 'williams',
      name: 'Atlassian Williams Racing',
      shortName: 'WIL',
      principalName: 'James Vowles',
      primaryColor: '#005AFF',
      secondaryColor: '#041E42',
      accentColor: '#00A3E0',
      liveryPattern: 'aero',
      crestShape: 'shield',
      crestIcon: 'apex',
      isCustom: false,
      engineSupplierId: 'mercedes',
      budget: 36000000,
      reputation: 70,
      car: { engine: 89, aero: 81, chassis: 80, suspension: 81, brakes: 82, reliability: 86 },
      facilities: { factory: 3, windTunnel: 3, simulator: 4 },
      sponsors: [
        { ...SPONSOR_CATALOG[4], id: 'wil_sp1', name: 'Atlassian Cloud', remainingRaces: 24 },
        { ...SPONSOR_CATALOG[9], id: 'wil_sp2', name: 'Duracell Power', remainingRaces: 14 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 9, bestConstructorPos: 1 },
      aiStrategyProfile: 'balanced',
    },
    {
      id: 'alpine',
      name: 'BWT Alpine F1 Team',
      shortName: 'ALP',
      principalName: 'Oliver Oakes',
      primaryColor: '#0093CC',
      secondaryColor: '#131722',
      accentColor: '#FF4E9B',
      liveryPattern: 'diagonal',
      crestShape: 'hexagon',
      crestIcon: 'compass',
      isCustom: false,
      engineSupplierId: is2026 ? 'mercedes' : 'renault',
      budget: 34000000,
      reputation: 66,
      car: { engine: is2026 ? 88 : 81, aero: 82, chassis: 81, suspension: 80, brakes: 81, reliability: 83 },
      facilities: { factory: 4, windTunnel: 3, simulator: 3 },
      sponsors: [
        { ...SPONSOR_CATALOG[4], id: 'alp_sp1', name: 'BWT Water Tech', remainingRaces: 20 },
        { ...SPONSOR_CATALOG[10], id: 'alp_sp2', name: 'Castrol EDGE', remainingRaces: 12 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 2, bestConstructorPos: 1 },
      aiStrategyProfile: 'balanced',
    },
    {
      id: 'racing_bulls',
      name: 'Visa Cash App RB',
      shortName: 'VCB',
      principalName: 'Laurent Mekies',
      primaryColor: '#2B4593',
      secondaryColor: '#F4F5F7',
      accentColor: '#EF4444',
      liveryPattern: 'stripe',
      crestShape: 'crest',
      crestIcon: 'bolt',
      isCustom: false,
      engineSupplierId: 'honda_rbpt',
      budget: 31000000,
      reputation: 61,
      car: { engine: 90, aero: 80, chassis: 80, suspension: 79, brakes: 80, reliability: 84 },
      facilities: { factory: 3, windTunnel: 3, simulator: 3 },
      sponsors: [
        { ...SPONSOR_CATALOG[4], id: 'vcb_sp1', name: 'Visa Cash App', remainingRaces: 24 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 0, bestConstructorPos: 6 },
      aiStrategyProfile: 'balanced',
    },
    {
      id: 'haas',
      name: 'MoneyGram Haas F1 Team',
      shortName: 'HAS',
      principalName: 'Ayao Komatsu',
      primaryColor: '#B6BABD',
      secondaryColor: '#141416',
      accentColor: '#E6002B',
      liveryPattern: 'stealth',
      crestShape: 'hexagon',
      crestIcon: 'target',
      isCustom: false,
      engineSupplierId: 'ferrari',
      budget: 27000000,
      reputation: 56,
      car: { engine: 89, aero: 78, chassis: 79, suspension: 78, brakes: 79, reliability: 83 },
      facilities: { factory: 2, windTunnel: 3, simulator: 3 },
      sponsors: [
        { ...SPONSOR_CATALOG[5], id: 'has_sp1', name: 'MoneyGram Global', remainingRaces: 20 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 0, bestConstructorPos: 5 },
      aiStrategyProfile: 'conservative',
    },
    {
      id: 'sauber',
      name: is2026 ? 'Audi F1 Factory Team' : 'Stake F1 Team Kick Sauber',
      shortName: is2026 ? 'AUD' : 'SAU',
      principalName: 'Mattia Binotto',
      primaryColor: is2026 ? '#BB0A30' : '#52E252',
      secondaryColor: '#0E1014',
      accentColor: is2026 ? '#D4D4D8' : '#10B981',
      liveryPattern: 'stealth',
      crestShape: 'diamond',
      crestIcon: 'flame',
      isCustom: false,
      engineSupplierId: is2026 ? 'audi' : 'ferrari',
      budget: is2026 ? 46000000 : 25000000,
      reputation: is2026 ? 68 : 49,
      car: {
        engine: is2026 ? 86 : 87,
        aero: is2026 ? 81 : 74,
        chassis: is2026 ? 82 : 75,
        suspension: is2026 ? 80 : 75,
        brakes: is2026 ? 81 : 76,
        reliability: is2026 ? 84 : 81,
      },
      facilities: { factory: is2026 ? 4 : 3, windTunnel: is2026 ? 4 : 3, simulator: 3 },
      sponsors: [
        { ...SPONSOR_CATALOG[5], id: 'sau_sp1', name: is2026 ? 'Audi Sport AG' : 'Kick Global', remainingRaces: 24 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 0, bestConstructorPos: 2 },
      aiStrategyProfile: is2026 ? 'aggressive' : 'conservative',
    },
  ];

  if (is2026) {
    teams.push({
      id: 'cadillac',
      name: 'Cadillac Formula 1 Team',
      shortName: 'CAD',
      principalName: 'Graeme Lowdon',
      primaryColor: '#1E293B',
      secondaryColor: '#0A0D12',
      accentColor: '#D4AF37',
      liveryPattern: 'diagonal',
      crestShape: 'crest',
      crestIcon: 'crown',
      isCustom: false,
      engineSupplierId: 'ferrari',
      budget: 44000000,
      reputation: 64,
      car: { engine: 88, aero: 79, chassis: 80, suspension: 79, brakes: 80, reliability: 84 },
      facilities: { factory: 4, windTunnel: 3, simulator: 4 },
      sponsors: [
        { ...SPONSOR_CATALOG[4], id: 'cad_sp1', name: 'General Motors Performance', remainingRaces: 24 },
      ],
      seasonPoints: 0,
      seasonWins: 0,
      seasonPodiums: 0,
      seasonPoles: 0,
      history: { titles: 0, bestConstructorPos: 11 },
      aiStrategyProfile: 'aggressive',
    });
  }

  return teams;
}

function makeDriver(
  id: string,
  name: string,
  shortCode: string,
  number: number,
  age: number,
  nationality: string,
  flag: string,
  speed: number,
  talent: number,
  experience: number,
  consistency: number,
  potential: number,
  popularity: number,
  salary: number,
  contractYears: number,
  teamId: string | null,
  role: Driver['role'],
  isReal = true,
  careerTitles = 0,
  careerWins = 0,
  careerPodiums = 0,
  careerPoles = 0,
  careerRaces = 0,
  originSeries: Driver['originSeries'] = 'F1'
): Driver {
  return {
    id,
    name,
    shortCode,
    number,
    age,
    nationality,
    flag,
    speed,
    talent,
    experience,
    consistency,
    potential,
    morale: 78,
    popularity,
    salary,
    contractValue: Math.round(salary * Math.max(1, contractYears) * 0.65),
    contractYears,
    teamId,
    role,
    isReal,
    originSeries,
    seasonStats: { points: 0, wins: 0, podiums: 0, poles: 0, fastestLaps: 0, dnfs: 0, bestFinish: 99 },
    careerStats: { titles: careerTitles, wins: careerWins, podiums: careerPodiums, poles: careerPoles, races: careerRaces },
  };
}

export function buildInitialDrivers(seasonBase: SeasonBase): Driver[] {
  const ageOffset = seasonBase === 2026 ? 1 : 0;
  return [
    // McLaren
    makeDriver('norris', 'Lando Norris', 'NOR', 4, 25 + ageOffset, 'Reino Unido', 'GBR', 93, 92, 85, 88, 95, 92, 18500000, 3, 'mclaren', 'starter_1', true, 0, 6, 30, 10, 130),
    makeDriver('piastri', 'Oscar Piastri', 'PIA', 81, 24 + ageOffset, 'Austrália', 'AUS', 91, 93, 79, 89, 96, 86, 12000000, 3, 'mclaren', 'starter_2', true, 0, 4, 14, 3, 50),

    // Ferrari
    makeDriver('leclerc', 'Charles Leclerc', 'LEC', 16, 27 + ageOffset, 'Mônaco', 'MON', 94, 94, 88, 86, 95, 94, 24000000, 4, 'ferrari', 'starter_1', true, 0, 8, 43, 26, 150),
    makeDriver('hamilton', 'Lewis Hamilton', 'HAM', 44, 40 + ageOffset, 'Reino Unido', 'GBR', 90, 95, 99, 91, 90, 99, 28000000, 2, 'ferrari', 'starter_2', true, 7, 105, 202, 104, 358),

    // Red Bull
    makeDriver('verstappen', 'Max Verstappen', 'VER', 1, 27 + ageOffset, 'Holanda', 'NED', 97, 98, 94, 95, 98, 96, 32000000, 4, 'redbull', 'starter_1', true, 4, 63, 113, 40, 212),
    makeDriver('tsunoda', 'Yuki Tsunoda', 'TSU', 22, 25 + ageOffset, 'Japão', 'JPN', 85, 84, 82, 80, 87, 81, 5500000, 2, 'redbull', 'starter_2', true, 0, 0, 0, 0, 90),

    // Mercedes
    makeDriver('russell', 'George Russell', 'RUS', 63, 27 + ageOffset, 'Reino Unido', 'GBR', 91, 90, 86, 89, 93, 86, 16000000, 3, 'mercedes', 'starter_1', true, 0, 3, 16, 5, 130),
    makeDriver('antonelli', 'Andrea Kimi Antonelli', 'ANT', 12, 18 + ageOffset, 'Itália', 'ITA', 86, 93, 66, 78, 96, 82, 4200000, 3, 'mercedes', 'starter_2', true, 0, 0, 0, 0, 4),

    // Aston Martin
    makeDriver('alonso', 'Fernando Alonso', 'ALO', 14, 43 + ageOffset, 'Espanha', 'ESP', 87, 94, 99, 92, 87, 95, 16500000, 2, 'aston_martin', 'starter_1', true, 2, 32, 106, 22, 404),
    makeDriver('stroll', 'Lance Stroll', 'STR', 18, 26 + ageOffset, 'Canadá', 'CAN', 79, 77, 84, 75, 80, 68, 7000000, 3, 'aston_martin', 'starter_2', true, 0, 0, 3, 1, 168),

    // Williams
    makeDriver('sainz', 'Carlos Sainz', 'SAI', 55, 30 + ageOffset, 'Espanha', 'ESP', 89, 89, 90, 90, 90, 89, 13500000, 3, 'williams', 'starter_1', true, 0, 4, 27, 6, 208),
    makeDriver('albon', 'Alexander Albon', 'ALB', 23, 29 + ageOffset, 'Tailândia', 'THA', 86, 85, 85, 85, 87, 83, 8500000, 3, 'williams', 'starter_2', true, 0, 0, 2, 0, 106),

    // Alpine
    makeDriver('gasly', 'Pierre Gasly', 'GAS', 10, 29 + ageOffset, 'França', 'FRA', 86, 86, 87, 85, 87, 82, 9000000, 2, 'alpine', 'starter_1', true, 0, 1, 5, 0, 155),
    makeDriver('doohan', 'Jack Doohan', 'DOO', 7, 22 + ageOffset, 'Austrália', 'AUS', 80, 82, 68, 77, 86, 70, 2400000, 2, 'alpine', 'starter_2', true, 0, 0, 0, 0, 4),

    // Racing Bulls
    makeDriver('lawson', 'Liam Lawson', 'LAW', 30, 23 + ageOffset, 'Nova Zelândia', 'NZL', 83, 85, 73, 80, 88, 76, 3200000, 2, 'racing_bulls', 'starter_1', true, 0, 0, 0, 0, 16),
    makeDriver('hadjar', 'Isack Hadjar', 'HAD', 6, 20 + ageOffset, 'França', 'FRA', 82, 86, 65, 76, 89, 73, 2100000, 2, 'racing_bulls', 'starter_2', true, 0, 0, 0, 0, 4),

    // Haas
    makeDriver('ocon', 'Esteban Ocon', 'OCO', 31, 28 + ageOffset, 'França', 'FRA', 84, 83, 86, 84, 85, 77, 7200000, 2, 'haas', 'starter_1', true, 0, 1, 4, 0, 158),
    makeDriver('bearman', 'Oliver Bearman', 'BEA', 87, 19 + ageOffset, 'Reino Unido', 'GBR', 83, 87, 68, 79, 91, 78, 2500000, 3, 'haas', 'starter_2', true, 0, 0, 0, 0, 6),

    // Sauber / Audi
    makeDriver('hulkenberg', 'Nico Hülkenberg', 'HUL', 27, 37 + ageOffset, 'Alemanha', 'GER', 84, 83, 94, 87, 84, 80, 6500000, 2, 'sauber', 'starter_1', true, 0, 0, 0, 1, 229),
    makeDriver('bortoleto', 'Gabriel Bortoleto', 'BOR', 5, 20 + ageOffset, 'Brasil', 'BRA', 84, 89, 66, 81, 92, 85, 2200000, 3, 'sauber', 'starter_2', true, 0, 0, 0, 0, 4),

    // Reserves attached to teams
    makeDriver('colapinto', 'Franco Colapinto', 'COL', 43, 21 + ageOffset, 'Argentina', 'ARG', 83, 86, 70, 78, 90, 84, 2000000, 2, 'alpine', 'reserve', true, 0, 0, 0, 0, 9, 'Reserva'),
    makeDriver('drugovich', 'Felipe Drugovich', 'DRU', 34, 24 + ageOffset, 'Brasil', 'BRA', 80, 83, 71, 82, 85, 76, 1500000, 1, 'aston_martin', 'reserve', true, 0, 0, 0, 0, 0, 'Reserva'),
    makeDriver('bottas', 'Valtteri Bottas', 'BOT', 77, 35 + ageOffset, 'Finlândia', 'FIN', 82, 83, 95, 86, 82, 81, 5200000, seasonBase === 2026 ? 2 : 1, seasonBase === 2026 ? 'cadillac' : 'mercedes', seasonBase === 2026 ? 'starter_1' : 'reserve', true, 0, 10, 67, 20, 246, seasonBase === 2026 ? 'F1' : 'Reserva'),
    makeDriver('zhou', 'Zhou Guanyu', 'ZHO', 24, 25 + ageOffset, 'China', 'CHN', 78, 79, 78, 80, 81, 79, 1900000, 1, 'ferrari', 'reserve', true, 0, 0, 0, 0, 68, 'Reserva'),
    makeDriver('hirakawa', 'Ryo Hirakawa', 'HIR', 45, 31 + ageOffset, 'Japão', 'JPN', 76, 77, 80, 82, 77, 64, 1200000, 1, 'haas', 'reserve', true, 0, 0, 0, 0, 0, 'Reserva'),
    makeDriver('pato', "Pato O'Ward", 'OWA', 29, 25 + ageOffset, 'México', 'MEX', 82, 85, 76, 80, 87, 83, 2600000, 1, 'mclaren', 'reserve', true, 0, 0, 0, 0, 0, 'Reserva'),
    makeDriver('iwasa', 'Ayumu Iwasa', 'IWA', 40, 23 + ageOffset, 'Japão', 'JPN', 79, 82, 68, 78, 86, 68, 1300000, 1, 'redbull', 'reserve', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('browning', 'Luke Browning', 'BRO', 46, 23 + ageOffset, 'Reino Unido', 'GBR', 77, 82, 65, 77, 86, 65, 1100000, 1, 'williams', 'reserve', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('lindblad', 'Arvid Lindblad', 'LIN', 36, 17 + ageOffset, 'Reino Unido', 'GBR', 81, 89, 58, 74, 94, 72, 1200000, 2, 'racing_bulls', 'reserve', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('maloney', 'Zane Maloney', 'MAL', 41, 21 + ageOffset, 'Barbados', 'BAR', 77, 80, 66, 76, 84, 62, 1000000, 1, 'sauber', 'reserve', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('herta', 'Colton Herta', 'HER', 26, 25 + ageOffset, 'Estados Unidos', 'USA', 83, 86, 76, 80, 88, 82, 2900000, seasonBase === 2026 ? 2 : 0, seasonBase === 2026 ? 'cadillac' : null, seasonBase === 2026 ? 'reserve' : 'free_agent', true, 0, 0, 0, 0, 0, seasonBase === 2026 ? 'Reserva' : 'F1'),

    // Free Agents — Ex-F1 / Sem Equipe
    makeDriver('perez', 'Sergio Pérez', 'PER', 11, 35 + ageOffset, 'México', 'MEX', 83, 84, 96, 82, 83, 88, 6800000, seasonBase === 2026 ? 2 : 0, seasonBase === 2026 ? 'cadillac' : null, seasonBase === 2026 ? 'starter_2' : 'free_agent', true, 0, 6, 39, 3, 281, 'F1'),
    makeDriver('ricciardo', 'Daniel Ricciardo', 'RIC', 3, 35 + ageOffset, 'Austrália', 'AUS', 81, 83, 95, 80, 81, 91, 4800000, 0, null, 'free_agent', true, 0, 8, 32, 3, 257, 'F1'),
    makeDriver('magnussen', 'Kevin Magnussen', 'MAG', 20, 32 + ageOffset, 'Dinamarca', 'DEN', 80, 81, 90, 79, 80, 74, 3800000, 0, null, 'free_agent', true, 0, 0, 1, 1, 185, 'F1'),
    makeDriver('schumacher', 'Mick Schumacher', 'MSC', 47, 26 + ageOffset, 'Alemanha', 'GER', 79, 81, 76, 78, 84, 81, 2500000, 0, null, 'free_agent', true, 0, 0, 0, 0, 43, 'F1'),
    makeDriver('sargeant', 'Logan Sargeant', 'SAR', 2, 24 + ageOffset, 'Estados Unidos', 'USA', 74, 76, 70, 72, 79, 68, 1400000, 0, null, 'free_agent', true, 0, 0, 0, 0, 36, 'F1'),
    makeDriver('de_vries', 'Nyck de Vries', 'DEV', 21, 30 + ageOffset, 'Holanda', 'NED', 77, 79, 78, 79, 79, 69, 1750000, 0, null, 'free_agent', true, 0, 0, 0, 0, 11, 'F1'),
    makeDriver('giovinazzi', 'Antonio Giovinazzi', 'GIO', 99, 31 + ageOffset, 'Itália', 'ITA', 78, 80, 83, 81, 80, 72, 2100000, 0, null, 'free_agent', true, 0, 0, 0, 0, 62, 'F1'),
    makeDriver('vandoorne', 'Stoffel Vandoorne', 'VAN', 92, 33 + ageOffset, 'Bélgica', 'BEL', 79, 81, 84, 82, 81, 71, 2200000, 0, null, 'free_agent', true, 0, 0, 0, 0, 41, 'F1'),
    makeDriver('latifi', 'Nicholas Latifi', 'LAT', 96, 29 + ageOffset, 'Canadá', 'CAN', 72, 74, 78, 74, 74, 65, 1300000, 0, null, 'free_agent', true, 0, 0, 0, 0, 61, 'F1'),
    makeDriver('fittipaldi_p', 'Pietro Fittipaldi', 'FIT', 51, 28 + ageOffset, 'Brasil', 'BRA', 75, 77, 73, 78, 79, 73, 1250000, 0, null, 'free_agent', true, 0, 0, 0, 0, 2, 'F1'),
    makeDriver('vesti', 'Frederik Vesti', 'VES', 57, 23 + ageOffset, 'Dinamarca', 'DEN', 79, 83, 69, 81, 86, 70, 1500000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('shwartzman', 'Robert Shwartzman', 'SHW', 39, 25 + ageOffset, 'Israel', 'ISR', 79, 82, 73, 80, 85, 69, 1550000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('aitken', 'Jack Aitken', 'AIT', 89, 29 + ageOffset, 'Reino Unido', 'GBR', 76, 78, 77, 80, 79, 64, 1300000, 0, null, 'free_agent', true, 0, 0, 0, 0, 1, 'F1'),
    makeDriver('ilott', 'Callum Ilott', 'ILO', 93, 26 + ageOffset, 'Reino Unido', 'GBR', 78, 81, 74, 79, 83, 67, 1400000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),

    // Fórmula 2 (Grid Completo & Campeões / Promessas da F2)
    makeDriver('pourchaire', 'Théo Pourchaire', 'POU', 98, 21 + ageOffset, 'França', 'FRA', 81, 85, 68, 80, 88, 71, 1600000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('aron', 'Paul Aron', 'ARO', 15, 21 + ageOffset, 'Estônia', 'EST', 80, 84, 65, 79, 88, 66, 1400000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('beganovic', 'Dino Beganovic', 'BEG', 38, 21 + ageOffset, 'Suécia', 'SWE', 78, 84, 63, 76, 89, 65, 1300000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('camara', 'Rafael Câmara', 'CAM', 50, 20 + ageOffset, 'Brasil', 'BRA', 79, 87, 60, 76, 92, 74, 1250000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('fornaroli', 'Leonardo Fornaroli', 'FOR', 48, 20 + ageOffset, 'Itália', 'ITA', 78, 84, 62, 81, 88, 64, 1200000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('martins', 'Victor Martins', 'MAR', 64, 23 + ageOffset, 'França', 'FRA', 81, 85, 69, 78, 88, 70, 1500000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('verschoor', 'Richard Verschoor', 'VRS', 52, 24 + ageOffset, 'Holanda', 'NED', 79, 81, 72, 80, 84, 67, 1350000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('crawford', 'Jak Crawford', 'CRA', 54, 20 + ageOffset, 'Estados Unidos', 'USA', 79, 84, 65, 77, 88, 69, 1300000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('mini', 'Gabriele Minì', 'MIN', 58, 20 + ageOffset, 'Itália', 'ITA', 80, 86, 64, 78, 90, 68, 1350000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('dunne', 'Alex Dunne', 'DUN', 60, 19 + ageOffset, 'Irlanda', 'IRL', 80, 86, 62, 76, 90, 67, 1250000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('marti', 'Pepe Martí', 'MRT', 62, 20 + ageOffset, 'Espanha', 'ESP', 79, 84, 64, 76, 88, 68, 1250000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('maini', 'Kush Maini', 'MAI', 65, 24 + ageOffset, 'Índia', 'IND', 76, 78, 68, 76, 82, 65, 1150000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('stanek', 'Roman Staněk', 'STA', 67, 21 + ageOffset, 'Rep. Tcheca', 'CZE', 76, 79, 66, 77, 83, 60, 1100000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('durksen', 'Joshua Dürksen', 'DUR', 68, 21 + ageOffset, 'Paraguai', 'PAR', 78, 82, 64, 77, 86, 66, 1150000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('miyata', 'Ritomo Miyata', 'MIY', 69, 25 + ageOffset, 'Japão', 'JPN', 77, 80, 71, 79, 83, 66, 1250000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('goethe', 'Oliver Goethe', 'GOE', 70, 20 + ageOffset, 'Alemanha', 'GER', 77, 82, 63, 76, 87, 63, 1150000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('cordeel', 'Amaury Cordeel', 'COR', 71, 22 + ageOffset, 'Bélgica', 'BEL', 73, 75, 67, 74, 78, 56, 950000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('villagomez', 'Rafael Villagómez', 'VIL', 73, 23 + ageOffset, 'México', 'MEX', 74, 76, 66, 75, 79, 59, 1000000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('meguetounif', 'Sami Meguetounif', 'MEG', 74, 21 + ageOffset, 'França', 'FRA', 76, 81, 61, 74, 86, 60, 1050000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('bennett', 'John Bennett', 'BEN', 75, 21 + ageOffset, 'Reino Unido', 'GBR', 74, 78, 60, 75, 82, 57, 950000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('shields', 'Cian Shields', 'SHI', 76, 20 + ageOffset, 'Reino Unido', 'GBR', 73, 76, 60, 74, 80, 55, 900000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('esterson', 'Max Esterson', 'EST', 78, 22 + ageOffset, 'Estados Unidos', 'USA', 74, 77, 61, 75, 81, 58, 950000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('montoya', 'Sebastián Montoya', 'MNT', 79, 20 + ageOffset, 'Colômbia', 'COL', 77, 83, 63, 75, 87, 70, 1150000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('hauger', 'Dennis Hauger', 'HAU', 80, 22 + ageOffset, 'Noruega', 'NOR', 79, 82, 68, 78, 85, 68, 1300000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('fittipaldi_e', 'Enzo Fittipaldi', 'EFI', 82, 23 + ageOffset, 'Brasil', 'BRA', 78, 81, 69, 78, 84, 74, 1300000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('barnard', 'Taylor Barnard', 'BAR', 83, 20 + ageOffset, 'Reino Unido', 'GBR', 79, 85, 64, 78, 89, 67, 1250000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('tsolov', 'Nikola Tsolov', 'TSO', 84, 18 + ageOffset, 'Bulgária', 'BUL', 78, 86, 58, 75, 91, 65, 1100000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('stenshorne', 'Martinius Stenshorne', 'STE', 85, 19 + ageOffset, 'Noruega', 'NOR', 77, 84, 59, 75, 89, 62, 1050000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),
    makeDriver('vanhoepen', 'Laurens van Hoepen', 'VHO', 86, 19 + ageOffset, 'Holanda', 'NED', 76, 82, 59, 76, 87, 60, 1000000, 0, null, 'free_agent', true, 0, 0, 0, 0, 0, 'F2'),

    // Jovens da Base / Revelações
    makeDriver('fic_vermeer', 'Lucas Vermeer', 'LVE', 61, 19 + ageOffset, 'Holanda', 'NED', 78, 85, 57, 74, 91, 61, 1050000, 0, null, 'free_agent', false, 0, 0, 0, 0, 0, 'Base'),
    makeDriver('fic_moretti', 'Matteo Moretti', 'MOR', 72, 22 + ageOffset, 'Itália', 'ITA', 77, 81, 67, 80, 85, 60, 1150000, 0, null, 'free_agent', false, 0, 0, 0, 0, 0, 'Base'),
    makeDriver('fic_keller', 'Jonas Keller', 'KEL', 88, 24 + ageOffset, 'Alemanha', 'GER', 79, 80, 72, 82, 84, 63, 1450000, 0, null, 'free_agent', false, 0, 0, 0, 0, 0, 'Base'),
    makeDriver('fic_silva', 'Enzo Mendonça', 'MEN', 91, 18 + ageOffset, 'Brasil', 'BRA', 77, 86, 55, 73, 93, 69, 950000, 0, null, 'free_agent', false, 0, 0, 0, 0, 0, 'Base'),
  ];
}

const STAFF_ROLES: StaffRole[] = [
  'technical_director',
  'aero_chief',
  'strategy_chief',
  'sporting_director',
  'lead_engineer',
  'head_mechanic',
];

const STAFF_NAMES_BY_TEAM: Record<string, string[]> = {
  mclaren: ['Peter Prodromou', 'Rob Marshall', 'Randy Singh', 'Mark Temple', 'Neil Houldey', 'Paul James'],
  ferrari: ['Loïc Serra', 'Diego Tondi', 'Ravin Jain', 'Diego Ioverno', 'Matteo Togninalli', 'Francesco Cigarini'],
  redbull: ['Pierre Waché', 'Enrico Balbo', 'Hannah Schmitz', 'Jonathan Wheatley', 'Gianpiero Lambiase', 'Lee Stevenson'],
  mercedes: ['James Allison', 'Simone Resta', 'Rosie Wait', 'Ron Meadows', 'Andrew Shovlin', 'Matt Deane'],
  aston_martin: ['Adrian Newey', 'Eric Blandin', 'Bernadette Collins', 'Tom McCullough', 'Ben Michell', 'Chris Dye'],
  williams: ['Pat Fry', 'Adam Kenyon', 'Will Joseph', 'Sven Smeets', 'Dave Robson', 'Mark Baines'],
  alpine: ['David Sanchez', 'Ciaron Pilbeam', 'Davide Brivio', 'Julian Rouse', 'Karel Loos', 'Jason Milligan'],
  racing_bulls: ['Jody Egginton', 'Guillaume Cattelani', 'Claudio Balestri', 'Alan Permane', 'Mattia Spini', 'Marco Perrone'],
  haas: ['Andrea De Zordo', 'Davide Paganelli', 'Mike Caulfield', 'Peter Crolla', 'Mark Lowe', 'Toby Brown'],
  sauber: ['James Key', 'Jan Monchaux', 'Iñaki Rueda', 'Beat Zehnder', 'Xevi Pujolar', 'Urs Kuratle'],
  cadillac: ['Nick Chester', 'Pat Symonds', 'Naoki Tokunaga', 'Peter Crolla', 'John McQuilliam', 'Craig Wilson'],
};

export function buildInitialStaff(teams: Team[]): StaffMember[] {
  const list: StaffMember[] = [];
  const nationalities = ['Reino Unido', 'Itália', 'França', 'Alemanha', 'Espanha', 'Japão'];

  teams.forEach((team) => {
    const tierBonus = Math.round((team.reputation - 45) * 0.45);
    const names = STAFF_NAMES_BY_TEAM[team.id] ?? [
      'Marcus Vance',
      'Elena Rossi',
      'Henrik Lindqvist',
      'Carlos Navarro',
      'Tomás Ferreira',
      'Liam O’Connor',
    ];

    STAFF_ROLES.forEach((role, idx) => {
      const baseQual = Math.min(96, Math.max(66, 75 + tierBonus + ((idx * 3) % 5) - 2));
      const baseExp = Math.min(97, Math.max(62, 74 + tierBonus + ((idx * 7) % 6)));
      const salary = Math.round((baseQual * 22000 + baseExp * 8000) * (role === 'technical_director' ? 1.45 : role === 'aero_chief' ? 1.3 : 1));
      list.push({
        id: `staff_${team.id}_${role}`,
        name: names[idx] || `Especialista ${idx + 1}`,
        role,
        nationality: nationalities[(idx + team.shortName.charCodeAt(0)) % nationalities.length],
        age: 36 + ((idx * 5 + team.reputation) % 20),
        quality: baseQual,
        experience: baseExp,
        salary,
        contractYears: 2 + (idx % 2),
        teamId: team.id,
      });
    });
  });

  // Free agent staff market
  const marketPool: Array<{ name: string; role: StaffRole; nat: string; age: number; quality: number; exp: number }> = [
    { name: 'Dan Fallows', role: 'technical_director', nat: 'Reino Unido', age: 51, quality: 87, exp: 91 },
    { name: 'Mike Elliott', role: 'technical_director', nat: 'Reino Unido', age: 50, quality: 85, exp: 89 },
    { name: 'Otmar Szafnauer', role: 'sporting_director', nat: 'Estados Unidos', age: 60, quality: 83, exp: 94 },
    { name: 'Guenther Steiner', role: 'sporting_director', nat: 'Itália', age: 59, quality: 79, exp: 92 },
    { name: 'Marcin Budkowski', role: 'technical_director', nat: 'Polônia', age: 48, quality: 82, exp: 85 },
    { name: 'Dirk de Beer', role: 'aero_chief', nat: 'África do Sul', age: 58, quality: 84, exp: 90 },
    { name: 'Jarrod Murphy', role: 'aero_chief', nat: 'Austrália', age: 44, quality: 81, exp: 82 },
    { name: 'Claire Williams-Reed', role: 'sporting_director', nat: 'Reino Unido', age: 46, quality: 80, exp: 83 },
    { name: 'Ruth Buscombe', role: 'strategy_chief', nat: 'Reino Unido', age: 35, quality: 86, exp: 84 },
    { name: 'Ignacio Palacios', role: 'strategy_chief', nat: 'Espanha', age: 39, quality: 80, exp: 78 },
    { name: 'Julien Simon', role: 'lead_engineer', nat: 'França', age: 41, quality: 83, exp: 85 },
    { name: 'Marco Bellini', role: 'lead_engineer', nat: 'Itália', age: 38, quality: 79, exp: 77 },
    { name: 'Callum MacLeod', role: 'head_mechanic', nat: 'Reino Unido', age: 43, quality: 85, exp: 88 },
    { name: 'Sander Van Dijk', role: 'head_mechanic', nat: 'Holanda', age: 37, quality: 80, exp: 79 },
    { name: 'Henrique Vasconcelos', role: 'aero_chief', nat: 'Brasil', age: 36, quality: 78, exp: 74 },
    { name: 'Kenji Takahashi', role: 'lead_engineer', nat: 'Japão', age: 42, quality: 84, exp: 86 },
  ];

  marketPool.forEach((m, i) => {
    const salary = Math.round((m.quality * 22000 + m.exp * 8000) * (m.role === 'technical_director' ? 1.4 : 1));
    list.push({
      id: `staff_mkt_${i}`,
      name: m.name,
      role: m.role,
      nationality: m.nat,
      age: m.age,
      quality: m.quality,
      experience: m.exp,
      salary,
      contractYears: 0,
      teamId: null,
    });
  });

  return list;
}

export function buildObjectivesForTeam(team: Team, totalTeams: number): BoardObjective[] {
  const avgCar =
    (team.car.engine + team.car.aero + team.car.chassis + team.car.suspension + team.car.brakes + team.car.reliability) / 6;

  if (avgCar >= 89) {
    return [
      { id: 'obj_rank', label: 'Terminar no Top 3 de Construtores', type: 'constructor_rank', targetValue: 3, currentValue: totalTeams, completed: false },
      { id: 'obj_wins', label: 'Conquistar pelo menos 3 vitórias', type: 'wins', targetValue: 3, currentValue: 0, completed: false },
      { id: 'obj_podiums', label: 'Somar pelo menos 10 pódios', type: 'podiums', targetValue: 10, currentValue: 0, completed: false },
      { id: 'obj_bal', label: 'Manter saldo positivo ao fim do ano', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
    ];
  }

  if (avgCar >= 80) {
    return [
      { id: 'obj_rank', label: 'Terminar no Top 6 de Construtores', type: 'constructor_rank', targetValue: 6, currentValue: totalTeams, completed: false },
      { id: 'obj_podiums', label: 'Conquistar pelo menos 1 pódio na temporada', type: 'podiums', targetValue: 1, currentValue: 0, completed: false },
      { id: 'obj_bal', label: 'Manter saúde financeira positiva', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
    ];
  }

  return [
    { id: 'obj_rank', label: `Terminar acima da ${Math.max(7, totalTeams - 1)}ª posição nos Construtores`, type: 'constructor_rank', targetValue: Math.max(7, totalTeams - 1), currentValue: totalTeams, completed: false },
    { id: 'obj_young', label: 'Dar experiência a piloto jovem (<= 23 anos)', type: 'young_driver', targetValue: 1, currentValue: 0, completed: false },
    { id: 'obj_bal', label: 'Controlar gastos e fechar com saldo positivo', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
  ];
}

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach_first_podium', title: 'Primeiro Pódio', description: 'Coloque um carro da sua equipe entre os 3 primeiros em um GP.', unlocked: false },
  { id: 'ach_first_win', title: 'Primeira Vitória', description: 'Vença um Grande Prêmio oficial de Fórmula 1.', unlocked: false },
  { id: 'ach_first_title', title: 'Primeiro Campeonato', description: 'Conquiste o Campeonato Mundial de Construtores ou Pilotos.', unlocked: false },
  { id: 'ach_richest_team', title: 'Equipe Mais Rica', description: 'Tenha o maior saldo bancário entre todas as equipes do grid.', unlocked: false },
  { id: 'ach_best_driver', title: 'Melhor Piloto', description: 'Tenha em sua equipe o campeão mundial de pilotos ou líder em pontuação.', unlocked: false },
  { id: 'ach_best_car', title: 'Melhor Carro do Grid', description: 'Alcance a maior média técnica de carro da Fórmula 1.', unlocked: false },
  { id: 'ach_breakthrough', title: 'Equipe Revelação', description: 'Supere a expectativa de posição da diretoria em pelo menos 2 posições.', unlocked: false },
  { id: 'ach_underdog_champ', title: 'De Pequena a Campeã', description: 'Comece com uma equipe de fundo/meio de pelotão e conquiste o título de Construtores.', unlocked: false },
];

export interface CreateExistingCareerInput {
  careerName: string;
  seasonBase: SeasonBase;
  teamId: string;
  principalName: string;
  starterDriver1Id?: string;
  starterDriver2Id?: string;
  settings: CareerSettings;
}

export interface CreateCustomCareerInput {
  careerName: string;
  seasonBase: SeasonBase;
  teamName: string;
  shortName: string;
  principalName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  liveryPattern: LiveryPattern;
  crestShape: CrestShape;
  crestIcon: CrestIcon;
  customLogoUrl?: string;
  engineSupplierId: string;
  startingBudget: number;
  startingTier: 'top' | 'midfield' | 'backmarker';
  customObjectiveTarget: 'title' | 'top5' | 'points';
  starterDriver1Id?: string;
  starterDriver2Id?: string;
  settings: CareerSettings;
}

export function createCareerFromExisting(input: CreateExistingCareerInput): CareerState {
  const teams = buildBaseTeams(input.seasonBase);
  const playerTeam = teams.find((t) => t.id === input.teamId) ?? teams[0];
  playerTeam.principalName = input.principalName || playerTeam.principalName;

  const drivers = buildInitialDrivers(input.seasonBase);
  if (
    input.starterDriver1Id &&
    input.starterDriver2Id &&
    input.starterDriver1Id !== input.starterDriver2Id
  ) {
    const picked1 = drivers.find((d) => d.id === input.starterDriver1Id);
    const picked2 = drivers.find((d) => d.id === input.starterDriver2Id);
    if (picked1 && picked2) {
      drivers.forEach((d) => {
        if (
          d.teamId === playerTeam.id &&
          (d.role === 'starter_1' || d.role === 'starter_2') &&
          d.id !== picked1.id &&
          d.id !== picked2.id
        ) {
          d.teamId = null;
          d.role = 'free_agent';
          d.contractYears = 0;
        }
      });
      picked1.teamId = playerTeam.id;
      picked1.role = 'starter_1';
      picked1.contractYears = Math.max(2, picked1.contractYears || 2);
      picked2.teamId = playerTeam.id;
      picked2.role = 'starter_2';
      picked2.contractYears = Math.max(2, picked2.contractYears || 2);
    }
  }
  const staff = buildInitialStaff(teams);
  const calendar = buildSeasonCalendar();
  const objectives = buildObjectivesForTeam(playerTeam, teams.length);

  const avgCar =
    (playerTeam.car.engine +
      playerTeam.car.aero +
      playerTeam.car.chassis +
      playerTeam.car.suspension +
      playerTeam.car.brakes +
      playerTeam.car.reliability) /
    6;

  const startingTier: CareerState['startingTeamTier'] =
    avgCar >= 89 ? 'top' : avgCar >= 80 ? 'midfield' : 'backmarker';

  const usedSponsorNames = new Set(playerTeam.sponsors.map((s) => s.name));
  const availableSponsors = SPONSOR_CATALOG.filter((s) => !usedSponsorNames.has(s.name)).map((s) => ({
    ...s,
    remainingRaces: s.durationRaces,
  }));

  const now = new Date().toISOString();
  return {
    id: `career_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    careerName: input.careerName || `${playerTeam.name} (${input.seasonBase})`,
    createdAt: now,
    updatedAt: now,
    seasonBase: input.seasonBase,
    currentSeason: input.seasonBase,
    currentRound: 1,
    phase: 'in_season',
    playerTeamId: playerTeam.id,
    startingTeamTier: startingTier,
    teams,
    drivers,
    staff,
    calendar,
    devQueue: [],
    availableSponsors,
    board: {
      confidence: 75,
      status: 'Segura',
      objectives,
      meetingsHeldThisSeason: 0,
      lastMeetingRound: 0,
      ultimatumActive: false,
      fired: false,
    },
    transactions: [
      {
        id: 'tx_init',
        round: 0,
        season: input.seasonBase,
        category: 'board',
        description: 'Orçamento inicial aprovado pela diretoria',
        amount: playerTeam.budget,
      },
    ],
    financeHistory: [{ round: 0, label: 'Pré', balance: playerTeam.budget, income: playerTeam.budget, expense: 0 }],
    carRatingHistory: [{ round: 0, rating: Math.round(avgCar) }],
    pointsProgression: [{ round: 0, standings: Object.fromEntries(teams.map((t) => [t.id, 0])) }],
    pendingEvent: null,
    news: [
      {
        id: 'news_init',
        round: 0,
        season: input.seasonBase,
        title: `${playerTeam.principalName} assume comando da ${playerTeam.name}`,
        body: `A nova liderança chega ao paddock para a temporada ${input.seasonBase} com foco em desenvolvimento técnico e metas ambiciosas.`,
        category: 'board',
      },
    ],
    achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
    seasonHistory: [],
    settings: input.settings,
    lastRaceResult: null,
    unreadNotifications: 1,
  };
}

export function createCareerFromCustom(input: CreateCustomCareerInput): CareerState {
  const baseTeams = buildBaseTeams(input.seasonBase);
  const drivers = buildInitialDrivers(input.seasonBase);
  const engine = ENGINE_SUPPLIERS.find((e) => e.id === input.engineSupplierId) ?? ENGINE_SUPPLIERS[1];

  const tierStats = {
    top: { carBase: 88, rep: 82, facilities: { factory: 4, windTunnel: 4, simulator: 4 } },
    midfield: { carBase: 79, rep: 58, facilities: { factory: 3, windTunnel: 3, simulator: 3 } },
    backmarker: { carBase: 71, rep: 36, facilities: { factory: 2, windTunnel: 2, simulator: 2 } },
  }[input.startingTier];

  const customTeamId = 'custom_team';
  const customTeam: Team = {
    id: customTeamId,
    name: input.teamName.trim() || 'Apex Grand Prix',
    shortName: (input.shortName.trim().toUpperCase() || 'APX').slice(0, 3),
    principalName: input.principalName.trim() || 'Diretor de Equipe',
    primaryColor: input.primaryColor,
    secondaryColor: input.secondaryColor,
    accentColor: input.accentColor,
    liveryPattern: input.liveryPattern,
    crestShape: input.crestShape,
    crestIcon: input.crestIcon,
    customLogoUrl: input.customLogoUrl,
    isCustom: true,
    engineSupplierId: engine.id,
    budget: input.startingBudget,
    reputation: tierStats.rep,
    car: {
      engine: Math.round((tierStats.carBase + engine.powerRating) / 2),
      aero: tierStats.carBase,
      chassis: tierStats.carBase - 1,
      suspension: tierStats.carBase,
      brakes: tierStats.carBase - 1,
      reliability: Math.round((tierStats.carBase + engine.reliabilityRating) / 2),
    },
    facilities: tierStats.facilities,
    sponsors: [
      {
        ...(input.startingTier === 'top'
          ? SPONSOR_CATALOG[3]
          : input.startingTier === 'midfield'
          ? SPONSOR_CATALOG[4]
          : SPONSOR_CATALOG[5]),
        id: 'custom_sp_main',
        remainingRaces: 24,
      },
    ],
    seasonPoints: 0,
    seasonWins: 0,
    seasonPodiums: 0,
    seasonPoles: 0,
    history: { titles: 0, bestConstructorPos: 11 },
  };

  // Assign chosen or default free agent / F2 drivers to custom team so the team is race-ready immediately
  const freeAgents = drivers.filter((d) => d.role === 'free_agent' && d.teamId === null);
  const chosen1 = input.starterDriver1Id
    ? freeAgents.find((d) => d.id === input.starterDriver1Id)
    : undefined;
  const chosen2 = input.starterDriver2Id
    ? freeAgents.find((d) => d.id === input.starterDriver2Id && d.id !== chosen1?.id)
    : undefined;

  if (chosen1 && chosen2) {
    chosen1.teamId = customTeamId;
    chosen1.role = 'starter_1';
    chosen1.contractYears = 2;
    chosen2.teamId = customTeamId;
    chosen2.role = 'starter_2';
    chosen2.contractYears = 2;

    const remainingReserve = freeAgents.find(
      (d) => d.id !== chosen1.id && d.id !== chosen2.id
    );
    if (remainingReserve) {
      remainingReserve.teamId = customTeamId;
      remainingReserve.role = 'reserve';
      remainingReserve.contractYears = 1;
    }
  } else if (input.startingTier === 'top') {
    const d1 = freeAgents.find((d) => d.id === 'perez') ?? freeAgents[0];
    const d2 = freeAgents.find((d) => d.id === 'pourchaire') ?? freeAgents[1];
    const d3 = freeAgents.find((d) => d.id === 'aron') ?? freeAgents[2];
    if (d1) { d1.teamId = customTeamId; d1.role = 'starter_1'; d1.contractYears = 2; }
    if (d2) { d2.teamId = customTeamId; d2.role = 'starter_2'; d2.contractYears = 2; }
    if (d3) { d3.teamId = customTeamId; d3.role = 'reserve'; d3.contractYears = 1; }
  } else if (input.startingTier === 'midfield') {
    const d1 = freeAgents.find((d) => d.id === 'magnussen') ?? freeAgents[0];
    const d2 = freeAgents.find((d) => d.id === 'schumacher') ?? freeAgents[1];
    const d3 = freeAgents.find((d) => d.id === 'camara') ?? freeAgents[2];
    if (d1) { d1.teamId = customTeamId; d1.role = 'starter_1'; d1.contractYears = 2; }
    if (d2) { d2.teamId = customTeamId; d2.role = 'starter_2'; d2.contractYears = 2; }
    if (d3) { d3.teamId = customTeamId; d3.role = 'reserve'; d3.contractYears = 1; }
  } else {
    const d1 = freeAgents.find((d) => d.id === 'schumacher') ?? freeAgents[0];
    const d2 = freeAgents.find((d) => d.id === 'fic_silva') ?? freeAgents[1];
    const d3 = freeAgents.find((d) => d.id === 'fic_vermeer') ?? freeAgents[2];
    if (d1) { d1.teamId = customTeamId; d1.role = 'starter_1'; d1.contractYears = 2; }
    if (d2) { d2.teamId = customTeamId; d2.role = 'starter_2'; d2.contractYears = 2; }
    if (d3) { d3.teamId = customTeamId; d3.role = 'reserve'; d3.contractYears = 1; }
  }

  const teams = [...baseTeams, customTeam];
  const staff = buildInitialStaff(teams);
  const calendar = buildSeasonCalendar();

  const objectives: BoardObjective[] =
    input.customObjectiveTarget === 'title'
      ? [
          { id: 'obj_rank', label: 'Terminar no Top 3 de Construtores', type: 'constructor_rank', targetValue: 3, currentValue: 11, completed: false },
          { id: 'obj_wins', label: 'Conquistar pelo menos 2 vitórias', type: 'wins', targetValue: 2, currentValue: 0, completed: false },
          { id: 'obj_bal', label: 'Manter saldo financeiro positivo', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
        ]
      : input.customObjectiveTarget === 'top5'
      ? [
          { id: 'obj_rank', label: 'Terminar no Top 6 de Construtores', type: 'constructor_rank', targetValue: 6, currentValue: 11, completed: false },
          { id: 'obj_podiums', label: 'Conquistar pelo menos 1 pódio', type: 'podiums', targetValue: 1, currentValue: 0, completed: false },
          { id: 'obj_bal', label: 'Manter saldo financeiro positivo', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
        ]
      : [
          { id: 'obj_rank', label: 'Terminar entre os 9 primeiros nos Construtores', type: 'constructor_rank', targetValue: 9, currentValue: 11, completed: false },
          { id: 'obj_young', label: 'Desenvolver jovem talento (<= 23 anos)', type: 'young_driver', targetValue: 1, currentValue: 1, completed: true },
          { id: 'obj_bal', label: 'Controlar gastos e manter saldo positivo', type: 'positive_balance', targetValue: 1, currentValue: 1, completed: true },
        ];

  const avgCar =
    (customTeam.car.engine +
      customTeam.car.aero +
      customTeam.car.chassis +
      customTeam.car.suspension +
      customTeam.car.brakes +
      customTeam.car.reliability) /
    6;

  const availableSponsors = SPONSOR_CATALOG.filter(
    (s) => s.name !== customTeam.sponsors[0]?.name
  ).map((s) => ({ ...s, remainingRaces: s.durationRaces }));

  const now = new Date().toISOString();
  return {
    id: `career_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    careerName: input.careerName || `${customTeam.name} (${input.seasonBase})`,
    createdAt: now,
    updatedAt: now,
    seasonBase: input.seasonBase,
    currentSeason: input.seasonBase,
    currentRound: 1,
    phase: 'in_season',
    playerTeamId: customTeamId,
    startingTeamTier: input.startingTier,
    teams,
    drivers,
    staff,
    calendar,
    devQueue: [],
    availableSponsors,
    board: {
      confidence: 80,
      status: 'Segura',
      objectives,
      meetingsHeldThisSeason: 0,
      lastMeetingRound: 0,
      ultimatumActive: false,
      fired: false,
    },
    transactions: [
      {
        id: 'tx_init',
        round: 0,
        season: input.seasonBase,
        category: 'board',
        description: 'Capital inicial da escuderia',
        amount: customTeam.budget,
      },
    ],
    financeHistory: [{ round: 0, label: 'Pré', balance: customTeam.budget, income: customTeam.budget, expense: 0 }],
    carRatingHistory: [{ round: 0, rating: Math.round(avgCar) }],
    pointsProgression: [{ round: 0, standings: Object.fromEntries(teams.map((t) => [t.id, 0])) }],
    pendingEvent: null,
    news: [
      {
        id: 'news_init_custom',
        round: 0,
        season: input.seasonBase,
        title: `Nova escuderia ${customTeam.name} entra no grid da Fórmula 1!`,
        body: `Liderada por ${customTeam.principalName} e equipada com motores ${engine.manufacturer}, a ${customTeam.shortName} expande o grid para ${teams.length} equipes.`,
        category: 'board',
      },
    ],
    achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
    seasonHistory: [],
    settings: input.settings,
    lastRaceResult: null,
    unreadNotifications: 1,
  };
}
