import React from "react";
import { isMobile } from "react-device-detect";
import Mobile from "../Components/Mobile";
import Desktop from "../Components/Desktop";

const Home = () => {
  return isMobile ? <Mobile /> : <Desktop />;
};
export default Home;
