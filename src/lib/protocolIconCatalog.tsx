import {
  Activity,
  AlarmClock,
  Apple,
  Bed,
  Bike,
  Brain,
  Droplets,
  Dumbbell,
  Flame,
  Flower2,
  GlassWater,
  HandHeart,
  HeartPulse,
  Leaf,
  Moon,
  NotebookPen,
  Pill,
  Salad,
  ScanHeart,
  Smile,
  Sparkles,
  Stethoscope,
  Sun,
  Target,
  Timer,
  Waves,
  Wind,
  type LucideIcon,
} from 'lucide-react';

/**
 * Os ícones que uma entrada do catálogo pode usar.
 *
 * A chave é o nome kebab-case do Lucide, e é ela que vai para o banco: o app
 * Flutter resolve a mesma chave em `lucide_icons_flutter`. Só entram aqui
 * ícones que existem nos dois pacotes — chave que só existe no web deixaria o
 * app sem ícone, sem erro nenhum.
 */
export const protocolIcons: Readonly<Record<string, LucideIcon>> = {
  sparkles: Sparkles,
  droplets: Droplets,
  'glass-water': GlassWater,
  pill: Pill,
  moon: Moon,
  bed: Bed,
  timer: Timer,
  'alarm-clock': AlarmClock,
  'heart-pulse': HeartPulse,
  'scan-heart': ScanHeart,
  'hand-heart': HandHeart,
  brain: Brain,
  target: Target,
  leaf: Leaf,
  'flower-2': Flower2,
  flame: Flame,
  waves: Waves,
  wind: Wind,
  sun: Sun,
  activity: Activity,
  dumbbell: Dumbbell,
  bike: Bike,
  apple: Apple,
  salad: Salad,
  stethoscope: Stethoscope,
  smile: Smile,
  'notebook-pen': NotebookPen,
};

export const protocolIconKeys = Object.keys(protocolIcons);

export function protocolIcon(key: string): LucideIcon {
  return protocolIcons[key] ?? Sparkles;
}
