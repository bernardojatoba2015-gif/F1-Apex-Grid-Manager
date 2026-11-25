import React from 'react';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Flag,
  Handshake,
  Play,
  TrendingUp,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react';
import { F1CarLivery } from './visuals/F1CarLivery';

interface AboutGamePageProps {
  onPlayNow: () => void;
  onGoHome: () => void;
}

export const AboutGamePage: React.FC<AboutGamePageProps> = ({ onPlayNow, onGoHome }) => {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 relative overflow-x-hidden flex flex-col">
      {/* Paddock backdrop matching main menu */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="/src/assets/images/hero_f1_paddock_1795450822007.jpg"
          alt="Garagem de Fórmula 1 no paddock do Apex Grid"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14] via-[#0B0E14]/92 to-[#0B0E14]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-[#0B0E14]/85" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 px-6 lg:px-10 py-4 flex items-center justify-between gap-4 bg-[#0B0E14]/80 backdrop-blur-md">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded bg-[#E10600] flex items-center justify-center font-display font-extrabold text-sm tracking-tight text-white">
            F1
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white whitespace-nowrap group-hover:text-slate-200 transition-colors">
            Apex Grid Manager
          </span>
        </a>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden sm:inline font-display text-xs sm:text-sm font-medium tracking-wider text-white/35 select-none whitespace-nowrap">
            creator: Bernardo Jatobá
          </span>
          <button
            type="button"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar à Página Inicial
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-5 lg:px-10 py-10 lg:py-14 space-y-12">
        {/* Hero Presentation */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ff5a54]">
              Guia Oficial do Simulador · Temporadas 2025 e 2026
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Apex Grid F1 Team Manager – Jogo Online de Gerenciamento de Fórmula 1
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              O <strong className="text-white">Apex Grid F1 Team Manager</strong> é um simulador de F1 online
              gratuito para navegador criado para quem quer viver o dia a dia de um chefe de equipe no paddock.
              Neste jogo de Fórmula 1 focado em gerenciamento de equipe de F1, você comanda todas as decisões
              estratégicas fora e dentro da pista, com salvamento automático direto no seu navegador.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onPlayNow}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#E10600] hover:bg-[#c80500] text-white font-display font-bold text-sm tracking-wide transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                JOGAR AGORA
              </button>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  onGoHome();
                }}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#141A24] hover:bg-[#1B2331] border border-white/10 text-slate-200 text-sm font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à Página Inicial
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#121722]/90 border border-white/10 rounded-2xl p-6 space-y-5 backdrop-blur-md">
            <div className="text-xs font-medium text-slate-400">
              Simulador de F1 Online no Navegador
            </div>
            <F1CarLivery
              primaryColor="#E10600"
              secondaryColor="#141821"
              accentColor="#FACC15"
              pattern="aero"
              shortName="APX"
              carNumber={1}
              sponsorLabel="APEX GRID"
            />
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/10 text-center">
              <div>
                <div className="font-mono-tabular text-xl font-bold text-white">24</div>
                <div className="text-xs text-slate-400 mt-0.5">Grandes Prêmios</div>
              </div>
              <div>
                <div className="font-mono-tabular text-xl font-bold text-white">F1 + F2</div>
                <div className="text-xs text-slate-400 mt-0.5">Mercado Completo</div>
              </div>
              <div>
                <div className="font-mono-tabular text-xl font-bold text-white">6 Áreas</div>
                <div className="text-xs text-slate-400 mt-0.5">Evolução do Carro</div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Feature Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gerenciamento de escuderias */}
          <section className="bg-[#121722]/90 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#ff4d47]">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                Como funciona o gerenciamento de escuderias
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Você escolhe entre dois modos de carreira: assumir uma das escuderias oficiais dos grids de 2025
              ou 2026 — como Ferrari, McLaren, Red Bull, Mercedes, Aston Martin, Williams, Alpine, Racing Bulls,
              Haas, Audi/Sauber e Cadillac — ou fundar sua própria equipe personalizada do zero.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ao criar uma escuderia, você define nome, sigla, pintura do carro, escudo ou logo personalizada por
              imagem, fornecedor de motor, orçamento inicial e metas. Dentro do gerenciamento de equipe de F1, você
              também contrata seu staff técnico, expande fábrica, túnel de vento e simulador e participa de reuniões
              com a diretoria para manter a confiança do conselho e evitar demissão.
            </p>
          </section>

          {/* Contratação de pilotos, contratos e patrocinadores */}
          <section className="bg-[#121722]/90 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                Contratação de pilotos, contratos e patrocinadores
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              O mercado reúne estrelas da Fórmula 1, pilotos sem equipe, reservas e talentos da Fórmula 2. Você pode
              definir os 2 pilotos titulares e o piloto reserva da equipe, negociar salário anual, tempo de contrato
              e posição no elenco — respondendo a contrapropostas realistas ou pagando multa rescisória quando o
              piloto tiver vínculo ativo com outra escuderia.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
              <Handshake className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              <span>
                Para sustentar o projeto, você assina contratos com patrocinadores principais e secundários que
                oferecem bônus imediato de assinatura, pagamentos fixos por Grande Prêmio e premiações extras ao
                cumprir objetivos de reputação e classificação nos construtores.
              </span>
            </p>
          </section>

          {/* Desenvolvimento dos carros e administração financeira */}
          <section className="bg-[#121722]/90 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                Desenvolvimento dos carros e administração financeira
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cada carro possui seis áreas técnicas avaliadas de 0 a 100: motor, aerodinâmica, chassi, suspensão,
              freios e confiabilidade. Você escolhe projetos de atualização padrão ou focados na fila de
              desenvolvimento, contando com o impacto direto da sua equipe técnica e das instalações da sede
              enquanto as equipes rivais controladas pela simulação também evoluem.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-amber-300 shrink-0 mt-1" />
              <span>
                Na administração financeira, todas as receitas de prêmios e patrocínios são registradas etapa por
                etapa frente aos custos de salários de pilotos e staff, unidade de potência, expansão de sede e
                pesquisa e desenvolvimento, garantindo controle completo do saldo do caixa.
              </span>
            </p>
          </section>

          {/* Temporadas, Grandes Prêmios e campeonatos */}
          <section className="bg-[#121722]/90 border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                <Trophy className="w-5 h-5" />
              </div>
              <h2 className="font-display text-xl font-bold text-white">
                Temporadas, Grandes Prêmios e campeonatos
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cada temporada segue um calendário oficial de 24 Grandes Prêmios com circuitos de alta potência,
              exigência aerodinâmica, pistas de rua e traçados equilibrados, além de previsão climática variando de
              pista seca a chuva leve ou tempestade.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
              <Calendar className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
              <span>
                As etapas são simuladas automaticamente com sessão classificatória, grid de largada, corrida completa,
                abandono por falha ou incidente, volta mais rápida e distribuição oficial de pontos. Ao final dos 24
                GPs, você passa pela janela de transferências e segue para novas temporadas com histórico de campeões
                e conquistas salvas neste jogo de Fórmula 1.
              </span>
            </p>
          </section>
        </div>

        {/* Bottom CTA */}
        <section className="bg-[#131823] border border-white/15 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Flag className="w-4 h-4" />
              Pronto para assumir o pit wall?
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Comece sua carreira agora no Apex Grid F1 Team Manager
            </h2>
            <p className="text-sm text-slate-300">
              Crie sua escuderia ou assuma um time do grid oficial e teste suas decisões neste simulador de F1 online.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onPlayNow}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#E10600] hover:bg-[#c80500] text-white font-display font-bold text-sm tracking-wide transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              JOGAR AGORA
            </button>
            <button
              type="button"
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 text-slate-200 text-sm font-semibold transition-colors cursor-pointer"
            >
              Voltar à Página Inicial
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
