import React from 'react';
import {
  View, Text, Pressable, StyleSheet, TextInput, ScrollView, Modal,
  ActivityIndicator, ViewStyle, TextStyle, StyleProp,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, radius, font, shadow, spacing } from '@/theme';
import { flameColor } from '@/data/mock';

/* ---------------------------------------------------------------- Screen */

export function Screen({
  children, style, scroll = false, padded = true, bg = colors.bg,
}: {
  children: React.ReactNode; style?: StyleProp<ViewStyle>;
  scroll?: boolean; padded?: boolean; bg?: string;
}) {
  const inner = [padded && { paddingHorizontal: spacing(4.5) }, style];
  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: bg }}
        contentContainerStyle={[{ paddingBottom: spacing(8) }, inner]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[{ flex: 1, backgroundColor: bg }, inner]}>{children}</View>;
}

/* ---------------------------------------------------------------- Header */

export function Header({
  title, subtitle, onBack, right, large = false, flat,
}: {
  title: string; subtitle?: string; onBack?: () => void;
  right?: React.ReactNode; large?: boolean;
  /** @deprecated mantido por compatibilidade — o cabeçalho é claro por padrão agora */
  flat?: boolean;
}) {
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: colors.bg }}>
      <View style={s.header}>
        <View style={s.headerRow}>
          {onBack !== undefined && (
            <Pressable onPress={onBack} hitSlop={10} style={s.roundBtn}>
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </Pressable>
          )}
          <View style={{ flex: 1 }}>
            {title ? (
              <Text style={large ? s.headerTitleLarge : s.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
            {subtitle ? <Text style={s.headerSubtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      </View>
    </SafeAreaView>
  );
}

/** Botão circular do cabeçalho — use no slot `right` do Header. */
export function HeaderAction({
  icon, onPress, tone = colors.text, bg = colors.surface,
}: {
  icon: keyof typeof Ionicons.glyphMap; onPress?: () => void; tone?: string; bg?: string;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={[s.roundBtn, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={19} color={tone} />
    </Pressable>
  );
}

/** Header padrão de tela interna: volta na pilha do expo-router. */
export function BackHeader(props: Omit<React.ComponentProps<typeof Header>, 'onBack'>) {
  return <Header {...props} onBack={() => router.back()} />;
}

/* ---------------------------------------------------------------- Button */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  label, onPress, variant = 'primary', icon, disabled, loading, style, full = true,
}: {
  label: string; onPress?: () => void; variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap; disabled?: boolean; loading?: boolean;
  style?: StyleProp<ViewStyle>; full?: boolean;
}) {
  const v = buttonVariants[variant];
  const off = disabled || loading;
  return (
    <Pressable
      onPress={off ? undefined : onPress}
      style={({ pressed }) => [
        s.btn, v.container, full && { alignSelf: 'stretch' },
        pressed && !off && { opacity: 0.85 }, off && { opacity: 0.45 }, style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.label.color as string} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={v.label.color as string} />}
          <Text style={[s.btnLabel, v.label]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const buttonVariants: Record<ButtonVariant, { container: ViewStyle; label: TextStyle }> = {
  primary: { container: { backgroundColor: colors.brand }, label: { color: colors.onBrand } },
  secondary: {
    container: { backgroundColor: colors.bg, borderWidth: 1.5, borderColor: colors.brand },
    label: { color: colors.brand },
  },
  ghost: { container: { backgroundColor: 'transparent' }, label: { color: colors.textMuted } },
  danger: { container: { backgroundColor: colors.dangerWash }, label: { color: colors.danger } },
};

/** Barra fixa no rodapé para o CTA principal da tela. */
export function BottomBar({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bottomBar, shadow.raised, { paddingBottom: Math.max(insets.bottom, spacing(4)) }]}>
      {children}
    </View>
  );
}

/* ---------------------------------------------------------------- Avatar */

export function Avatar({
  initials, size = 48, flame, color = colors.brandWash, textColor = colors.brand,
}: {
  initials: string; size?: number; flame?: string; color?: string; textColor?: string;
}) {
  const ring = flame ? flameColor[flame] : undefined;
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size / 2, backgroundColor: color,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: ring ? 2.5 : 0, borderColor: ring,
      }}
    >
      <Text style={{ fontSize: size * 0.36, fontWeight: '700', color: textColor }}>{initials}</Text>
    </View>
  );
}

/* ----------------------------------------------------------------- Stars */

export function Stars({ value, size = 14, showValue = false }: { value: number; size?: number; showValue?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={value >= i ? 'star' : value >= i - 0.5 ? 'star-half' : 'star-outline'}
          size={size}
          color={colors.star}
        />
      ))}
      {showValue && <Text style={[font.small, { marginLeft: 4 }]}>{value.toFixed(1).replace('.', ',')}</Text>}
    </View>
  );
}

/* ------------------------------------------------------------------ Chip */

export function Chip({
  label, active, onPress, icon, tone = 'neutral',
}: {
  label: string; active?: boolean; onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap; tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
}) {
  const tones = {
    neutral: { bg: colors.bg, fg: colors.text, border: colors.border },
    brand: { bg: colors.brandWash, fg: colors.brand, border: colors.brandLight },
    success: { bg: colors.successWash, fg: colors.success, border: colors.successWash },
    warning: { bg: colors.warningWash, fg: colors.warning, border: colors.warningWash },
    danger: { bg: colors.dangerWash, fg: colors.danger, border: colors.dangerWash },
  }[tone];
  const bg = active ? colors.brand : tones.bg;
  const fg = active ? colors.onBrand : tones.fg;
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={[s.chip, { backgroundColor: bg, borderColor: active ? colors.brand : tones.border }]}
    >
      {icon && <Ionicons name={icon} size={13} color={fg} />}
      <Text style={{ fontSize: 13, fontWeight: '600', color: fg }}>{label}</Text>
    </Wrapper>
  );
}

/* ------------------------------------------------------------------ Card */

export function Card({
  children, onPress, style, padded = true,
}: {
  children: React.ReactNode; onPress?: () => void;
  style?: StyleProp<ViewStyle>; padded?: boolean;
}) {
  // View não aceita style como função — só Pressable. Passar função para View
  // faz o RN descartar TODO o estilo, então os dois caminhos são separados.
  const base = [s.card, padded && { padding: spacing(4) }, style];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.9 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

/* --------------------------------------------------------------- ListRow */

export function ListRow({
  icon, label, sublabel, onPress, right, tone = colors.brand, last = false,
}: {
  icon?: keyof typeof Ionicons.glyphMap; label: string; sublabel?: string;
  onPress?: () => void; right?: React.ReactNode; tone?: string; last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.listRow, pressed && { backgroundColor: colors.surface }]}
    >
      {icon && (
        <View style={[s.listIcon, { backgroundColor: tone + '14' }]}>
          <Ionicons name={icon} size={19} color={tone} />
        </View>
      )}
      {/* A borda fica no corpo, não na linha inteira: assim o divisor começa
          alinhado com o texto em vez de cortar a tela de ponta a ponta. */}
      <View style={[s.listBody, !last && s.listBodyBorder]}>
        <View style={{ flex: 1 }}>
          <Text style={font.bodyStrong}>{label}</Text>
          {sublabel ? <Text style={[font.small, { marginTop: 2 }]}>{sublabel}</Text> : null}
        </View>
        {right ?? (onPress ? <Ionicons name="chevron-forward" size={18} color={colors.textFaint} /> : null)}
      </View>
    </Pressable>
  );
}

/* ----------------------------------------------------------------- Field */

export function Field({
  label, value, onChangeText, placeholder, keyboardType, secureTextEntry,
  multiline, hint, autoCapitalize, maxLength,
}: {
  label?: string; value: string; onChangeText: (t: string) => void; placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'; secureTextEntry?: boolean;
  multiline?: boolean; hint?: string; autoCapitalize?: 'none' | 'sentences' | 'words'; maxLength?: number;
}) {
  return (
    <View style={{ marginBottom: spacing(4) }}>
      {label ? <Text style={[font.small, { marginBottom: spacing(1.5), color: colors.text, fontWeight: '600' }]}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        style={[s.input, multiline && { height: 96, textAlignVertical: 'top', paddingTop: spacing(3) }]}
      />
      {hint ? <Text style={[font.tiny, { marginTop: spacing(1.5) }]}>{hint}</Text> : null}
    </View>
  );
}

/* ------------------------------------------------------------ EmptyState */

export function EmptyState({
  icon = 'file-tray-outline', title, body, action,
}: {
  icon?: keyof typeof Ionicons.glyphMap; title: string; body?: string; action?: React.ReactNode;
}) {
  return (
    <View style={s.empty}>
      <View style={s.emptyIcon}>
        <Ionicons name={icon} size={30} color={colors.brandLight} />
      </View>
      <Text style={[font.h3, { textAlign: 'center' }]}>{title}</Text>
      {body ? <Text style={[font.small, { textAlign: 'center', marginTop: spacing(2), lineHeight: 20 }]}>{body}</Text> : null}
      {action ? <View style={{ marginTop: spacing(5), alignSelf: 'stretch' }}>{action}</View> : null}
    </View>
  );
}

/* ------------------------------------------------------------ misc bits */

export function SectionTitle({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[font.h3, { marginTop: spacing(6), marginBottom: spacing(3) }, style]}>{children}</Text>;
}

export function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing(3) }} />;
}

export function MoneyRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={s.moneyRow}>
      <Text style={strong ? font.bodyStrong : font.small}>{label}</Text>
      <Text style={[strong ? font.h3 : font.body, strong && { color: colors.text }]}>{value}</Text>
    </View>
  );
}

export function Notice({
  children, tone = 'warning', icon = 'shield-checkmark-outline',
}: {
  children: React.ReactNode; tone?: 'warning' | 'success' | 'info' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const map = {
    warning: { bg: colors.warningWash, fg: colors.warning },
    success: { bg: colors.successWash, fg: colors.success },
    info: { bg: colors.brandWash, fg: colors.brand },
    danger: { bg: colors.dangerWash, fg: colors.danger },
  }[tone];
  return (
    <View style={[s.notice, { backgroundColor: map.bg }]}>
      <Ionicons name={icon} size={17} color={map.fg} />
      <Text style={{ flex: 1, fontSize: 13, lineHeight: 19, color: map.fg }}>{children}</Text>
    </View>
  );
}

/** Retângulo colorido que faz as vezes de foto — o mock não usa assets externos. */
export function PhotoBox({ color, size, style }: { color: string; size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        { backgroundColor: color, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
        size ? { width: size, height: size } : { flex: 1, aspectRatio: 1 },
        style,
      ]}
    >
      <Ionicons name="image-outline" size={20} color="rgba(0,0,0,0.25)" />
    </View>
  );
}

export function Stat({ value, label, tone }: { value: string; label: string; tone?: string }) {
  return (
    <View style={s.stat}>
      <Text style={[font.h3, { color: tone ?? colors.text }]}>{value}</Text>
      <Text style={[font.tiny, { textAlign: 'center', marginTop: 2 }]}>{label}</Text>
    </View>
  );
}

export function Row({ children, gap = 2, style }: { children: React.ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap: spacing(gap) }, style]}>{children}</View>;
}

/* ---------------------------------------------------------------- styles */

const s = StyleSheet.create({
  header: { paddingHorizontal: spacing(4.5), paddingTop: spacing(2), paddingBottom: spacing(4) },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(3) },
  roundBtn: {
    width: 42, height: 42, borderRadius: radius.round, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  headerTitleLarge: { fontSize: 26, fontWeight: '700', color: colors.text },
  headerSubtitle: { fontSize: 12.5, color: colors.textMuted, marginTop: 2 },

  btn: {
    height: 54, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: spacing(2), paddingHorizontal: spacing(5),
  },
  btnLabel: { fontSize: 16, fontWeight: '700' },

  bottomBar: {
    paddingHorizontal: spacing(4.5), paddingTop: spacing(3.5),
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing(2),
  },

  chip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(1.5),
    paddingHorizontal: spacing(3.5), paddingVertical: spacing(2),
    borderRadius: radius.pill, borderWidth: 1,
  },

  card: {
    backgroundColor: colors.bg, borderRadius: radius.card, borderWidth: 1,
    borderColor: colors.border, overflow: 'hidden', ...shadow.card,
  },

  listRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3.5),
    paddingLeft: spacing(4), paddingRight: spacing(4.5),
  },
  listIcon: {
    width: 38, height: 38, borderRadius: radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  listBody: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing(3),
    paddingVertical: spacing(4),
  },
  listBodyBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },

  input: {
    height: 54, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg,
    paddingHorizontal: spacing(4), fontSize: 15, color: colors.text, backgroundColor: colors.surface,
  },

  empty: { alignItems: 'center', paddingVertical: spacing(14), paddingHorizontal: spacing(6) },
  emptyIcon: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: colors.brandWash,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing(4),
  },

  moneyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing(1.5) },

  notice: {
    flexDirection: 'row', gap: spacing(2.5), padding: spacing(4),
    borderRadius: radius.lg, alignItems: 'flex-start',
  },

  stat: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    paddingVertical: spacing(4), paddingHorizontal: spacing(2),
    alignItems: 'center', justifyContent: 'center', minHeight: 76,
  },
});

/* ----------------------------------------------------------------- Sheet */

/**
 * Painel que sobe pelo rodapé. Usado para filtros, escolhas rápidas e
 * confirmações — evita ter que criar uma rota nova só para uma decisão curta.
 */
export function Sheet({
  visible, onClose, title, subtitle, children, footer,
}: {
  visible: boolean; onClose: () => void; title: string; subtitle?: string;
  children: React.ReactNode; footer?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sheetStyles.backdrop} onPress={onClose} />
      <View style={[sheetStyles.panel, { paddingBottom: Math.max(insets.bottom, spacing(4)) }]}>
        <View style={sheetStyles.grabber} />
        <View style={sheetStyles.head}>
          <View style={{ flex: 1 }}>
            <Text style={font.h3}>{title}</Text>
            {subtitle ? <Text style={[font.small, { marginTop: 2 }]}>{subtitle}</Text> : null}
          </View>
          <Pressable onPress={onClose} hitSlop={10} style={sheetStyles.close}>
            <Ionicons name="close" size={19} color={colors.text} />
          </Pressable>
        </View>

        <ScrollView style={{ maxHeight: 460 }} contentContainerStyle={{ paddingBottom: spacing(2) }}>
          {children}
        </ScrollView>

        {footer ? <View style={{ marginTop: spacing(4), gap: spacing(2) }}>{footer}</View> : null}
      </View>
    </Modal>
  );
}

/** Linha de opção dentro de um Sheet. */
export function SheetOption({
  icon, label, sublabel, onPress, tone = colors.brand,
}: {
  icon: keyof typeof Ionicons.glyphMap; label: string; sublabel?: string;
  onPress?: () => void; tone?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [sheetStyles.option, pressed && { backgroundColor: colors.surface }]}
    >
      <View style={[sheetStyles.optionIcon, { backgroundColor: tone + '1A' }]}>
        <Ionicons name={icon} size={20} color={tone} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={font.bodyStrong}>{label}</Text>
        {sublabel ? <Text style={[font.small, { marginTop: 2 }]}>{sublabel}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={17} color={colors.textFaint} />
    </Pressable>
  );
}

/** Aviso curto que aparece e some sozinho — feedback de ação em mock. */
export function Toast({ message, visible }: { message: string; visible: boolean }) {
  const insets = useSafeAreaInsets();
  if (!visible) return null;
  return (
    <View style={[toastStyles.wrap, { bottom: insets.bottom + spacing(20) }]} pointerEvents="none">
      <View style={toastStyles.body}>
        <Ionicons name="checkmark-circle" size={17} color={colors.onBrand} />
        <Text style={toastStyles.text}>{message}</Text>
      </View>
    </View>
  );
}

/** Controla um Toast com sumiço automático. */
export function useToast() {
  const [message, setMessage] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = React.useCallback((m: string) => {
    setMessage(m);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), 2200);
  }, []);

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return { message, visible: message !== null, show };
}

const sheetStyles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  panel: {
    backgroundColor: colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: spacing(4.5), paddingTop: spacing(3),
  },
  grabber: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginBottom: spacing(4),
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing(3), marginBottom: spacing(4) },
  close: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(3.5),
    paddingVertical: spacing(3.5), borderRadius: radius.lg,
  },
  optionIcon: {
    width: 42, height: 42, borderRadius: radius.lg,
    alignItems: 'center', justifyContent: 'center',
  },
});

const toastStyles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  body: {
    flexDirection: 'row', alignItems: 'center', gap: spacing(2),
    backgroundColor: colors.text, borderRadius: radius.pill,
    paddingHorizontal: spacing(4.5), paddingVertical: spacing(3),
  },
  text: { fontSize: 13.5, fontWeight: '600', color: colors.onBrand },
});
