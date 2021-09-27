import React, { useContext } from "react";
import "@styles/globals.css";
import "@styles/theme.css";
import { Backdrop, Content, Nav, NavLink, Scene } from "@components";
import { SceneContext } from "@contexts";
import { useWindows } from "@hooks";
import * as themes from "@themes";
import { IThreeScene } from "@types";
import { siteNav } from "@content/site";
import { ArrowLeft, ArrowRight, Pause, Play } from "@components/_icons";

const Main: React.FC = (): JSX.Element => {
  const { setSceneContainer, loading, activeTheme, switchTheme, sceneComponents } = useContext(SceneContext)!;
  const { loop } = sceneComponents;
  const theme = themes[activeTheme];
  const { content, handleNavClick } = useWindows();

  return (
    <main className={`${theme.className ?? activeTheme} ${loading ? 'loading' : ''}`}>
      <Nav ariaLabel="toggle theme" addClass="toggleTheme">
        <NavLink {...{
          name: 'previous',
          Icon: ArrowLeft,
          handleClick: () => switchTheme.previous()
        }} />
        {loop && <NavLink {...{
          name: loop.isLooping ? 'pause' : 'play',
          Icon: loop.isLooping ? Pause : Play,
          handleClick: () => loop.isLooping ? loop.stop() : loop.start()
        }} />}
        <NavLink {...{
          name: 'next',
          Icon: ArrowRight,
          handleClick: () => switchTheme.next()
        }} />
      </Nav>
      <Content>
        {theme.objects ? <SceneWrapper {...{ theme, sceneComponents, loading, setSceneContainer }} /> : theme.load()}
        {content}
      </Content>
      <Nav main>
        {siteNav.map(({ name, Icon }) => (
          <NavLink {...{
            key: name,
            name,
            Icon,
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
  setSceneContainer: (element: HTMLDivElement) => void;
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