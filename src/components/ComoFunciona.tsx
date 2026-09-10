import Image from 'next/image';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import CtaButton from './CtaButton';
import { site } from '@/lib/site';

const steps = [
  {
    title: 'Solicite o orçamento',
    text: 'Clique no botão e abra uma conversa direta com a gente no WhatsApp.',
  },
  {
    title: 'Fale com um consultor',
    text: 'Um consultor entende a sua ideia, tira as dúvidas e monta o layout do boné.',
  },
  {
    title: 'Hora da fabricação',
    text: `Com o layout aprovado, o pedido entra em produção em até ${site.productionDays} dias úteis.`,
  },
  {
    title: 'Receba no seu endereço',
    text: `Enviamos o pedido pronto e você recebe em cerca de ${site.shippingDays} dias úteis.`,
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="bg-grid-light absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,#000,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <SectionHeading
            eyebrow="Como funciona"
            title="Do primeiro contato à"
            highlight="entrega"
            description="Quatro passos simples. Sem burocracia, sem formulário longo — é só chamar no WhatsApp."
          />
        </AnimatedSection>

        <div className="mt-16 grid items-center gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Foto */}
          <AnimatedSection animation="fadeInLeft" delay={0.1} className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-sm lg:max-w-md">
              <div className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl border-2 border-brand-600/25" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card-hover">
                <Image
                  src="/images/WhatsApp-Image-2024-12-03-at-14.28.25-1.jpeg"
                  alt="Bonés personalizados produzidos pela Bonno"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
              </div>

              <div className="absolute -right-3 bottom-8 rounded-2xl bg-white p-4 shadow-card-hover sm:-right-6">
                <p className="font-display text-3xl font-extrabold text-brand-600">
                  {site.productionDays}
                </p>
                <p className="text-xs font-medium leading-tight text-ink-500">
                  dias úteis
                  <br />
                  de fabricação
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* Passos */}
          <div className="order-1 lg:order-2">
            <ol className="relative space-y-2">
              {/* Linha que conecta os passos */}
              <span
                className="absolute left-[1.4rem] top-8 bottom-14 w-px bg-gradient-to-b from-brand-600 via-brand-600/40 to-transparent"
                aria-hidden="true"
              />

              {steps.map((step, index) => (
                <AnimatedSection
                  key={step.title}
                  animation="fadeInRight"
                  delay={0.1 + index * 0.1}
                >
                  <li className="group relative flex gap-5 rounded-2xl p-4 transition-colors duration-300 hover:bg-ink-50">
                    <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-bold text-white shadow-glow transition-transform duration-300 group-hover:scale-110">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="pt-1">
                      <h3 className="font-display text-lg font-bold text-ink-950">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                        {step.text}
                      </p>
                    </div>
                  </li>
                </AnimatedSection>
              ))}
            </ol>

            <AnimatedSection animation="fadeInUp" delay={0.5}>
              <div className="mt-10 pl-4">
                <CtaButton>Começar meu orçamento</CtaButton>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
