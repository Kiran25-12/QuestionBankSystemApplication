import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  resetLoginState,
} from "../../Redux/Feature/AuthSlices/LoginSlice";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TypeAnimation } from "react-type-animation";
 
// toast.configure();
 
const Login = () => {
  const [user_email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {success, userData } = useSelector(
    (state) => state.authlogin.login
  );
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(login({ user_email, password }));
  };
 
  const notifySuccess = () => toast.success("Login Successfully");
 
  useEffect(() => {
    if (success) {
      notifySuccess();
      console.log("loged in usersdata--", userData.user_email);
      localStorage.setItem("token", userData.token["access"]);
      const token = localStorage.getItem("token");
      // console.log("local storage get token=", token)
      localStorage.setItem("user_type", userData.user_type);
      localStorage.setItem("id", userData.id);
      const id = localStorage.getItem("id");
      localStorage.setItem("user_email", userData.user_email);
      const email = localStorage.getItem("user_email");
      console.log("************", email);
 
      navigate("/topic");
      dispatch(resetLoginState()); // Reset state after successful login
    }
  }, [success]);
 
  return (
    <>
      <section>
        <div
          style={{
            color: "#5D8381",
            marginLeft: " 30%",
            marginTop: "2%",
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          <TypeAnimation
            sequence={[
              "Welcome",
              500,
              "Welcome To ", //  Continuing previous Text
              500,
              "Welcome To Question",
              500,
              "Welcome To Question Bank",
              500,
              "Welcome To Question Bank System..!",
              500,
              " ",
              500,
            ]}
            style={{ fontSize: "1.5em" }}
            repeat={Infinity}
          />
        </div>
 
        <div className="register">
          <div className="col-1">
            <h2 style={{ color: "#565651" }}>QBMS LOGIN</h2>
            <span> login and enjoy the QBMS service</span>
            <form id="form" className="flex flex-col" onSubmit={handleSubmit}>
              <input
                type="email"
                name="user_email"
                id="user_email"
                value={user_email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email ID"
                required
              />
 
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                required
              />
              <button className="btn">Login </button>
              <a className="text--create-account" href="/signup">
                Create Account...
              </a>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
 
export default Login;