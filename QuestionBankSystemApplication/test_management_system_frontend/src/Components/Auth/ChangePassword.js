import React, { useEffect, useState } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { changeUsersPassword } from "../../Redux/Feature/AuthSlices/ChangePasswordSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChangePassword() {
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, success, message } = useSelector(
        (state) => state.changepass.changePassword
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(changeUsersPassword({ password, password2 }));
    };

    useEffect(() => {
        if (success) {
            setPassword("");
            setPassword2("");
            navigate("/");
            toast.success("successful");
        }
        if (password !== password2) {
            toast.error("error");
        }
    }, [success, navigate]);

    return (
        <>
            <section>
                <div className="register">
                    <div className="col-1">
                        <h3 style={{ color: "#565651" }}>Change Password here... </h3>
                        <form id="form" className="flex flex-col" onSubmit={handleSubmit}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                placeholder="Enter New Passoword"
                                onChange={(e) => setPassword(e.target.value)}
                                required=""
                            />

                            <input
                                type="password"
                                name="password2"
                                id="password2"
                                value={password2}
                                placeholder="Enter Confirm New Passoword"
                                onChange={(e) => setPassword2(e.target.value)}
                                required=""
                            />
                            <button className="btn">Submit</button>

                            <button className="btn">
                                <Link to='/topic' style={{ color: "#e9ecef", textDecoration: 'none' }}>Cancel</Link>
                            </button>

                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ChangePassword;