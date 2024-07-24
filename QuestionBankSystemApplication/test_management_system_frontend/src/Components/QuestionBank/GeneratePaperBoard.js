import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody
} from "@mui/material";

function GeneratePaperBoard() {
  const [questions, setQuestions] = useState([]);
  const [testName, setTestName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [time, setTime] = useState("");
  const token = localStorage.getItem("token");
  const id = useParams();
  const uid = id.id

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/testpaper/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // Log full API response
        const data = response.data[0] || {}; // Assuming the first element in the array
        console.log(data);
        setQuestions(data.qid || "");
        setTestName(data.test_name || ""); // Added fallback
        setTime(data.time_to_solve || ""); // Added fallback
        setTopicName(data.topic);
        console.log(topicName.name);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [token]);

  // Count the question list
  const calculateRows = () => {
    return questions.length || 0;
  };

  // Count the difficulty level questions
  const calculateAccordingLevel = (difficulty) => {
    return questions.filter((row) => row.difficulty === difficulty).length;
  };

  return (
    <>
      <Card
        sx={{
          width: "200px",
          marginLeft: "7%",
          marginTop: "4%",
          float: "left",
          fontFamily: "Poppins",
          fontWeight: "bold",
          color: "#233c5c"
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h6"
              fontFamily={"Poppins"}
              fontWeight={"bold"}
            >
              Total Questions
            </Typography>
            <Typography
              variant="h5"
              color="red"
              component="div"
              textAlign={"center"}
              fontFamily={"Poppins"}
              fontWeight={"bold"}
            >
              {calculateRows()}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Card
        sx={{
          width: "200px",
          marginLeft: "7%",
          marginTop: "4%",
          float: "left",
          color: "#233c5c"
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h6"
              fontFamily={"Poppins"}
              fontWeight={"bold"}
            >
              Beginner Level
            </Typography>
            <Typography
              variant="h5"
              color="red"
              component="div"
              textAlign={"center"}
              fontFamily={"Poppins"}
              fontWeight={"bold"}
            >
              {calculateAccordingLevel("beginner")}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Card
        sx={{
          width: "230px",
          marginLeft: "7%",
          marginTop: "4%",
          float: "left",
          color: "#233c5c"
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h6"
              fontFamily={"Poppins"}
              fontWeight={"bold"}
            >
              Intermediate Level
            </Typography>
            <Typography
              variant="h5"
              color="red"
              component="div"
              textAlign={"center"}
              fontFamily={"Poppins"}
              fontWeight={"bold"}
            >
              {calculateAccordingLevel("intermediate")}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Card
        sx={{
          width: "200px",
          marginLeft: "7%",
          marginTop: "4%",
          float: "left",
          marginBottom: "5%",
          color: "#233c5c"
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography
              component="div"
              variant="h6"
              fontFamily={"Poppins"}
              fontWeight={"bold"}
            >
              Advance Level
            </Typography>
            <Typography
              variant="h5"
              color="red"
              component="div"
              textAlign={"center"}
              fontFamily={"Poppins"}
              fontWeight={"bold"}
            >
              {calculateAccordingLevel("advance")}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <div style={{ margin: "6%" }}>
        <Box style={{ margin: "0.9%" }}>
          <TableContainer style={{ width: "100%" }} component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead style={{ background: "#ffffff", width: "140%" }}>
                <TableRow>
                  <TableCell>
                    <span
                      style={{
                       color: "#233c5c",
                        fontSize: 19,
                        fontWeight: "bold",
                      }}
                    >
                      Test Name ~ { testName}
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
        <Box style={{ margin: "0.9%" }}>
          <TableContainer style={{ width: "100%" }} component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead style={{ background: "#ffffff", width: "140%" }}>
                <TableRow>
                  <TableCell>
                    <span
                      style={{
                        color: "#233c5c",
                        fontSize: 19,
                        fontWeight: "bold",
                       
                      }}
                    >
                      Estimated Time ~ {time} min
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
        <Box style={{ margin: "0.9%" }}>
          <TableContainer style={{ width: "100%" }} component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead style={{ background: "#ffffff" }}>
                <TableRow >
                  {/* Question table columns */}
                  <TableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    Question ID
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    Topic Name
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    Questions
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    Type
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    Difficulty Level
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    Time to Solve
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id} sx={{ "& > *": { borderBottom: "unset" } }}>
                    <TableCell align="center" style={{ fontSize: 16 }}>
                      {question.id}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 16 }}>
                      {topicName.name} {/* Ensure `question.topic` exists and is correct */}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 16 }}>
                      {question.question} {/* Ensure `question.question` exists and is correct */}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 16 }}>
                      {question.types} {/* Ensure `question.types` exists and is correct */}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 16 }}>
                      {question.difficulty}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: 16 }}>
                      {question.estimated_time_to_solve}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        </Box>
      </div>
    </>
  );
}

export default GeneratePaperBoard;
