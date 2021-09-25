import React, { useContext } from "react";
import "@styles/globals.css";
import "@styles/theme.css";
import { Backdrop, Content, Nav, NavLink, Scene } from "@components";
import { mainSiteNav } from "@config";
import { SceneContext } from "@contexts";
import { useResizeWindows, useWindows } from "@hooks";
import * as themes from "@themes";
import { IThreeScene } from "@types";

const Main: React.FC = (): JSX.Element => {
  const { setSceneContainer, loading, activeTheme, switchTheme, sceneComponents } = useContext(SceneContext);
  const { loop } = sceneComponents;
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
        {loop && <NavLink {...{
          name: loop.isLooping ? 'pause' : 'play',
          icon: loop.isLooping ? 'pause' : 'play',
          handleClick: () => loop.isLooping ? loop.stop() : loop.start()
        }} />}
        <NavLink {...{
          name: 'next',
          icon: 'arrowRight',
          handleClick: () => switchTheme.next()
        }} />
      </Nav>
      <Content>
        {theme.objects ? <SceneWrapper {...{ theme, sceneComponents, loading, setSceneContainer }} /> : theme.load()}
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

interface ISceneWrapperProps {
  theme: any;
  sceneComponents: IThreeScene;
  loading: boolean;
  setSceneContainer: (element: HTMLElement) => void;
}

const SceneWrapper: React.FC<ISceneWrapperProps> = ({ theme, sceneComponents, loading, setSceneContainer }): JSX.Element => {
  const { scene, camera, renderer } = sceneComponents;
  return (
    <Backdrop styles={theme.backdropStyles}>
      <div ref={setSceneContainer} data-scene className={`${loading ? 'loading' : ''}`}>
        {(scene && camera && renderer) && <Scene objects={theme.objects} loadTheme={theme.load} />}
      </div>
    </Backdrop>
  )
}

export default Main;