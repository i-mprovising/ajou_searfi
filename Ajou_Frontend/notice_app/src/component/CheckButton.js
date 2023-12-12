import React, { useState } from "react";
import "css/CheckButton.css";

export default function CheckButton(props) {

    const removeKeyList = ":label:checked:onClick:onKeyDown:";
    var key, attrs = {}; // attrs object
    const [ checked, setChecked ] = useState(props.checked);

    for (key in props) {
      if (removeKeyList.indexOf(':' + key.toLowerCase() + ':') < 0 ) {
        attrs[key] = props[key];
      }
    }

    if (!attrs.type) attrs.type = "button"; // attrs.type or attrs['button']

    function toggleState() {
      var newState = !checked;
//console.log("old=" + state + " new="+newState);
      setChecked(newState);
      return newState;
    }

    function onClickButton(e) {
      var newState = toggleState();
      props.onClick && props.onClick(e, { name: props.name, checked: newState });
      e.preventDefault();
    }

    function onKeyDownButton(e) {
      if (props.onKeyDown && !props.onKeyDown(e)) return;
      if (e.key === "Space") {
        toggleState();
        e.preventDefault();
        return;
      }
      if (e.key !== "Enter") return;
      var form = e.target.form;
      if (!form) return;
      var nextIdx = Array.prototype.indexOf.call(form, e.target) + 1;
      console.log(nextIdx);
      console.log(form.elements);
      if (form.elements[nextIdx]) form.elements[nextIdx].focus();
      e.preventDefault();
    }

    var className;
    if (checked) {
      className = (props.checkedClass) ? props.checkedClass : "buttonChecked";
    } else {
      className = (props.uncheckedClass) ? props.uncheckedClass : "buttonUnchecked";
    }

    return (
      <button className={className} {...attrs}
      	onClick={onClickButton}
        onKeyDown={onKeyDownButton}
       >
        {props.label}
      </button>
    );

}
