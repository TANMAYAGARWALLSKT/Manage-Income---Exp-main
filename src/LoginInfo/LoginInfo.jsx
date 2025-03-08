import React, { useState, useEffect } from "react";
// import { auth } from "../Config/firebase";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { Button } from "@nextui-org/react";

function LoginInfo() {
  const [userPhotoURL, setUserPhotoURL] = useState();
  const [displayName, setDisplayName] = useState("");
  const [email, setemail] = useState("");
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserPhotoURL(user.photoURL);
        setDisplayName(user.displayName);
        setemail(user.email);
        // console.log(user);
      } else {
        setUserPhotoURL("https://via.placeholder.com/150");
      }
    });
  });
  return (
    <div className="flex top-0 w-screen animate-[Op_3s_ease-in-out_infinite]  h-screen absolute  left-0 flex-wrap justify-center  content-center">
      <div className="flex p-10 gap-10 w-[40vw] h-[40vh] flex-wrap justify-center    Forst noto-sans text-white">
        <img
          src={userPhotoURL}
          alt="user"
          className=" rounded-3xl  w-[10vw] h-[10vw] "
        />
        <span className="flex justify-between flex-wrap content-center">
          <h1 className="w-[20vw]">Name: {displayName}</h1>
          <h1 className="w-[20vw]">{email}</h1>
          <Button type="submit" size="lg" onClick={logout}>
            Sign out
          </Button>
        </span>
      </div>
    </div>
  );
}

export default LoginInfo;
