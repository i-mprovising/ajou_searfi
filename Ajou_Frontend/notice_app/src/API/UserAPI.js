import baseAPI from "API/BaseAPI";
import axwrap from "component/AxWrap";

const UserAPI = {

//  아래 __proto__는 deprecated 됨, 사용하지 말고 아래의 Object.setPrototypeOf()를 사용할 것

//  __proto__ : baseAPI, // baseAPI prototype 사용

  getHashtagInfo: () => { // hashtag 목록 가져오기
    return axwrap.get('/mypage/hashtag', UserAPI.getHeader());
  },

  joinUser: (userData) => { // 사용자 신규 가입
    return axwrap.post('/user/join', userData, UserAPI.getJSONheader());
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

  doLogin: (loginData) => { // 로그인
    return axwrap.post('/user/login', loginData, UserAPI.getHeader());
  },

  IdCheck: (id) => { // 이메일 중복 체크
    return axwrap.post('/user/idcheck', { email: id }, UserAPI.getJSONheader());
  },

}

Object.setPrototypeOf(UserAPI, baseAPI); // baseAPI prototype 사용

export default UserAPI;