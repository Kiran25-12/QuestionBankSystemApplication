import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

function GetAllQuestions() {
    const columns = [
        { id: 'qid', name: 'Question Id' },
        { id: 'topic', name: 'Topic' },
        { id: 'question', name: 'Question' },
        { id: 'types', name: 'Type' },
        { id: 'difficulty', name: 'Difficulty level' },
        { id: 'estimated_time_to_solve', name: 'Estimate Time To Solve' },
        { id: 'action', name: "Action" }
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

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <h1>  Question <span style={{ color: "#cf9934" }}>Bank</span></h1>
                <div style={{ textAlign: 'right', marginRight: '5%' }}>
                    <Link to='/addquestion'>
                        <button className="button-30" role="button"><span style={{ color: "rgb(162, 89, 32)" }}>
                            Add Question</span></button>
                    </Link>
                </div>

                <Paper sx={{ width: '90%', marginLeft: '5%' }}>
                    <TableContainer sx={{ maxHeight: 450 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell style={{ backgroundColor: 'rgb(161, 164, 166)', color: 'black',fontWeight:'bold' }} key={column.id}>{column.name}</TableCell>
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
                                            <Link to={`/deletequestion/${item.id}`}>
                                                <DeleteForeverRoundedIcon color="error" /></Link>
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

export default GetAllQuestions;
