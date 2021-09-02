import React from "react";
import * as backdropStyles from "./css/backdrop.module.css";
import { Backdrop, Scene } from "@components";

const load = () => {
  return (
    <Backdrop styles={backdropStyles}>
      <Scene objects={['oracle']} />
    </Backdrop>
  )
}

export default {
  load
}