/**
 * Mapa de assets gerados (ver scripts/gen-assets.mjs).
 * Os require() precisam ser literais — o Metro resolve em tempo de build.
 */

export const categoryIcon: Record<string, any> = {
  churrasqueiro: require('../../assets/img/icone-churrasqueiro.png'),
  'dog-walker': require('../../assets/img/icone-dog-walker.png'),
  'banho-tosa': require('../../assets/img/icone-banho-tosa.png'),
  'marido-aluguel': require('../../assets/img/icone-marido-aluguel.png'),
  diarista: require('../../assets/img/icone-diarista.png'),
  eletricista: require('../../assets/img/icone-eletricista.png'),
  encanador: require('../../assets/img/icone-encanador.png'),
  pintor: require('../../assets/img/icone-pintor.png'),
  jardineiro: require('../../assets/img/icone-jardineiro.png'),
  montador: require('../../assets/img/icone-montador.png'),
  cuidador: require('../../assets/img/icone-cuidador.png'),
  garcom: require('../../assets/img/icone-garcom.png'),
};

/** Foto editorial por categoria. Nem toda categoria tem — use categoryPhoto(). */
const fotos: Record<string, any> = {
  churrasqueiro: require('../../assets/img/foto-churrasco.jpg'),
  'dog-walker': require('../../assets/img/foto-dog-walker.jpg'),
  'banho-tosa': require('../../assets/img/foto-banho-tosa.jpg'),
  diarista: require('../../assets/img/foto-diarista.jpg'),
  'marido-aluguel': require('../../assets/img/foto-marido-aluguel.jpg'),
};

export const categoryPhoto = (id: string) => fotos[id] ?? fotos.churrasqueiro;
export const hasPhoto = (id: string) => Boolean(fotos[id]);

export const heroPro = require('../../assets/img/hero-profissional-v2.png');
export const heroChurrasqueiro = require('../../assets/img/hero-churrasqueiro.png');
