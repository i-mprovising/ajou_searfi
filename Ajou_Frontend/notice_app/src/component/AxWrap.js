import axios from "axios";
import Swal from "../component/Swal";

import GVar from "../const/GlobalVar";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

const AxWrap = {

  defaultUrl: (url) => {
    if (url.charAt(0) === '/') url = `${GVar.API_URL}${url}`;
    return url;
  },

  get: async (url, config) => {
    url = AxWrap.defaultUrl(url);

console.log("AxWrap.get() url="+url);

    try {

      const response = await axios.get(url, config);
      if (response.status >= 200 || response.status < 300) {
        return response.data;
      }
console.log("AxWrap.get() " + AxWrap.logErrorMessage({response: response}));
      throw new Error(response);

    } catch (error) {

console.log("AxWrap.get() " + AxWrap.logErrorMessage(error));
      throw new Error(AxWrap.responseErr(error) ? error.response : { status: 0 });

    }
  },

  post: async (url, data, config) => {
    url = AxWrap.defaultUrl(url);

console.log("AxWrap.post() url="+url);

    try {

      const response = await axios.post(url, data, config);
console.log(response);
      if (response.status >= 200 || response.status < 300) {
        return response.data;
      }
console.log("AxWrap.post() " + AxWrap.logErrorMessage({response: response}));
      throw new Error(response);

    } catch (error) {

console.log("AxWrap.post() " + AxWrap.logErrorMessage(error));
      throw new Error(AxWrap.responseErr(error) ? error.response : { status: 0 });

    }
  },

  patch: async (url, data, config) => {
    url = AxWrap.defaultUrl(url);

console.log("AxWrap.patch() url="+url);

    try {

      const response = await axios.patch(url, data, config);
      if (response.status >= 200 || response.status < 300) {
        return response.data;
      }
console.log("AxWrap.patch() " + AxWrap.logErrorMessage({response: response}));
      throw new Error(response);

    } catch (error) {

console.log("AxWrap.patch() " + AxWrap.logErrorMessage(error));
      throw new Error(AxWrap.responseErr(error) ? error.response : { status: 0 });

    }
  },

  delete: async (url, config) => {
    url = AxWrap.defaultUrl(url);

console.log("AxWrap.patch() url="+url);

    try {

      const response = await axios.delete(url, config);
      if (response.status >= 200 || response.status < 300) {
        return response.status;
      }
console.log("AxWrap.delete() " + AxWrap.logErrorMessage({response: response}));
      throw new Error(response);

    } catch (error) {

console.log("AxWrap.delete() " + AxWrap.logErrorMessage(error));
      throw new Error(AxWrap.responseErr(error) ? error.response : { status: 0 });

    }
  },

  logErrorMessage: (error) => {
    if (error.response) return "error: " + error.response.status;
    if (error.request) return "error: network error";
    return "error:  unknown error";
  },

  responseErr: (error) => {
    if (error.response) return true;
    if (error.request) {
      Swal.alertErr("네트워크 오류가 발생했습니다.");
    } else {
      Swal.alertErr("알 수 없는 오류가 발생했습니다.");
    }
    return false;
  }

}

export default AxWrap;