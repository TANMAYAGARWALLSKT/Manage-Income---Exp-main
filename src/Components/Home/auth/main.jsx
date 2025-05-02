import React, { useState } from "react";
import { Button, Input, Divider } from "@nextui-org/react";
import { auth } from "../../../utils/firebase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { SparklesCore } from "../../ui/sparkles";

export default function Auth() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [UserPhotoURL, setUserPhotoURL] = useState(
    " https://placehold.co/600x400" // Default profile picture URL
  );

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else setPassword(value);
  };

  const handleSubmit = (e, isLogin) => {
    e.preventDefault();
    const authFunction = isLogin
      ? signInWithEmailAndPassword
      : createUserWithEmailAndPassword;
    authFunction(auth, email, password)
      .then((userCred) => {
        const user = userCred.user;
        if (isLogin) navigate("/");
        else alert("Account has been created successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setUserPhotoURL(auth.currentUser.photoURL);
      console.log(auth.currentUser.photoURL);
      navigate("/home");
    } catch (error) {
      console.error("Authentication error:", error.code, error.message);
    }
  };

  return (
    <div className="  w-[99%] h-[95%] flex justify-center items-center z-[999]   ">
      <div className="relative shadow-2xl shadow-yellow-500/40 bg-black  text-white  border-2 rounded-xl border-yellow-500/20  overflow-hidden  flex justify-center items-center flex-col ">
        <form
          className="flex rounded-lg    flex-col z-30   gap-10 justify-center items-center py-10  px-10"
          onSubmit={(e) => handleSubmit(e, false)}
        >
          <h1 className="font-bold text-3xl text-white uppercase">Log In</h1>
          {/* <Divider className="bg-yellow-500/60" /> */}
          <Input
            onChange={handleChange}
            name="email"
            label="Email"
            type="email"
            variant="bordered"
            placeholder="Enter your Email"
            className="max-w-xs w-[22vw] z-40 text-white"
          />
          <Input
            onChange={handleChange}
            name="password"
            label="Password"
            variant="bordered"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            className="max-w-xs w-[22vw] z-40"
          />
          <Button className="bg-yellow-600 z-40" type="submit">
            Create An Account
          </Button>
        </form>
        <span className="text-sm text-red-500/90 pb-3 flex flex-wrap w-[25vw]">
          *There Is no need to authentication/fill more Details Just Fill Email
          id and password fields and click on sign up{" "}
        </span>
        <span className=" pb-3">
          <hr color="" className="text-slate-400 w-full py-3 " />
          <span className="flex justify-center w-full h-full items-center pb-3  gap-5">
            <Button
              onClick={(e) => handleSubmit(e, true)}
              className="bg-blue-700 z-40"
            >
              Sign Up
            </Button>
            <Button
              onClick={signInWithGoogle}
              className="bg-zinc-200 text-red-600 font-semibold z-40"
            >
              <svg
                className="bg-zinc-300 p-2 rounded-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 50"
                width="30px"
                height="30px"
              >
                <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z" />
              </svg>
              Sign In With Google
            </Button>
          </span>
        </span>
      </div>
    </div>
  );
}
