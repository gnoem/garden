import React from "react";
import { RenderContextProvider } from "@contexts"
import { Head } from "@components";
import { IHeadProps } from "@types";

interface AppHeadProps extends IHeadProps {
  headChildren?: JSX.Element;
}

const AppLayout: React.FC<AppHeadProps> = ({ children, title, image, description, headChildren }) => {
  return (
    <RenderContextProvider>
      <Head {...{ title, image, description }}>{headChildren}</Head>
      {children}
    </RenderContextProvider>
  )
}

export default AppLayout;