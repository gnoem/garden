import React from "react";
import * as backdropStyles from "./css/backdrop.module.css";
import * as heroStyles from "./css/hero.module.css";
import { Backdrop, Hero } from "@components";
import Groovy from "./component";

export default {
  assets: <Groovy />,
  backdrop: <Backdrop styles={backdropStyles} />,
  hero: <Hero styles={heroStyles} />
}