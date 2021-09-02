import React from "react";
import "./theme.css";
import * as backdropStyles from "./css/backdrop.module.css";
import * as heroStyles from "./css/hero.module.css";
import { Backdrop, Hero } from "@components";

export default {
  backdrop: <Backdrop styles={backdropStyles} />,
  hero: <Hero styles={heroStyles} />
}