import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import gVar from "../const/GlobalVar";
import authLogin from "../const/AuthLogin";
import swal from "../component/Swal";
import axwrap from "../component/AxWrap";
import InputText from "../component/InputText";

export default function Login() {
  const navigate = useNavigate();

  const formSchema = yup.object({
    email: yup
      .string()
      .required(true)
      .max(40, "최대 40자 까지만 가능합니다")
      .matches(
        /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/,
        "이메일 주소 형식으로 입력하세요"
      ),
    password: yup
      .string()
      .required(true)
      .min(8, "영문 숫자포함 8자리 이상을 입력하세요")
      .max(16, "최대 16자 까지만 가능합니다")
      .matches(
        /^((?=.*[a-zA-Z])(?=.*[\d])|(?=.*[a-zA-Z])(?=.*[\d])(?=.*[\W])).{8,15}$/, // 영문+숫자, 영문+숫자+특수문자
//	/^(?=.*[a-zA-Z])(?=.*[\d\W]).{8,15}$/, // 영문+숫자, 영문+특수문자, 영문+숫자+특수문자
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

  swal.setControl(control, true);

  async function onSubmit(submitData) {

    await axwrap
      .post('/login', submitData) // 템플릿 리터럴 사용
      .then((data) => {
        var jwtToken = data.token; // 토큰 값을 추출
//console.log("data=" + data);

        if (jwtToken !== null) {
          authLogin.setToken(jwtToken); // 토큰을 로컬 스토리지에 저장
//console.log("token=" + authLogin.getToken());
        }
        navigate("/");
      })
      .catch((response) => {
        if (response.status === 401) {
          return swal.alertErr("회원 정보가 맞지 않습니다.", "email");
        }
      });
  };

  function onClickSubmitButton(e) {
    if (isValid) return;
    e.preventDefault(); // 버튼 클릭 취소
    swal.alert("이메일과 암호 입력을 완료하고 버튼을 클릭하세요.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="contentBoard" style={{ width: "calc(50vh * 1.5)", height: "45vh" }}>
      <div className="contentContainer">
        <h2 className="pageTitle">{gVar.TITLE}</h2>
        <div style={{ width:"65%" }}>
          <InputText name="email" trim autoFocus
            maxLength="40" tabIndex="1"
            label="E-mail"
            placeholder="이메일을 입력해주세요."
            error={errors}
            {...register("email")}
          />
      	  <InputText type="password" name="password"
            maxLength="16" tabIndex="2"
            label="Password"
            placeholder="비밀번호를 입력해주세요."
            error={errors}
            {...register("password")}
          />
        </div>
        <div style={{ position:"relative", width: "90%" }}>
          <div style={{ position:"absolute", width: "100%", bottom: "1vh", textAlign: "right" }}>
            <Link to="/join" className="textLink" tabIndex="4">
              회원가입하기
            </Link>
          </div>
          <button type="submit" className="button" onClick={(e)=>{onClickSubmitButton(e)}} tabIndex="3">
            로그인
          </button>
        </div>
      </div>
    </div>
    </form>
  );
}