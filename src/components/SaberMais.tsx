import Image from 'next/image';
import { CalendarDays, CreditCard, Package, Truck } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import CtaButton from './CtaButton';
import { site } from '@/lib/site';

const items = [
  {
    icon: CalendarDays,
    label: 'Fabricação',
    value: `${site.productionDays} dias úteis`,
    text: 'Contados a partir da aprovação do layout.',
  },
  {
    icon: Truck,
    label: 'Entrega',
    value: `${site.shippingDays} dias úteis`,
    text: 'O pedido sai daqui direto para o seu endereço.',
  },
  {
    icon: Package,
    label: 'Pedido mínimo',
    value: `${site.minOrder} unidades`,
    text: 'Quanto maior a quantidade, melhor o valor por peça.',
  },
  {
    icon: CreditCard,
    label: 'Pagamento',
    value: 'Pix, boleto ou cartão',
    text: 'Você escolhe a forma que ficar melhor.',
  },
];

export default function SaberMais() {
  return (
    <section id="saber-mais" className="relative overflow-hidden bg-ink-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          {/* Painel azul com o recorte */}
          <AnimatedSection animation="fadeInLeft">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              <div className="grain relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-700 to-ink-950 px-6 pt-10">
                <div className="bg-grid absolute inset-0 opacity-60" />
                <div className="glow absolute -left-16 -top-16 size-56 text-brand-400/25 [--glow-spread:6rem]" />
                <Image
                  src="/images/homem-segurando-celular.png"
                  alt="Pessoa consultando o orçamento de bonés pelo celular"
                  width={826}
                  height={1123}
                  // A imagem nunca passa de max-w-xs (320px), em qualquer tela
                  sizes="320px"
                  className="relative mx-auto h-auto w-full max-w-xs object-contain drop-shadow-2xl"
                />
              </div>

              <div className="absolute -right-4 top-8 rotate-3 rounded-2xl bg-white px-4 py-3 shadow-card-hover">
                <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-ink-400">
                  Atendimento
                </p>
                <p className="font-display text-base font-bold text-ink-950">
                  Direto no WhatsApp
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Conteúdo */}
          <div>
            <AnimatedSection animation="fadeInRight">
              <SectionHeading
                align="left"
                eyebrow="Antes de pedir"
                title="O que preciso"
                highlight="saber?"
                description="Tudo o que costuma ser perguntado antes de fechar o pedido, sem letras miúdas."
                className="max-w-xl"
              />
            </AnimatedSection>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {items.map((item, index) => (
                <AnimatedSection
                  key={item.label}
                  animation="fadeInUp"
                  delay={0.08 * index}
                >
                  <div className="group h-full rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                      <item.icon className="size-5" />
                    </span>
                    <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-widest text-ink-400">
                      {item.label}
                    </p>
                    <p className="mt-1 font-display text-xl font-bold text-ink-950">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.text}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="fadeInUp" delay={0.4}>
              <div className="mt-10">
                <CtaButton>Tirar dúvidas no WhatsApp</CtaButton>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
