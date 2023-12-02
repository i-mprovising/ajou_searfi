import React from "react";
import InputText from "../component/InputText";

export default function Notice() {
  return (
    <div
      style={{ width: "100%", height: "97%", padding: "20px 50px 20px 50px" }}
    >
      <div className="leftBoard">
        <div className="search">
          <InputText
            name="search"
            autoFocus
            maxLength="40"
            tabIndex="1"
            placeholder="검색어를 입력해주세요."
          />
        </div>
        <div className="search">
          <h3>hashtag</h3>
        </div>
        <div className="noticeList"></div>
      </div>
      <div className="rightBoard">
        <iframe
          title="noticeInfo"
          className="rightIframe"
          src="https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=226932&article.offset=0&articleLimit=10"
        />
      </div>
    </div>
  );
}
