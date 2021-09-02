export interface IHeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export interface IThemeContext {
  activeTheme: string;
  setActiveTheme: (value: string) => void;
}