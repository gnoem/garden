import React, { useState } from "react";
import "../styles/globals.css";
import * as themes from "@themes";
import { Content, Backdrop, Hero, Nav, NavLink, Head } from "@components";
import { mainSiteNav } from "@config";
import { useResizeWindows, useWindows } from "@hooks";

const IndexPage: React.FC = (): JSX.Element => {
  const [activeTheme] = useState<string>('groovy');
  const theme = themes[activeTheme];
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  return (
    <>
      <Head />
      <main className={activeTheme}>
        <Content>
          {theme.assets}
          {theme.backdrop ?? <Backdrop />}
          {theme.hero ?? <Hero />}
          {content}
        </Content>
        <Nav main>
          {mainSiteNav.map(({ name, icon }) => (
            <NavLink {...{
              key: name,
              name,
              icon,
              handleClick: handleNavClick
            }} />
          ))}
        </Nav>
      </main>
    </>
  )
}

export default IndexPage;
