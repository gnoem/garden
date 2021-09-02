import React from "react";
import { RenderContextProvider, ThemeContextProvider } from "@contexts"
import { Head } from "@components";
import { IHeadProps } from "@types";

interface AppHeadProps extends IHeadProps {
  headChildren?: JSX.Element;
}

const ContextProvider: React.FC = ({ children }): JSX.Element => {
  return (
    <ThemeContextProvider>
      <RenderContextProvider>
        {children}
      </RenderContextProvider>
    </ThemeContextProvider>
  )
}

const AppLayout: React.FC<AppHeadProps> = ({ children, title, image, description, headChildren }): JSX.Element => {
  return (
    <ContextProvider>
      <Head {...{ title, image, description }}>{headChildren}</Head>
      {children}
    </ContextProvider>
  )
}

export default AppLayout;