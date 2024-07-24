import React,{ useEffect} from 'react'
import mbggg from '../Images/profile.png';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const UserProfile = () => {

    const userID = useParams();
    console.log("comopenet userid----", userID)
    const users = useSelector((state) => state.user.selectedUser);
    console.log("selected users profile---",users)

    return (
        <>
            <div className="modal">
                {/* Modal content */}
                <div className="modal-content">
                    <div className="modal-header">
                        <div style={{
                            position: "absolute", top: "55%", left: "35%", width: '400px', padding: "30px ",
                            margin: "16px", transform: "translate(-20%, -50%)", background: " rgb(241, 234, 221)",
                            border: "solid #c27104 3px", boxShadow: '5px 5px #a87a3b', marginTop: '50px', borderRadius: '10px'
                        }}>
                            <div style={{ fontFamily: "Arial" }} className='w-50 borer bg-gray shadow px-5 pt-3 pb-5 rounded'>
                                <h2 style={{ textAlign: 'center', color: "#ed900e", marginTop: '5px', }}>User Profile</h2>
                                <hr></hr>
                            </div>
                            <div className="modal-body">
                                <div style={{ textAlign: 'center' }}>
                                    <img src={mbggg} style={{ textAlign: 'center', height: '145px', width: '155px', marginTop: '10px', }} alt="User profile picture" />
                                </div>
                                <div>
                                    <strong>User ID:</strong>  
                                    {users.id}
                                    <br />
                                    <strong>Name:</strong> {users.user_name}
                                    <br />
                                    <strong>Email:</strong> {users.user_email}
                                    <br />
                                    <strong>User Type:</strong> {users.user_type}
                                    <br />
                                    <strong>Active Status:</strong>
                                     {users?.is_active === true ? 'True' : 'False'}
                                    <br />
                                    <strong>Created At:</strong>{users.created_at}
                                    <br />
                                    <strong>Updated At:</strong>{users.updated_at}
                                    <br />
                                </div>
                            </div >
                            <div style={{ textAlign: "center" }}>
                                <Link to='/getallusers'><button style={{ color: "#fcfbfa", background: '#b07523' }} >Close</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}
export default UserProfile;