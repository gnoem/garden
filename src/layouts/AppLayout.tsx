import React from "react";
import { SceneContextProvider } from "@contexts"
import { Head } from "@components";
import { IHeadProps } from "@types";

interface AppHeadProps extends IHeadProps {
  headChildren?: JSX.Element;
}

const AppLayout: React.FC<AppHeadProps> = ({ children, title, image, description, headChildren }): JSX.Element => {
  return (
    <SceneContextProvider>
      <Head {...{ title, image, description }}>{headChildren}</Head>
      {children}
    </SceneContextProvider>
  )
}

export default AppLayout;