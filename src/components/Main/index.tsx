import React, { useContext } from "react";
import "@styles/globals.css";
import "@styles/theme.css";
import { Content, Nav, NavLink, Backdrop, Scene } from "@components";
import { mainSiteNav } from "@config";
import { SceneContext } from "@contexts";
import { useResizeWindows, useWindows } from "@hooks";
import * as themes from "@themes";

const Main: React.FC = (): JSX.Element => {
  const { themeContext } = useContext(SceneContext);
  const theme = themes[themeContext.activeTheme];
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  return (
    <main className={theme.className ?? themeContext.activeTheme}>
      <Content>
        <Backdrop>
          <Scene objects={theme.objects} load={theme.load} />
        </Backdrop>
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