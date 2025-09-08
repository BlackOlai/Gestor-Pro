import { Expert, Category } from '../types';

// Importar avatares locais
import AndreAvatar from '../assets/avatars/Andre.webp';
import CarlaAvatar from '../assets/avatars/Carla.webp';
import JoaoAvatar from '../assets/avatars/Joao.webp';
import LucianaAvatar from '../assets/avatars/Luciana.webp';
import PedroAvatar from '../assets/avatars/Pedro.webp';
import FernandaAvatar from '../assets/avatars/Fernanda.webp';
import RafaelAvatar from '../assets/avatars/Rafael.webp';
import BiancaAvatar from '../assets/avatars/Bianca.webp';
import LucasAvatar from '../assets/avatars/Lucas.webp';
import MarcosAvatar from '../assets/avatars/Marcos.webp';
import CarlosAvatar from '../assets/avatars/Carlos.webp';
import MarceloAvatar from '../assets/avatars/Marcelo.webp';
import JoanaAvatar from '../assets/avatars/Joana.webp';
import MariaAvatar from '../assets/avatars/Maria.webp';
import RobertoAvatar from '../assets/avatars/Roberto.webp';
import JulianaAvatar from '../assets/avatars/Juliana.webp';
import FabioAvatar from '../assets/avatars/Fabio.webp';
import PaulaAvatar from '../assets/avatars/Paula.webp';
import SergioAvatar from '../assets/avatars/Sergio.webp';
import RicardoAvatar from '../assets/avatars/Ricardo.webp';
import CamilaAvatar from '../assets/avatars/Camila.webp';
import HenriqueAvatar from '../assets/avatars/Henrique.webp';
import PatriciaAvatar from '../assets/avatars/Patricia.webp';
import DanielAvatar from '../assets/avatars/Daniel.webp';
import EduardoAvatar from '../assets/avatars/Eduardo_.webp';
import NataliaAvatar from '../assets/avatars/Natalia.webp';
import GustavoAvatar from '../assets/avatars/Gustavo.webp';
import IsabelaAvatar from '../assets/avatars/Isabela.webp';
import ThiagoAvatar from '../assets/avatars/Thiago.webp';

export const experts: Record<Category, Expert[]> = {
  vendas: [
    {
      id: 'andre-prospeccao',
      name: 'André',
      specialty: 'Especialista em prospecção B2B',
      avatar: AndreAvatar,
      category: 'vendas'
    },
    {
      id: 'carla-roteiros',
      name: 'Carla',
      specialty: 'Criadora de roteiros de vendas consultivas',
      avatar: CarlaAvatar,
      category: 'vendas'
    },
    {
      id: 'joao-crm',
      name: 'João',
      specialty: 'Estrategista de CRM e follow-up',
      avatar: JoaoAvatar,
      category: 'vendas'
    },
    {
      id: 'luciana-negociacao',
      name: 'Luciana',
      specialty: 'Especialista em negociação e fechamento',
      avatar: LucianaAvatar,
      category: 'vendas'
    },
    {
      id: 'pedro-upsell',
      name: 'Pedro',
      specialty: 'Treinador em técnicas de upsell e cross-sell',
      avatar: PedroAvatar,
      category: 'vendas'
    }
  ],
  marketing: [
    {
      id: 'fernanda-funil',
      name: 'Fernanda',
      specialty: 'Especialista em funil de vendas digitais',
      avatar: FernandaAvatar,
      category: 'marketing'
    },
    {
      id: 'rafael-anuncios',
      name: 'Rafael',
      specialty: 'Criador de estratégias de anúncios pagos',
      avatar: RafaelAvatar,
      category: 'marketing'
    },
    {
      id: 'bianca-social',
      name: 'Bianca',
      specialty: 'Especialista em redes sociais e engajamento',
      avatar: BiancaAvatar,
      category: 'marketing'
    },
    {
      id: 'lucas-email',
      name: 'Lucas',
      specialty: 'Criador de campanhas de e-mail marketing',
      avatar: LucasAvatar,
      category: 'marketing'
    }
  ],
  pessoas: [
    {
      id: 'marcos-formacao',
      name: 'Marcos',
      specialty: 'Especialista em formação de pessoas',
      avatar: MarcosAvatar,
      category: 'pessoas'
    },
    {
      id: 'carlos-vagas',
      name: 'Carlos',
      specialty: 'Criador de anúncios de vagas',
      avatar: CarlosAvatar,
      category: 'pessoas'
    },
    {
      id: 'marcelo-cargos',
      name: 'Marcelo',
      specialty: 'Criador de descrição de cargos',
      avatar: MarceloAvatar,
      category: 'pessoas'
    },
    {
      id: 'joana-cultural',
      name: 'Joana',
      specialty: 'Especialista em reset cultural',
      avatar: JoanaAvatar,
      category: 'pessoas'
    },
    {
      id: 'maria-feedbacks',
      name: 'Maria',
      specialty: 'Especialista em feedbacks',
      avatar: MariaAvatar,
      category: 'pessoas'
    }
  ],
  processos: [
    {
      id: 'roberto-mapeamento',
      name: 'Roberto',
      specialty: 'Especialista em mapeamento de processos',
      avatar: RobertoAvatar,
      category: 'processos'
    },
    {
      id: 'juliana-melhoria',
      name: 'Juliana',
      specialty: 'Especialista em melhoria contínua (Lean/Kaizen)',
      avatar: JulianaAvatar,
      category: 'processos'
    },
    {
      id: 'fabio-automacao',
      name: 'Fábio',
      specialty: 'Consultor em automação e produtividade',
      avatar: FabioAvatar,
      category: 'processos'
    },
    {
      id: 'paula-qualidade',
      name: 'Paula',
      specialty: 'Especialista em gestão da qualidade (ISO)',
      avatar: PaulaAvatar,
      category: 'processos'
    },
    {
      id: 'sergio-ageis',
      name: 'Sérgio',
      specialty: 'Estrategista em metodologias ágeis (Scrum/Kanban)',
      avatar: SergioAvatar,
      category: 'processos'
    }
  ],
  financas: [
    {
      id: 'ricardo-planejamento',
      name: 'Ricardo',
      specialty: 'Consultor em planejamento financeiro empresarial',
      avatar: RicardoAvatar,
      category: 'financas'
    },
    {
      id: 'camila-fluxo',
      name: 'Camila',
      specialty: 'Especialista em fluxo de caixa e capital de giro',
      avatar: CamilaAvatar,
      category: 'financas'
    },
    {
      id: 'henrique-custos',
      name: 'Henrique',
      specialty: 'Analista de custos e precificação',
      avatar: HenriqueAvatar,
      category: 'financas'
    },
    {
      id: 'patricia-orcamento',
      name: 'Patrícia',
      specialty: 'Consultora em controle orçamentário',
      avatar: PatriciaAvatar,
      category: 'financas'
    },
    {
      id: 'daniel-indicadores',
      name: 'Daniel',
      specialty: 'Especialista em indicadores financeiros e relatórios gerenciais',
      avatar: DanielAvatar,
      category: 'financas'
    }
  ],
  estrategia: [
    {
      id: 'eduardo-planejamento',
      name: 'Eduardo',
      specialty: 'Especialista em planejamento estratégico',
      avatar: EduardoAvatar,
      category: 'estrategia'
    },
    {
      id: 'natalia-mercado',
      name: 'Natália',
      specialty: 'Estrategista em análise de mercado e concorrência',
      avatar: NataliaAvatar,
      category: 'estrategia'
    },
    {
      id: 'gustavo-inovacao',
      name: 'Gustavo',
      specialty: 'Mentor em inovação e transformação digital',
      avatar: GustavoAvatar,
      category: 'estrategia'
    },
    {
      id: 'isabela-governanca',
      name: 'Isabela',
      specialty: 'Consultora em governança corporativa',
      avatar: IsabelaAvatar,
      category: 'estrategia'
    },
    {
      id: 'thiago-okrs',
      name: 'Thiago',
      specialty: 'Especialista em OKRs e metas empresariais',
      avatar: ThiagoAvatar,
      category: 'estrategia'
    }
  ]
};