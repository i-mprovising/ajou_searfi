import React, { useState, useEffect } from "react";

import authLogin from "../const/AuthLogin";
import swal from "../component/Swal";
import userAPI from "../API/UserAPI";
import noticeAPI from "../API/NoticeAPI";
import InputText from "../component/InputText";
import CheckButton from "../component/CheckButton";
import imgSearch from "../image/search.png";
import '../css/notice.css';

export default function Notice() {
  let [HashtagList, setHashtagList] = useState(null);
  let [isDateAscendingOrder, setDateAscendingOrder] = useState(false);
  const [selectItem, setSelectItem] = useState(-1);
  const [noticeList, setNoticeList] = useState([]);

  useEffect(() => {
//console.log("useEffect");

    if (authLogin.isLogin()) {
        userAPI.getUserInfo()
          .then((data) => {
//console.log(data);
            var hashtag = {};
            for (let item of data.keyword) hashtag[item] = 1;
            setHashtagList(hashtag);
        });
      }

      noticeAPI.getNoticeList()
        .then((noticeData) => {
console.log(noticeData);
          prepareNoticeList(noticeData);
        });

  }, []); // 비어있는 배열 인자 []가 있으면 useEffect를 1회만 실행함, 인자가 없거나 [v#1,...,v#N]과 같이 배열의 요소가 있으면 렌더링마다 실행함

  function Hashtag() {
    if (!HashtagList) return null;

    return (
      <>
      {
        Object.entries(HashtagList).map((data) => {
          return (
            <CheckButton name={data[0]} key={data[0]}
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

  function sortNoticeList(noticeData) {
    if (isDateAscendingOrder) { // 과거순
      noticeData.sort(function(a, b) { return (a.date < b.date) ? -1 : (a.date > b.date) ? 1 : 0; });
    } else { // 최신순
      noticeData.sort(function(a, b) { return (a.date < b.date) ? 1 : (a.date > b.date) ? -1 : 0; });
    }
  }

  function prepareNoticeList(noticeData) {
    for (let item of noticeData) {
      if (item.noticeid.includes("NOTI")) item.noticeid = "아주대학교";
      else if (item.noticeid.includes("SWUN")) item.noticeid = "소프트웨어융합대학";
      else if (item.noticeid.includes("NATU")) item.noticeid = "수학과";
      else if (item.noticeid.includes("SOFT")) item.noticeid = "소프트웨어학과";
    }

    sortNoticeList(noticeData);

    setNoticeList(noticeData);
  }

  function searchKeyword(keyword) {
console.log("keyword="+keyword);
    noticeAPI.getSearchList(keyword)
      .then((noticeData) => {
        prepareNoticeList(noticeData);
      })
      .catch((response) => {
        if (response.status === 409) {
          swal.alertOk("검색 결과가 없습니다.");
        }
      });
  }

  function onKeyDownSearchInput(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (e.target.value.length === 0) {
      return swal.alert("검색어를 입력해주세요.");
    }

    searchKeyword(e.target.value);

    return false;
    // return false는 InputText.js의 onKeyDownInput()에서 Enter키 처리하지 않도록 함
  }

  function onClickOrder() {
//console.log("onClickOrder");

    isDateAscendingOrder = !isDateAscendingOrder; // true: 과거순 , false:최신순

    sortNoticeList(noticeList);

    setDateAscendingOrder(isDateAscendingOrder);
    setNoticeList([ ...noticeList ]);
  }

  function onClickNoticeItem(e, index, url) {
    setSelectItem(index);

    console.log(`index=${index} url=${url}`);
  }

  function NoticeItem(props) {
    var selectClassName = (props.index === selectItem) ? " noticeItemSelect" : "";

    return  (
      <div className={`noticeItem${selectClassName}`/*템플릿 리터럴 사용*/}
        onClick={(e)=>{onClickNoticeItem(e, props.index, props.url)}}>
        <div className="noticeDate">
          <span>{props.date}</span>
          <span style={{ marginLeft: "auto"}}>{props.noticeid}</span>
        </div>
        <div className="noticeSubject">
          {props.title}
        </div>
      </div>
    )
  }

  return (
    <div className="noticeFrame">
      <div className="noticePartition">
        <div style={{width:"95%", height:"10vh", overflow:"hidden"}}>
          <div className="noticeSearchBox">
            <img className="noticeSearchImage" src={imgSearch} alt="" />
            <InputText className="noticeSearchInput" name="searchInput"
                       placeholder="검색어를 입력하세요" trim autoFocus
                       onKeyDown={onKeyDownSearchInput} />
          </div>
          <div className="noticeHashtag">
            <Hashtag/>
          </div>
        </div>
        <div className="noticeBoard" style={{width:"100%", height:"calc(100% - 10vh)"}}>
          <div className="noticeOrderFrame">
            <span className="noticeOrder" onClick={onClickOrder}>
              {isDateAscendingOrder ? "과거순" : "최신순"}
            </span>
          </div>
          <div className="noticeItemFrame">
            {noticeList.map((item, index) => (
              <NoticeItem date={item.date} title={item.title} noticeid={item.noticeid}
                url={item.url} key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
      <div className="noticePartition">
        <div className="noticeBoard" style={{width:"100%", height:"100%"}}>
          <iframe className="noticeIframe" title="notice"
            src={(selectItem >= 0) ? noticeList[selectItem].url : ""} />
        </div>
      </div>
    </div>
  );
}
