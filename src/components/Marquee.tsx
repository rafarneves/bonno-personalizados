const words = [
  'Empresas',
  'Formaturas',
  'Times',
  'Eventos',
  'Brindes',
  'Uniformes',
  'Igrejas',
  'Lojas',
];

function Track() {
  return (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden="true">
      {words.map((word) => (
        <li
          key={word}
          className="flex items-center gap-10 font-display text-xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-2xl"
        >
          {word}
          <svg viewBox="0 0 24 24" className="size-4 shrink-0 fill-white/60">
            <path d="M12 0l2.9 8.4L23 12l-8.1 3.6L12 24l-2.9-8.4L1 12l8.1-3.6z" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

/** Faixa infinita entre o topo e o conteúdo — dá movimento e diz para quem a Bonno produz. */
export default function Marquee() {
  return (
    <div className="relative -mt-px overflow-hidden bg-brand-600 py-4">
      <p className="sr-only">
        A Bonno produz bonés personalizados para {words.join(', ')}.
      </p>
      <div className="flex w-max items-center animate-marquee">
        <Track />
        <Track />
      </div>
    </div>
  );
}
