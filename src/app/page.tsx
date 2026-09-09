import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ComoFunciona from '@/components/ComoFunciona';
import SaberMais from '@/components/SaberMais';
import Modelos from '@/components/Modelos';
import Clientes from '@/components/Clientes';
import Contato from '@/components/Contato';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ComoFunciona />
      <SaberMais />
      <Modelos />
      <Clientes />
      <Contato />
    </main>
  );
}
