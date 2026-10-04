import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import * as mock from '@/data/mock';
import type {
  Address, AppNotification, EarningEntry, Order, OrderStatus,
  PaymentMethod, ReviewTag, WaitlistEntry,
} from '@/data/types';

/**
 * Camada de dados mock. Tudo vive em memória — ao recarregar o app, volta ao
 * estado inicial. Quando entrar backend de verdade, só este arquivo muda:
 * as telas continuam consumindo os mesmos métodos.
 */

type BookingDraft = {
  providerId?: string;
  isoDate?: string;
  dateLabel?: string;
  time?: string;
  addressId?: string;
  paymentMethodId?: string;
};

type AppState = {
  orders: Order[];
  addresses: Address[];
  payments: PaymentMethod[];
  favorites: string[];
  notifications: AppNotification[];
  waitlist: WaitlistEntry[];
  earnings: EarningEntry[];
  providerOrders: Order[];
  draft: BookingDraft;
  providerApproved: boolean;
};

type AppActions = {
  setDraft: (patch: BookingDraft) => void;
  resetDraft: () => void;
  placeOrder: () => Order;
  getOrder: (id: string) => Order | undefined;
  advanceOrder: (id: string, status: OrderStatus) => void;
  rateOrder: (id: string, stars: number, tags: ReviewTag[], text: string) => void;
  disputeOrder: (id: string, reason: string) => void;
  cancelOrder: (id: string) => void;
  addAddress: (a: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, patch: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addCard: (brand: string, last4: string, expiry: string) => void;
  removePayment: (id: string) => void;
  setDefaultPayment: (id: string) => void;
  toggleFavorite: (providerId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  joinWaitlist: (categoryId: string, categoryName: string, region: string) => void;
  acceptProviderOrder: (id: string) => void;
  startProviderOrder: (id: string) => void;
  declineProviderOrder: (id: string) => void;
  addProof: (id: string, color: string) => void;
  finishProviderOrder: (id: string) => void;
  withdraw: (amount: number) => void;
  approveProvider: () => void;
};

const AppContext = createContext<(AppState & AppActions) | null>(null);

let idSeq = 100;
const nextId = (prefix: string) => `${prefix}${++idSeq}`;

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(mock.orders);
  const [addresses, setAddresses] = useState<Address[]>(mock.addresses);
  const [payments, setPayments] = useState<PaymentMethod[]>(mock.paymentMethods);
  const [favorites, setFavorites] = useState<string[]>(mock.favoriteProviderIds);
  const [notifications, setNotifications] = useState<AppNotification[]>(mock.notifications);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [earnings, setEarnings] = useState<EarningEntry[]>(mock.earnings);
  const [providerOrders, setProviderOrders] = useState<Order[]>(mock.providerOrders);
  const [draft, setDraftState] = useState<BookingDraft>({});
  const [providerApproved, setProviderApproved] = useState(false);

  const setDraft = useCallback((patch: BookingDraft) => {
    setDraftState((d) => ({ ...d, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraftState({}), []);

  const placeOrder = useCallback((): Order => {
    const provider = mock.providers.find((p) => p.id === draft.providerId)!;
    const address = addresses.find((a) => a.id === draft.addressId) ?? addresses[0];
    const fee = Math.round(provider.dailyRate * mock.SERVICE_FEE_RATE * 100) / 100;
    const order: Order = {
      id: nextId('o'),
      providerId: provider.id,
      providerName: provider.name,
      providerInitials: provider.initials,
      categoryName: provider.categoryName,
      date: draft.dateLabel ?? 'sáb, 20 de jun',
      isoDate: draft.isoDate ?? '2026-06-20',
      time: draft.time ?? '12:00',
      addressId: address.id,
      addressLabel: address.city,
      dailyRate: provider.dailyRate,
      serviceFee: fee,
      total: provider.dailyRate + fee,
      paymentMethodId: draft.paymentMethodId ?? payments.find((p) => p.isDefault)!.id,
      status: 'aguardando',
      createdAt: 'agora',
      proofPhotos: [],
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  }, [draft, addresses, payments]);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id) ?? providerOrders.find((o) => o.id === id),
    [orders, providerOrders],
  );

  const patchOrder = (id: string, patch: Partial<Order>) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const advanceOrder = useCallback((id: string, status: OrderStatus) => {
    patchOrder(id, { status });
  }, []);

  const rateOrder = useCallback((id: string, stars: number, tags: ReviewTag[], text: string) => {
    patchOrder(id, { status: 'avaliado', clientRating: stars, clientReviewTags: tags, clientReviewText: text });
  }, []);

  const disputeOrder = useCallback((id: string, reason: string) => {
    patchOrder(id, { status: 'disputa', disputeReason: reason });
  }, []);

  const cancelOrder = useCallback((id: string) => {
    patchOrder(id, { status: 'cancelado' });
  }, []);

  const addAddress = useCallback((a: Omit<Address, 'id'>) => {
    const created = { ...a, id: nextId('a') };
    setAddresses((prev) =>
      created.isDefault
        ? [...prev.map((x) => ({ ...x, isDefault: false })), created]
        : [...prev, created],
    );
  }, []);

  const updateAddress = useCallback((id: string, patch: Partial<Address>) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const addCard = useCallback((brand: string, last4: string, expiry: string) => {
    setPayments((prev) => [
      ...prev.filter((p) => p.kind === 'card'),
      { id: nextId('pm'), kind: 'card', brand, last4, expiry, isDefault: false },
      ...prev.filter((p) => p.kind !== 'card'),
    ]);
  }, []);

  const removePayment = useCallback((id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setDefaultPayment = useCallback((id: string) => {
    setPayments((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
  }, []);

  const toggleFavorite = useCallback((providerId: string) => {
    setFavorites((prev) =>
      prev.includes(providerId) ? prev.filter((p) => p !== providerId) : [...prev, providerId],
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const joinWaitlist = useCallback((categoryId: string, categoryName: string, region: string) => {
    setWaitlist((prev) => [
      ...prev,
      { id: nextId('w'), categoryId, categoryName, region, when: 'agora' },
    ]);
  }, []);

  const patchProviderOrder = (id: string, patch: Partial<Order>) =>
    setProviderOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const acceptProviderOrder = useCallback((id: string) => patchProviderOrder(id, { status: 'aceito' }), []);
  const startProviderOrder = useCallback((id: string) => patchProviderOrder(id, { status: 'em_andamento' }), []);
  const declineProviderOrder = useCallback((id: string) => patchProviderOrder(id, { status: 'cancelado' }), []);

  const addProof = useCallback((id: string, color: string) => {
    setProviderOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, proofPhotos: [...o.proofPhotos, color] } : o)),
    );
  }, []);

  const finishProviderOrder = useCallback((id: string) => {
    setProviderOrders((prev) => {
      const order = prev.find((o) => o.id === id);
      if (order) {
        const commission = Math.round(order.dailyRate * mock.COMMISSION_RATE * 100) / 100;
        setEarnings((e) => [
          {
            id: nextId('e'),
            label: `${order.categoryName} · ${order.providerName}`,
            date: order.date.split(', ')[1] ?? order.date,
            gross: order.dailyRate,
            commission,
            net: Math.round((order.dailyRate - commission) * 100) / 100,
            status: 'pendente',
          },
          ...e,
        ]);
      }
      return prev.map((o) => (o.id === id ? { ...o, status: 'aguardando_confirmacao' } : o));
    });
  }, []);

  const withdraw = useCallback((amount: number) => {
    setEarnings((prev) =>
      prev.map((e) => (e.status === 'disponivel' ? { ...e, status: 'sacado' } : e)),
    );
    setNotifications((prev) => [
      {
        id: nextId('n'),
        icon: 'cash-outline',
        title: 'Saque solicitado',
        body: `${amount.toFixed(2).replace('.', ',')} a caminho da sua conta via Pix. Cai em até 1 dia útil.`,
        when: 'agora',
        read: false,
        audience: 'prestador',
      },
      ...prev,
    ]);
  }, []);

  const approveProvider = useCallback(() => setProviderApproved(true), []);

  const value = useMemo(
    () => ({
      orders, addresses, payments, favorites, notifications, waitlist, earnings,
      providerOrders, draft, providerApproved,
      setDraft, resetDraft, placeOrder, getOrder, advanceOrder, rateOrder, disputeOrder,
      cancelOrder, addAddress, updateAddress, removeAddress, setDefaultAddress, addCard,
      removePayment, setDefaultPayment, toggleFavorite, markNotificationRead,
      markAllNotificationsRead, joinWaitlist, acceptProviderOrder, startProviderOrder, declineProviderOrder,
      addProof, finishProviderOrder, withdraw, approveProvider,
    }),
    [
      orders, addresses, payments, favorites, notifications, waitlist, earnings,
      providerOrders, draft, providerApproved, setDraft, resetDraft, placeOrder, getOrder,
      advanceOrder, rateOrder, disputeOrder, cancelOrder, addAddress, updateAddress,
      removeAddress, setDefaultAddress, addCard, removePayment, setDefaultPayment,
      toggleFavorite, markNotificationRead, markAllNotificationsRead, joinWaitlist,
      acceptProviderOrder, startProviderOrder, declineProviderOrder, addProof, finishProviderOrder,
      withdraw, approveProvider,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>');
  return ctx;
}
