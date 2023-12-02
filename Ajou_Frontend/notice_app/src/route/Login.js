import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import GVar from "../const/GlobalVar";
import Swal from "../component/Swal";
import axwrap from "../component/AxWrap";
import { setLogin } from "../const/Auth";
import InputText from "../component/InputText";

export default function Login() {
  const navigate = useNavigate();

  const formSchema = yup.object({
    in_email: yup
      .string()
      .required(true)
      .max(40, "최대 40자 까지만 가능합니다")
      .matches(
        /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/,
        "이메일 주소 형식으로 입력하세요"
      ),
    in_passwd: yup
      .string()
      .required(true)
      .min(8, "영문 숫자포함 8자리 이상을 입력하세요")
      .max(16, "최대 16자 까지만 가능합니다")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/,
        "영문 숫자포함 8자리 이상을 입력하세요"
      ),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(formSchema),
  });

  Swal.setControl(control, true);

  async function onSubmit(submitData) {
    await axwrap
      .post(`${GVar.SERVER_URL}/login/`, submitData) // 템플릿 리터럴 사용
      .then((data) => {
        var jwtToken = data.token; // 토큰 값을 추출
        console.log("data=" + data);

        if (jwtToken !== null) {
          setLogin(jwtToken); // setLogin 함수를 사용하여 토큰을 로컬 스토리지에 저장
          console.log("token=" + localStorage.getItem("token"));
        }
        navigate("/");
      })
      .catch((response) => {
        if (response.status === 401) {
          return Swal.alertErr("회원 정보가 맞지 않습니다.", "in_email");
        }
      });
    console.log("leave onSubmit()");
  }

  function onClickSubmitButton(e) {
    if (isValid) return;
    e.preventDefault(); // 버튼 클릭 취소
    Swal.alert("회원가입 정보 입력을 완료하고 버튼을 클릭하세요.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        className="contentBoard"
        style={{ width: "calc(50vh * 1.5)", height: "45vh" }}
      >
        <div className="contentContainer">
          <h2 className="pageTitle">{GVar.TITLE}</h2>
          <div style={{ width: "65%" }}>
            <InputText
              name="in_email"
              autoFocus
              maxLength="40"
              trim={true}
              tabIndex="1"
              label="E-mail"
              placeholder="이메일을 입력해주세요."
              error={errors}
              {...register("in_email")}
            />
            <InputText
              type="password"
              name="in_passwd"
              maxLength="16"
              tabIndex="2"
              label="Password"
              placeholder="비밀번호를 입력해주세요."
              error={errors}
              {...register("in_passwd")}
            />
          </div>
          <div style={{ position: "relative", width: "90%" }}>
            <div
              style={{
                position: "absolute",
                width: "100%",
                bottom: "1vh",
                textAlign: "right",
              }}
            >
              <Link to="/join" className="textLink" tabIndex="4">
                회원가입하기
              </Link>
            </div>
            <button
              type="submit"
              className="button"
              onClick={(e) => {
                onClickSubmitButton(e);
              }}
              tabIndex="3"
            >
              로그인
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
