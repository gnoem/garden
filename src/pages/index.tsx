import React, { useState } from "react";
import { Head } from "@components";
import "../styles/globals.css";
import { Groovy } from "@themes";

const layouts = {
  groovy: (props) => <Groovy {...props} />
}

const IndexPage: React.FC = (): JSX.Element => {
  const [theme] = useState<string>('groovy');
  const [currentPage, setCurrentPage] = useState<string>('home');
  return (
    <>
      <Head />
      <main className={theme}>
        {layouts[theme]?.({ currentPage, setCurrentPage }) ?? null}
      </main>
    </>
  )
}

export default IndexPage;
