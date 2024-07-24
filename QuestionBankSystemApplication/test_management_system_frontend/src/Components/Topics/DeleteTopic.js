import axios from 'axios';
import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const DeleteTopic = () => {

    const id = useParams();
    console.log("delete compo user id---", id)
    const uid = id.id
    const navigate = useNavigate()

    //to delete user 
    const deleteTopic = async () => {
        const token = localStorage.getItem('token');
        await axios.delete(`http://127.0.0.1:8000/deletetopic/${uid}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(toast.success("Topic Deleted Succefully"),
            navigate('/topic')
        )
            .catch(err => console.log(err),
        toast.error('Error Deleting Topic'))
    };
    return (
        <>
           <h1 style={{textAlign:'center '}}>  Delete <span style={{ color: "rgb(162, 89, 32)" }}>Topic</span></h1>
            <div className='container'>
                <div className="login-container">

                    <form className="form-login" >
                        <div style={{ textAlign: 'center' }}>
                            <h2 >Are You Sure?</h2>
                        </div>
                        <div className="btn-cls">
                            <button className="ripple-btn"
                                onClick={deleteTopic}
                                style={{ marginLeft: '28%' }}>Delete</button>
                        </div>

                        <div className="btn-cls">
                            <Link to='/topic'><button className="ripple-btn"
                                style={{ marginLeft: '28%' }} >
                                Cancel</button></Link>
                        </div>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </>

    )
}

export default DeleteTopic;