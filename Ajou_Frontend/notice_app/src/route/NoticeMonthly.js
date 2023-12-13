import React, { useState, useEffect } from "react";

import noticeAPI from "API/NoticeAPI";
import CheckButton from "component/CheckButton";
import "css/notice.css";

export default function NoticeMonthly() {
  let [currMonth, setcurrMonth] = useState(new Date().getMonth() + 1); // 현재 월
  let [isDateAscendingOrder, setDateAscendingOrder] = useState(false);
  const [selectItem, setSelectItem] = useState(-1);
  const [noticeList, setNoticeList] = useState({});

  useEffect(() => {
//console.log("useEffect");

      noticeAPI.getNoticeMonthlyList()
        .then((noticeData) => {
//console.log(noticeData);
          prepareNoticeList(noticeData);
        });

  }, []); // 비어있는 배열 인자 []가 있으면 useEffect를 1회만 실행함, 인자가 없거나 [v#1,...,v#N]과 같이 배열의 요소가 있으면 렌더링마다 실행함

  function getMonthData(noticeData, month) {
    if (!month) month = currMonth;
    return noticeData[month];
  }

  function sortNoticeList(noticeData, month) {
    if (!month) month = currMonth;
    let monthData = getMonthData(noticeData, month);
    if (!monthData) return;
    if (noticeData.isAscendingOrder[month] === isDateAscendingOrder) return;

    if (isDateAscendingOrder) { // 과거순
      monthData.sort(function(a, b) { return (a.date < b.date) ? -1 : (a.date > b.date) ? 1 : 0; });
    } else { // 최신순
      monthData.sort(function(a, b) { return (a.date < b.date) ? 1 : (a.date > b.date) ? -1 : 0; });
    }
    noticeData.isAscendingOrder[month] = isDateAscendingOrder;
  }

  function prepareNoticeList(noticeData) {
    for (let month in noticeData) {
      for (let item of noticeData[month]) {
        if (item.noticeid.includes("NOTI")) item.noticeid = "아주대학교";
        else if (item.noticeid.includes("SWUN")) item.noticeid = "소프트웨어융합대학";
        else if (item.noticeid.includes("NATU")) item.noticeid = "수학과";
        else if (item.noticeid.includes("SOFT")) item.noticeid = "소프트웨어학과";
      }
    }
    noticeData.isAscendingOrder = Array(12).fill(-1);
    sortNoticeList(noticeData);
    setNoticeList({ ...noticeData });
  }

  function onClickMonth(e, data) {
    var oldMonth = currMonth;
    currMonth = parseInt(data.name.split('_')[1]);
    if (oldMonth === currMonth) return;
    setSelectItem(-1); // 월이 변경되면 선택 목록이 없는 것으로 처리
    sortNoticeList(noticeList);
    setcurrMonth(currMonth);
    setNoticeList({ ...noticeList });

//console.log(`onClickMonth() name=${data.name} checked=${data.checked} currMonth=${currMonth}`);
  }

  function onClickOrder() {
//console.log("onClickOrder");

    isDateAscendingOrder = !isDateAscendingOrder; // true: 과거순 , false:최신순

    sortNoticeList(noticeList);

    setDateAscendingOrder(isDateAscendingOrder);
    setNoticeList({ ...noticeList });
  }

  function onClickNoticeItem(e, index, url) {
    setSelectItem(index);

    console.log(`index=${index} url=${url}`);
  }

  function MonthButton() {
    return (
      <>
      {
        Array(12).fill().map((data, index) => {
          index++;
          return (
            <CheckButton name={"month_"+index} key={index} checked={index===currMonth}
              uncheckedClass="monthButtonUnchecked" checkedClass="monthButtonChecked"
              label={index+"월"} onClick={onClickMonth}
            />
          );
        })
      }
      </>
    );
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

  let monthData = getMonthData(noticeList);

  return (
    <div className="noticeFrame">
      <div className="noticePartition">
        <div className="monthFrame" style={{width:"100%", height:"7vh"}}>
          <MonthButton/>
        </div>
        <div className="noticeBoard" style={{width:"100%", height:"calc(100% - 7vh)"}}>
          <div className="noticeOrderFrame">
            <span className="noticeOrder" onClick={onClickOrder}>
              {isDateAscendingOrder ? "과거순" : "최신순"}
            </span>
          </div>
          <div className="noticeItemFrame">
            {monthData && monthData.map((item, index) => (
              <NoticeItem date={item.date} title={item.title} noticeid={item.noticeid}
                url={item.url} key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
      <div className="noticePartition">
        <div className="noticeBoard" style={{width:"100%", height:"100%"}}>
          <iframe className="noticeIframe" title="notice"
            src={(selectItem >= 0) ? monthData[selectItem].url : ""} />
        </div>
      </div>
    </div>
  );
}
