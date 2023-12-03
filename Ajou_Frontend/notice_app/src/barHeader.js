import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./css/barHeader.css";

import gVar from "./const/GlobalVar";
import authLogin from "./const/AuthLogin";
import imgLogo from "./image/logo.png";
import imgProfile from "./image/profile.png";

function BarHeader() {

  const navigate = useNavigate();

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  }

  function onClickProfile() {
    navigate(authLogin.isLogin() ? "/MyPage" : "/Login");
  }

  function onClickLogout(e) {
    e.preventDefault();
    authLogin.removeToken();
    navigate("/");
  }

  return (
    <header>
      <ScrollToTop />
      <div className="barNav">
        <div className="barNavLeft" onClick={()=>{navigate("/")}}>
          <img className="barNavLogo" src={imgLogo} alt="" />
          <h3 className="barNavTitle">{gVar.TITLE}~</h3>
	</div>
	<span className="barNavRight">
          { authLogin.isLogin() &&
            <Link className="barNavLogout" onClick={onClickLogout}>
              Logout
            </Link>
          }
          <img className="barNavProfile" src={imgProfile} alt="" onClick={onClickProfile} />
	</span>
      </div>
    </header>
  );

}

export default BarHeader;
