import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';

const UserUpdateForm = () => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('')
    const [userType, setUserType] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [message, setMessage] = useState('');
    const userId = useParams()
    const uid = userId.id
    const token = localStorage.getItem('token');

    const navigate = useNavigate()

    useEffect(() => {
        // Fetch the user details to pre-fill the form
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/editusers/${uid}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log("user for edit---", response.data)
                const user = response.data;
                setUserName(user.user_name);
                setUserEmail(user.user_email)
                setUserType(user.user_type);
                setIsActive(user.is_active);
            } catch (error) {
                console.error("There was an error fetching the user details!", error);
            }
        };

        fetchUserDetails();
    }, [uid, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://127.0.0.1:8000/editusers/${uid}/`, {
                user_name: userName,
                user_type: userType,
                is_active: isActive
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setMessage('User updated successfully!');
            navigate('/getallusers')
        } catch (error) {
            setMessage('There was an error updating the user.');
            console.error("There was an error updating the user!", error);
        }
    };

    return (
        <div>

            <div className="container">
                <div className="login-container">

                    <form className="form-login" onSubmit={handleSubmit}>
                        <h3>Update user Detils</h3>
                        <div className="textfield">
                            <label htmlFor="userName">User Name:</label>
                            <input
                                type="text"
                                id="userName"
                                defaultValue={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="textfield">
                            <label htmlFor="userName">User Email:</label>
                            <input
                                type="text"
                                id="userName"
                                value={userEmail}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="textfield">
                            <label htmlFor="userType">User Type:</label>
                            <select
                                id="userType"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                            >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>

                            </select>
                        </div>
                        <div className="textfield">
                            <label htmlFor="isActive">Active:</label>
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                            />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <button type="submit">Update User</button>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <Link to='/getallusers'><button type='submit'>Cancel</button></Link>
                        </div>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default UserUpdateForm;
