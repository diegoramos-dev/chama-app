export const colors = {
  brand: '#D4562A',
  brandDark: '#B8461F',
  brandLight: '#F2A98C',
  brandWash: '#FDEEE7',

  bg: '#FFFFFF',
  surface: '#F6F6F7',
  surfaceAlt: '#FAF7F5',
  border: '#E8E6E4',

  text: '#1C1917',
  textMuted: '#78716C',
  textFaint: '#A8A29E',
  onBrand: '#FFFFFF',

  success: '#15803D',
  successWash: '#E8F5EC',
  warning: '#B45309',
  warningWash: '#FDF3E3',
  danger: '#B91C1C',
  dangerWash: '#FDECEC',
  info: '#1D4ED8',

  star: '#E8A33D',
} as const;

export const spacing = (n: number) => n * 4;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  /** cards de conteúdo e blocos grandes */
  card: 20,
  /** tiles quadrados da grade de categorias */
  tile: 20,
  /** botões circulares de navegação (voltar, sino, ações) */
  round: 14,
  pill: 999,
} as const;

export const font = {
  h1: { fontSize: 30, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 17, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const, color: colors.text },
  small: { fontSize: 13, fontWeight: '400' as const, color: colors.textMuted },
  tiny: { fontSize: 11, fontWeight: '500' as const, color: colors.textMuted },
} as const;

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  raised: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
} as const;

/** Formata centavos-free: 350 -> "R$ 350,00" */
export const brl = (v: number) =>
  'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const brlShort = (v: number) => 'R$ ' + Math.round(v).toString();

/**
 * Caixa de sentença: só a primeira letra. Use ao exibir rótulos que vêm dos
 * dados (categorias, tags, apelidos de endereço) — os dados ficam em minúsculo
 * porque também aparecem no meio de frases.
 */
export const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
