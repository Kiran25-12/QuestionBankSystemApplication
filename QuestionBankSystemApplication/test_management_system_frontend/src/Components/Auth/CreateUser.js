import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  createUser,
  resetCreateUserState,
} from "../../Redux/Feature/AuthSlices/SignupSlice";
import { toast } from "react-toastify";
import { TypeAnimation } from "react-type-animation";
 
 
const CreateUser = () => {
  const [values, setValues] = useState({
    user_name: "",
    user_email: "",
    user_type: "user",
    password: "",
    password2: "",
  });
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(
    (state) => state.authsignup.createUser
  );
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(createUser(values));
  };
 
  useEffect(() => {
    if (success) {
      setValues({
        user_name: "",
        user_email: "",
        user_type: "user",
        password: "",
        password2: "",
      });
      // alert('Registration Successful!');
      toast.success("User Register Successfully.");
      navigate("/");
 
      dispatch(resetCreateUserState()); // Reset state after successful creation
    }
  }, [success, dispatch, navigate]);
 
  return (
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
          <h2 style={{ color: "#565651" }}>QBMS SIGNUP</h2>
          <span>register and enjoy the QBMS service</span>
 
          <form id="form" className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              name="user_name"
              id="user_name"
              required
              // value={values.user_name}
              onChange={(e) =>
                setValues({ ...values, user_name: e.target.value })
              }
              placeholder="Full Name"
            />
            <input
              type="email"
              name="user_email"
              id="user_email"
              required
              // value={values.user_email}
              onChange={(e) =>
                setValues({ ...values, user_email: e.target.value })
              }
              placeholder="Email"
            />
            <input
              type="password"
              name="password"
              id="password"
              required
              // value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              placeholder="Password"
            />
            <input
              type="password"
              name="password2"
              id="password2"
              required
              // value={values.password2}
              onChange={(e) =>
                setValues({ ...values, password2: e.target.value })
              }
              placeholder="confirm password"
            />
 
            <button className="btn">Sign Up</button>
            <div style={{ textAlign: "end" }}>
              <a className="text--create-account" href="/">
                {" "}
                Already Register,Login Here...
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
export default CreateUser;