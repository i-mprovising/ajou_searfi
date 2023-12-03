import baseAPI from "./BaseAPI";
import axwrap from "../component/AxWrap";

const NoticeAPI = {

  getNoticeList: () => { // notice 목록 가져오기
    return axwrap.get('/notice/list', NoticeAPI.getHeader());
  },

  getSearchList: (keyword) => { // 검색 목록 가져오기
    return axwrap.post('/notice/search', { keyword: keyword }, NoticeAPI.getJSONheader());
  }

}

Object.setPrototypeOf(NoticeAPI, baseAPI); // baseAPI prototype 사용

export default NoticeAPI;