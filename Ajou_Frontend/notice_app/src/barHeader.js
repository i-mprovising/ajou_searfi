import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/style.css";

import GVar from "./const/GlobalVar";
import imgLogo from "./image/logo.png";
import imgProfile from "./image/profile.png";

function BarHeader() {

  const navigate = useNavigate();

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  }

  return (
    <header>
      <ScrollToTop />
      <div className="barNav">
        <div className="barNavLogo" onClick={()=>{navigate("/")}}>
          <img src={imgLogo} alt="" />
          <h3 className="barNavTitle">{GVar.TITLE}~</h3>
	</div>
        <img className="barImgProfile"  src={imgProfile} alt="" onClick={()=>{navigate("/MyPage")}} />
      </div>
    </header>
  );

}

export default BarHeader;
