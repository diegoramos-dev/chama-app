import pathlib, re

# --- rotas que existem de fato ---
rotas = []
for p in pathlib.Path('app').rglob('*.tsx'):
    if p.name == '_layout.tsx':
        continue
    partes = list(p.relative_to('app').parts)
    partes[-1] = partes[-1][:-4]                      # tira .tsx
    partes = [x for x in partes if not (x.startswith('(') and x.endswith(')'))]  # tira grupos
    if partes and partes[-1] == 'index':
        partes.pop()
    rotas.append('/' + '/'.join(partes))

def casa(alvo, rota):
    a = [x for x in alvo.strip('/').split('/') if x]
    r = [x for x in rota.strip('/').split('/') if x]
    if len(a) != len(r):
        return False
    return all(rp.startswith('[') or rp == ap for ap, rp in zip(a, r))

# --- alvos de navegação usados no código ---
alvos = []
padrao = re.compile(r"router\.(push|replace)\(\s*[`'\"]([^`'\"]+)[`'\"]")
for p in sorted(pathlib.Path('app').rglob('*.tsx')) + sorted(pathlib.Path('src').rglob('*.tsx')):
    for m in padrao.finditer(p.read_text()):
        bruto = m.group(2)
        limpo = bruto.split('?')[0]
        limpo = re.sub(r'\$\{[^}]*\}', 'X', limpo)      # interpolação -> segmento genérico
        limpo = re.sub(r'\(tabs\)', '', limpo).replace('//', '/')
        if limpo != '/' and limpo.endswith('/'):
            limpo = limpo[:-1]
        alvos.append((str(p), m.start(), bruto, limpo))

quebrados = []
for arq, pos, bruto, limpo in alvos:
    if not any(casa(limpo, r) for r in rotas):
        quebrados.append((arq, bruto, limpo))

print(f"{len(rotas)} rotas existentes · {len(alvos)} navegações no código\n")
if quebrados:
    print(f"⚠ {len(quebrados)} navegação(ões) para rota inexistente:\n")
    for arq, bruto, limpo in quebrados:
        print(f"  {arq}\n     usa: {bruto}\n     resolve para: {limpo}\n")
else:
    print("✓ todas as navegações apontam para rotas que existem")
