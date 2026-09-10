export const site = {
  name: 'Bonno Personalizados',
  shortName: 'Bonno',
  url: 'https://bonnopersonalizados.com',
  tagline: 'Bonés personalizados sob encomenda',
  phoneDisplay: '(84) 99827-1330',
  phoneE164: '+5584998271330',
  whatsappNumber: '5584998271330',
  instagram: 'https://www.instagram.com/bonno_personalizados',
  instagramHandle: '@bonno_personalizados',
  address: {
    street: 'Rua Lúcia Viveiros, 255',
    district: 'Neópolis',
    city: 'Natal',
    state: 'RN',
    zip: '59086-005',
  },
  minOrder: 30,
  productionDays: 20,
  shippingDays: 7,
} as const;

const DEFAULT_MESSAGE =
  'Olá! Vim pelo site e gostaria de solicitar um orçamento de bonés personalizados.';

/** Link do WhatsApp já com a mensagem preenchida, para o cliente só apertar enviar. */
export function whatsappLink(message: string = DEFAULT_MESSAGE) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const navLinks = [
  { name: 'Início', href: '#principal' },
  { name: 'Como funciona', href: '#como-funciona' },
  { name: 'Modelos', href: '#modelos' },
  { name: 'Clientes', href: '#clientes' },
  { name: 'Dúvidas', href: '#duvidas' },
  { name: 'Contato', href: '#contato' },
] as const;
