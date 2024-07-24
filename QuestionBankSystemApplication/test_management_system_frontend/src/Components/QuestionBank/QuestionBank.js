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
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import axios from "axios";
import { Link } from "react-router-dom";
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';


function QuestionBank() {
    const columns = [
        { id: 'id', name: 'Question Id' },
        { id: 'topic', name: 'Topic' },
        { id: 'question', name: 'Question' },
        { id: 'types', name: 'Type' },
        { id: 'difficulty', name: 'Difficulty level' },
        { id: 'estimated_time_to_solve', name: 'Estimate Time To Solve' },
        { id: 'action', name: "Action" },
        { id: 'addchoice', name: "Add Choices" }
    ];

    const [data, setData] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchQuestionBank = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/questionlist", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("Q B res---", response.data);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching Question Bank:", error);
            }
        };
        fetchQuestionBank();
    }, [token]);

    // open and close menu icon 
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


    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <h1>  Question <span style={{ color: "#cf9934" }}>Bank</span></h1>

                <Paper sx={{ width: '90%', marginLeft: '5%' }}>
                    <TableContainer sx={{ maxHeight: 450 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell style={{ backgroundColor: 'rgb(161, 164, 166)', color: 'black', fontWeight: 'bold' }} key={column.id}>{column.name}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.topic.name}</TableCell>
                                        <TableCell>{item.question}</TableCell>
                                        <TableCell>{item.types}</TableCell>
                                        <TableCell>{item.difficulty}</TableCell>
                                        <TableCell>{item.estimated_time_to_solve}</TableCell>
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
                                                    <MenuItem onClick={handleCloseUserMenu} title='Update Question'>
                                                        <Typography sx={{ color: '#EA6912' }} textAlign="center">
                                                            <Link to={`/editquestion/${item.id}`}>
                                                                <ModeEditOutlineRoundedIcon color="success" />
                                                            </Link>
                                                        </Typography>
                                                    </MenuItem>
                                                    <MenuItem onClick={handleCloseUserMenu} title='Delete Question'>
                                                        <Typography sx={{ color: '#EA6912' }} textAlign="center">
                                                            <Link to={`/deletequestion/${item.id}`}>
                                                                <DeleteForeverRoundedIcon color="error" />
                                                            </Link>
                                                        </Typography>
                                                    </MenuItem>
                                                </Menu>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Link to={`/addquestionchoice/${item.id}`}> <button style={{ height: 35, fontSize: 10 }}>Add Choices</button></Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </>
    );
}

export default QuestionBank;
