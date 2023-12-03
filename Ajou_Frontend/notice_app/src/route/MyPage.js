import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import gVar from "../const/GlobalVar";
import swal from "../component/Swal";
import userAPI from "../API/UserAPI";
import InputText from "../component/InputText";
import CheckButton from "../component/CheckButton";

export default function MyPage() {
  let [HashtagList, setHashtagList] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
//console.log("useEffect");

    var hashtag = {};
    userAPI.getHashtagInfo()
      .then((data) => {
//console.log(data);
        var item;
        for (item of data.keyword) hashtag[item] = 0; // clear check value

        userAPI.getUserInfo()
          .then((data) => {
//console.log(data);
            var user = data.user;
            // setValue 안하고 Gvar.setValue 한 이유는
            // eslint 경고 'React Hook useEffect has a missing dependency' 안나오게 하려고 한 것임
            gVar.setValue('email', user.email);
            gVar.setValue('grade', user.grade);
            gVar.setValue('major', user.major);
            gVar.setValue('password', user.password);
            gVar.setValue('passwordConfirm', user.password);

            for (item of data.keyword) hashtag[item] = 1;
            setHashtagList(hashtag);
          });
      });

  }, []); // 비어있는 배열 인자 []가 있으면 useEffect를 1회만 실행함, 인자가 없거나 [v#1,...,v#N]과 같이 배열의 요소가 있으면 렌더링마다 실행함

  const formSchema = yup.object({
    email: yup
      .string()
      .required(true)
      .max(40, "최대 40자 까지만 가능합니다")
      .matches(
        /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/,
        "이메일 주소 형식으로 입력하세요"
      ),
    grade: yup
      .string()
      .required(true)
      .matches(
        /^\d{1}$/,
        "숫자 한 자를 입력하세요"
      ),
    major: yup
      .string()
      .required(true),
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
    passwordConfirm: yup
      .string()
      .oneOf([yup.ref("password")], "비밀번호가 일치하지 않습니다."),
  });

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(formSchema),
  });

  gVar.setValue = setValue; // eslint 경고 'React Hook useEffect has a missing dependency' 안나오게 하려고 한 것임

  swal.setControl(control, true);

  async function onSubmit(submitData) {
    if (getValues('password') !== getValues('passwordConfirm')) {
      return swal.alert("비밀번호가 일치하지 않습니다.", "passwordConfirm");
    }

    const { passwordConfirm, ...data } = submitData;

    var hashtag = [];
    for (let key in HashtagList) {
      if (HashtagList[key]) hashtag.push(key);
    }
    const userData = { user: data, keyword: hashtag };

//console.log(userData);

    userAPI.UpdateUser(userData)
      .then((data) => {
//console.log(data);
         swal.alertOk("회원 정보가 수정되었습니다.",
           ()=>{ navigate("/login") }
         );
      })
      .catch((response) => {
        swal.alertErr("에러가 발생했습니다.");
      });
};

  function onClickSubmitButton(e) {
    if (isValid) return;
    e.preventDefault(); // 버튼 클릭 취소
    swal.alert("회원 정보 수정을 완료하고 버튼을 클릭하세요.");
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
        <h2 className="pageTitle">{gVar.TITLE}</h2>
        <div style={{ width:"84%" }}>
          <InputText name="email" readOnly
            maxLength="40"
            label="E-mail"
            placeholder="이메일을 입력해주세요."
            error={errors}
            {...register("email")}
          />
      	  <InputText name="grade" trim autoFocus
            maxLength="1" pattern={/\d{1}/}
            label="grade"
            placeholder="학년을 입력해주세요."
            error={errors}
            {...register("grade")}
          />
      	  <InputText name="major" trim
            maxLength="10"
            label="major"
            placeholder="전공을 입력해주세요."
            error={errors}
            {...register("major")}
          />
      	  <InputText type="password" name="password"
            maxLength="16"
            label="Password"
            placeholder="비밀번호를 입력해주세요."
            error={errors}
            {...register("password")}
          />
      	  <InputText type="password" name="passwordConfirm"
            maxLength="16"
            label="Password"
            placeholder="비밀번호를 한번 더 입력해주세요."
            error={errors}
            {...register("passwordConfirm")}
          />
          <div className="label" style={{width: "100%", padding: "3.5vh 0 1vh 0", textAlign: "left" }}>
            관심있는 키워드를 클릭해주세요!
          </div>
          <div className="hashtag">
            <Hashtag/>
          </div>
          <div>
            <button type="submit" className="button" onClick={(e)=>{onClickSubmitButton(e)}}>
              수정하기
            </button>
          </div>
        </div>
      </div>
    </div>
    </form>
  );
}
