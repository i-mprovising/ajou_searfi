import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "css/barHeader.css";

import gVar from "const/GlobalVar";
import authLogin from "const/AuthLogin";
import imgLogo from "image/logo.png";
import imgProfile from "image/profile.png";

function BarHeader() {

  const navigate = useNavigate();

  function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  }

  function onClickProfile() {
    navigate(authLogin.isLogin() ? "/MyPage" : "/Login");
  }

  function onClickLink(e, url) {
    e.preventDefault();
    navigate(url);
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
          <h3 className="barNavTitle">𓆡𓆞𓆜𓆟𓆝 {gVar.TITLE} 𓆝𓆟𓆜𓆞𓆡</h3>
	</div>
	<span className="barNavRight">
          <span className="barNavDot">●</span>
          <Link className="barNavLink" onClick={(e)=>{onClickLink(e, '/notice')}}
                title="검색 및 키워드 기반의 공지사항을 보여줍니다.">
            <h4>공지사항</h4>
          </Link>
          <span className="barNavDot">●</span>
          <Link className="barNavLink" onClick={(e)=>{onClickLink(e, '/notice/monthly')}}
                title="2년 이상 반복되는 공지사항을 월별로 보여줍니다.">
            <h4>월별반복공지</h4>
          </Link>
          { authLogin.isLogin() &&
            <>
              <span className="barNavDot">●</span>
              <Link className="barNavLogout" onClick={onClickLogout}>
                Logout
              </Link>
            </>
          }
          <img className="barNavProfile" src={imgProfile} alt="" onClick={onClickProfile} />
	</span>
      </div>
    </header>
  );

}

export default BarHeader;
