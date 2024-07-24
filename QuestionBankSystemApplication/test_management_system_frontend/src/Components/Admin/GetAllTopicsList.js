import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from "react-router-dom";
import axios from "axios";

function GetAllTopicsList() {
  const columns = [
    { id: 'qid', name: 'Topic ID' },
    { id: 'topic_id', name: 'Topic Name' },
    { id: 'description', name: 'Description' },
    { id: 'created_date', name: 'Created Date' },
    { id: 'created_by', name: 'Created By' },
    { id: 'updated_date', name: 'Updated Date' },
    { id: 'updated_by', name: "Updated By" },

  ]
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/topiclist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };

    fetchTopics();
  }, [token]);

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1>  Topic <span style={{ color: "rgb(162, 89, 32)" }}>Details</span></h1>

        <Paper sx={{ width: '90%', marginLeft: '5%' }}>

          <TableContainer sx={{ maxHeight: 450 }} className="table table-hover table-sm">
            <Table stickyHeader  >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell style={{
                      backgroundColor: 'rgb(161, 164, 166)', color: 'black',
                      fontWeight: 'bold'
                    }} key={column.id}>{column.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((item) => (

                  <TableRow>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Link to={`/questionpaper/${item.id}`} style={{ color: "black", textDecoration: 'none' }}>{item.name}</Link>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.created_date}</TableCell>
                    <TableCell>{item.created_by.user_email}</TableCell>
                    <TableCell>{item.updated_date}</TableCell>
                    <TableCell>{item.updated_by ? item.updated_by.user_email : '-'}</TableCell>
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

export default GetAllTopicsList;