import { Plus } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import SectionHeading from './SectionHeading';
import CtaButton from './CtaButton';
import { faq } from '@/lib/faq';

export default function Faq() {
  return (
    <section id="duvidas" className="relative overflow-hidden bg-ink-50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1fr] lg:gap-16">
          <AnimatedSection animation="fadeInLeft">
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                align="left"
                eyebrow="Dúvidas frequentes"
                title="Ainda com"
                highlight="alguma dúvida?"
                description="Reunimos aqui as perguntas que mais chegam no nosso WhatsApp. Se a sua não estiver na lista, é só chamar."
              />
              <div className="mt-8">
                <CtaButton size="md">Falar com um consultor</CtaButton>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.1}>
            <div className="divide-y divide-ink-200 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
              {faq.map((item, index) => (
                <details key={item.question} className="group" name="faq" open={index === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-ink-50 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-brand-600 sm:px-8">
                    <h3 className="font-display text-base font-bold text-ink-950 sm:text-lg">
                      {item.question}
                    </h3>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition-all duration-300 group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">
                      <Plus className="size-4" />
                    </span>
                  </summary>
                  <div className="px-6 pb-6 pr-16 text-sm leading-relaxed text-ink-600 sm:px-8 sm:text-base">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
