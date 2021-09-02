import React, { useState } from "react";
import "../styles/globals.css";
import * as themes from "@themes";
import { Content, Backdrop, Hero, Nav, NavLink, Head } from "@components";
import { mainSiteNav } from "@config";
import { useResizeWindows, useWindows } from "@hooks";
import { useEffect } from "react";

const IndexPage: React.FC = (): JSX.Element => {
  const [activeTheme, setActiveTheme] = useState<string>('oracle');
  const theme = themes[activeTheme];
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  useEffect(() => {
    const handleClick = () => {
      if (activeTheme === 'oracle') {
        setActiveTheme('groovy');
      }
      if (activeTheme === 'groovy') {
        setActiveTheme('oracle');
      }
    }
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick)
  }, [activeTheme]);
  return (
    <>
      <Head />
      <main className={activeTheme}>
        <Content>
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
