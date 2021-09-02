import React, { useEffect, useState, useContext } from "react";
import "@styles/globals.css";
import "@styles/theme.css";
import * as themes from "@themes";
import { Content, Backdrop, Hero, Nav, NavLink } from "@components";
import { mainSiteNav } from "@config";
import { useResizeWindows, useWindows } from "@hooks";
import { AppLayout } from "@layouts";
import { RenderContext } from "@contexts";

const IndexPage: React.FC = (): JSX.Element => {
  const [activeTheme, setActiveTheme] = useState<string>('oracle');
  const theme = themes[activeTheme];
  const { loop, renderer } = useContext(RenderContext);
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  console.log({ loop, renderer })
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== 'Escape') return;
      if (activeTheme === 'oracle') {
        setActiveTheme('groovy');
      }
      if (activeTheme === 'groovy') {
        setActiveTheme('oracle');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTheme]);
  return (
    <AppLayout>
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
    </AppLayout>
  )
}

export default IndexPage;
