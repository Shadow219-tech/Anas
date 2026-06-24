export type Status = 'available' | 'soon';
export type ProductAvailability = 'available' | 'unavailable';

export interface Country {
  code: string;
  name: string;
  flag: string;
  subtitle: string;
  continent: string;
  status: Status;
  heroImage?: string;
}

export interface Continent {
  id: string;
  name: string;
  emoji: string;
  countryCount: number;
  status: Status;
  dropLabel?: string;
}

export interface Product {
  id: string;
  type: 'hoodie' | 'cargo' | 'tshirt' | 'short' | 'ensemble-hiver' | 'ensemble-ete';
  name: string;
  price: number;
  images: string[]; // multiple images for gallery
  sizes: string[];
  availability: ProductAvailability;
  unavailableReason?: string;
  description?: string;
  season: 'ete' | 'hiver';
}

export const CONTINENTS: Continent[] = [
  { id: 'afrique', name: 'Afrique', emoji: '🌍', countryCount: 54, status: 'available' },
  { id: 'asie', name: 'Asie', emoji: '🌏', countryCount: 48, status: 'soon', dropLabel: 'DROP 002' },
  { id: 'ameriques', name: 'Amériques', emoji: '🌎', countryCount: 35, status: 'available' },
  { id: 'europe', name: 'Europe', emoji: '🏛', countryCount: 44, status: 'soon', dropLabel: 'DROP 002' },
  { id: 'oceanie', name: 'Océanie', emoji: '🌊', countryCount: 14, status: 'soon', dropLabel: 'DROP 003' },
];

export const COUNTRIES: Country[] = [
  {
    code: 'MA', name: 'Maroc', flag: '🇲🇦', subtitle: 'Zellige, Sahara, Majorelle',
    continent: 'afrique', status: 'available',
    heroImage: 'https://images.pexels.com/photos/2404843/pexels-photo-2404843.jpeg',
  },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', subtitle: 'Dakar, Wax, Couleurs vives', continent: 'afrique', status: 'soon' },
  { code: 'NG', name: 'Nigéria', flag: '🇳🇬', subtitle: 'Lagos, afrobeat, ankara', continent: 'afrique', status: 'soon' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', subtitle: 'Nil, hiéroglyphes, désert', continent: 'afrique', status: 'soon' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', subtitle: 'Cape Town, kwaito, ubuntu', continent: 'afrique', status: 'soon' },
  { code: 'ET', name: 'Éthiopie', flag: '🇪🇹', subtitle: 'Addis, café, Lalibela', continent: 'afrique', status: 'soon' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', subtitle: 'Accra, kente, highlife', continent: 'afrique', status: 'soon' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', subtitle: 'Abidjan, coupé-décalé', continent: 'afrique', status: 'soon' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', subtitle: 'Nairobi, savane, maasai', continent: 'afrique', status: 'soon' },
  { code: 'TN', name: 'Tunisie', flag: '🇹🇳', subtitle: 'Sidi Bou Saïd, médina, bleu', continent: 'afrique', status: 'soon' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', subtitle: 'Indigo, Sashiko, Tokyo', continent: 'asie', status: 'soon' },
  { code: 'KR', name: 'Corée du Sud', flag: '🇰🇷', subtitle: 'Seoul, K-culture, Minimal', continent: 'asie', status: 'soon' },
  { code: 'CN', name: 'Chine', flag: '🇨🇳', subtitle: 'Shanghai, soie, dragons', continent: 'asie', status: 'soon' },
  { code: 'IN', name: 'Inde', flag: '🇮🇳', subtitle: 'Mumbai, épices, broderie', continent: 'asie', status: 'soon' },
  { code: 'TH', name: 'Thaïlande', flag: '🇹🇭', subtitle: 'Bangkok, temples, soie', continent: 'asie', status: 'soon' },
  {
    code: 'US', name: 'États-Unis', flag: '🇺🇸', subtitle: 'Denim, NYC, Workwear',
    continent: 'ameriques', status: 'available',
    heroImage: 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg',
  },
  { code: 'AR', name: 'Argentine', flag: '🇦🇷', subtitle: 'Buenos Aires, Gaucho, Cobalt', continent: 'ameriques', status: 'soon' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', subtitle: 'Rio, capoeira, carnaval', continent: 'ameriques', status: 'soon' },
  { code: 'MX', name: 'Mexique', flag: '🇲🇽', subtitle: 'Oaxaca, huipil, couleurs', continent: 'ameriques', status: 'soon' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', subtitle: 'Vancouver, tartan, grand nord', continent: 'ameriques', status: 'soon' },
  { code: 'FR', name: 'France', flag: '🇫🇷', subtitle: 'Paris, Haussmann, Élégance', continent: 'europe', status: 'soon' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', subtitle: 'Milan, savoir-faire, marbre', continent: 'europe', status: 'soon' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', subtitle: 'Barcelone, flamenco, soleil', continent: 'europe', status: 'soon' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', subtitle: 'Berlin, Bauhaus, techno', continent: 'europe', status: 'soon' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', subtitle: 'Londres, punk, tartan', continent: 'europe', status: 'soon' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', subtitle: 'Sydney, surf, outback', continent: 'oceanie', status: 'soon' },
  { code: 'NZ', name: 'Nouvelle-Zélande', flag: '🇳🇿', subtitle: 'Auckland, maori, jade', continent: 'oceanie', status: 'soon' },
];

// Morocco images
import maTshirt from '../assets/images/morocco/t-shirt/image.png';
import maShort from '../assets/images/morocco/short/image copy.png';
import maEnsemble from '../assets/images/morocco/ensemble/image copy copy copy copy copy.png';
import maEnsemble2 from '../assets/images/morocco/ensemble/image.png';
import maWinter from '../assets/images/morocco/winter/image.png';
import maWinter2 from '../assets/images/morocco/winter/image copy.png';

// USA images
import usTshirt from '../assets/images/t-shirt/USA/image.png';
import usShort from '../assets/images/short/image copy.png';
import usEnsemble from '../assets/images/t-shirt/ensemble/image.png';
import usaHero from '../assets/images/usa/image.png';

export const USA_HERO = usaHero;

export const PRODUCTS_BY_COUNTRY: Record<string, Product[]> = {
  MA: [
    {
      id: 'ma-tshirt', type: 'tshirt', name: 'T-shirt Maroc', price: 50,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maTshirt, maEnsemble, maShort],
      availability: 'available',
      season: 'ete',
      description: 'T-shirt oversize en coton 280g. Motif zellige brodé à la main, étoile Orygin au dos. Coupe unisexe.',
    },
    {
      id: 'ma-short', type: 'short', name: 'Short Maroc', price: 50,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maShort, maTshirt, maEnsemble],
      availability: 'available',
      season: 'ete',
      description: 'Short cargo multi-poches en toile de coton. Détails brodés inspirés des motifs marocains. Coupe large.',
    },
    {
      id: 'ma-ensemble-ete', type: 'ensemble-ete', name: 'Ensemble Été Maroc', price: 90,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maEnsemble, maTshirt, maShort, maEnsemble2],
      availability: 'available',
      season: 'ete',
      description: 'Le duo signature Orygin Maroc — T-shirt + Short assortis. Économie groupée. Édition limitée Drop 001.',
    },
    {
      id: 'ma-hoodie', type: 'hoodie', name: 'Hoodie Maroc', price: 75,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maWinter, maWinter2],
      availability: 'unavailable',
      season: 'hiver',
      unavailableReason: 'Collection Hiver — Bientôt',
      description: 'Hoodie oversize en molleton 400g. Motifs zellige brodés. Étoile Orygin sur la poitrine.',
    },
    {
      id: 'ma-cargo', type: 'cargo', name: 'Cargo Hiver Maroc', price: 75,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maWinter2, maWinter],
      availability: 'unavailable',
      season: 'hiver',
      unavailableReason: 'Collection Hiver — Bientôt',
      description: 'Cargo patchwork multi-matières. Détails cuir et broderies artisanales. Coupe oversize.',
    },
    {
      id: 'ma-ensemble-hiver', type: 'ensemble-hiver', name: 'Ensemble Hiver Maroc', price: 130,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maWinter, maWinter2],
      availability: 'unavailable',
      season: 'hiver',
      unavailableReason: 'Collection Hiver — Bientôt',
      description: 'Hoodie + Cargo hiver assortis. La pièce maîtresse du Drop 001.',
    },
  ],
  US: [
    {
      id: 'us-tshirt', type: 'tshirt', name: 'T-shirt USA', price: 50,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [usTshirt, usEnsemble],
      availability: 'available',
      season: 'ete',
      description: 'T-shirt oversize en coton 280g. Eagle brodé NYC au dos, étoile Orygin sur la poitrine. Coupe unisexe.',
    },
    {
      id: 'us-short', type: 'short', name: 'Short USA', price: 50,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [usShort, usTshirt, usEnsemble],
      availability: 'available',
      season: 'ete',
      description: 'Short cargo denim multi-poches. Bretelles, broderies americana, patch Orygin. Coupe large.',
    },
    {
      id: 'us-ensemble-ete', type: 'ensemble-ete', name: 'Ensemble Été USA', price: 90,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [usEnsemble, usTshirt, usShort],
      availability: 'available',
      season: 'ete',
      description: 'T-shirt + Short USA Drop 001. La paire parfaite. Édition limitée, pièces numérotées.',
    },
    {
      id: 'us-hoodie', type: 'hoodie', name: 'Hoodie USA', price: 75,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maWinter],
      availability: 'unavailable',
      season: 'hiver',
      unavailableReason: 'Collection Hiver — Bientôt',
      description: 'Hoodie workwear premium, motifs denim brodés, coupe oversize New York.',
    },
    {
      id: 'us-cargo', type: 'cargo', name: 'Cargo USA', price: 75,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maWinter2],
      availability: 'unavailable',
      season: 'hiver',
      unavailableReason: 'Collection Hiver — Bientôt',
      description: 'Cargo multi-poches en denim lourd. Détails patch et broderies americana.',
    },
    {
      id: 'us-ensemble-hiver', type: 'ensemble-hiver', name: 'Ensemble Hiver USA', price: 130,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      images: [maWinter, maWinter2],
      availability: 'unavailable',
      season: 'hiver',
      unavailableReason: 'Collection Hiver — Bientôt',
      description: 'Hoodie + Cargo hiver USA. Drop 002.',
    },
  ],
};
