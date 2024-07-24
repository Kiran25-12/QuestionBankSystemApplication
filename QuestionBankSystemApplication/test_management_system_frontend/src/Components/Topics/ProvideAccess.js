import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

function ProvideAccess() {

    const topicid = useParams()
    const tid = topicid.id
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [access_level, setAccessLevel] = useState('')

    useEffect(() => {
        // Fetch user list from API
        axios.get('http://127.0.0.1:8000/allusers')
            .then(response => {
                console.log('users list--', response.data)
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching user list:', error);
            });
    }, []);

    const handleUserChange = (event) => {
        const selectedUsername = event.target.value;
        setSelectedUser(selectedUsername);
    };

    const handleAccessLevel = (event) => {
        const selectedAccessLevel = event.target.value;
        setAccessLevel(selectedAccessLevel);

    }
    const token = localStorage.getItem('token');
    const navigate = useNavigate()


    const handleSubmit = (e) => {
        e.preventDefault();
        const response = axios.post(`http://127.0.0.1:8000/accesslevel/${selectedUser}`,
            {
                "topic": tid,
                "access_level": access_level
            }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
        )
            .then(response => {
                console.log('provide access level response ----', response.data);
                if (response === 201)
                    toast.success('Provide Access to user Successfull!')
                    navigate('/topic')
            })
            .catch(error => {
                toast.error('Error Providing access to user...')
                console.error('Error providing access level:', error);
            });
    }


    return (
        <>
        <ToastContainer/>
<section>
        <div className="register">
          <div className="col-1">
            <h2 style={{ color: "#565651" }}>Add Topic</h2>
 
            <form id="form" className="flex flex-col" onSubmit={handleSubmit}>
                
                    <label htmlFor="userSelect">Select user:</label>
                    <select id="userSelect" value={selectedUser} onChange={handleUserChange} style={{border: '1px solid #bba70d', width: "23vw",padding: "8px" , marginBottom: "10px"}}>
                        <option value="">Select...</option>
                        {users.map((user) => (
                            <option value={user.id}>
                                {user.user_email}
                            </option>
                        ))}
                    </select>
               
                    <label htmlFor='access_level'>Select Access Level:</label>
                    <select value={access_level} onChange={handleAccessLevel} style={{border: '1px solid #bba70d', width: "23vw",padding: "8px" , marginBottom: "10px"}}>
                        <option value="">Select...</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                        <option value="Viewer">Owner</option>
                    </select>
               
                    <button type='submit' className="btn">Give Access</button>
              
                    <button className="btn"><Link to='/topic' style={{ color: "#e9ecef", textDecoration: 'none' }}>Cancel</Link></button>
               
            </form>
            </div>
        </div>
      </section>
        </>
    )
}

export default ProvideAccess