import Swal_ from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

var Swal = withReactContent(Swal_);

Swal.setControl = function(control, select) {
  Swal._ctrl = control;
  Swal._ctrlFields = (control) ? control._fields : null;
  Swal.setSelect(select);
}

Swal.setSelect = function(select) {
  Swal._select = select;
}

Swal.getRef = function(name) {
  if (!name) return null;
  var f = Swal._ctrlFields && Swal._ctrlFields[name];
  return f && f._f && f._f.ref;
}

Swal.focus = function(name) {
  var ref = Swal.getRef(name);
  if (!ref) return Swal;
  ref.focus();
  return ref;
}

Swal.select = function(name) {
  var ref = Swal.getRef(name);
  if (!ref) return Swal;
  ref.select();
  return ref;
}

Swal.fire2 = function(args) {
  if (!args.confirmButtonColor) {
    args.confirmButtonColor = "var(--button-color)";
  }

  if(!args.iconColor) {
    args.iconColor = "var(--button-color)";
  }

  return Swal.fire(args);
}

/*
Swal.alert("message");
Swal.alert("message", "name");
Swal.alert("message", ()=>{ Swal.select("name").focus(); });
Swal.alert({ icon: "info", title: "title", text: "message" });
Swal.alert({ icon: "info", title: "title", text: "message" }, "name");
Swal.alert({ icon: "info", title: "title", text: "message" }, ()=>{ Swal.select("name").focus(); });
*/

Swal.alert = function(msg_or_params, name_or_callback) {
  if (typeof name_or_callback === 'object') return;

  if (Array.isArray(msg_or_params)) return;

  if (typeof msg_or_params !== 'object') {
    msg_or_params = { text: msg_or_params };
  }

  if (!msg_or_params.icon) msg_or_params.icon = "warning";

  if (typeof name_or_callback === 'function') {
    msg_or_params.didClose = name_or_callback;
  } else if (name_or_callback) {
    msg_or_params.didClose = function() {
      var ref = Swal.getRef(name_or_callback);
      if (!ref) return;
      if (Swal._select) ref.select();
      ref.focus();
    }
  }

  return Swal.fire2(msg_or_params);
}

Swal.alertOk = function(msg, name) {
  return Swal.alert({ icon: "success", text: msg }, name);
}

Swal.alertErr = function(msg, name) {
  return Swal.alert({ icon: "error", text: msg }, name);
}

Swal.alertInfo = function(msg, name) {
  return Swal.alert({ icon: "info", text: msg }, name);
}

Swal.alertWarning = function(msg, name) {
  return Swal.alert({ icon: "warning", text: msg }, name);
}

Swal.alertQuestion = function(msg, name) {
  return Swal.alert({ icon: "question", text: msg }, name);
}

export default Swal;
