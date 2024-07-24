import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const UserAcessLevelList = () => {
    const columns = [
        { id: 'user', name: 'User' },
        { id: 'access_level', name: 'Access Level' },
    ]

    const [data, setData] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/accesslevels/", {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    console.error('Error fetching owner list:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching owner list:', error);
            }
        };

        fetchData();
    }, [token]);

    return (
        <>
            <div style={{ textAlign: 'center' }}>
                <h1>  Owner <span style={{ color: "#cf9934" }}>Details</span></h1>

                <Paper sx={{ width: '70%', marginLeft: '13%' }}>
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell style={{ backgroundColor: 'black', color: 'white' }} key={column.id}>{column.name}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {data.map((item) => (

                                    <TableRow>
                                        <TableCell>{item.user.user_email}</TableCell>
                                        <TableCell>{item.access_level}</TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </>
    )
}

export default UserAcessLevelList;