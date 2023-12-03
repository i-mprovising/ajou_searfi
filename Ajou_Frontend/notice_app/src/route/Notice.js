import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import authLogin from "../const/AuthLogin";
import userAPI from "../API/UserAPI";
import noticeAPI from "../API/NoticeAPI";
import InputText from "../component/InputText";
import CheckButton from "../component/CheckButton";
import imgSearch from "../image/search.png";
import '../css/notice.css';

export default function Notice() {

  let [HashtagList, setHashtagList] = useState(null);
  let [NoticeList, setNoticeList] = useState(null);
  let [keyword, setKeyword]= useState(null);
  let returnElement = [];
  let url = "";
  const navigate = useNavigate();

  useEffect(() => {

    if (authLogin.isLogin()) {
      var hashtag = {};
      var item;
      userAPI.getHashtagInfo()
        .then((data) => {
// console.log(data);
          for (item of data.keyword) hashtag[item] = 0; // clear check value

          userAPI.getUserInfo()
            .then((data) => {
//console.log(data);
              for (item of data.keyword) hashtag[item] = 1;
              setHashtagList(hashtag);
              console.log(hashtag);
            }); });}
      noticeAPI.getNoticeList()
        .then((noti) => {
    console.log(noti);
        SetNoticeId(noti)
      })

  }, []); // 비어있는 배열 인자 []가 있으면 useEffect를 1회만 실행함, 인자가 없거나 [v#1,...,v#N]과 같이 배열의 요소가 있으면 렌더링마다 실행함


//   useEffect(() => {
//     noticeAPI.getSearchList(keyword)
//     .then((noti) => {
// console.log(noti);
//     SetNoticeId(noti)
//     })
//   }, []);


  function SetNoticeId(noti) {
    var item;
    for (item of noti) {
      if (item.noticeid.includes("NOTI")) item.noticeid = "아주대학교";
      else if (item.noticeid.includes("SWUN")) item.noticeid = "소프트웨어융합대학";
      else if (item.noticeid.includes("NATU")) item.noticeid = "수학과";
      else if (item.noticeid.includes("SOFT")) item.noticeid = "소프트웨어학과";
    }
    setNoticeList(noti)
  }

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
      <div className="noticeItem" onClick={(e)=>{onClickNoticeItem(props, e)}}>
        <div className="noticeDate">
          <span>{props.date}</span>
          <span style={{ marginLeft: "auto"}}>{props.noticeid}</span>
          <span style={{ display : "none"}}>{props.url}</span>
        </div>
        <div className="noticeSubject">
          {props.title}
        </div>
      </div>
    )
  }

  function NotiList(props) {
    if (!props.notice) return null;
    props.notice.forEach((e) => {
      returnElement.push(
        <NoticeItem date={e.date} noticeid={e.noticeid} title={e.title} url={e.url}/>
      );
    });
  }

  function onClickNoticeItem(props, e) {
    document.getElementById("noticeIframe").src = props.url;
    // document.getElementById("noticeIframe").location.reload(true);
    // .contentDocument.location.reload(true);
// console.log(document.getElementById('noticeIframe').location);
// console.log(props.url);
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
            <NotiList notice = {NoticeList}/>
            {returnElement}
          </div>
        </div>
      </div>
      <div className="noticePartition">
        <div className="noticeBoard" style={{width:"100%", height:"100%"}}>
            <iframe className="noticeIframe" id = "noticeIframe" title="iframe" src={url} />
        </div>
      </div>
    </div>
  );
}
