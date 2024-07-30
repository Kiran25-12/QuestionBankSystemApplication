import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import axios from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { toast } from "react-toastify";

function Topic() {
  //define columns for table
  const columns = [
    { id: 'qid', name: 'Topic ID' },
    { id: 'topic_id', name: 'Topic Name' },
    { id: 'description', name: 'Description' },
    { id: 'created_date', name: 'Created Date' },
    { id: 'created_by', name: 'Created By' },
    { id: 'updated_date', name: 'Updated Date' },
    { id: 'updated_by', name: "Updated By" },
    { id: 'Viewques', name: 'Question List' },
    { id: 'action', name: "Action" }
  ]
  

  const token = localStorage.getItem('token'); // get logged in users token from localstorage
  const [topics, setTopics] = useState([]);

  // get topic list
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/topiclist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("topic list=", response.data)
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, [token]);

  // Filter topics based on ownership
  const userTopics = topics.filter(topic => topic.created_by.user_email === localStorage.getItem('user_email')); // Assuming you store user email in local storage

  // open and close menu action (...) icon 
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [menuItemId, setMenuItemId] = useState(null);

  const handleOpenUserMenu = (event, id) => {
    setAnchorElUser(event.currentTarget);
    setMenuItemId(id);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setMenuItemId(null);
  };

  // get users access_level 
  const [accessLevel, setAccessLevel] = useState(null);// getting loged in user's access_level
  const email = localStorage.getItem('user_email')
  const [userEmail, setUserEmail] = useState(email || '')

  useEffect(() => {
    const fetchAccessLevel = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/accesslevels/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            user_email: userEmail,
          },
        });

        if (response.status === 200) {
          // console.log('email----------', userEmail)
          console.log('access_level at topic page---', response.data[0].access_level)

          setAccessLevel(response.data[0].access_level);
          console.log("8888", accessLevel)
        } else {
          console.error('Error fetching access level:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching access level:', error);
      }
    };

    if (token && userEmail) {
      fetchAccessLevel();
    } else {
      console.error("No token or user email found");
    }
  }, [token, userEmail]);

  //Delete topic 
  const [open, setOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const handleClickOpen = (id) => {
    setSelectedTopicId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTopicId(null);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://127.0.0.1:8000/deletetopic/${selectedTopicId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      toast.success("Topic Deleted Successfully");
      window.location.reload();
      handleClose();
    }).catch((err) => {
      console.log(err);
      // toast.error('Error Deleting Topic');
    });
  };

  return (
    <>

      <div style={{ margin: '5%' }}>
        
        <Box style={{ margin: '0.9%' }}>
          <TableContainer style={{width:'100%'}} component={Paper}>
            <Table aria-label="collapsible table" >
              <TableHead style={{ background: '#ffffff', width: '140%' }}>
                <TableRow  >
                  <TableCell><span style={{ color: '#003049', fontSize: 21, fontWeight: 'bold' }}>Topic List</span></TableCell>
                  <TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell /><TableCell />
                  <TableCell align='right'>
                    <button className="button-75" role="button"><span className="text">
                      <Link to='/addtopic' style={{ color: "#ffff", textDecoration: 'none' }}>
                        Add Topic</Link></span>
                    </button></TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
        <Box style={{ margin: '0.9%' }}>
        <TableContainer style={{width:'100%'}} component={Paper}>
            <Table aria-label="collapsible table" >
            <TableHead style={{ background: '#ffffff' }}>
                <TableRow style={{ background: '#ffffff' }} >
                  {columns.map((column) => (
                    <TableCell  key={column.id} style={{
                       color: 'black',
                      fontWeight: 'bold', fontSize: 16 
                    }}>{column.name}</TableCell>
                    
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {accessLevel === 'Owner' && userTopics.map((item) => (
                  <TableRow>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.created_date}</TableCell>
                    <TableCell>{item.created_by.user_email}</TableCell>
                    <TableCell>{item.updated_date}</TableCell>
                    <TableCell>{item.updated_by ? item.updated_by.user_email : '-'}</TableCell>
                    <TableCell>
                      <Link to={`/demotable/${item.id}`}><VisibilityRoundedIcon /></Link>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ flexGrow: 0 }} dir="rtl">
                        <Tooltip title="Open">
                          <IconButton onClick={(event) => handleOpenUserMenu(event, item.id)} sx={{ p: 0 }}>
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                        <Menu
                          sx={{ mt: '30px' }}
                          id="menu-appbar"
                          anchorEl={anchorElUser}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={Boolean(anchorElUser) && menuItemId === item.id}
                          onClose={handleCloseUserMenu}
                        >
                          <MenuItem onClick={handleCloseUserMenu} title='Add Question'>
                            <Typography sx={{ color: '#EA6912' }} textAlign="center">
                              <Link to={`/addquestion/${item.id}`}>
                                <AddCircleOutlineRoundedIcon />
                              </Link>
                            </Typography>
                          </MenuItem>
                          <MenuItem onClick={handleCloseUserMenu} title='Update Topic'>
                            <Typography sx={{ color: '#EA6912' }} textAlign="center">
                              <Link to={`/edittopic/${item.id}`}><ModeEditOutlineRoundedIcon color="success" /></Link>
                            </Typography>
                          </MenuItem>
                          <MenuItem onClick={() => handleClickOpen(item.id)} title="Delete Topic">
                            <Typography sx={{ color: '#EA6912' }} textAlign="center">
                              <DeleteForeverRoundedIcon color="error" />
                            </Typography>
                          </MenuItem>
                          <MenuItem onClick={handleCloseUserMenu} title='Provide Access'>
                            <Typography sx={{ color: '#EA6912' }} textAlign="center">
                              <Link to={`/provideaccess/${item.id}`}><KeyRoundedIcon /></Link>
                            </Typography>
                          </MenuItem>
                        </Menu>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Topic</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this topic?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleDelete} color="primary">
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              


            </Table>
          </TableContainer>  
        </Box>

      </div>

    </>
  );
}

export default Topic;