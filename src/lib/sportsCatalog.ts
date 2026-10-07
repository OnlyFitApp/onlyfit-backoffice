import type { StaffSportItem } from '../api/core.gen';

const sportNames: Readonly<Record<string, string>> = {
  'sport.strength': 'Musculação',
  'sport.running': 'Corrida',
  'sport.walking': 'Caminhada',
  'sport.cycling': 'Ciclismo',
  'sport.triathlon': 'Triathlon',
  'sport.swimming': 'Natação',
  'sport.crossfit': 'CrossFit',
  'sport.hyrox': 'HYROX',
  'sport.hiit': 'HIIT',
  'sport.functional': 'Funcional',
  'sport.martial_arts': 'Artes marciais',
  'sport.mobility': 'Mobilidade',
  'sport.yoga': 'Yoga',
  'sport.pilates': 'Pilates',
  'sport.custom': 'Personalizado',
};

export function staffSportLabel(sport: StaffSportItem): string {
  return sport.data.label ?? sportNames[sport.name_key] ?? sport.key;
}
