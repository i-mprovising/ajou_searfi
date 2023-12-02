export const setLogin = (token) => {
  localStorage.setItem("token", token);
//  localStorage.setItem("category", category);
};

export const setLogOut = () => {
  localStorage.removeItem("token");
//  localStorage.removeItem("category");
};

export const isLogin = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

export const getUserCategory = () => {
  const userCategory = localStorage.getItem("category");
  return userCategory;
};
