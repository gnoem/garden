import React, { useContext } from "react";
import "@styles/globals.css";
import "@styles/theme.css";
import { Backdrop, Content, Nav, NavLink, Scene } from "@components";
import { mainSiteNav } from "@config";
import { SceneContext } from "@contexts";
import { useResizeWindows, useWindows } from "@hooks";
import * as themes from "@themes";

const Main: React.FC = (): JSX.Element => {
  const { loading, activeTheme, switchTheme } = useContext(SceneContext);
  const theme = themes[activeTheme];
  const { refs, content, handleNavClick } = useWindows();
  useResizeWindows(refs);
  return (
    <main className={`${theme.className ?? activeTheme} ${loading ? 'loading' : ''}`}>
      <Nav ariaLabel="toggle theme" addClass="toggleTheme">
        <NavLink {...{
          name: 'previous',
          icon: 'arrowLeft',
          handleClick: () => switchTheme.previous()
        }} />
        <NavLink {...{
          name: 'next',
          icon: 'arrowRight',
          handleClick: () => switchTheme.next()
        }} />
      </Nav>
      <Content>
        {theme.objects ? <ThreeScene {...{ theme }} /> : theme.load()}
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

const ThreeScene: React.FC<{ theme: any }> = ({ theme }): JSX.Element => {
  return (
    <Backdrop styles={theme.backdropStyles}>
      <Scene objects={theme.objects} load={theme.load} />
    </Backdrop>
  )
}

export default Main;