import AuthLogin from "const/AuthLogin";

const BaseAPI = {

  getHeader: (addHeaders) => {
    return {
      headers: {
        Authorization: `Bearer ${AuthLogin.getToken()}`, ...addHeaders }};
  },

  getJSONheader: (addHeaders) => {
    return BaseAPI.getHeader({ "Content-Type": "application/json", ...addHeaders });
  },

}

export default BaseAPI;
