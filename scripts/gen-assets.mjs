/**
 * Gera assets de UI via OpenAI Images (gpt-image-1).
 * Uso: node scripts/gen-assets.mjs <lote>
 *   lote = "piloto" | "icones" | "fotos" | "hero"
 *
 * A chave vem de .env (fora do git). Nada é commitado além das imagens geradas.
 */
import fs from 'node:fs';
import path from 'node:path';

const env = Object.fromEntries(
  fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter(Boolean).map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);
const KEY = env.OPENAI_API_KEY;
if (!KEY) throw new Error('OPENAI_API_KEY ausente no .env');

const OUT = new URL('../assets/gen/', import.meta.url).pathname;

/* Estilo compartilhado — é o que mantém os ícones parecendo um conjunto só. */
const ESTILO_ICONE = [
  'Modern 3D-rendered app category icon, soft clay/plasticine style with smooth rounded shapes,',
  'subtle glossy highlights and soft ambient shadow, isometric three-quarter view, centered composition,',
  'vibrant but warm color palette dominated by terracotta orange (#D4562A), cream, warm beige and soft charcoal accents,',
  'clean and friendly, no text, no letters, no background scenery, isolated object on fully transparent background,',
  'consistent lighting from top-left, high detail, professional mobile app icon set.',
].join(' ');

const ESTILO_FOTO = [
  'Professional editorial photograph, natural warm daylight, shallow depth of field,',
  'authentic Brazilian setting, real working professional, candid and warm mood,',
  'warm color grading with terracotta and cream tones, high resolution, no text overlay, no watermark.',
].join(' ');

const LOTES = {
  piloto: [
    { nome: 'icone-churrasqueiro', size: '1024x1024', transparente: true,
      prompt: `${ESTILO_ICONE} The icon depicts a charcoal barbecue grill with a skewer of grilled meat and a small stylized flame above it.` },
    { nome: 'hero-profissional', size: '1024x1024', transparente: true,
      prompt: 'Modern 3D-rendered friendly character illustration, soft clay style, a smiling Brazilian service professional wearing a terracotta orange work uniform and tool belt, giving a confident thumbs up, three-quarter view, warm palette of terracotta orange cream and soft charcoal, soft ambient shadow, no text, isolated on fully transparent background, professional mobile app hero illustration.' },
    { nome: 'foto-churrasco', size: '1536x1024', transparente: false,
      prompt: `${ESTILO_FOTO} A barbecue chef in an apron grilling picanha steaks over a charcoal grill at a family backyard party.` },
  ],
  icones: [
    ['icone-dog-walker', 'a single happy golden dog sitting, wearing a collar, with a looped leash held beside it — a standalone object, absolutely no picture frame, no plaque, no border, no square panel behind it'],
    ['icone-banho-tosa', 'a small fluffy dog in a bathtub with soap bubbles and a grooming brush'],
    ['icone-marido-aluguel', 'a toolbox with a hammer and adjustable wrench crossed above it'],
    ['icone-diarista', 'a bucket with cleaning supplies, a spray bottle and a sparkling cloth'],
    ['icone-eletricista', 'a light bulb with a lightning bolt and a screwdriver'],
    ['icone-encanador', 'a chrome water pipe with a wrench and a water droplet'],
    ['icone-pintor', 'a paint roller and paint bucket with a fresh stroke of paint'],
    ['icone-jardineiro', 'garden pruning shears with a leafy potted plant'],
    ['icone-montador', 'a partially assembled wooden stool or small chair with an allen key leaning against it and two screws beside it — a clearly recognisable piece of furniture being built, no flat panel, no abstract shapes'],
    ['icone-cuidador', 'two hands gently holding a heart, caring gesture'],
    ['icone-garcom', 'a serving tray with two drink glasses and a folded napkin'],
  ].map(([nome, desc]) => ({
    nome, size: '1024x1024', transparente: true,
    prompt: `${ESTILO_ICONE} The icon depicts ${desc}.`,
  })),
  hero: [
    { nome: 'hero-profissional-v2', size: '1024x1024', transparente: true,
      prompt: 'Modern 3D-rendered friendly character illustration, soft clay style, a smiling Brazilian service professional wearing a CREAM AND OFF-WHITE work uniform with a warm charcoal tool belt and a small terracotta orange cap, giving a confident thumbs up, three-quarter view upper body, palette of cream ivory soft charcoal with small terracotta accents, must read clearly against a terracotta orange background, soft ambient shadow, no text, isolated on fully transparent background, professional mobile app hero illustration.' },
    { nome: 'hero-churrasqueiro', size: '1024x1024', transparente: true,
      prompt: 'Modern 3D-rendered friendly character illustration, soft clay style, a smiling Brazilian barbecue chef wearing a CREAM apron over an off-white shirt, holding barbecue tongs with a small skewer, three-quarter view upper body, palette of cream ivory soft charcoal with small terracotta accents, must read clearly against a terracotta orange background, soft ambient shadow, no text, isolated on fully transparent background, professional mobile app illustration.' },
  ],
  icone_app: [
    { nome: 'app-icon-flame', size: '1024x1024', transparente: true,
      prompt: 'A single bold flame symbol for a mobile app icon, modern 3D soft clay style with smooth rounded shapes and subtle glossy highlights, pure warm cream and ivory white color with soft shadow, centered, simple and highly legible at small sizes, thick confident silhouette, no text, no letters, no background, isolated on fully transparent background.' },
  ],
  fotos: [
    ['foto-dog-walker', 'a young woman walking two happy dogs on leashes along a tree-lined city sidewalk'],
    ['foto-banho-tosa', 'a pet groomer carefully brushing a small dog on a grooming table'],
    ['foto-diarista', 'a professional house cleaner wiping a kitchen counter in a bright tidy apartment'],
    ['foto-marido-aluguel', 'a handyman drilling a shelf into an apartment wall, tools nearby'],
  ].map(([nome, desc]) => ({
    nome, size: '1536x1024', transparente: false,
    prompt: `${ESTILO_FOTO} ${desc}.`,
  })),
};

const lote = process.argv[2] ?? 'piloto';
const itens = LOTES[lote];
if (!itens) throw new Error(`lote desconhecido: ${lote}. use: ${Object.keys(LOTES).join(', ')}`);

console.log(`gerando lote "${lote}" — ${itens.length} imagem(ns)\n`);

let ok = 0, falhas = 0;
for (const item of itens) {
  const destino = path.join(OUT, `${item.nome}.png`);
  if (fs.existsSync(destino)) { console.log(`· ${item.nome} — já existe, pulando`); continue; }

  const corpo = {
    model: 'gpt-image-1',
    prompt: item.prompt,
    size: item.size,
    quality: 'medium',
    n: 1,
    output_format: 'png',
    ...(item.transparente ? { background: 'transparent' } : {}),
  };

  process.stdout.write(`· ${item.nome} ... `);
  try {
    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify(corpo),
    });
    if (!r.ok) {
      const txt = await r.text();
      console.log(`FALHOU (${r.status})`);
      console.log(`  ${txt.slice(0, 300)}`);
      falhas++;
      continue;
    }
    const json = await r.json();
    const b64 = json.data?.[0]?.b64_json;
    if (!b64) { console.log('FALHOU (sem imagem na resposta)'); falhas++; continue; }
    fs.writeFileSync(destino, Buffer.from(b64, 'base64'));
    const kb = Math.round(fs.statSync(destino).size / 1024);
    console.log(`ok (${kb} KB)`);
    ok++;
  } catch (e) {
    console.log(`ERRO: ${e.message}`);
    falhas++;
  }
}

console.log(`\nconcluído: ${ok} gerada(s), ${falhas} falha(s)`);
