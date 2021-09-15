import React, { useContext } from "react";
import "@styles/globals.css";
import "@styles/theme.css";
import { Content, Nav, NavLink } from "@components";
import { mainSiteNav } from "@config";
import { SceneContext } from "@contexts";
import { useResizeWindows, useWindows } from "@hooks";
import * as themes from "@themes";

const Main: React.FC = (): JSX.Element => {
  const { activeTheme } = useContext(SceneContext);
  const theme = themes[activeTheme];
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  return (
    <main className={theme.className ?? activeTheme}>
      <Content>
        {theme.load()}
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