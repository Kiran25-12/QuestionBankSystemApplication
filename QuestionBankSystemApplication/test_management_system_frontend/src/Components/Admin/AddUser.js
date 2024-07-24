import React, { useState, useEffect } from "react";
import "../Auth/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    createUser,
    resetCreateUserState,
} from "../../Redux/Feature/AuthSlices/SignupSlice";
import { toast } from "react-toastify";

function AddUser() {
    const [values, setValues] = useState({
        user_name: "",
        user_email: "",
        user_type: "",
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
                user_type: "",
                password: "",
                password2: "",
            });
            // alert('Registration Successful!');
            toast.success("User Added Successfully.");
            navigate("/getallusers");

            dispatch(resetCreateUserState()); // Reset state after successful creation
        }
    }, [success, dispatch, navigate]);
    return (
        <>
            <section>
                <div className="register">
                    <div className="col-1">
                        <h2 style={{ color: "#565651" }}>ADD USER</h2>
                        <form id="form" className="flex flex-col" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                name="user_email"
                                id="user_email"
                                placeholder="Email ID"
                                required
                                // value={values.user_email}
                                onChange={(e) =>
                                    setValues({ ...values, user_email: e.target.value })
                                }
                            />

                            <input
                                type="text"
                                name="user_name"
                                id="user_name"
                                required
                                placeholder="User Name"
                                // value={values.user_name}
                                onChange={(e) =>
                                    setValues({ ...values, user_name: e.target.value })
                                }
                            />
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                placeholder="Password"
                                // value={values.password}
                                onChange={(e) =>
                                    setValues({ ...values, password: e.target.value })
                                }
                            />
                            <input
                                type="password"
                                name="password2"
                                id="password2"
                                required
                                placeholder="Confirmed Password"
                                // value={values.password2}
                                onChange={(e) =>
                                    setValues({ ...values, password2: e.target.value })
                                }
                            />
                            <select className="select"
                                id="user_type"
                                name="user_type"
                                value={values.user_type}
                                onChange={(e) =>
                                    setValues({ ...values, user_type: e.target.value })
                                }
                                
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>

                            <button className="btn">Add User </button>
                            <button className="btn">
                                <Link to='/getallusers' style={{ color: "#e9ecef", textDecoration: 'none' }}>Cancel</Link>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddUser;