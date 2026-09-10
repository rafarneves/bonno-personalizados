import Image from 'next/image';

interface LogoProps {
  /** `dark` = fundo escuro (marca em branco), `light` = fundo claro (marca em azul). */
  tone?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ tone = 'light', className = '' }: LogoProps) {
  const isDark = tone === 'dark';

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/images/icone-bonno-300x300.png"
        alt=""
        // Tamanho real na tela (no máximo 40px). Com 300, o navegador baixava a versão de 640px.
        width={40}
        height={40}
        className={`size-9 w-auto shrink-0 transition-[filter] duration-300 sm:size-10 ${
          isDark ? 'brightness-0 invert' : ''
        }`}
        loading="eager"
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.35rem] font-extrabold tracking-tight transition-colors duration-300 sm:text-2xl ${
            isDark ? 'text-white' : 'text-ink-950'
          }`}
        >
          Bonno
        </span>
        <span
          className={`mt-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.3em] transition-colors duration-300 ${
            isDark ? 'text-white/55' : 'text-ink-500'
          }`}
        >
          Personalizados
        </span>
      </span>
    </span>
  );
}
