export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  iconName: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  url: string;
  techStack: string[];
  highlights: string[];
  status: string;
  badgeColor?: string;
}

export interface TechCategory {
  name: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level?: string;
    highlight?: boolean;
  }[];
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  badge?: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface MetricItem {
  value: string;
  label: string;
  description: string;
  prefix?: string;
  suffix?: string;
}

export interface PillarItem {
  title: string;
  description: string;
  iconName: string;
}
