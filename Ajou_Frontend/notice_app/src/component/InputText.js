import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import '../css/inputText.css';

const InputText = forwardRef((props, ref) => {

    var error = props.error && props.error[props.name];
    var isError = (error && error.message !== true);
    var isGuide = props.guide ? true : false;
    const [show, setShow] = useState(isError || isGuide);
    const inRef = useRef(null);
    const removeKeyList = ":ref:value:label:guide:trim:pattern:error:link:onChange:onFocus:onBlur:onKeyDown:";
    var setValue, attrs = {}; // attrs object

    if (!ref) ref = inRef;

    inRef.param_ref = ref;
    inRef.param_name = props.name;
    useEffect(() => {
      if (!inRef.input) {
        inRef.input = inRef.param_ref.current;
        if (!inRef.input) inRef.input = document.querySelector(`input[name=${inRef.param_name}]`); // 템플릿 리터럴 사용
      }
    }, []); // 비어있는 배열 인자 []가 있으면 useEffect를 1회만 실행함, 인자가 없거나 [v#1,...,v#N]과 같이 배열의 요소가 있으면 렌더링마다 실행함

    if (isError && !show) {
       setShowState(true);
       return null;
    }

    for (let key in props) {
      if (removeKeyList.indexOf(':' + key.toLowerCase() + ':') < 0 ) {
        attrs[key] = props[key];
      }
    }

    if (!attrs.type) attrs.type = "text"; // attrs.type or attrs['type'] or attrs["type"]

    if (Array.isArray(props.value)) {
      attrs.value = props.value[0];
      setValue = props.value[1];
    } else {
      if (props.value) attrs.value = props.value;
      //setValue = () => {}; // or "setValue = function() {}" or "function setValue() {}"
      setValue = null;
    }

    function setShowState(newState) {
      if (show !== newState) setShow(newState);
    }

    function onClickGuide() {
      if (isError) setShowState(false); // guide는 onChange 일 때 false 함
      if (inRef.input) inRef.input.focus();
    }

    function Guide() {
//if (props.name==='name') console.log(`name=${props.name} isError=${isError} isGuide=${isGuide} show=${show} value=${attrs.value} guide=${props.guide}`);

      if (!show) return null;

      var text = (isError) ? error.message : props.guide;
      if (!text) return null;

      var className = (isError) ? "inputBoxError" : "inputBoxGuide";

      return (
        <div className={`inputBoxOverlap ${className}`} onClick={onClickGuide}>
          <span className="inputBoxEllipsis">
            {text}
          </span>
        </div>
      )
    }

    function onChangeInput(e) {
      if (props.pattern) {
        var val = e.target.value.match(props.pattern);
        val = (val) ? val[0] : '';
        if (val.length !== e.target.value.length) {
          if (inRef.input) inRef.input.value = val;
          setValue && setValue(val);
          e.preventDefault();
        }
      }

      props.onChange && props.onChange(e);

      setValue && setValue(e.target.value);
      if (isGuide) setShowState(e.target.value.length === 0);
    }

    function onFocusInput(e) {
      props.onFocus && props.onFocus(e);

      if (isError) {
        error.message = true;
        setShowState(false);
      }
    }

    function onBlurInput(e) {
      var length = e.target.value.length;

      if (props.trim) {
        var val = e.target.value.trim();
        if (val.length !== length) {
          length = val.length;
          if (inRef.input) inRef.input.value = val;
          setValue && setValue(val);
        }
      }

      setShowState((length > 0) ? isError : isGuide);

      props.onBlur && props.onBlur(e);
    }

    function onKeyDownInput(e) {
      if (props.onKeyDown && !props.onKeyDown(e)) return;
      if (e.key !== "Enter") return;
      var form = e.target.form;
      if (!form) return;
      var nextIdx = Array.prototype.indexOf.call(form, e.target) + 1;
      if (form.elements[nextIdx]) form.elements[nextIdx].focus();
      e.preventDefault();
    }

    return (
      <div className="inputContainer">
        { props.label !== undefined &&
          <label className="label" htmlFor={props.name}>{props.label}<br/></label>
	}
        <div className="inputBox">
          { props.link && !isError &&
            <div className="inputBoxOverlap inputBoxLink">
              <Link className="textLink" to={props.link.url}
                onClick={(e) => {
                  e.preventDefault();
                  props.link.onClick && props.link.onClick(e);
              }}>
                {props.link.text}
              </Link>
            </div>
          }
          { Guide() }
          <input {...attrs}
            ref={ref}
            onChange={onChangeInput}
            onFocus={onFocusInput}
            onBlur={onBlurInput}
            onKeyDown={onKeyDownInput}
          />
        </div>
      </div>
    );

});

export default InputText;
