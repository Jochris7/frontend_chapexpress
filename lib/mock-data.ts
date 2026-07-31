import type { Category, DeliveryZone, Order, Product } from '@/types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'T-shirts', slug: 't-shirts', createdAt: '2026-01-05T09:00:00.000Z' },
  { id: 'cat-2', name: 'Pantalons', slug: 'pantalons', createdAt: '2026-01-05T09:05:00.000Z' },
  { id: 'cat-3', name: 'Casquettes', slug: 'casquettes', createdAt: '2026-01-05T09:10:00.000Z' },
  { id: 'cat-4', name: 'Chaussures', slug: 'chaussures', createdAt: '2026-01-05T09:15:00.000Z' },
  { id: 'cat-5', name: 'Accessoires', slug: 'accessoires', createdAt: '2026-01-05T09:20:00.000Z' },
];

const categoryById = (id: string): Category => {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category id: ${id}`);
  return category;
};

interface ProductSeed {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  price: number;
  quantity: number;
  size?: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

const productSeeds: ProductSeed[] = [
  {
    id: 'prod-1',
    title: 'T-shirt Oversized Blanc',
    description: 'Coupe oversized en coton lourd, idéal pour un look streetwear décontracté.',
    categoryId: 'cat-1',
    price: 15000,
    quantity: 12,
    size: 'L',
    imageUrl: 'https://picsum.photos/seed/tshirt-oversized-blanc/600/600',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
  },
  {
    id: 'prod-2',
    title: 'T-shirt Boxy Gris',
    description: 'T-shirt coupe boxy en jersey doux, parfait pour un style minimaliste.',
    categoryId: 'cat-1',
    price: 12000,
    quantity: 8,
    size: 'M',
    imageUrl: 'https://picsum.photos/seed/tshirt-boxy-gris/600/600',
    createdAt: '2026-02-02T10:00:00.000Z',
    updatedAt: '2026-02-02T10:00:00.000Z',
  },
  {
    id: 'prod-3',
    title: 'T-shirt Édition Supreme',
    description: 'Édition limitée, tissu premium, disponible en série restreinte.',
    categoryId: 'cat-1',
    price: 18000,
    quantity: 0,
    size: 'XL',
    imageUrl: 'https://picsum.photos/seed/tshirt-supreme/600/600',
    createdAt: '2026-02-03T10:00:00.000Z',
    updatedAt: '2026-06-15T14:30:00.000Z',
  },
  {
    id: 'prod-4',
    title: 'Pantalon Cargo Noir',
    description: 'Pantalon cargo multipoches, taille ajustable, coupe droite.',
    categoryId: 'cat-2',
    price: 24000,
    quantity: 5,
    size: 'M',
    imageUrl: 'https://picsum.photos/seed/pantalon-cargo-noir/600/600',
    createdAt: '2026-02-04T10:00:00.000Z',
    updatedAt: '2026-02-04T10:00:00.000Z',
  },
  {
    id: 'prod-5',
    title: 'Pantalon Jogger Beige',
    description: 'Jogger confortable en molleton, taille élastique avec cordon.',
    categoryId: 'cat-2',
    price: 17000,
    quantity: 10,
    size: 'L',
    imageUrl: 'https://picsum.photos/seed/pantalon-jogger-beige/600/600',
    createdAt: '2026-02-05T10:00:00.000Z',
    updatedAt: '2026-02-05T10:00:00.000Z',
  },
  {
    id: 'prod-6',
    title: 'Pantalon Slim Bleu',
    description: 'Coupe slim en denim stretch, confortable au quotidien.',
    categoryId: 'cat-2',
    price: 21000,
    quantity: 0,
    size: 'S',
    imageUrl: 'https://picsum.photos/seed/pantalon-slim-bleu/600/600',
    createdAt: '2026-02-06T10:00:00.000Z',
    updatedAt: '2026-06-20T09:00:00.000Z',
  },
  {
    id: 'prod-7',
    title: 'Casquette Snapback Noire',
    description: 'Snapback ajustable, broderie discrète, structure semi-rigide.',
    categoryId: 'cat-3',
    price: 8000,
    quantity: 20,
    imageUrl: 'https://picsum.photos/seed/casquette-snapback-noire/600/600',
    createdAt: '2026-02-07T10:00:00.000Z',
    updatedAt: '2026-02-07T10:00:00.000Z',
  },
  {
    id: 'prod-8',
    title: 'Casquette Trucker Kaki',
    description: 'Casquette trucker filet respirant, dos réglable par snap.',
    categoryId: 'cat-3',
    price: 7000,
    quantity: 15,
    imageUrl: 'https://picsum.photos/seed/casquette-trucker-kaki/600/600',
    createdAt: '2026-02-08T10:00:00.000Z',
    updatedAt: '2026-02-08T10:00:00.000Z',
  },
  {
    id: 'prod-9',
    title: 'Casquette Sport Lime',
    description: 'Casquette technique légère, coloris lime, idéale en extérieur.',
    categoryId: 'cat-3',
    price: 9000,
    quantity: 0,
    imageUrl: 'https://picsum.photos/seed/casquette-sport-lime/600/600',
    createdAt: '2026-02-09T10:00:00.000Z',
    updatedAt: '2026-06-25T11:00:00.000Z',
  },
  {
    id: 'prod-10',
    title: 'Sneakers Minimalist Blanc',
    description: 'Silhouette épurée en cuir premium, semelle ergonomique.',
    categoryId: 'cat-4',
    price: 25000,
    quantity: 6,
    size: '42',
    imageUrl: 'https://picsum.photos/seed/sneakers-minimalist-blanc/600/600',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z',
  },
  {
    id: 'prod-11',
    title: 'High-Tops Lime',
    description: 'Montantes édition limitée, empiècements lime, semelle épaisse.',
    categoryId: 'cat-4',
    price: 25000,
    quantity: 2,
    size: '43',
    imageUrl: 'https://picsum.photos/seed/high-tops-lime/600/600',
    createdAt: '2026-02-11T10:00:00.000Z',
    updatedAt: '2026-02-11T10:00:00.000Z',
  },
  {
    id: 'prod-12',
    title: 'Sandales Cuir',
    description: 'Sandales en cuir véritable, semelle confort, finition artisanale.',
    categoryId: 'cat-4',
    price: 14000,
    quantity: 0,
    size: '41',
    imageUrl: 'https://picsum.photos/seed/sandales-cuir/600/600',
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-06-28T16:00:00.000Z',
  },
  {
    id: 'prod-13',
    title: 'Sac à Dos Tech',
    description: 'Sac à dos avec compartiment laptop rembourré et poches organisées.',
    categoryId: 'cat-5',
    price: 22000,
    quantity: 9,
    imageUrl: 'https://picsum.photos/seed/sac-a-dos-tech/600/600',
    createdAt: '2026-02-13T10:00:00.000Z',
    updatedAt: '2026-02-13T10:00:00.000Z',
  },
  {
    id: 'prod-14',
    title: 'Porte-feuille Slim',
    description: 'Porte-feuille fin en cuir anthracite, plusieurs compartiments carte.',
    categoryId: 'cat-5',
    price: 9000,
    quantity: 14,
    imageUrl: 'https://picsum.photos/seed/porte-feuille-slim/600/600',
    createdAt: '2026-02-14T10:00:00.000Z',
    updatedAt: '2026-02-14T10:00:00.000Z',
  },
  {
    id: 'prod-15',
    title: 'Ceinture Cuir Noire',
    description: 'Ceinture en cuir pleine fleur, boucle métal brossé.',
    categoryId: 'cat-5',
    price: 6000,
    quantity: 0,
    imageUrl: 'https://picsum.photos/seed/ceinture-cuir-noire/600/600',
    createdAt: '2026-02-15T10:00:00.000Z',
    updatedAt: '2026-07-01T12:00:00.000Z',
  },
];

export const products: Product[] = productSeeds.map((seed) => ({
  id: seed.id,
  title: seed.title,
  description: seed.description,
  categoryId: seed.categoryId,
  category: categoryById(seed.categoryId),
  price: seed.price,
  quantity: seed.quantity,
  size: seed.size,
  imageUrl: seed.imageUrl,
  isAvailable: seed.quantity > 0,
  createdAt: seed.createdAt,
  updatedAt: seed.updatedAt,
}));

export const deliveryZones: DeliveryZone[] = [
  { id: 'zone-1', name: 'Yopougon', fee: 1000, city: 'Abidjan' },
  { id: 'zone-2', name: 'Cocody', fee: 1500, city: 'Abidjan' },
  { id: 'zone-3', name: 'Marcory', fee: 1500, city: 'Abidjan' },
  { id: 'zone-4', name: 'Abobo', fee: 1500, city: 'Abidjan' },
  { id: 'zone-5', name: 'Anyama', fee: 2000, city: 'Abidjan' },
  { id: 'zone-6', name: 'Attécoubé', fee: 1500, city: 'Abidjan' },
  { id: 'zone-7', name: 'Koumassi', fee: 1500, city: 'Abidjan' },
  { id: 'zone-8', name: 'Plateau', fee: 1500, city: 'Abidjan' },
  { id: 'zone-9', name: 'Port-Bouet', fee: 2000, city: 'Abidjan' },
  { id: 'zone-10', name: 'Treichville', fee: 1500, city: 'Abidjan' },
  { id: 'zone-11', name: 'Expédition', fee: 2500, city: 'Autres villes' },
];

const zoneById = (id: string): DeliveryZone => {
  const zone = deliveryZones.find((z) => z.id === id);
  if (!zone) throw new Error(`Unknown delivery zone id: ${id}`);
  return zone;
};

const productById = (id: string): Product => {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product id: ${id}`);
  return product;
};

export const orders: Order[] = [
  {
    id: 'order-1',
    customerName: 'Jean Kouassi',
    phone1: '+225 07 01 02 03 04',
    city: 'Abidjan',
    deliveryZoneId: 'zone-1',
    deliveryZone: zoneById('zone-1'),
    district: 'Yopougon Selmer',
    items: [
      {
        productId: 'prod-10',
        product: productById('prod-10'),
        quantity: 1,
        unitPrice: 25000,
        size: '42',
      },
    ],
    subtotal: 25000,
    deliveryFee: 1000,
    total: 26000,
    paymentMethod: 'cash_on_delivery',
    status: 'pending',
    createdAt: '2026-07-10T08:30:00.000Z',
  },
  {
    id: 'order-2',
    customerName: 'Awa Fofana',
    phone1: '+225 05 11 22 33 44',
    phone2: '+225 01 22 33 44 55',
    city: 'Abidjan',
    deliveryZoneId: 'zone-2',
    deliveryZone: zoneById('zone-2'),
    district: 'Cocody Angré',
    promoCode: 'BIENVENUE10',
    items: [
      {
        productId: 'prod-1',
        product: productById('prod-1'),
        quantity: 1,
        unitPrice: 15000,
        size: 'L',
      },
      {
        productId: 'prod-14',
        product: productById('prod-14'),
        quantity: 1,
        unitPrice: 9000,
      },
    ],
    subtotal: 24000,
    deliveryFee: 1500,
    total: 25500,
    paymentMethod: 'wave',
    status: 'paid',
    createdAt: '2026-07-12T14:15:00.000Z',
  },
  {
    id: 'order-3',
    customerName: 'Moussa Diabaté',
    phone1: '+225 07 55 66 77 88',
    city: 'Abidjan',
    deliveryZoneId: 'zone-8',
    deliveryZone: zoneById('zone-8'),
    district: 'Plateau, Rue du Commerce',
    items: [
      {
        productId: 'prod-7',
        product: productById('prod-7'),
        quantity: 2,
        unitPrice: 8000,
      },
    ],
    subtotal: 16000,
    deliveryFee: 1500,
    total: 17500,
    paymentMethod: 'cash_on_delivery',
    status: 'delivered',
    createdAt: '2026-06-28T09:45:00.000Z',
  },
  {
    id: 'order-4',
    customerName: 'Fatou Bamba',
    phone1: '+225 01 99 88 77 66',
    city: 'Abidjan',
    deliveryZoneId: 'zone-9',
    deliveryZone: zoneById('zone-9'),
    district: 'Port-Bouet Vridi',
    items: [
      {
        productId: 'prod-4',
        product: productById('prod-4'),
        quantity: 1,
        unitPrice: 24000,
        size: 'M',
      },
    ],
    subtotal: 24000,
    deliveryFee: 2000,
    total: 26000,
    paymentMethod: 'wave',
    status: 'cancelled',
    createdAt: '2026-07-05T17:00:00.000Z',
  },
  {
    id: 'order-5',
    customerName: 'Ibrahim Traoré',
    phone1: '+225 07 44 55 66 77',
    city: 'Bouaké',
    deliveryZoneId: 'zone-11',
    deliveryZone: zoneById('zone-11'),
    district: 'Gare routière Bouaké',
    items: [
      {
        productId: 'prod-11',
        product: productById('prod-11'),
        quantity: 1,
        unitPrice: 25000,
        size: '43',
      },
      {
        productId: 'prod-8',
        product: productById('prod-8'),
        quantity: 1,
        unitPrice: 7000,
      },
    ],
    subtotal: 32000,
    deliveryFee: 2500,
    total: 34500,
    paymentMethod: 'cash_on_delivery',
    status: 'paid',
    createdAt: '2026-07-20T11:20:00.000Z',
  },
];
