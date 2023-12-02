import baseAPI from "./BaseAPI";
import axwrap from "../component/AxWrap";

const UserAPI = {

  getHashtagInfo: () => { // hashtag 목록 가져오기
    return axwrap.get('/hashtag', UserAPI.getHeader());
  },

  joinUser: (userData) => { // 사용자 신규 가입
    return axwrap.post('/join', userData, UserAPI.getJSONheader());
  },

  getUserInfo: () => { // 사용자 정보
    return axwrap.get('/mypage', UserAPI.getHeader());
  },

  UpdateUser: (userData) => { // 사용자 정보 수정
    return axwrap.patch('/mypage/update', userData, UserAPI.getJSONheader());
  },

  deleteUser: (userData) => { // 사용자 정보 삭제
    return axwrap.delete('/user/delete', UserAPI.getHeader());
  },

  IdCheck: (id) => { // 이메일 중복 체크
    return axwrap.post('/idcheck', { email: id }, UserAPI.getJSONheader());
  },

}

Object.setPrototypeOf(UserAPI, baseAPI); // baseAPI prototype 사용

export default UserAPI;