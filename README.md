# Chama

Marketplace de microserviços — o "Uber dos bicos". Conecta quem precisa de uma mãozinha
(churrasqueiro, dog walker, diarista, marido de aluguel...) com quem faz o serviço.

**Esta versão é 100% mock: não há banco de dados nem backend.** Todos os dados vivem em
memória (`src/data/mock.ts`) e o estado é gerenciado por um único contexto React
(`src/store/app.tsx`). Ao recarregar o app, tudo volta ao estado inicial — isso é esperado.

## Rodando

```bash
npm install
npx expo start          # abre o Metro; escaneie o QR code com o app Expo Go no Android
npx expo start --web    # roda no navegador, útil para desenvolvimento rápido
```

Não é preciso instalar Android Studio nem o Android SDK para desenvolver — o Expo Go
no celular basta.

## Gerando o APK

```bash
npx eas-cli build -p android --profile preview
```

O profile `preview` produz um **`.apk` instalável** direto no celular. O profile
`production` gera `.aab`, que é o formato da Play Store e não instala direto.
Requer uma conta Expo (gratuita).

## Estrutura

```
app/                          rotas (expo-router — o arquivo é a rota)
  index.tsx                   splash
  escolher-perfil.tsx         cliente ou prestador
  (auth)/                     login, cadastro, recuperar senha
  cliente/
    (tabs)/                   início · agenda · perfil
    prestador/[id].tsx        perfil de quem presta o serviço
    agendar/[id].tsx          escolha de dia e hora
    pedido/[id].tsx           acompanhamento do pedido
    conta/                    pedidos, pagamentos, endereços, favoritos, ajuda...
  prestador/
    cadastro/                 4 etapas: dados · documentos · selfie · serviços
    (tabs)/                   início · pedidos · ganhos · perfil
src/
  data/mock.ts                todos os dados falsos
  data/types.ts               tipos do domínio
  store/app.tsx               estado + ações (a "API" mock)
  components/ui.tsx           biblioteca de componentes genéricos
  components/domain.tsx       componentes do domínio (card de prestador, timeline...)
  theme/index.ts              cores, espaçamento, tipografia
```

## Regras de negócio implementadas

- **Comissão de 2%** sobre cada serviço concluído. Sem mensalidade e sem taxa por orçamento.
- **Pagamento retido (escrow):** pré-autoriza no agendamento e só libera na conclusão.
- **Conclusão tem 3 caminhos:** cliente confirma · automático em 24h · disputa.
- **Verificação do prestador:** documentos e certidão de antecedentes criminais antes de aparecer.
- **Nível da chama:** nota alta deixa a borda do avatar mais "quente" e melhora o ranking.
- **Sem prestador na região:** mostra a chama triste e oferece a lista de espera.

## Botões "simular"

Como não existe backend, algumas telas trazem botões `simular: ...` que empurram o pedido
para o próximo estado à mão (profissional aceitou, serviço começou, serviço terminou).
Eles existem só para dar para percorrer o fluxo inteiro sozinho — somem quando entrar a API.

## Trocando o mock por um backend de verdade

As telas nunca acessam `mock.ts` para escrever — elas só chamam métodos do `useApp()`.
Para plugar uma API real, basta reescrever o corpo dessas ações em `src/store/app.tsx`
(`placeOrder`, `rateOrder`, `withdraw`, etc.) para fazer as chamadas HTTP. Nenhuma tela
precisa mudar.
