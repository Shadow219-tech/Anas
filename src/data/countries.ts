export type Status = 'available' | 'soon';

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
  type: 'jacket';
  name: string;
  price: number;
  images: string[];
  sizes: string[];
  stock: number;
  availability: 'available';
  description: string;
  story: string;
  fabric: string;
}

export const CONTINENTS: Continent[] = [
  { id: 'afrique', name: 'Afrique', emoji: '🌍', countryCount: 54, status: 'available' },
  { id: 'europe', name: 'Europe', emoji: '🏛', countryCount: 44, status: 'available' },
  { id: 'ameriques', name: 'Amériques', emoji: '🌎', countryCount: 35, status: 'soon', dropLabel: 'DROP 002' },
  { id: 'asie', name: 'Asie', emoji: '🌏', countryCount: 48, status: 'soon', dropLabel: 'DROP 002' },
  { id: 'oceanie', name: 'Océanie', emoji: '🌊', countryCount: 14, status: 'soon', dropLabel: 'DROP 003' },
];

export const COUNTRIES: Country[] = [
  {
    code: 'MA', name: 'Maroc', flag: '🇲🇦', subtitle: 'Sahara, Majorelle, Zellige',
    continent: 'afrique', status: 'available',
    heroImage: 'https://images.pexels.com/photos/28829635/pexels-photo-28829635.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  {
    code: 'FR', name: 'France', flag: '🇫🇷', subtitle: 'Paris, Haussmann, Élégance',
    continent: 'europe', status: 'available',
    heroImage: 'https://images.pexels.com/photos/17501700/pexels-photo-17501700.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', subtitle: 'Dakar, Wax, Couleurs vives', continent: 'afrique', status: 'soon' },
  { code: 'NG', name: 'Nigéria', flag: '🇳🇬', subtitle: 'Lagos, afrobeat, ankara', continent: 'afrique', status: 'soon' },
  { code: 'EG', name: 'Égypte', flag: '🇪🇬', subtitle: 'Nil, hiéroglyphes, désert', continent: 'afrique', status: 'soon' },
  { code: 'JP', name: 'Japon', flag: '🇯🇵', subtitle: 'Indigo, Sashiko, Tokyo', continent: 'asie', status: 'soon' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', subtitle: 'Denim, NYC, Workwear', continent: 'ameriques', status: 'soon' },
  { code: 'BR', name: 'Brésil', flag: '🇧🇷', subtitle: 'Rio, capoeira, carnaval', continent: 'ameriques', status: 'soon' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', subtitle: 'Milan, savoir-faire, marbre', continent: 'europe', status: 'soon' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', subtitle: 'Londres, punk, tartan', continent: 'europe', status: 'soon' },
  { code: 'AU', name: 'Australie', flag: '🇦🇺', subtitle: 'Sydney, surf, outback', continent: 'oceanie', status: 'soon' },
];

const MOROCCO_JACKET_IMG_1 = 'https://images.pexels.com/photos/6545539/pexels-photo-6545539.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const MOROCCO_JACKET_IMG_2 = 'https://images.pexels.com/photos/19190941/pexels-photo-19190941.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const FRANCE_JACKET_IMG_1 = 'https://images.pexels.com/photos/32251869/pexels-photo-32251869.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const FRANCE_JACKET_IMG_2 = 'https://images.pexels.com/photos/11511052/pexels-photo-11511052.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const PRODUCTS_BY_COUNTRY: Record<string, Product[]> = {
  MA: [
    {
      id: 'ma-desert-gold',
      type: 'jacket',
      name: 'Desert Gold',
      price: 120,
      images: [MOROCCO_JACKET_IMG_1, MOROCCO_JACKET_IMG_2],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      stock: 42,
      availability: 'available',
      description: 'Veste oversize en coton ciré, teintée aux pigments naturels du Sahara. Motifs zellige brodés à la main sur le dos, étoile Orygin dorée sur la poitrine. Coupe unisexe, doublure intérieure en soie.',
      story: 'Née dans les dunes de Merzouga, la Desert Gold capture la lumière dorée du Sahara au coucher du soleil. Chaque pièce est numérotée et brodée par les artisans de Fès.',
      fabric: 'Coton ciré 380g · Doublure soie · Broderies main',
    },
  ],
  FR: [
    {
      id: 'fr-parisian-night',
      type: 'jacket',
      name: 'Parisian Night',
      price: 120,
      images: [FRANCE_JACKET_IMG_1, FRANCE_JACKET_IMG_2],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      stock: 38,
      availability: 'available',
      description: 'Veste tailleur en laine mélangée, coupe cintrée inspirée de l'architecture haussmannienne. Boutons en laiton patiné, étoile Orygin discrète sur la patte de poche. Doublure satin noir.',
      story: 'Façonnée dans les ateliers parisiens, la Parisian Night incarne l'élégance discrète des rues de Paris au crépuscule. Une pièce intemporelle, pensée pour traverser les saisons.',
      fabric: 'Laine mélangée 320g · Doublure satin · Boutons laiton',
    },
  ],
};

export function findProductById(id: string): { product: Product; countryCode: string; countryName: string } | null {
  for (const [countryCode, products] of Object.entries(PRODUCTS_BY_COUNTRY)) {
    const product = products.find(p => p.id === id);
    if (product) {
      const country = COUNTRIES.find(c => c.code === countryCode);
      return { product, countryCode, countryName: country?.name ?? countryCode };
    }
  }
  return null;
}

export const AVAILABLE_COUNTRIES = COUNTRIES.filter(c => c.status === 'available');
