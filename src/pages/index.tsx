import React, { useState } from "react";
import "../styles/globals.css";
import { Head } from "@components";
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
