export type ServiceCategory = {
  id: string;
  name: string;
  tagline: string;
  icon: string;          // nome do ícone Ionicons
  popular: boolean;
  avgPrice: number;
};

export type ReviewTag =
  | 'pontual' | 'caprichoso' | 'simpático' | 'deixou tudo limpo'
  | 'preço justo' | 'resolveu rápido';

export type Review = {
  id: string;
  author: string;
  initials: string;
  stars: number;
  when: string;
  text: string;
  tags: ReviewTag[];
};

/** Nível da chama — quanto melhor a nota, mais quente a borda do avatar. */
export type FlameLevel = 'novato' | 'bronze' | 'prata' | 'ouro' | 'chama';

export type Provider = {
  id: string;
  name: string;
  initials: string;
  categoryId: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  dailyRate: number;
  jobsDone: number;
  yearsOnApp: number;
  responseTime: string;
  verified: boolean;
  bestOption: boolean;
  flame: FlameLevel;
  bio: string;
  photos: string[];       // cores placeholder — sem assets externos no mock
  reviews: Review[];
  availableHours: string[];
};

export type Address = {
  id: string;
  label: string;
  street: string;
  detail: string;
  city: string;
  isDefault: boolean;
};

export type PaymentMethod = {
  id: string;
  kind: 'card' | 'pix';
  brand: string;
  last4?: string;
  expiry?: string;
  note?: string;
  isDefault: boolean;
};

export type OrderStatus =
  | 'aguardando'      // esperando o prestador aceitar
  | 'aceito'          // prestador aceitou, serviço agendado
  | 'em_andamento'    // prestador em campo
  | 'aguardando_confirmacao' // prestador concluiu, cliente precisa confirmar
  | 'concluido'
  | 'avaliado'
  | 'cancelado'
  | 'disputa';

export type Order = {
  id: string;
  providerId: string;
  providerName: string;
  providerInitials: string;
  categoryName: string;
  date: string;          // "sáb, 20 de jun"
  isoDate: string;       // "2026-06-20"
  time: string;
  addressId: string;
  addressLabel: string;
  dailyRate: number;
  serviceFee: number;
  total: number;
  paymentMethodId: string;
  status: OrderStatus;
  createdAt: string;
  proofPhotos: string[];
  clientRating?: number;
  clientReviewText?: string;
  clientReviewTags?: ReviewTag[];
  disputeReason?: string;
};

export type ChatMessage = {
  id: string;
  from: 'cliente' | 'prestador';
  text: string;
  at: string;
};

export type AppNotification = {
  id: string;
  icon: string;
  title: string;
  body: string;
  when: string;
  read: boolean;
  audience: 'cliente' | 'prestador';
};

export type EarningEntry = {
  id: string;
  label: string;
  date: string;
  gross: number;
  commission: number;   // 2%
  net: number;
  status: 'disponivel' | 'pendente' | 'sacado';
};

export type FaqItem = { id: string; q: string; a: string; audience: 'cliente' | 'prestador' | 'ambos' };

export type WaitlistEntry = { id: string; categoryId: string; categoryName: string; region: string; when: string };
