import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./css/style.css";

import GVar from "./const/GlobalVar";

function BarHeader() {

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  }

  return (
    <header>
      <ScrollToTop />
      <div className="barNav">
        <h3 className="barNavTitle">{GVar.TITLE}~</h3>
      </div>
    </header>
  );

}

export default BarHeader;
