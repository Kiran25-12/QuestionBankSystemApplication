import React from 'react'
import './Login.css';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { resetLoginState } from '../../Redux/Feature/AuthSlices/LoginSlice';
 
function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Clear access token and other user data
        navigate('/');
        // dispatch an action to reset user login state in Redux
        dispatch(resetLoginState()); 
    };
    return (
        <>
            <section>
                <div className="register">
                    <div className="col-1">
                        <h2 style={{ color: "#565651" }}>LogOut</h2>
                        <br></br>
                        <form id="form" className="flex flex-col">

                                <h2 >Are You Sure want to Logout?</h2>
                         
                                <button className="btn"
                                    onClick={handleLogout}
                                    style={{
                                        flex: 1, flexDirection: 'row',
                                        marginHorizontal: 20,
                                        marginTop: 5,
                                       
                                    }} >
                                    Log Out
                                </button>
                           

                                <button className="btn"
                                    style={{
                                        flex: 1, flexDirection: 'row',
                                        marginHorizontal: 20,
                                        marginTop: 5,
                                        
                                    }} >
                                    <Link to='/topic' style={{ color: "#e9ecef", textDecoration: 'none' }} >Cancel</Link>
                                </button>
                         



                        </form>
                    </div>
                </div>
                


            </section>

        </>
    )
}

export default Logout