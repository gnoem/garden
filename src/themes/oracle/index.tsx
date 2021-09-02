import React from "react";
import "./theme.css";
import * as backdropStyles from "./css/backdrop.module.css";
import { Backdrop, Scene } from "@components";

const backdrop = (
  <Backdrop styles={backdropStyles}>
    <Scene objects={['oracle']} />
  </Backdrop>
)

export default {
  backdrop
}