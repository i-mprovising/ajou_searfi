import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import GVar from "../const/GlobalVar";
import Swal from "../component/Swal";
import InputText from "../component/InputText";
import CheckButton from "../component/CheckButton";
import joinAPI from "../API/JoinAPI";

export default function Join() {
  let [HashtagList, setHashtagList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
console.log("useEffect");
    joinAPI.getHashtagInfo()
      .then((data) => {
console.log(data);
        for (let key in data) data[key] = 0; // clear check value
        setHashtagList(data);
      });
  }, []); // 비어있는 배열 인자 []가 있으면 useEffect를 1회만 실행함, 인자가 없거나 [v#1,...,v#N]과 같이 배열의 요소가 있으면 렌더링마다 실행함

  const formSchema = yup.object({
    in_email: yup
      .string()
      .required(true)
      .max(40, "최대 40자 까지만 가능합니다")
      .matches(
        /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/,
        "이메일 주소 형식으로 입력하세요"
      ),
    in_grade: yup
      .string()
      .required(true)
      .matches(
        /^\d{1}$/,
        "숫자 한 자를 입력하세요"
      ),
    in_major: yup
      .string()
      .required(true),
    in_passwd: yup
      .string()
      .required(true)
      .min(8, "영문 숫자포함 8자리 이상을 입력하세요")
      .max(16, "최대 16자 까지만 가능합니다")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/,
        "영문 숫자포함 8자리 이상을 입력하세요"
      ),
    in_passwdConfirm: yup
      .string()
      .oneOf([yup.ref("in_passwd")], "비밀번호가 일치하지 않습니다."),
  });

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(formSchema),
  });

  Swal.setControl(control, true);

  async function onSubmit(submitData) {
    if (getValues('in_passwd') !== getValues('in_passwdConfirm')) {
      return Swal.alert("비밀번호가 일치하지 않습니다.", "in_passwdConfirm");
    }

    const { in_passwdConfirm, ...jsonData } = submitData;
    console.log(jsonData);

    joinAPI.joinUser(jsonData)
      .then((data) => {
console.log(data);
         Swal.alertOk("회원가입이 성공적으로 완료되었습니다.",
           ()=>{ navigate("/login") }
         );
      })
      .catch((response) => {
        if (response.status === 409) {
          Swal.alertOk("입력한 아이디는 사용할 수 없습니다.", "in_email");
        }
      });
console.log("leave onSubmit()");
};

  function onClickSubmitButton(e) {
    if (isValid) return;
    e.preventDefault(); // 버튼 클릭 취소
    Swal.alert("회원가입 정보 입력을 완료하고 버튼을 클릭하세요.");
  }

  function IdCheck() {
    var id = getValues('in_email');
    if (!id) {
      return Swal.alertErr("이메일을 입력하세요.", "in_email");
    }
    joinAPI.IdCheck(getValues('in_email'))
    .then((data) => {
      Swal.alertOk("이 이메일은 사용 가능 합니다.", "in_grade");
    })
    .catch((error) => {
      Swal.alertErr("이 이메일은 사용할 수 없습니다.", "in_email");
    });
  }

  function onClickHashtag(e, data) {
    HashtagList[data.name] = data.checked ? 1 : 0;
    setHashtagList({...HashtagList});
//console.log(`onClickHashtag() name=${data.name} checked=${data.checked}`);
  }

  function Hashtag() {
    if (!HashtagList) return null;

    return (
      <>
      {
        Object.entries(HashtagList).map((data) => {
          return (
            <CheckButton checked={data[1]} name={data[0]} key={data[0]}
              label={data[0]} onClick={onClickHashtag}
            />
          );
        })
      }
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="contentBoard" style={{ width: "calc(90vh * 0.6)", height: "80vh" }}>
      <div className="contentContainer">
        <h2 className="pageTitle">{GVar.TITLE}</h2>
        <div style={{ width:"84%" }}>
          <InputText name="in_email" autoFocus
            maxLength="40" trim={true}
            label="E-mail"
            placeholder="이메일을 입력해주세요."
            link={{ text: "중복 확인", onClick: IdCheck }}
            error={errors}
            {...register("in_email")}
          />
      	  <InputText name="in_grade"
            maxLength="1" trim={true} pattern={/\d{1}/}
            label="grade"
            placeholder="학년을 입력해주세요."
            error={errors}
            {...register("in_grade")}
          />
      	  <InputText name="in_major"
            maxLength="10" trim={true}
            label="major"
            placeholder="전공을 입력해주세요."
            error={errors}
            {...register("in_major")}
          />
      	  <InputText type="password" name="in_passwd"
            maxLength="16"
            label="Password"
            placeholder="비밀번호를 입력해주세요."
            error={errors}
            {...register("in_passwd")}
          />
      	  <InputText type="password" name="in_passwdConfirm"
            maxLength="16"
            label="Password"
            placeholder="비밀번호를 한번 더 입력해주세요."
            error={errors}
            {...register("in_passwdConfirm")}
          />
          <div className="label" style={{width: "100%", padding: "3.5vh 0 1vh 0", textAlign: "left" }}>
            관심있는 키워드를 클릭해주세요!
          </div>
          <div className="hashtag">
            <Hashtag/>
          </div>
          <div>
            <button type="submit" className="button" onClick={(e)=>{onClickSubmitButton(e)}}>
              동의하고 가입하기
            </button>
          </div>
          <div style={{ width: "100%", textAlign: "center", fontSize:"1.1vh" }}>
          이용 약관, 개인정보 수집 및 이용, 개인정보 제공 내용을 확인 하였으며, 동의합니다.
          </div>
        </div>
      </div>
    </div>
    </form>
  );
}
