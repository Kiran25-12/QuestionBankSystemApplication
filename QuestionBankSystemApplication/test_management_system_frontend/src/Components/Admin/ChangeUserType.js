import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './ChangeUserType.css'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import {setNewRole, changeUserRole} from '../../Redux/Feature/AdminSlices/ChangeTypeSlice';


function ChangeUserType() {

  const { newRole, loading, error } = useSelector((state) => state.changeType);
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log("component update id =", id)
  const navigate = useNavigate();

  const handleChangeUserType = (e) => {
    e.preventDefault();
    dispatch(changeUserRole({ id, newRole }))
      .unwrap()
      .then(() => {
        console.log('User role changed successfully');
        navigate('/getuser');
      })
      .catch((err) => {
        console.error('Error changing user role:', err);
      });
  };
  const handleRoleChange = (e) => {
    dispatch(setNewRole(e.target.value));
  };

  return (
    <>
      <div className='rolechange-box'>
      <form className='rolechangeform' onSubmit={handleChangeUserType}>
        <h2>Change User Role</h2>
        <div className='user-box'>
          <InputLabel id="demo-simple-select-helper-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            sx={{ width: 200, height: 50 }}
            label="role"
            name='role'
            value={newRole}
            onChange={handleRoleChange}
          >
            <MenuItem value={'admin'}>admin</MenuItem>
            <MenuItem value={'viewer'}>viewer</MenuItem>
            <MenuItem value={'editor'}>editor</MenuItem>
            <MenuItem value={'owner'}>owner</MenuItem>

          </Select>
        </div>
        <button className="button-70" type='submit' disabled={loading}>
          {loading ? 'Loading...' : 'Change User Role'}
        </button>
        <Link to='/getuser'>
          <button className="button-70" type='button'>Cancel</button>
        </Link>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
    </>
  )
}

export default ChangeUserType