declare module "*.module.css";

type Section = import("@types").ISectionsModule;

declare module "@content" {
  export const siteSections: Section;
}