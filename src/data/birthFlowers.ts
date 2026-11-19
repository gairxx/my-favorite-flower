export interface BirthMonthGuide {
  month: number; // 1-12
  monthName: string;
  shortName: string;
  daysInMonth: number;
  primaryFlowerId: string;
  secondaryFlowerId: string;
  temperamentTitle: string;
  birthPortrait: string;
}

export const BIRTH_MONTHS: BirthMonthGuide[] = [
  {
    month: 1,
    monthName: 'January',
    shortName: 'Jan',
    daysInMonth: 31,
    primaryFlowerId: 'galanthus-snowdrop',
    secondaryFlowerId: 'alpine-edelweiss',
    temperamentTitle: 'The Quiet Lantern',
    birthPortrait:
      'Born beneath January’s snowdrop, you carry a steady, unhurried hope that remains calm when circumstances feel austere. Others turn to you for quiet reassurance and sincere clarity.',
  },
  {
    month: 2,
    monthName: 'February',
    shortName: 'Feb',
    daysInMonth: 29,
    primaryFlowerId: 'sweet-violet',
    secondaryFlowerId: 'winter-primrose',
    temperamentTitle: 'The Faithful Confidant',
    birthPortrait:
      'Guided by the sweet violet, your warmth needs no grand stage to be felt deeply. You value loyalty, thoughtful observation, and promises kept long after applause fades.',
  },
  {
    month: 3,
    monthName: 'March',
    shortName: 'Mar',
    daysInMonth: 31,
    primaryFlowerId: 'paperwhite-narcissus',
    secondaryFlowerId: 'wild-anemone',
    temperamentTitle: 'The Dawn Messenger',
    birthPortrait:
      'Rooted in the narcissus of March, you bring fresh clarity and renewal wherever stagnation gathers. Your instinct is to turn quiet beginnings into bright, welcoming spaces.',
  },
  {
    month: 4,
    monthName: 'April',
    shortName: 'Apr',
    daysInMonth: 30,
    primaryFlowerId: 'bellis-daisy',
    secondaryFlowerId: 'hanging-wisteria',
    temperamentTitle: 'The Open-Hearted',
    birthPortrait:
      'Paired with April’s meadow daisy, your spirit blends candor, resilience, and gentle optimism. You greet each morning honestly and lift heavy rooms with plain warmth.',
  },
  {
    month: 5,
    monthName: 'May',
    shortName: 'May',
    daysInMonth: 31,
    primaryFlowerId: 'lily-of-the-valley',
    secondaryFlowerId: 'garden-peony',
    temperamentTitle: 'The Keeper of Joy',
    birthPortrait:
      'Represented by lily of the valley, you carry the gift of quiet sweetness and restored happiness. People remember the gentleness of your presence long after a conversation ends.',
  },
  {
    month: 6,
    monthName: 'June',
    shortName: 'Jun',
    daysInMonth: 30,
    primaryFlowerId: 'damask-rose',
    secondaryFlowerId: 'white-lily',
    temperamentTitle: 'The Devoted Heart',
    birthPortrait:
      'Crowned by June’s Damask rose, you unite wholehearted affection with deep discretion. You love generously, protect confidences, and find poetry in everyday tenderness.',
  },
  {
    month: 7,
    monthName: 'July',
    shortName: 'Jul',
    daysInMonth: 31,
    primaryFlowerId: 'sacred-lotus',
    secondaryFlowerId: 'wild-lavender',
    temperamentTitle: 'The Clear Mirror',
    birthPortrait:
      'Embodied by the July lotus, you possess an uncommon ability to stay grounded in complex waters while keeping your perspective luminous and unclouded.',
  },
  {
    month: 8,
    monthName: 'August',
    shortName: 'Aug',
    daysInMonth: 31,
    primaryFlowerId: 'crimson-poppy',
    secondaryFlowerId: 'golden-sunburst',
    temperamentTitle: 'The Vivid Flame',
    birthPortrait:
      'Born under the August poppy, you live with striking immediacy, vivid memory, and quiet courage. Even after difficult seasons, you bring color back into open ground.',
  },
  {
    month: 9,
    monthName: 'September',
    shortName: 'Sep',
    daysInMonth: 30,
    primaryFlowerId: 'michaelmas-aster',
    secondaryFlowerId: 'meadow-yarrow',
    temperamentTitle: 'The Evening Star',
    birthPortrait:
      'Linked to September’s Michaelmas aster, your temperament balances discernment with patience. You notice subtle details others rush past and offer counsel that steadies the room.',
  },
  {
    month: 10,
    monthName: 'October',
    shortName: 'Oct',
    daysInMonth: 31,
    primaryFlowerId: 'autumn-marigold',
    secondaryFlowerId: 'autumn-crocus',
    temperamentTitle: 'The Golden Hearth',
    birthPortrait:
      'Illuminated by October’s marigold, you carry fierce warmth, loyalty, and a gift for honoring memory. You are the friend who keeps a welcoming light burning in twilight.',
  },
  {
    month: 11,
    monthName: 'November',
    shortName: 'Nov',
    daysInMonth: 30,
    primaryFlowerId: 'bronze-chrysanthemum',
    secondaryFlowerId: 'winter-camellia',
    temperamentTitle: 'The Ripened Sage',
    birthPortrait:
      'Honored by November’s chrysanthemum, your strength deepens in late seasons. You bring cheerful endurance, ripened wisdom, and steadfast friendship through every turn of weather.',
  },
  {
    month: 12,
    monthName: 'December',
    shortName: 'Dec',
    daysInMonth: 31,
    primaryFlowerId: 'lenten-hellebore',
    secondaryFlowerId: 'winter-camellia',
    temperamentTitle: 'The Winter Sanctuary',
    birthPortrait:
      'Sheltered by December’s winter-blooming hellebore, you offer serene fortitude and protective grace. Your calm presence turns the quietest days of the year into sanctuary.',
  },
];

export function getBirthMonthGuide(month: number): BirthMonthGuide {
  return BIRTH_MONTHS.find((b) => b.month === month) ?? BIRTH_MONTHS[10];
}
