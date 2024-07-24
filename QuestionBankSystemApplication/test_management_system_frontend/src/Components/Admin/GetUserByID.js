import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchUserDetails } from '../../Redux/Feature/AdminSlices/FetchUserByID';
import { toast } from 'react-toastify';
import axios from 'axios';
import mbggg from '../Images/profile.png';

const GetUserByID = () => {
    const  id  = useParams();
    console.log("user by id new compo==", id)
    const uid = id.id
    console.log("uid", uid)
    const token = localStorage.getItem('token');
    console.log("new compo token---", token)
    const[user,setUser] = useState(null)

    useEffect(()=>{
        axios.get(`http://127.0.0.1:8000/editusers/${uid}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res =>setUser(res.data))

        .catch(err => console.log(err))
    },[])
    // const dispatch = useDispatch();
    // const { user, loading, error } = useSelector((state) => state.getuserbyid);

    
    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     console.log("new compo token---", token)
    //     if (token,id) {
            
    //         console.log("uid==", id)
    //         dispatch(fetchUserDetails({ token,id }));
    //     } else {
    //         toast.error("Authentication token is missing");
    //     }
    // }, [dispatch, id]);

    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error: {error.message || error}</div>;

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
                                    <strong>User ID:</strong>  {user?.id}
                                    <br />
                                    <strong>Name:</strong> {user?.user_name}
                                    <br />
                                    <strong>Email:</strong> {user?.user_email}
                                    <br />

                                    <strong>User Type:</strong> {user?.user_type}
                                    <br />
                                    <strong>Active Status:</strong> {user?.is_active === true ? 'True' : 'False'}
                                    <br />
                                    <strong>Created At:</strong> {user?.created_at}
                                    <br />
                                    <strong>Updated At:</strong> {user?.updated_at}
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
        </>
    )
}

export default GetUserByID;