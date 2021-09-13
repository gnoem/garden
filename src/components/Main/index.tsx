import React, { useEffect, useContext } from "react";
import "@styles/globals.css";
import "@styles/theme.css";
import { Content, Nav, NavLink } from "@components";
import { mainSiteNav } from "@config";
import { RenderContext, ThemeContext } from "@contexts";
import { useResizeWindows, useWindows } from "@hooks";
import * as themes from "@themes";

const Main: React.FC = (): JSX.Element => {
  const { activeTheme, setActiveTheme } = useContext(ThemeContext); // todo figure out do we really need a context for this?
  const theme = themes[activeTheme];
  const renderContext = useContext(RenderContext);
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  useEffect(() => {
    renderContext?.loop?.dispose?.();
    const handleKeyDown = (e) => {
      if (e.code !== 'Escape') return;
      if (activeTheme === 'oracle') {
        setActiveTheme('groovy');
      }
      if (activeTheme === 'groovy') {
        setActiveTheme('oracle');
      }
    }
    //window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTheme]);
  return (
    <main className={theme.className ?? activeTheme}>
      <Content>
        {renderContext && theme.load()}
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
  )
}

export default Main;