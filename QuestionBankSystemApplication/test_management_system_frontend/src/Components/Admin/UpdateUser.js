import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../Redux/Feature/AdminSlices/UpdateUserSlice';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import GetUserByID from './GetUserByID';

function UpdateUser() {
    const userId = useParams()
    
    const navigate = useNavigate()
    // console.log("userId update user all data-",userId)
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        user_name: '',
        user_type: '',
        is_active: '',
    });

    useEffect(()=>{
        const token = localStorage.getItem('token');

        const uid = userId.id
        axios.get(`http://127.0.0.1:8000/editusers/${uid}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res =>console.log("updated data==", res.data))

        .catch(err => console.log(err))
    },[])
    console.log("userdata---", userData)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        // console.log("token==", token)
        if (token) {
            dispatch(updateUser({ token, userId, userData }));
            toast.success("user updated successfully!")
            navigate('/getallusers')
        } else {
            toast.error("Authentication token is missing");
        }
    };


    return (
        <>
        <div  className="container">
            <div className="login-container">

           
            <form className="form-login" onSubmit={handleSubmit}>
                <div>
                    <label>User ID: {userData.id}</label>
                </div>
                <div className="textfield">
                <label>User Name:</label>
                <input type="text" name="user_name" defaultValue={userData.user_name} 
                onChange={handleChange} />
                </div>
                <div>
                    <label>User E-mail: {userData.user_email}</label>
                </div>
                <div className="textfield">
                {/* <label>User Type:</label>
            <input type="text" name="user_type" value={userData.user_type} onChange={handleChange} /> */}
                <label>User Type:</label>
                <select name="user_type" value={userData.user_type} onChange={handleChange}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  
                </select>
                </div>
                <div className="textfield">
                <label>Is Active:</label>
                <input type="checkbox" name="is_active" checked={userData.is_active === true ? 'True' : 'False'} onChange={handleChange} />
                </div>
                <div style={{textAlign:"center"}}>
                <button type="submit" className="btn-login">Update User</button>
                </div>
                <div style={{textAlign:"center"}}>
               <Link to='/getallusers'><button type="submit" className="btn-login">Cancel</button></Link> 
                </div>
            </form>
            <ToastContainer />
            </div>
        </div>
        </>
    )
}

export default UpdateUser