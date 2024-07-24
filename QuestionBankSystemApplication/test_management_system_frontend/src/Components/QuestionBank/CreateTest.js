import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const CreateTest = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [testName, setTestName] = useState('');
  const [totalTime, setTotalTime] = useState(0);
  const { id: topicid } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/questionchoicelist/${topicid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [token, topicid]);
  

  const handleCheckboxChange = (event) => {
    const questionId = parseInt(event.target.value, 10);
    const isChecked = event.target.checked;

    setSelectedQuestionIds((prevSelected) => {
      if (isChecked) {
        return [...prevSelected, questionId];
      } else {
        return prevSelected.filter((id) => id !== questionId);
      }
    });
  };

  useEffect(() => {
    const calculateTotalTime = () => {
      const selectedQuestions = questions.filter((question) =>
        selectedQuestionIds.includes(question.id)
      );
      const totalTime = selectedQuestions.reduce(
        (total, question) => total + question.estimated_time_to_solve,
        0
      );
      setTotalTime(totalTime);
    };

    calculateTotalTime();
  }, [selectedQuestionIds, questions]);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (id === "test_name") setTestName(value);
    // Removed manual time-to-solve input to keep the total time in sync
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  // Prevent form from reloading

    const payload = {
        test_name: testName,
        time_to_solve: totalTime,
        questions: selectedQuestionIds,
        topic_id: topicid,  // Add topic_id here
    };

    console.log("Payload:", payload); // Log the payload to verify it

    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/createtest/',
            payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
      
        console.log("Test created successfully:", response.data);
      alert('Test created successfully')
        navigate(`/demotable/${topicid}`);
    } catch (error) {
        console.error("Error creating test:", error);
    }
  };

  const renderSelectedQuestions = () => {
    return questions
      .filter((question) => selectedQuestionIds.includes(question.id))
      .map((question) => (
        <TableRow key={question.id}>
          <TableCell align="center">{question.id}</TableCell>
          <TableCell align="center">{question.topic.name}</TableCell>
          <TableCell align="center">{question.question}</TableCell>
          <TableCell align="center">{question.types}</TableCell>
          <TableCell align="center">{question.difficulty}</TableCell>
          <TableCell align="center">{question.estimated_time_to_solve}</TableCell>
        </TableRow>
      ));
  };

  return (
    <>
      <section>
        <div className="register">
          <div className="col-1">
            <h2 style={{ color: "#565651" }}>Test Paper</h2>
            <br />
            <Box component="form" sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
              <TextField
                id="test_name"
                label="Test Name"
                value={testName}
                onChange={handleInputChange}
                helperText="Please enter test name"
              />
              <TextField
                id="time-to-solve"
                label="Total Time"
                type="number"
                value= {totalTime}
                InputProps={{
                  readOnly: true,
                }}
                helperText="Total calculated time here"
              />
              <TextField
                id="select-questions"
                select
                label="Select Question"
                SelectProps={{
                  multiple: true,
                  value: selectedQuestionIds,
                  renderValue: (selected) => (
                    <div>
                      {selected.map((value) => {
                        const question = questions.find((q) => q.id === value);
                        return question ? (
                          <span key={value}>
                            {question.question}{" "}
                          </span>
                        ) : null;
                      })}
                    </div>
                  ),
                }}
              >
                {questions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedQuestionIds.includes(option.id)}
                          value={option.id}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={`${option.question} Time to solve ----- ${option.estimated_time_to_solve}`}
                    />
                   
                  </MenuItem>
                ))}           
              </TextField>
              <div>
              <button className="button-75" role="button" onClick={handleSubmit}>
                <span className="text">Save Paper</span>
              </button>
              </div>
            </Box>
          </div>
        </div>
      </section>
      <section>
        <div className="register">
          <div className="col-1">
            <h2 style={{ color: "#565651", textAlign: 'center' }}>Selected Questions</h2>
            <br />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: "bold", fontSize: 16 }}>Question ID</TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold", fontSize: 16 }}>Topic Name</TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold", fontSize: 16 }}>Questions</TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold", fontSize: 16 }}>Type</TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold", fontSize: 16 }}>Difficulty Level</TableCell>
                    <TableCell align="center" style={{ fontWeight: "bold", fontSize: 16 }}>Time to Solve</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderSelectedQuestions()}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </section>
    </>
  );
};

export default CreateTest;
