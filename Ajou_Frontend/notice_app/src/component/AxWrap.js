import axios from "axios";
import Swal from "../component/Swal";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

const AxWrap = {
  get: async (url, config) => {
    try {
      const response = await axios.get(url, config);
      if (response.status >= 200 || response.status < 300) {
        return response.data;
      }
      console.log(
        "axwrap.get() " + this.logErrorMessage({ response: response })
      );
      throw new Error(response);
    } catch (error) {
      console.log("axwrap.get() " + this.logErrorMessage(error));
      throw new Error(this.responseErr(error) ? error.response : { status: 0 });
    }
  },

  post: async (url, data, config) => {
    console.log("axwrap.post() url=" + url);

    try {
      let response = await axios.post(url, data, config);
      console.log(response);
      if (response.status >= 200 || response.status < 300) {
        return response.data;
      }
      console.log(
        "axwrap.post() " + this.logErrorMessage({ response: response })
      );
      throw new Error(response);
    } catch (error) {
      console.log("axwrap.post() " + this.logErrorMessage(error));
      throw new Error(this.responseErr(error) ? error.response : { status: 0 });
    }
  },

  patch: async (url, data, config) => {
    try {
      const response = await axios.patch(url, data, config);
      if (response.status >= 200 || response.status < 300) {
        return response.data;
      }
      console.log(
        "axwrap.patch() " + this.logErrorMessage({ response: response })
      );
      throw new Error(response);
    } catch (error) {
      console.log("axwrap.patch() " + this.logErrorMessage(error));
      throw new Error(this.responseErr(error) ? error.response : { status: 0 });
    }
  },

  delete: async (url, config) => {
    try {
      const response = await axios.delete(url, config);
      if (response.status >= 200 || response.status < 300) {
        return response.status;
      }
      console.log(
        "axwrap.delete() " + this.logErrorMessage({ response: response })
      );
      throw new Error(response);
    } catch (error) {
      console.log("axwrap.delete() " + this.logErrorMessage(error));
      throw new Error(this.responseErr(error) ? error.response : { status: 0 });
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
  },
};

export default AxWrap;
