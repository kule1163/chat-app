//socket
export const ENDPOINT = "https://batu-chatapp.herokuapp.com/";

//storage
export const sessionStorageGetUser = () => {
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") || "")
    : null;

  return user;
};

export const sessionStorageRemoveUser = () => sessionStorage.removeItem("user");
