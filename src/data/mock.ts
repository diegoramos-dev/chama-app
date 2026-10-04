import type {
  Address, AppNotification, ChatMessage, EarningEntry, FaqItem,
  Order, PaymentMethod, Provider, ServiceCategory,
} from './types';

export const COMMISSION_RATE = 0.02; // 2% por serviço — regra de negócio do Chama
export const SERVICE_FEE_RATE = 0.05;

export const currentUser = {
  name: 'Ana Lima',
  initials: 'AL',
  email: 'ana.lima@email.com',
  phone: '(11) 98877-6655',
  city: 'Vila Mariana, SP',
  memberSince: 'desde 2024',
};

export const currentProvider = {
  name: 'Carlos Mendes',
  initials: 'CM',
  email: 'carlos.mendes@email.com',
  phone: '(11) 97766-5544',
  city: 'Vila Mariana, SP',
  category: 'churrasqueiro',
  dailyRate: 350,
  rating: 4.9,
  memberSince: 'desde 2024',
};

export const categories: ServiceCategory[] = [
  { id: 'churrasqueiro', name: 'churrasqueiro', tagline: 'pro seu evento', icon: 'flame-outline', popular: true, avgPrice: 350 },
  { id: 'dog-walker', name: 'dog walker', tagline: 'passeio com seu cão', icon: 'paw-outline', popular: true, avgPrice: 60 },
  { id: 'banho-tosa', name: 'banho e tosa', tagline: 'a domicílio, pro seu pet', icon: 'cut-outline', popular: true, avgPrice: 90 },
  { id: 'marido-aluguel', name: 'marido de aluguel', tagline: 'pequenos reparos', icon: 'hammer-outline', popular: false, avgPrice: 180 },
  { id: 'diarista', name: 'diarista', tagline: 'limpeza completa', icon: 'sparkles-outline', popular: false, avgPrice: 160 },
  { id: 'eletricista', name: 'eletricista', tagline: 'instalação e reparo', icon: 'flash-outline', popular: false, avgPrice: 220 },
  { id: 'encanador', name: 'encanador', tagline: 'vazamento e desentupimento', icon: 'water-outline', popular: false, avgPrice: 200 },
  { id: 'pintor', name: 'pintor', tagline: 'parede nova em um dia', icon: 'color-palette-outline', popular: false, avgPrice: 240 },
  { id: 'jardineiro', name: 'jardineiro', tagline: 'poda e manutenção', icon: 'leaf-outline', popular: false, avgPrice: 150 },
  { id: 'montador', name: 'montador de móveis', tagline: 'monta e desmonta', icon: 'construct-outline', popular: false, avgPrice: 130 },
  { id: 'cuidador', name: 'cuidador de idosos', tagline: 'acompanhamento diário', icon: 'heart-outline', popular: false, avgPrice: 280 },
  { id: 'garcom', name: 'garçom', tagline: 'pro seu evento', icon: 'wine-outline', popular: false, avgPrice: 200 },
];

const R = (id: string, author: string, initials: string, stars: number, when: string, text: string, tags: any[]) =>
  ({ id, author, initials, stars, when, text, tags });

export const providers: Provider[] = [
  {
    id: 'p1', name: 'Carlos Mendes', initials: 'CM', categoryId: 'churrasqueiro', categoryName: 'churrasqueiro',
    rating: 4.9, reviewCount: 124, distanceKm: 1.2, dailyRate: 350, jobsDone: 312, yearsOnApp: 2,
    responseTime: 'Responde rápido', verified: true, bestOption: true, flame: 'chama',
    bio: 'Churrasqueiro há 12 anos. Levo a carvão, faço o corte na hora e deixo a área limpa. Atendo festas de 10 a 80 pessoas.',
    photos: ['#F2C4A8', '#E8D5A8', '#F0B896'],
    availableHours: ['10:00', '11:00', '12:00', '13:00', '16:00', '18:00'],
    reviews: [
      R('r1', 'Juliana P.', 'JP', 5, 'há 2 semanas', 'Chegou no horário, mandou muito bem no churrasco. A picanha estava perfeita e ainda deixou a churrasqueira limpa.', ['pontual', 'caprichoso', 'deixou tudo limpo']),
      R('r2', 'Marcos T.', 'MT', 5, 'há 1 mês', 'Contratei pro aniversário do meu pai. Todo mundo elogiou a carne. Já quero chamar de novo.', ['caprichoso', 'simpático']),
      R('r3', 'Renata S.', 'RS', 4, 'há 1 mês', 'Muito bom, só atrasou uns 15 minutinhos por conta do trânsito, mas avisou antes.', ['caprichoso', 'preço justo']),
      R('r4', 'Paulo H.', 'PH', 5, 'há 2 meses', 'Profissional de verdade. Trouxe o próprio carvão e os utensílios.', ['pontual', 'caprichoso']),
    ],
  },
  {
    id: 'p2', name: 'Marcão Brasa', initials: 'MB', categoryId: 'churrasqueiro', categoryName: 'churrasqueiro',
    rating: 4.6, reviewCount: 203, distanceKm: 6.1, dailyRate: 300, jobsDone: 480, yearsOnApp: 3,
    responseTime: 'Responde em 1h', verified: true, bestOption: true, flame: 'ouro',
    bio: 'Especialista em costela fogo de chão e cortes nobres. Levo ajudante para eventos acima de 50 pessoas.',
    photos: ['#E8C4A0', '#F2D2B8', '#DCC0A0'],
    availableHours: ['09:00', '11:00', '14:00', '17:00'],
    reviews: [
      R('r5', 'Fernando L.', 'FL', 5, 'há 1 semana', 'A costela de fogo de chão foi o destaque da festa. Vale cada centavo.', ['caprichoso', 'preço justo']),
      R('r6', 'Camila R.', 'CR', 4, 'há 3 semanas', 'Muito bom no geral, bem simpático com os convidados.', ['simpático']),
    ],
  },
  {
    id: 'p3', name: 'André Souza', initials: 'AS', categoryId: 'churrasqueiro', categoryName: 'churrasqueiro',
    rating: 4.7, reviewCount: 89, distanceKm: 2.8, dailyRate: 280, jobsDone: 156, yearsOnApp: 1,
    responseTime: 'Responde em 2h', verified: true, bestOption: false, flame: 'prata',
    bio: 'Churrasco tradicional e opções vegetarianas. Preço fechado, sem surpresa no final.',
    photos: ['#F0D0B0', '#E6C8A8', '#F4DCC4'],
    availableHours: ['10:00', '12:00', '15:00', '18:00'],
    reviews: [
      R('r7', 'Bruno M.', 'BM', 5, 'há 5 dias', 'Fez opção veg pra minha esposa sem cobrar a mais. Muito atencioso.', ['simpático', 'preço justo']),
      R('r8', 'Larissa D.', 'LD', 4, 'há 1 mês', 'Bom serviço, entregou o combinado.', ['pontual']),
    ],
  },
  {
    id: 'p4', name: 'Roberto Lima', initials: 'RL', categoryId: 'churrasqueiro', categoryName: 'churrasqueiro',
    rating: 5.0, reviewCount: 46, distanceKm: 4.5, dailyRate: 420, jobsDone: 98, yearsOnApp: 1,
    responseTime: 'Responde rápido', verified: true, bestOption: false, flame: 'chama',
    bio: 'Churrasco premium com cortes importados. Atendimento personalizado e cardápio combinado antes.',
    photos: ['#E0C0A0', '#EED8C0', '#E8CCB0'],
    availableHours: ['11:00', '13:00', '16:00'],
    reviews: [
      R('r9', 'Patrícia N.', 'PN', 5, 'há 2 semanas', 'Impecável do começo ao fim. Caro, mas entrega um nível de restaurante.', ['caprichoso', 'pontual']),
    ],
  },
  {
    id: 'p5', name: 'Bia Ferreira', initials: 'BF', categoryId: 'dog-walker', categoryName: 'dog walker',
    rating: 4.9, reviewCount: 167, distanceKm: 0.8, dailyRate: 60, jobsDone: 890, yearsOnApp: 2,
    responseTime: 'Responde rápido', verified: true, bestOption: true, flame: 'chama',
    bio: 'Passeio de 1h com relatório e fotos no fim. Atendo até 3 cães por vez, sempre da mesma casa.',
    photos: ['#C8DCC0', '#D8E8D0', '#C0D4B8'],
    availableHours: ['07:00', '09:00', '15:00', '17:00', '19:00'],
    reviews: [
      R('r10', 'Diego R.', 'DR', 5, 'há 3 dias', 'Manda foto do passeio todo dia. Meu cachorro ama ela.', ['pontual', 'simpático']),
      R('r11', 'Sofia A.', 'SA', 5, 'há 2 semanas', 'Cuidadosa demais, super recomendo.', ['caprichoso']),
    ],
  },
  {
    id: 'p6', name: 'Rafa Pet', initials: 'RP', categoryId: 'dog-walker', categoryName: 'dog walker',
    rating: 4.5, reviewCount: 72, distanceKm: 3.4, dailyRate: 45, jobsDone: 210, yearsOnApp: 1,
    responseTime: 'Responde em 3h', verified: true, bestOption: false, flame: 'prata',
    bio: 'Passeios em grupo ou individuais. Trabalho no Ibirapuera e região.',
    photos: ['#D0DCC8', '#C8D8C0', '#DCE8D4'],
    availableHours: ['08:00', '10:00', '16:00', '18:00'],
    reviews: [R('r12', 'Igor P.', 'IP', 4, 'há 1 mês', 'Bom preço e cumpre o horário.', ['preço justo', 'pontual'])],
  },
  {
    id: 'p7', name: 'Tosa da Nina', initials: 'TN', categoryId: 'banho-tosa', categoryName: 'banho e tosa',
    rating: 4.8, reviewCount: 134, distanceKm: 2.1, dailyRate: 90, jobsDone: 420, yearsOnApp: 2,
    responseTime: 'Responde rápido', verified: true, bestOption: true, flame: 'ouro',
    bio: 'Banho e tosa a domicílio com van equipada. Sem estresse pro pet, tudo feito na porta da sua casa.',
    photos: ['#DCC8DC', '#E8D8E8', '#D4C0D4'],
    availableHours: ['09:00', '11:00', '14:00', '16:00'],
    reviews: [
      R('r13', 'Helena C.', 'HC', 5, 'há 1 semana', 'A van é impecável e a Nina tem uma paciência enorme com o meu shih tzu.', ['caprichoso', 'simpático']),
    ],
  },
  {
    id: 'p8', name: 'Seu Zé Reparos', initials: 'ZR', categoryId: 'marido-aluguel', categoryName: 'marido de aluguel',
    rating: 4.7, reviewCount: 256, distanceKm: 1.9, dailyRate: 180, jobsDone: 640, yearsOnApp: 3,
    responseTime: 'Responde em 1h', verified: true, bestOption: true, flame: 'ouro',
    bio: 'Elétrica, hidráulica, furo em parede, montagem. Levo minhas próprias ferramentas.',
    photos: ['#D0D0DC', '#C8C8D4', '#DCDCE8'],
    availableHours: ['08:00', '10:00', '13:00', '15:00'],
    reviews: [
      R('r14', 'Vera L.', 'VL', 5, 'há 4 dias', 'Resolveu 5 probleminhas da casa em uma tarde só.', ['resolveu rápido', 'preço justo']),
    ],
  },
  {
    id: 'p9', name: 'Dona Cida', initials: 'DC', categoryId: 'diarista', categoryName: 'diarista',
    rating: 4.9, reviewCount: 312, distanceKm: 3.0, dailyRate: 160, jobsDone: 1120, yearsOnApp: 4,
    responseTime: 'Responde rápido', verified: true, bestOption: true, flame: 'chama',
    bio: 'Faxina completa, passo roupa e organizo armários. Trabalho com produtos próprios se precisar.',
    photos: ['#DCD8C8', '#E8E4D4', '#D4D0C0'],
    availableHours: ['08:00', '13:00'],
    reviews: [
      R('r15', 'Ana Lima', 'AL', 5, 'há 3 semanas', 'Deixa a casa brilhando. Já é da família.', ['caprichoso', 'deixou tudo limpo']),
    ],
  },
  {
    id: 'p10', name: 'Elétrica Silva', initials: 'ES', categoryId: 'eletricista', categoryName: 'eletricista',
    rating: 4.6, reviewCount: 98, distanceKm: 5.2, dailyRate: 220, jobsDone: 280, yearsOnApp: 2,
    responseTime: 'Responde em 2h', verified: true, bestOption: false, flame: 'prata',
    bio: 'Instalação de chuveiro, tomada, disjuntor e troca de fiação. Emito laudo quando necessário.',
    photos: ['#DCD4C0', '#E8E0CC', '#D0C8B4'],
    availableHours: ['09:00', '11:00', '14:00'],
    reviews: [R('r16', 'Tiago F.', 'TF', 5, 'há 1 semana', 'Trocou toda a fiação do apê. Trabalho limpo.', ['caprichoso'])],
  },
];

export const addresses: Address[] = [
  { id: 'a1', label: 'casa', street: 'Rua Joaquim Távora, 820', detail: 'Apto 74, bloco B', city: 'Vila Mariana, SP', isDefault: true },
  { id: 'a2', label: 'trabalho', street: 'Av. Paulista, 1500', detail: '12º andar', city: 'Bela Vista, SP', isDefault: false },
  { id: 'a3', label: 'casa da minha mãe', street: 'Rua Domingos de Morais, 240', detail: 'Casa 2', city: 'Vila Mariana, SP', isDefault: false },
];

export const paymentMethods: PaymentMethod[] = [
  { id: 'pm1', kind: 'card', brand: 'Visa', last4: '1234', expiry: '08/28', isDefault: true },
  { id: 'pm2', kind: 'card', brand: 'Mastercard', last4: '7788', expiry: '02/27', isDefault: false },
  { id: 'pm3', kind: 'pix', brand: 'Pix', note: 'Aprovação na hora', isDefault: false },
];

export const orders: Order[] = [
  {
    id: 'o1', providerId: 'p1', providerName: 'Carlos Mendes', providerInitials: 'CM', categoryName: 'churrasqueiro',
    date: 'sáb, 20 de jun', isoDate: '2026-06-20', time: '12:00', addressId: 'a1', addressLabel: 'Vila Mariana, SP',
    dailyRate: 350, serviceFee: 18, total: 368, paymentMethodId: 'pm1', status: 'aceito',
    createdAt: 'há 2 dias', proofPhotos: [],
  },
  {
    id: 'o2', providerId: 'p5', providerName: 'Bia Ferreira', providerInitials: 'BF', categoryName: 'dog walker',
    date: 'seg, 22 de jun', isoDate: '2026-06-22', time: '07:00', addressId: 'a1', addressLabel: 'Vila Mariana, SP',
    dailyRate: 60, serviceFee: 3, total: 63, paymentMethodId: 'pm1', status: 'aguardando',
    createdAt: 'há 3 horas', proofPhotos: [],
  },
  {
    id: 'o3', providerId: 'p9', providerName: 'Dona Cida', providerInitials: 'DC', categoryName: 'diarista',
    date: 'qui, 04 de jun', isoDate: '2026-06-04', time: '08:00', addressId: 'a1', addressLabel: 'Vila Mariana, SP',
    dailyRate: 160, serviceFee: 8, total: 168, paymentMethodId: 'pm1', status: 'avaliado',
    createdAt: 'há 3 semanas', proofPhotos: ['#DCD8C8', '#E8E4D4'],
    clientRating: 5, clientReviewText: 'Deixa a casa brilhando. Já é da família.', clientReviewTags: ['caprichoso', 'deixou tudo limpo'],
  },
  {
    id: 'o4', providerId: 'p8', providerName: 'Seu Zé Reparos', providerInitials: 'ZR', categoryName: 'marido de aluguel',
    date: 'ter, 12 de mai', isoDate: '2026-05-12', time: '10:00', addressId: 'a2', addressLabel: 'Bela Vista, SP',
    dailyRate: 180, serviceFee: 9, total: 189, paymentMethodId: 'pm2', status: 'concluido',
    createdAt: 'há 2 meses', proofPhotos: ['#D0D0DC', '#C8C8D4', '#DCDCE8'],
  },
  {
    id: 'o5', providerId: 'p7', providerName: 'Tosa da Nina', providerInitials: 'TN', categoryName: 'banho e tosa',
    date: 'sex, 02 de mai', isoDate: '2026-05-02', time: '14:00', addressId: 'a1', addressLabel: 'Vila Mariana, SP',
    dailyRate: 90, serviceFee: 5, total: 95, paymentMethodId: 'pm1', status: 'cancelado',
    createdAt: 'há 3 meses', proofPhotos: [],
  },
];

export const favoriteProviderIds = ['p1', 'p5', 'p9'];

export const chatMessages: Record<string, ChatMessage[]> = {
  p1: [
    { id: 'm1', from: 'cliente', text: 'Oi Carlos! Seria pra uns 25 convidados, no sábado. O valor de R$ 350 cobre isso?', at: '10:12' },
    { id: 'm2', from: 'prestador', text: 'Boa tarde! Cobre sim, até 30 pessoas é a diária normal. Acima disso eu levo um ajudante e fica R$ 480.', at: '10:15' },
    { id: 'm3', from: 'cliente', text: 'Perfeito. A carne eu compro ou você traz?', at: '10:16' },
    { id: 'm4', from: 'prestador', text: 'Pode deixar comigo se preferir, aí eu passo a nota do açougue. Ou você compra e eu só preparo, como for melhor.', at: '10:18' },
  ],
  p5: [
    { id: 'm5', from: 'cliente', text: 'Oi Bia, você atende na Joaquim Távora?', at: '08:40' },
    { id: 'm6', from: 'prestador', text: 'Atendo sim! É pertinho de mim. Que horário você prefere?', at: '08:41' },
  ],
};

export const notifications: AppNotification[] = [
  { id: 'n1', icon: 'checkmark-circle-outline', title: 'Carlos aceitou seu pedido', body: 'Churrasco sáb, 20 de jun às 12:00 confirmado.', when: 'há 2 horas', read: false, audience: 'cliente' },
  { id: 'n2', icon: 'star-outline', title: 'Avalie a Dona Cida', body: 'Como foi a faxina de quinta? Sua nota ajuda outros clientes.', when: 'há 1 dia', read: false, audience: 'cliente' },
  { id: 'n3', icon: 'pricetag-outline', title: 'Bia Ferreira baixou o preço', body: 'Dog walker agora por R$ 60 a diária na sua região.', when: 'há 3 dias', read: true, audience: 'cliente' },
  { id: 'n4', icon: 'flame-outline', title: 'Você chegou no nível chama!', body: 'Sua nota passou de 4,8. Agora você aparece com borda em chama.', when: 'há 1 semana', read: true, audience: 'prestador' },
  { id: 'n5', icon: 'notifications-outline', title: 'Novo pedido de Ana Lima', body: 'Churrasco para 25 pessoas, sáb 20 de jun às 12:00.', when: 'há 2 horas', read: false, audience: 'prestador' },
  { id: 'n6', icon: 'cash-outline', title: 'Pagamento liberado', body: 'R$ 185,22 caíram no seu saldo referente ao serviço de 12 de mai.', when: 'há 4 dias', read: true, audience: 'prestador' },
];

export const earnings: EarningEntry[] = [
  { id: 'e1', label: 'Churrasco · Ana Lima', date: '12 de jun', gross: 350, commission: 7, net: 343, status: 'disponivel' },
  { id: 'e2', label: 'Churrasco · Marcos T.', date: '08 de jun', gross: 350, commission: 7, net: 343, status: 'disponivel' },
  { id: 'e3', label: 'Churrasco · Renata S.', date: '01 de jun', gross: 420, commission: 8.4, net: 411.6, status: 'sacado' },
  { id: 'e4', label: 'Churrasco · Paulo H.', date: '24 de mai', gross: 350, commission: 7, net: 343, status: 'sacado' },
  { id: 'e5', label: 'Churrasco · Juliana P.', date: '20 de jun', gross: 350, commission: 7, net: 343, status: 'pendente' },
];

export const providerOrders: Order[] = [
  {
    id: 'po1', providerId: 'p1', providerName: 'Ana Lima', providerInitials: 'AL', categoryName: 'churrasco para 25 pessoas',
    date: 'sáb, 20 de jun', isoDate: '2026-06-20', time: '12:00', addressId: 'a1', addressLabel: 'Vila Mariana, SP',
    dailyRate: 350, serviceFee: 18, total: 368, paymentMethodId: 'pm1', status: 'aguardando', createdAt: 'há 2 horas', proofPhotos: [],
  },
  {
    id: 'po2', providerId: 'p1', providerName: 'Marcos Teixeira', providerInitials: 'MT', categoryName: 'churrasco para 40 pessoas',
    date: 'dom, 21 de jun', isoDate: '2026-06-21', time: '11:00', addressId: 'a2', addressLabel: 'Moema, SP',
    dailyRate: 480, serviceFee: 24, total: 504, paymentMethodId: 'pm1', status: 'aguardando', createdAt: 'há 5 horas', proofPhotos: [],
  },
  {
    id: 'po3', providerId: 'p1', providerName: 'Juliana Prado', providerInitials: 'JP', categoryName: 'churrasco para 15 pessoas',
    date: 'sex, 19 de jun', isoDate: '2026-06-19', time: '18:00', addressId: 'a1', addressLabel: 'Saúde, SP',
    dailyRate: 350, serviceFee: 18, total: 368, paymentMethodId: 'pm1', status: 'em_andamento', createdAt: 'há 1 dia', proofPhotos: [],
  },
  {
    id: 'po4', providerId: 'p1', providerName: 'Paulo Henrique', providerInitials: 'PH', categoryName: 'churrasco para 20 pessoas',
    date: 'sáb, 12 de jun', isoDate: '2026-06-12', time: '13:00', addressId: 'a1', addressLabel: 'Ipiranga, SP',
    dailyRate: 350, serviceFee: 18, total: 368, paymentMethodId: 'pm1', status: 'avaliado', createdAt: 'há 1 semana',
    proofPhotos: ['#F2C4A8', '#E8D5A8'], clientRating: 5,
  },
];

export const faq: FaqItem[] = [
  { id: 'f1', audience: 'cliente', q: 'Como funciona o pagamento?', a: 'Ao agendar, o valor é pré-autorizado no seu cartão mas não é cobrado ainda. Ele fica retido e só é liberado para o profissional quando o serviço é concluído e você confirma. Se algo der errado, você pode abrir uma disputa antes disso.' },
  { id: 'f2', audience: 'cliente', q: 'E se o profissional não aparecer?', a: 'Você não paga nada. O pedido é cancelado automaticamente e a pré-autorização é liberada em até 7 dias úteis, dependendo do seu banco.' },
  { id: 'f3', audience: 'cliente', q: 'Os profissionais são verificados?', a: 'Sim. Todo profissional passa por checagem de documentos e certidão de antecedentes criminais antes de aparecer no app. O selo azul ao lado do nome confirma a verificação.' },
  { id: 'f4', audience: 'cliente', q: 'O que significa a borda em chama?', a: 'É o nível do profissional no Chama. Quanto melhor a média das notas, mais quente fica a borda do avatar — de novato até chama. Profissionais com nota alta aparecem primeiro nas buscas.' },
  { id: 'f5', audience: 'cliente', q: 'Posso cancelar um agendamento?', a: 'Pode. Cancelamentos com mais de 24h de antecedência são gratuitos. Abaixo disso, é cobrada uma taxa de 20% para compensar o profissional que reservou a data.' },
  { id: 'f6', audience: 'cliente', q: 'Não tem profissional na minha região', a: 'Entre na lista de espera da categoria. Assim que alguém se cadastrar e for aprovado perto de você, a gente te avisa por notificação.' },
  { id: 'f7', audience: 'prestador', q: 'Quanto o Chama cobra?', a: 'A comissão é de 2% sobre o valor de cada serviço concluído. Não tem mensalidade, nem taxa de cadastro, nem cobrança por orçamento enviado.' },
  { id: 'f8', audience: 'prestador', q: 'Quando recebo o dinheiro?', a: 'O valor entra como pendente assim que o serviço é concluído e vira saldo disponível após a confirmação do cliente (ou automaticamente em 24h). O saque cai via Pix em até 1 dia útil.' },
  { id: 'f9', audience: 'prestador', q: 'Quanto tempo demora a análise?', a: 'Até 48 horas. A gente confere seus documentos e a certidão de antecedentes. Se faltar alguma coisa, você recebe uma notificação pedindo o reenvio.' },
  { id: 'f10', audience: 'ambos', q: 'Como falo com o suporte?', a: 'Pelo chat dentro do app, de segunda a sábado das 8h às 20h. Casos de disputa têm resposta em até 24h.' },
];

export const waitlistRegions = ['Vila Mariana, SP', 'Bela Vista, SP', 'Moema, SP'];

export const flameLabel: Record<string, string> = {
  novato: 'novato', bronze: 'bronze', prata: 'prata', ouro: 'ouro', chama: 'chama',
};

export const flameColor: Record<string, string> = {
  novato: '#A8A29E', bronze: '#B87333', prata: '#94A3B8', ouro: '#E8A33D', chama: '#D4562A',
};

/** Datas do seletor de agendamento — fixas, já que é mock. */
export const scheduleDays = [
  { weekday: 'qua', day: '17', iso: '2026-06-17' },
  { weekday: 'qui', day: '18', iso: '2026-06-18' },
  { weekday: 'sex', day: '19', iso: '2026-06-19' },
  { weekday: 'sáb', day: '20', iso: '2026-06-20' },
  { weekday: 'dom', day: '21', iso: '2026-06-21' },
  { weekday: 'seg', day: '22', iso: '2026-06-22' },
  { weekday: 'ter', day: '23', iso: '2026-06-23' },
];

export const monthLabel: Record<string, string> = {
  '01': 'jan', '02': 'fev', '03': 'mar', '04': 'abr', '05': 'mai', '06': 'jun',
  '07': 'jul', '08': 'ago', '09': 'set', '10': 'out', '11': 'nov', '12': 'dez',
};
