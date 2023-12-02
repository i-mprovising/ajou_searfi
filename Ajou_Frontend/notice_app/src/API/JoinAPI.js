import GVar from "../const/GlobalVar";
import axwrap from "../component/AxWrap";

const JoinAPI = {

  getHashtagInfo: () => { // hashtag 목록 가져오기
    const token = localStorage.getItem("token");

    return axwrap.get(`${GVar.API_URL}/hashtag/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
  },

  joinUser: (userData) => { // 유저 신규 가입
    const token = localStorage.getItem("token");

    return axwrap.post(`${GVar.API_URL}/join/`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
  },

  IdCheck: (id) => {
    const token = localStorage.getItem("token");

    return axwrap.post(`${GVar.API_URL}/idcheck/`, {
        email: id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
  },

}

export default JoinAPI;
/*
//user의 기부목록 가져오기
export const getDonationList = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${GVar.API_URL}/donatelist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("테스트", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching user Donation list:", error);
    throw error;
  }
};

// 사용자 정보 가져오기 - request url은 /users, get 요청, Authorization 헤더 필요
export const getUserInfo = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${GVar.API_URL}/myinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

// 유저 정보 수정
export const updateUserInfo = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(`${GVar.API_URL}/users/update`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

//유저 정보 삭제
export const deleteUser = async () => {
  const token = localStorage.getItem("token");
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`${GVar.API_URL}/users/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.status;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

//수혜신청
export const createApplication = async (dataSet) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${GVar.API_URL}/apply/post`, dataSet, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      console.error(
        "Create application request failed with status:",
        response.status
      );
      throw new Error("Create application request failed");
    }
  } catch (error) {
    console.error("Error fetching create application:", error);
    throw error;
  }
};

//수혜신청 취소
export const cancelApplication = async (applyId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${GVar.API_URL}/apply/${applyId}/delete`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.status);
    return response.status;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

//수혜신청 수정
export const updateApplication = async (applyId, dataSet) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${GVar.API_URL}/apply/${applyId}/update`,
      dataSet,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error update application:", error);
    throw error;
  }
};

//수혜신청 조회
export const getApplication = async (applyId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${GVar.API_URL}/apply/${applyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error get application:", error);
    throw error;
  }
};

//기기 조회
export const getDevice = async (deviceId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${GVar.API_URL}/device/${deviceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error get device:", error);
    throw error;
  }
};

//운송장번호,택배사입력(기부자)
export const updateDelivery = async (deviceId, dataSet) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${GVar.API_URL}/donatelist/${deviceId}`,
      dataSet,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.status);
    return response.data;
  } catch (error) {
    console.error("Error update delivery:", error);
    throw error;
  }
};

//기기 수령확인 (수혜자)
export const confirmDelivery = async (applyId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.patch(
      `${GVar.API_URL}/apply/complete/${applyId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.status);
    return response.data;
  } catch (error) {
    console.error("Error confirm delivery:", error);
    throw error;
  }
};
*/