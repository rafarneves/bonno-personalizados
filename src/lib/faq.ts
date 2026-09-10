import { site } from './site';

export const faq = [
  {
    question: 'Qual é o pedido mínimo?',
    answer: `O pedido mínimo é de ${site.minOrder} unidades. Quanto maior a quantidade, melhor fica o valor por peça — o consultor te passa a tabela na hora do orçamento.`,
  },
  {
    question: 'Quanto tempo leva para o pedido ficar pronto?',
    answer: `A fabricação leva ${site.productionDays} dias úteis a partir da aprovação do layout, e a entrega, cerca de ${site.shippingDays} dias úteis.`,
  },
  {
    question: 'Quais modelos de boné vocês produzem?',
    answer:
      'Trabalhamos com Trucker, Americano, Americano aba reta, 6 gomos, 6 gomos aba reta, Dad hat e Viseira. Todos podem ser personalizados com a sua identidade visual.',
  },
  {
    question: 'Posso enviar o logo da minha marca?',
    answer:
      'Pode sim. Basta mandar a sua arte ou o seu logo pelo WhatsApp que o consultor monta o layout do boné e envia para você aprovar antes da produção.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer: 'Aceitamos Pix, boleto e cartão. Você escolhe a que ficar melhor para você.',
  },
  {
    question: 'Vocês entregam em outras cidades?',
    answer: `Nossa produção fica em ${site.address.city}/${site.address.state} e o pedido é enviado para o endereço que você indicar. Fale com o consultor para combinar o envio.`,
  },
  {
    question: 'Como faço para solicitar um orçamento?',
    answer:
      'É só clicar em qualquer botão de orçamento do site. A conversa abre direto no WhatsApp com um consultor, que entende a sua ideia e passa o valor.',
  },
] as const;
