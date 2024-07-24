import axios from 'axios';
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function DeleteUser() {
    const id  = useParams();
    console.log("delete compo user id---",id)
    const uid= id.id
    console.log("delete uid--", uid)
    const navigate = useNavigate()

    //to delete user 
    const deleteUser = async () => {
        const token = localStorage.getItem('token');
        console.log("delete user token", token)
        // console.log('token=', token)
        await axios.delete(`http://127.0.0.1:8000/editusers/${uid}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(toast.success("User Deleted Succefully"),
        navigate('/getallusers')
    )
            .catch(err => console.log(err))
    };

    return (
        <>
            <div className='container'>
                <div className="login-container">
                    
                    <form className="form-login" >
                        <div style={{ textAlign: 'center' }}>
                            <h2 >Are You Sure?</h2>
                        </div>
                        <div className="btn-cls">
                            <button className="ripple-btn"
                                onClick={deleteUser}
                                style={{ marginLeft:'28%' }}>Delete</button>
                        </div>

                        <div className="btn-cls">
                            <Link to='/getallusers'><button className="ripple-btn"
                                style={{  marginLeft:'28%' }} >
                                Cancel</button></Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default DeleteUser;