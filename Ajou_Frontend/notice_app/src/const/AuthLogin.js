const AuthLogin = {

  getToken: () => { // 로그인 토큰 가져오기
    const token = localStorage.getItem("token");

console.log("AuthLogin.getToken() token=" + token);

    return token;
  },

  setToken: (token) => { // 로그인 토큰 저장하기
    localStorage.setItem("token", token); // 토큰을 로컬 스토리지에 저장

console.log("AuthLogin.setToken() token=" + token);

  },

  removeToken: () => { // 로그인 토큰 제거
    localStorage.removeItem("token"); // 토큰을 로컬 스토리지에서 제거

console.log("AuthLogin.removeToken() token removed");
  },

  isLogin: () => { // 로그인 상태 확인
    const isLoggedIn = !!localStorage.getItem("token");

console.log("AuthLogin.isLogin() status= " + ((isLoggedIn) ? "logged-in" : "not login"));

    return isLoggedIn;
  },

}

export default AuthLogin;
