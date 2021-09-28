declare module "*.module.css";

declare module "*/children" {
  export const title: string;
  export const SectionContent: React.FC;
}