import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import authLogin from "../const/AuthLogin";
import userAPI from "../API/UserAPI";
import InputText from "../component/InputText";
import CheckButton from "../component/CheckButton";
import imgSearch from "../image/search.png";
import '../css/notice.css';

export default function Notice() {
  let [HashtagList, setHashtagList] = useState(null);
  let [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
//console.log("useEffect");

    isLogin = authLogin.isLogin();
    setIsLogin(isLogin);
    if (isLogin) {
      var hashtag = {};
      userAPI.getHashtagInfo()
        .then((data) => {
//console.log(data);
          var item;
          for (item of data.keyword) hashtag[item] = 0; // clear check value

          userAPI.getUserInfo()
            .then((data) => {
//console.log(data);
              data = data.user;
              for (item of data.keyword) hashtag[item] = 1;
              setHashtagList(hashtag);
            });
        });
      }

  }, []); // 비어있는 배열 인자 []가 있으면 useEffect를 1회만 실행함, 인자가 없거나 [v#1,...,v#N]과 같이 배열의 요소가 있으면 렌더링마다 실행함

  function Hashtag() {
    if (!HashtagList) return null;

    return (
      <>
      {
        Object.entries(HashtagList).map((data) => {
          return (
            <CheckButton checked={data[1]} name={data[0]} key={data[0]}
              label={data[0]} onClick={onClickHashtag}
            />
          );
        })
      }
      </>
    );
  }

  function onClickHashtag(e, data) {
    HashtagList[data.name] = data.checked ? 1 : 0;
    setHashtagList({...HashtagList});
//console.log(`onClickHashtag() name=${data.name} checked=${data.checked}`);
  }

  function NoticeItem(props) {
    return  (
      <div className="noticeItem" onClick={onClickNoticeItem} active="true" value="test">
        <div className="noticeDate">
          <span style={{ margin: "0"}}>{props.date}</span>
          <span style={{ marginLeft: "auto"}}>{props.view}</span>
        </div>
        <div className="noticeSubject">
          {props.title}
        </div>
      </div>
    )
  }

  function onClickNoticeItem(e) {

console.log(e);

     console.log("1. active=" + e.target.active);
     e.target.active = "true";
     console.log("2. active=" + e.taret.active);
  }

  return (
    <div className="noticeFrame">
      <div className="noticePartition">
        <div style={{width:"95%", height:"10vh", overflow:"hidden"}}>
          <div className="noticeSearchBox">
            <img src={imgSearch} alt="" width="30vh" height="30vh"/>
            <InputText className="noticeSearchInput" name="keyword"
                       placeholder="검색어를 입력하세요" trim autoFocus />
          </div>
          <div className="noticeHashtag">
            <Hashtag/>
          </div>
        </div>
        <div className="noticeBoard" style={{width:"100%", height:"calc(100% - 10vh)"}}>
          <div className="noticeOrder">
          최신순
          </div>
          <div className="noticeItemFrame">
            <NoticeItem date="2023-09-18" title="[학부]2023-2학기 수강포기(수강철회) 요청" view="자연과학대학" />
            <NoticeItem date="2023-09-18" title="[remind][학부] 2023-2학기 등록/환불 처리" view="자연과학대학" />
            <NoticeItem date="2023-09-18" title="[학사] 2023-2학기 휴학/복학 신청 안내 드립니다" view="자연과학대학" />
            <NoticeItem date="2023-09-18" title="[학부]2023-2학기 수강포기(수강철회) 요청" view="자연과학대학" />
            <NoticeItem date="2023-09-18" title="[학부]2023-2학기 수강포기(수강철회) 요청" view="자연과학대학" />
            <NoticeItem date="2023-09-18" title="[학부]2023-2학기 수강포기(수강철회) 요청" view="자연과학대학" />
            <NoticeItem date="2023-09-18" title="[학부]2023-2학기 수강포기(수강철회) 요청" view="자연과학대학" />
          </div>
        </div>
      </div>
      <div className="noticePartition">
        <div className="noticeBoard" style={{width:"100%", height:"100%"}}>
          <div style={{width:"100%", height:"100%", overflow:"auto"}}>
            <div style={{fontSize:"3vh", color:"#858585"}}>
            right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right
            right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right
            right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right
            right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right
            right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right right
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
