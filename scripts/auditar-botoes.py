import pathlib, re

INTERATIVOS = ['Pressable', 'TouchableOpacity', 'Button', 'ListRow', 'Chip', 'CategoryTile',
               'CategoryGridItem', 'SubChip', 'ServiceCard', 'ProviderCard', 'OrderCard',
               'HeaderAction', 'PostRequestCard', 'PromoBanner', 'SearchRow']
# props que contam como "faz alguma coisa"
ACOES = ['onPress', 'onAction', 'onBuscar', 'onSino', 'onBack']

def fim_da_tag(src, i):
    """Acha o '>' que fecha a tag aberta em i, ignorando os que estão dentro de {} ou ''."""
    d = 0; j = i
    while j < len(src):
        c = src[j]
        if c == '{': d += 1
        elif c == '}': d -= 1
        elif c == '>' and d == 0:
            return j
        j += 1
    return len(src)

achados = []
for p in sorted(list(pathlib.Path('app').rglob('*.tsx')) + list(pathlib.Path('src').rglob('*.tsx'))):
    src = p.read_text()
    for comp in INTERATIVOS:
        for m in re.finditer(r'<' + comp + r'(?=[\s/>])', src):
            i = m.start()
            fim = fim_da_tag(src, i)
            tag = src[i:fim]
            if not any(a in tag for a in ACOES):
                linha = src[:i].count('\n') + 1
                trecho = ' '.join(tag.split())[:96]
                achados.append((str(p), linha, comp, trecho))

print(f"{len(achados)} elemento(s) interativo(s) sem ação:\n")
atual = None
for arq, linha, comp, trecho in achados:
    if arq != atual:
        print(f"\n── {arq}")
        atual = arq
    print(f"   L{linha:<4} <{comp}>  {trecho}")
