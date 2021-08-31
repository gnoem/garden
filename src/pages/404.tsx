import React, { useState } from "react";
import "../styles/globals.css";
import { Head } from "@components";
//import { GroovyNotFound } from "@themes";

const layouts = {
  //groovy: <GroovyNotFound />
}

const NotFoundPage: React.FC = (): JSX.Element => {
  const [theme] = useState<string>('groovy');
  return (
    <>
      <Head />
      <main className={theme}>
        {layouts[theme] ?? layouts['groovy']}
      </main>
    </>
  )
}

export default NotFoundPage;
