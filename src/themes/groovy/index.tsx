import React from "react";
import * as backdropStyles from "./css/backdrop.module.css";
import * as heroStyles from "./css/hero.module.css";
import { Backdrop, Hero } from "@components";

const load = () => {
  return (
    <>
      <Backdrop styles={backdropStyles} />
      <Hero styles={heroStyles} />
    </>
  )
}

export default {
  load
}