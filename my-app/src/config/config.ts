//socket
export const ENDPOINT = "http://localhost:5000";

//storage
export const sessionStorageGetUser = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") || "")
    : null;

  return user;
};

export const sessionStorageRemoveUser = () => sessionStorage.removeItem("user");
