import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

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
  const navigate = useNavigate();
  let returnElement = [];
  let url = "";

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
      // noticeAPI.getNoticeList()
      // .then((noti) => {
        let noti = [
          {
              "date": "2023-11-23",
              "title": "[학생지원팀] Ajou Beyond Campus & Culture 2023 (舊 세계로 문화탐방) 참가자 모집 자세히 보기",
              "noticeid": "NOTI_226758",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=226758&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-11-21",
              "title": "[필독]2024학년도 1학기 국가장학금 1차 신청안내 (~ 12. 27. 18시까지) 자세히 보기",
              "noticeid": "NOTI_226566",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=226566&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-10-30",
              "title": "[학부/학사과정] 2023학년도 동계 계절수업 등록 및 수강포기(계절학기 수강료 환불) 안내 자세히 보기",
              "noticeid": "NOTI_223933",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=223933&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-10-30",
              "title": "★개설 교과목 List 업데이트_[학부/학사과정] 2023학년도 동계 계절수업 안내 자세히 보기",
              "noticeid": "NOTI_223916",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=223916&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-09-08",
              "title": "[학생지원팀] 2023-2 신입생을 위한 생각의 마중길 자세히 보기",
              "noticeid": "NOTI_221191",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=221191&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-08-30",
              "title": "어학 졸업인증(2024년 2월 졸업)을 위한 공인어학 성적 등록 및 제출 안내 (~2024.1.26) 자세히 보기",
              "noticeid": "NOTI_220675",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=220675&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-08-28",
              "title": "[학부/학사과정] ★필독★ 출석(전자출결, 공결, 취업계, 코로나 등) 관련 안내(08.28.수정) 자세히 보기",
              "noticeid": "NOTI_220586",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=220586&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-11-24",
              "title": "[학부]2023학년도 2학기 수업평가 실시 안내(Fall Semester Course Evaluation) 자세히 보기",
              "noticeid": "NOTI_226868",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=226868&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-11-24",
              "title": "[일자리+센터]  코멘토 온라인 직무체험 자세히 보기",
              "noticeid": "NOTI_226865",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=226865&article.offset=0&articleLimit=10"
          },
          {
              "date": "2023-11-24",
              "title": "[일자리+센터] 미국 취업 동향과 외국계 마케팅 직무 취업 노하우(재공지) 자세히 보기",
              "noticeid": "NOTI_226863",
              "url": "https://www.ajou.ac.kr/kr/ajou/notice.do?mode=view&articleNo=226863&article.offset=0&articleLimit=10"
          }
      ]
        for (item of noti) {
          if (item.noticeid.includes("NOTI")) item.noticeid = "아주대학교";
          else if (item.noticeid.includes("SWUN")) item.noticeid = "소프트웨어융합대학";
          else if (item.noticeid.includes("NATU")) item.noticeid = "수학과";
          else if (item.noticeid.includes("SOFT")) item.noticeid = "소프트웨어학과";
        }
        setNoticeList(noti)
      // });

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
