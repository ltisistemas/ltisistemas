import {
  ServiceItem,
  PortfolioItem,
  TechCategory,
  ExperienceItem,
  MetricItem,
  PillarItem,
} from "./types";

export const siteConfig = {
  name: "LTI Sistemas",
  fullName: "LTI Sistemas - Engenharia de Software & Soluções Corporativas",
  founder: "Luiz Felipe Marinho Dantas",
  founderRole: "Fundador & Diretor de Engenharia / Chief Solutions Architect",
  experienceYears: "20+",
  slogan: "Engenharia de Software de Alta Complexidade | Arquitetura | Liderança Técnica",
  tagline:
    "Desenvolvemos sistemas corporativos de missão crítica, arquiteturas cloud-native escaláveis, modernização de legados e aceleramos squads com excelência técnica.",
  companyBio:
    "A LTI Sistemas é uma empresa de engenharia de software e consultoria em arquitetura tecnológica de alta performance. Fundada e liderada pelo arquiteto sênior Luiz Felipe Marinho Dantas (20 anos de experiência prática em ambientes corporativos de missão crítica), atuamos como parceiro estratégico para empresas, CTOs e produtos digitais que demandam robustez, escalabilidade e velocidade com governança.",
  contact: {
    whatsappUrl:
      "https://wa.me/5581973123278?text=Ol%C3%A1%2C%20LTI%20Sistemas!%20Gostaria%20de%20conversar%20sobre%20uma%20proposta%20ou%20consultoria%20corporativa.",
    whatsappDisplay: "+55 (81) 97312-3278",
    phone: "81973123278",
    linkedinUrl: "https://www.linkedin.com/in/luizfelipemarinhodantas/",
    githubUrl: "https://github.com",
    email: "luizltisistemas@gmail.com",
    location: "Brasil / Atendimento Global",
    availability: "Novos Projetos Corporativos & Squad Acceleration",
  },
};

export const impactMetrics: MetricItem[] = [
  {
    value: "20+",
    label: "Anos de Know-How",
    description: "Sólida bagagem de engenharia e governança em projetos enterprise e sistemas críticos.",
  },
  {
    value: "+900%",
    label: "Aumento de Vazão",
    description: "Benchmark de performance em esteiras de prevenção a fraudes em ambiente bancário.",
  },
  {
    value: "4",
    label: "Produtos em Produção",
    description: "Plataformas e ecossistemas SaaS desenvolvidos e operando ativamente em produção.",
  },
  {
    value: "100%",
    label: "Foco em Alta Disponibilidade",
    description: "Padrão de arquitetura desacoplada, Clean Architecture e esteiras automatizadas de CI/CD.",
  },
];

export const companyPillars: PillarItem[] = [
  {
    title: "Engenharia Orientada a Negócios",
    description:
      "Construímos software com foco direto no valor gerado para sua empresa: escalabilidade real, redução de custos operacionais e segurança de dados.",
    iconName: "Shield",
  },
  {
    title: "Governança & Rigor Arquitetural",
    description:
      "Aplicamos Clean Architecture, Domain-Driven Design (DDD) e TDD para que seu sistema possa crescer por anos sem criar débitos técnicos intransponíveis.",
    iconName: "Boxes",
  },
  {
    title: "Liderança Técnica & Mentoria de Squads",
    description:
      "Elevamos a maturidade do seu time com code reviews rigorosos, pair programming, padronização de esteiras de CI/CD e boas práticas de engenharia.",
    iconName: "Users2",
  },
  {
    title: "Modernização sem Downtime",
    description:
      "Metodologia comprovada para decompor monólitos e sistemas legados para arquiteturas em nuvem de forma progressiva e segura, sem paradas no negócio.",
    iconName: "Layers",
  },
];

export const servicesData: ServiceItem[] = [
  {
    id: "custom-software-engineering",
    title: "Engenharia de Software Sob Medida",
    subtitle: "Sistemas corporativos robustos, alta concorrência e processamento em escala",
    description:
      "Desenvolvimento de ecossistemas de software corporativo de ponta a ponta com tolerância a falhas, concorrência refinada e processamento distribuído. Entregamos aplicações resilientes com código limpo e manutenível desde o primeiro deploy.",
    deliverables: [
      "Desenvolvimento de microsserviços e monólitos modulares resilientes",
      "Otimização de latência, throughput e profiling de desempenho",
      "Construção de APIs RESTful e gRPC de altíssima performance",
      "Refatoração profunda e engenharia de resiliência de software",
    ],
    technologies: ["C# .NET Core 8", "Node.js (NestJS)", "TypeScript", "PostgreSQL", "Redis"],
    iconName: "Cpu",
  },
  {
    id: "software-architecture-consulting",
    title: "Consultoria em Arquitetura & Cloud-Native",
    subtitle: "Design de soluções modernas, escaláveis e desacopladas em nuvem",
    description:
      "Desenho e governança arquitetural estratégica para empresas que precisam de soluções capazes de suportar hipercrescimento sem instabilidade. Estruturação de ecossistemas orientados a eventos e governança em nuvem.",
    deliverables: [
      "Clean Architecture, Hexagonal e Domain-Driven Design (DDD)",
      "Arquiteturas orientadas a eventos (Event-Driven) e mensageria",
      "Desenho de Microfrontends e Design Systems corporativos",
      "Modelagem de dados distribuída e governança de infraestrutura",
    ],
    technologies: ["AWS Cloud", "Terraform IaC", "Docker", "EventBridge", "Microservices"],
    iconName: "Boxes",
  },
  {
    id: "tech-lead-squad-acceleration",
    title: "Liderança Técnica & Squad Acceleration",
    subtitle: "Alocação de Tech Lead, mentoria de engenharia e governança de qualidade",
    description:
      "Acelere a velocidade e qualidade do seu time com liderança técnica experiente atuando hands-on. Estabelecemos esteiras de qualidade, padrões de código, code reviews rigorosos e capacitação contínua para sua squad.",
    deliverables: [
      "Liderança técnica hands-on e alinhamento de engenharia com negócios",
      "Code Reviews aprofundados e definição de padrões de qualidade",
      "Mentoria técnica continuada e capacitação de desenvolvedores",
      "Gestão de dívida técnica, segurança no código e esteiras de CI/CD",
    ],
    technologies: ["CI/CD Governance", "Code Review Standards", "Agile Engineering", "TDD"],
    iconName: "Users",
  },
  {
    id: "legacy-modernization",
    title: "Modernização de Sistemas Legados",
    subtitle: "Evolução arquitetural progressiva com zero downtime para a operação",
    description:
      "Modernizamos sistemas legados complexos através de estratégias progressivas de refatoração e migração para a nuvem, garantindo a integridade dos dados e das regras de negócio sem interromper o funcionamento diário da sua empresa.",
    deliverables: [
      "Mapeamento detalhado e diagnóstico de dívida técnica",
      "Estratégia de decomposição progressiva (Strangler Fig Pattern)",
      "Criação de camadas de interoperabilidade e APIs intermediárias",
      "Redução drástica de custos de infraestrutura e tempo de manutenção",
    ],
    technologies: ["Cloud Migration", "Refactoring", "API Gateways", "AWS / Azure"],
    iconName: "CloudCog",
  },
  {
    id: "fullstack-product-development",
    title: "Desenvolvimento de Produtos Digitais & SaaS",
    subtitle: "Soluções completas com experiência refinada, alta performance e conversão",
    description:
      "Da esteira de concepção à produção: desenvolvemos aplicações web e mobile completas com interfaces modernas, alta velocidade de carregamento e arquitetura pronta para escalar.",
    deliverables: [
      "Aplicações web modernas e responsivas em Next.js, React e TypeScript",
      "Sistemas corporativos robustos com Angular e Vue.js",
      "Aplicativos móveis nativos e híbridos com Flutter",
      "Integrações de pagamentos, autenticação corporativa e gateways B2B",
    ],
    technologies: ["Next.js", "React", "Angular", "Tailwind CSS", "Flutter"],
    iconName: "Layers",
  },
];

export const portfolioProjects: PortfolioItem[] = [
  {
    id: "credit-flow-app",
    title: "Credit Flow App",
    category: "Fintech & Gestão de Crédito",
    shortDescription:
      "Plataforma completa de automação e concessão de crédito com esteira de análise cadastral e simulação em tempo real.",
    fullDescription:
      "Solução corporativa desenvolvida pela LTI Sistemas para otimizar jornadas complexas de crédito financeiro. O sistema unifica simulação financeira reativa, validação de regras de risco, esteira de aprovação com múltiplos papéis e painel analítico para tomadores e gestores de crédito.",
    url: "https://credit-flow-app.vercel.app/",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Financial Engine", "Lucide UI"],
    highlights: [
      "Fluxo de análise e concessão de crédito 100% automatizado",
      "Simulador financeiro reativo com parametrização de parcelamento",
      "Interface corporativa com alta segurança e acessibilidade",
      "Em produção ativa e validada no Vercel",
    ],
    status: "Em Produção",
    badgeColor: "emerald",
  },
  {
    id: "mainfast-mvp",
    title: "MainFast - Fábrica de MVP",
    category: "SaaS & Aceleração de Produtos",
    shortDescription:
      "Plataforma de esteira acelerada de prototipagem, arquitetura modular e lançamento rápido de novos produtos digitais.",
    fullDescription:
      "Ecossistema modular concebido pela LTI Sistemas para acelerar a concepção e lançamento de produtos web de alta qualidade. Reduz o time-to-market de novas iniciativas em até 60% com componentes prontos e arquitetura preparada para hiper-escala.",
    url: "https://mainfast-fabrica-de-mvp-webapp-reac.vercel.app/",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Modular Architecture", "MVP Accelerator"],
    highlights: [
      "Esteira ultra-rápida de prototipagem e validação de produtos",
      "Arquitetura escalável desenhada para suportar hipercrescimento",
      "Componentes de conversão e onboarding otimizados",
      "Em produção ativa e validada no Vercel",
    ],
    status: "Em Produção",
    badgeColor: "emerald",
  },
  {
    id: "meu-fluxo-financeiro",
    title: "Meu Fluxo Financeiro",
    category: "Fintech & Gestão Financeira",
    shortDescription:
      "SaaS de controle financeiro empresarial e pessoal com fluxo de caixa projetado e dashboards em tempo real.",
    fullDescription:
      "Plataforma corporativa de inteligência financeira desenvolvida pela LTI Sistemas. Oferece visualização clara de fluxo de caixa previsto versus realizado, categorização inteligente de despesas e receitas, relatórios analíticos e simulação de metas.",
    url: "https://meufluxofinanceiro-app.vercel.app/",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Financial Analytics", "Interactive Charts"],
    highlights: [
      "Painel de controle financeiro executivo em tempo real",
      "Projeção preditiva de fluxo de caixa e orçamentação",
      "Exportação analítica e conciliação de lançamentos",
      "Em produção ativa e validada no Vercel",
    ],
    status: "Em Produção",
    badgeColor: "emerald",
  },
  {
    id: "quick-invoiceflow",
    title: "Quick InvoiceFlow",
    category: "B2B & Automação Fiscal",
    shortDescription:
      "Plataforma ágil de emissão, acompanhamento e gestão centralizada de notas fiscais e faturamento corporativo.",
    fullDescription:
      "Sistema corporativo B2B projetado pela LTI Sistemas para eliminar erros e fricções operacionais no faturamento de empresas. Automatiza conferência de dados fiscais, ciclo de vida das notas e envio integrado para contabilidade e clientes.",
    url: "https://quick-invoiceflow.vercel.app/",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Invoice Automation", "B2B Workflow"],
    highlights: [
      "Gestão centralizada do ciclo de faturamento e notas fiscais",
      "Automação de conferência de dados e regras de compliance",
      "Visão executiva de status de liquidação e pendências fiscais",
      "Em produção ativa e validada no Vercel",
    ],
    status: "Em Produção",
    badgeColor: "emerald",
  },
];

export const techStackCategories: TechCategory[] = [
  {
    name: "Backend & Microsserviços",
    iconName: "Server",
    description: "Sistemas robustos, APIs de alta vazão e arquiteturas distribuídas.",
    skills: [
      { name: "C# .NET Core 6/8", highlight: true },
      { name: "ASP.NET Web API", highlight: true },
      { name: "Node.js (NestJS / Express)", highlight: true },
      { name: "PHP (Laravel)", highlight: false },
      { name: "RESTful APIs & gRPC", highlight: true },
      { name: "Microserviços", highlight: true },
    ],
  },
  {
    name: "Frontend & Mobile",
    iconName: "Layout",
    description: "Interfaces modernas, reativas, ultra-rápidas e acessíveis.",
    skills: [
      { name: "React & Next.js", highlight: true },
      { name: "TypeScript", highlight: true },
      { name: "Angular (v8-18)", highlight: true },
      { name: "Vue.js", highlight: false },
      { name: "Tailwind CSS", highlight: true },
      { name: "Flutter (Mobile)", highlight: false },
      { name: "Microfrontends", highlight: true },
    ],
  },
  {
    name: "Cloud & Nuvem Escalável",
    iconName: "Cloud",
    description: "Infraestrutura em nuvem resiliente, econômica e com alta disponibilidade.",
    skills: [
      { name: "AWS (Lambda, API Gateway)", highlight: true },
      { name: "AWS S3 & RDS", highlight: true },
      { name: "AWS Step Functions", highlight: true },
      { name: "Microsoft Azure", highlight: false },
      { name: "Google Cloud Platform", highlight: false },
    ],
  },
  {
    name: "DevOps & CI/CD",
    iconName: "Terminal",
    description: "Automação de esteiras com governança, segurança e deploys sem fricção.",
    skills: [
      { name: "Docker", highlight: true },
      { name: "Terraform (IaC)", highlight: true },
      { name: "GitHub Actions", highlight: true },
      { name: "Azure DevOps", highlight: true },
      { name: "Linux & Shell Scripting", highlight: false },
    ],
  },
  {
    name: "Bancos de Dados & Cache",
    iconName: "Database",
    description: "Modelagem, persistência relacional e otimização de consultas em larga escala.",
    skills: [
      { name: "PostgreSQL", highlight: true },
      { name: "SQL Server", highlight: true },
      { name: "Oracle Database", highlight: true },
      { name: "MySQL", highlight: false },
      { name: "Redis (Cache & Queues)", highlight: true },
    ],
  },
  {
    name: "Arquitetura & Governança",
    iconName: "ShieldCheck",
    description: "Fundamentos rigorosos de engenharia para longevidade e sustentabilidade do software.",
    skills: [
      { name: "Clean Architecture", highlight: true },
      { name: "SOLID & Clean Code", highlight: true },
      { name: "TDD & Testes Automatizados", highlight: true },
      { name: "Domain-Driven Design (DDD)", highlight: true },
      { name: "Design Systems", highlight: true },
    ],
  },
];

export const experienceTimeline: ExperienceItem[] = [
  {
    period: "2024 - Presente",
    role: "Engenharia de Software & Consultoria em Arquitetura",
    company: "LTI Sistemas (Operação Corporativa)",
    badge: "Atual",
    description:
      "Estruturação de soluções de engenharia, arquitetura cloud-native e desenvolvimento de produtos digitais para empresas e startups em fase de expansão.",
    achievements: [
      "Desenvolvimento e entrega de 4 plataformas SaaS completas operando em produção.",
      "Design de arquiteturas modulares cloud-native com Next.js, .NET Core e AWS.",
      "Mentoria técnica e aceleração de squads de engenharia com governança de testes e qualidade.",
    ],
    technologies: ["Next.js", ".NET Core", "AWS", "TypeScript", "Tailwind CSS", "Docker"],
  },
  {
    period: "Bagagem Enterprise",
    role: "Engenharia Sênior de Sistemas Antifraude & Missão Crítica",
    company: "TCS (Tata Consultancy Services) / Banco Itaú",
    badge: "Missão Crítica",
    description:
      "Atuação no núcleo de sistemas antifraude do maior banco privado da América Latina, processando milhões de transações diárias.",
    achievements: [
      "Aumento de +900% na vazão de processamento de regras antifraude em tempo real através de refatoração arquitetural profunda.",
      "Construção de pipelines de altíssima resiliência e baixa latência para validações transacionais instantâneas.",
      "Liderança e governança técnica de 12+ desenvolvedores em boas práticas de TDD e testes automatizados.",
    ],
    technologies: ["C# .NET", "Microserviços", "Clean Architecture", "SQL Server", "CI/CD", "TDD"],
  },
  {
    period: "Bagagem Enterprise",
    role: "Desenvolvimento de Softwares Corporativos & Gestão",
    company: "F3M Information Systems",
    badge: "Enterprise",
    description:
      "Engenharia de sistemas de gestão corporativa e soluções ERP modulares com alta densidade de regras de negócio.",
    achievements: [
      "Desenho e sustentação de módulos ERP empresariais com foco em escalabilidade e compliance operacional.",
      "Modernização de componentes legados para arquiteturas orientadas a APIs desacopladas.",
    ],
    technologies: [".NET", "Angular", "SQL Server", "Web APIs", "Entity Framework"],
  },
  {
    period: "Bagagem Enterprise",
    role: "Engenharia de Software & Sistemas de Decisão",
    company: "Petrobras (Projetos de Engenharia & TI)",
    badge: "Alta Confiabilidade",
    description:
      "Desenvolvimento de sistemas de suporte à tomada de decisão operacional e gestão de informações críticas de engenharia.",
    achievements: [
      "Construção de módulos com rigor máximo de confiabilidade, segurança de dados e auditoria operacional.",
      "Otimização de consultas analíticas e processamento de dados volumosos em bancos relacionais corporativos.",
    ],
    technologies: [".NET", "Oracle", "C#", "SQL Avançado", "Arquitetura Modular"],
  },
];
