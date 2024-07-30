import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  MenuItem,
  Menu,
  Tooltip,
} from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { Link } from "react-router-dom";
import ModeEditOutlineRoundedIcon from "@mui/icons-material/ModeEditOutlineRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import AddIcon from "@mui/icons-material/Add";
import "./Button.css";
import AddChoiceDialog from "./QuestionBank/AddQuestionChoiceForm";
import DeleteQuestionDialog from "./QuestionBank/DeleteQuestion";
import EditChoiceDialog from "./QuestionBank/EditChoice";
import DeleteChoiceDialog from "./QuestionBank/DeleteChoice";

function DemoTable(props) {
  
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState({});
  const [openQuestions, setOpenQuestions] = useState({});
  const [openAddDialog, setOpenAddDialog] = useState(false); // to add question
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); //to delete question
  const token = localStorage.getItem("token"); // getting token from localstorage
  const topicid = useParams(); // getting topic id from url

  // to get selected topic
  const [topicDetails, setTopicDetails] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTopicDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/gettopic/${topicid.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopicDetails(response.data);
        // console.log('selected topic details-', response.data)
        // console.log("--", topicDetails.name)


      } catch (error) {
        setError("Error fetching topic details");
        console.error("Error fetching topic details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopicDetails();
  }, [topicid.id, token]);


  // dowload excel
  const handleDownload = () => {
    axios({
      url: `http://127.0.0.1:8000/downloadquestion/${topicid.id}`,
      method: "GET",
      responseType: "blob", // Important
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "questionlist.xlsx");
        document.body.appendChild(link);
        link.click();
        // this.setState({ fileUrl: url });
      })
      .catch((error) => {
        console.error("Error downloading Excel file: ", error);
      });
  };
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/questionchoicelist/${topicid.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, [token]);

 

  // to get selected questions choices
  const fetchChoices = async (questionId) => {
    if (!choices[questionId]) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/questionchoice/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("choice response--", response.data);
        setChoices((prevChoices) => ({
          ...prevChoices,
          [questionId]: response.data,
        }));
      } catch (error) {
        console.error("Error fetching choices:", error);
      }
    }
  };

  // to edit and delete choices
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  // to update choice
  const handleEditChoice = (choice) => {
    setSelectedChoice(choice);
    setEditDialogOpen(true);
    handleCloseUserMenu();
  };
  // to delete choice
  const handleDeleteChoice = (choice) => {
    setSelectedChoice(choice);
    console.log(selectedChoice);
    setDeleteDialogOpen(true);
    handleCloseUserMenu();
  };

  // to open down arrow to show choice table
  const handleRowClick = (questionId) => {
    setOpenQuestions((prevOpenQuestions) => ({
      ...prevOpenQuestions,
      [questionId]: !prevOpenQuestions[questionId],
    }));
    if (!openQuestions[questionId]) {
      fetchChoices(questionId);
    }
  };

  // open and close Action menu icon
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

  // to add choice
  const handleAddChoice = (questionId) => {
    setCurrentQuestionId(questionId);
    setOpenAddDialog(true);
    handleCloseUserMenu();
  };
  // to delete question
  const handleDeleteQuestion = (questionId) => {
    setCurrentQuestionId(questionId);
    setOpenDeleteDialog(true);
    handleCloseUserMenu();
  };


  
   // count the question list
   const calculateRows = ()=>{
    return questions.length;
  }
  //count the difficulty level questions
  const culateAccordingLevel = (difficulty)=>{
    return questions.filter(row => row.difficulty === difficulty).length;
  }

  //table style
  const tableStyle = { width: "100%" };

  return (
    <>
    <Card sx={{ width:'200px',marginLeft:'7%', marginTop:'4%',float:'left',fontFamily:"Poppins",fontWeight: "bold",color: "#233c5c"}}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto'}}>
          <Typography component="div" variant="h6" fontFamily={"Poppins"} fontWeight={ "bold"}>
            Total Questions
          </Typography>
          <Typography variant="h5" color="red" component="div" textAlign={"center"} fontFamily={"Poppins"} fontWeight={ "bold"}>
          {calculateRows()}
          </Typography>
        </CardContent>
      </Box>
    </Card>
    <Card sx={{ width:'200px',marginLeft:'7%', marginTop:'4%',float:'left',color: "#233c5c" }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6"fontFamily={"Poppins"} fontWeight={ "bold"}>
            Beginner Level
          </Typography>
          <Typography variant="h5" color="red" component="div" textAlign={"center"} fontFamily={"Poppins"} fontWeight={ "bold"}>
            {culateAccordingLevel('beginner')}
          </Typography>
        </CardContent>
      </Box>
    </Card>
    <Card sx={{ width:'230px',marginLeft:'7%', marginTop:'4%',float:'left',color: "#233c5c" }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6" fontFamily={"Poppins"} fontWeight={ "bold"}>
            Intermediate Level
          </Typography>
          <Typography variant="h5" color="red" component="div" textAlign={"center"} fontFamily={"Poppins"} fontWeight={ "bold"}>
            {culateAccordingLevel('intermediate')}       </Typography>
        </CardContent>
      </Box>
    </Card>
    <Card sx={{ width:'200px',marginLeft:'7%', marginTop:'4%',float:'left',marginBottom:'5%' ,color: "#233c5c"}}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6" fontFamily={"Poppins"} fontWeight={ "bold"}>
            Advance Level
          </Typography>
          <Typography variant="h5" color="red" component="div" textAlign={"center"} fontFamily={"Poppins"} fontWeight={ "bold"}>
            {culateAccordingLevel('advance')}
          </Typography>
        </CardContent>
      </Box>
    </Card>
      <div style={{ margin: "6%" }}>
        {/* to show Topic details table */}
        <Box style={{ margin: "0.9%" }}>
          <TableContainer style={{ width: "101%" }}>
            <Table aria-label="collapsible table">
              <TableHead style={{ background: "#ffffff" }}>
                <TableRow>
                  <TableCell>
                    <span
                      style={{
                        color:  "#233c5c",
                        fontSize: 19,
                        fontWeight: "bold",
                      }}
                    >
                      Topic ~ {topicDetails.name}
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
        <Box style={{ margin: "0.9%" }}>
          <TableContainer style={{ width: "101%" }}>
            <Table aria-label="collapsible table">
              <TableHead style={{ background: "#ffffff" }}>
                <TableRow>
                  <TableCell>
                    <span
                      style={{
                        color: "#233c5c",
                        fontSize: 19,
                        fontWeight: "bold",
                      }}
                    >
                      {topicDetails.description}
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
        {/* to show question list , add question button */}
        <Box style={{ margin: "0.9%" }}>
          <TableContainer style={{ width: "101%" }} component={Paper}>
            <Table aria-label="collapsible table">
              <TableHead style={{ background: "#ffffff" }}>
                <TableRow>
                  <TableCell>
                    <span
                      style={{
                        color:"#233c5c",
                        fontSize: 19,
                        fontWeight: "bold",
                      }}
                    >
                    Question
                    </span>
                  </TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell align="right">
                    <button className="button-75" role="button">
                      <span className="text">
                        <Link
                          to={`/addquestion/${topicid.id}`}
                          style={{ color: "#ffff", textDecoration: "none" }}
                        >
                          Add Question
                        </Link>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell align="right">
                  <button className="button-75" role="button">
                      <span className="text">
                        <Link
                          to={`/createtest/${topicid.id}`}
                          style={{ color: "#ffff", textDecoration: "none" }}
                        >
                          Create Test
                        </Link>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell align="right">
                  <button className="button-75" role="button">
                      <span className="text">
                        <Link
                          to={`/availabletest/${topicid.id}`}
                          style={{ color: "#ffff", textDecoration: "none" }}
                        >
                          Available Test Paper
                        </Link>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell align="right">
                  <button className="button-75" role="button">
                      <span className="text">
                        <Link
                          to={'/uploadfile'}
                          style={{ color: "#ffff", textDecoration: "none" }}
                        >
                          Upload Question
                        </Link>
                      </span>
                    </button>
                  </TableCell>
                  <TableCell align="right">
                    <button
                      className="button-75"
                      role="button"
                      onClick={handleDownload}
                    >
                      <span className="text">Download Question</span>
                    </button>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
        </Box>
        {/* to show question table */}
        <Box style={{ margin: "0.9%" }}>
          <TableContainer style={{ width: "101%" }} component={Paper}>
            <Table aria-label="collapsible table">
            <TableHead style={{ background: "#ffffff" }}>
                <TableRow>
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
                  <TableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    Choices
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ fontWeight: "bold", fontSize: 16 }}
                  >
                    Action
                  </TableCell>
                 
                </TableRow>
              </TableHead>
              <TableBody>
                {questions.map((question) => (
                  <React.Fragment key={question.id}>
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell align="center" style={{ fontSize: 16 ,fontFamily:"Poppins"}}>
                        {question.id}
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: 16,fontFamily:"Poppins" }}>
                        {question.topic.name}
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: 16,fontFamily:"Poppins" }}>
                        {question.question}
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: 16,fontFamily:"Poppins" }}>
                        {question.types}
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: 16,fontFamily:"Poppins" }}>
                        {question.difficulty}
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: 16,fontFamily:"Poppins"}}>
                        {question.estimated_time_to_solve}
                      </TableCell>
                      <TableCell align="center" style={{ fontSize: 16,fontFamily:"Poppins" }}>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => handleRowClick(question.id)}
                        >
                          {openQuestions[question.id] ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      {/* Question Action menu */}
                      <TableCell align="center">
                        <Box sx={{ flexGrow: 0 }} dir="rtl">
                          <Tooltip title="Open">
                            <IconButton
                              onClick={(event) =>
                                handleOpenUserMenu(event, question.id)
                              }
                              sx={{ p: 0 }}
                            >
                              <MoreHorizRoundedIcon />
                            </IconButton>
                          </Tooltip>
                          <Menu
                            sx={{ mt: "30px" }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            keepMounted
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            open={
                              Boolean(anchorElUser) &&
                              menuItemId === question.id
                            }
                            onClose={handleCloseUserMenu}
                          >
                            {/* Add choice icon  */}
                            <MenuItem
                              onClick={() => handleAddChoice(question.id)}
                            >
                              <Typography
                                sx={{ color: "#EA6912" }}
                                textAlign="center"
                              >
                                <Tooltip
                                  title="Add Choice"
                                  placement="right-start"
                                  arrow
                                >
                                  <AddIcon color="primary" />
                                </Tooltip>
                              </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                              <Typography
                                sx={{ color: "#EA6912" }}
                                textAlign="center"
                              >
                                {/* Edit Question */}
                                <Tooltip
                                  title="Update Question"
                                  placement="right-start"
                                  arrow
                                >
                                  <Link to={`/editquestion/${question.id}`}>
                                    <ModeEditOutlineRoundedIcon color="success" />
                                  </Link>
                                </Tooltip>
                              </Typography>
                            </MenuItem>
                            {/* delete question icon */}
                            <MenuItem
                              onClick={() => handleDeleteQuestion(question.id)}
                            >
                              <Typography
                                sx={{ color: "#EA6912" }}
                                textAlign="center"
                              >
                                <Tooltip
                                  title="Delete Question"
                                  placement="right-start"
                                  arrow
                                >
                                  <DeleteForeverRoundedIcon color="error" />
                                </Tooltip>
                              </Typography>
                            </MenuItem>
                          </Menu>
                        </Box>
                      </TableCell>
          
                      
                    </TableRow>
                    <TableRow>
                      {/*  to show choice table */}
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={7}
                      >
                        <Collapse
                          in={openQuestions[question.id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box margin={1}>
                            <Table size="small" aria-label="choices">
                              <TableHead style={{ background: "#eeeff0" }}>
                                <TableRow>
                                  {/* <TableCell align='center' style={{ fontWeight: 'bold' }}>Choice ID</TableCell> */}
                                  <TableCell
                                    align="center"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Choice Text
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Is Correct
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Discription
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Updated By
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    Actions
                                  </TableCell>
                                </TableRow>
                              </TableHead>

                              <TableBody>
                                {choices[question.id] &&
                                  choices[question.id].map((choice) => (
                                    <TableRow key={choice.id}>
                                      {/* <TableCell align='center'>{choice.id}</TableCell> */}
                                      <TableCell>
                                        {choice.choice_text}
                                      </TableCell>
                                      <TableCell align="center" fontFamily='Poppins'>
                                        {" "}
                                        {choice.is_correct ? (
                                          <span
                                            style={{
                                              display: "inline-block",
                                              padding: "2px 5px",
                                              backgroundColor: "#57b53a",
                                              borderRadius: "3px",
                                              color: "#fff",
                                              fontFamily:"Poppins"
                                            }}
                                          >
                                            True
                                          </span>
                                        ) : (
                                          "False"
                                        )}
                                      </TableCell>
                                      <TableCell align="center" fontFamily='Poppins'>
                                        {choice.description}
                                      </TableCell>
                                      <TableCell align="center" fontFamily='Poppins'>
                                        {choice.updated_by_email}
                                      </TableCell>
                                      <TableCell align="center" fontFamily='Poppins'>
                                        <Box sx={{ flexGrow: 0 }} dir="rtl">
                                          <Tooltip title="Open">
                                            <IconButton
                                              onClick={(event) =>
                                                handleOpenUserMenu(
                                                  event,
                                                  choice.id
                                                )
                                              }
                                              sx={{ p: 0 }}
                                            >
                                              <MoreHorizRoundedIcon />
                                            </IconButton>
                                          </Tooltip>
                                          <Menu
                                            sx={{ mt: "30px" }}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                              vertical: "top",
                                              horizontal: "right",
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                              vertical: "top",
                                              horizontal: "right",
                                            }}
                                            open={
                                              Boolean(anchorElUser) &&
                                              menuItemId === choice.id
                                            }
                                            onClose={handleCloseUserMenu}
                                          >
                                            {/* Update choice icon */}
                                            <MenuItem
                                              onClick={() =>
                                                handleEditChoice(choice)
                                              }
                                            >
                                              <Typography
                                                sx={{ color: "#EA6912" }}
                                                textAlign="center"
                                              >
                                                <Tooltip
                                                  title="Update Choice"
                                                  placement="right-start"
                                                  arrow
                                                >
                                                  <ModeEditOutlineRoundedIcon color="success" />
                                                </Tooltip>
                                              </Typography>
                                            </MenuItem>
                                            {/* Delete choice icon */}
                                            <MenuItem
                                              onClick={() =>
                                                handleDeleteChoice(choice.id)
                                              }
                                            >
                                              <Typography
                                                sx={{ color: "#EA6912" }}
                                                textAlign="center"
                                              >
                                                <Tooltip
                                                  title="Delete Choice"
                                                  placement="right-start"
                                                  arrow
                                                >
                                                  <DeleteForeverRoundedIcon color="error" />
                                                </Tooltip>
                                              </Typography>
                                            </MenuItem>
                                          </Menu>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                              {/* Dialog box for Update and Delete choices */}
                              {selectedChoice && (
                                <EditChoiceDialog
                                  open={editDialogOpen}
                                  onClose={() => setEditDialogOpen(false)}
                                  choice={selectedChoice}
                                  token={token}
                                  fetchChoices={fetchChoices}
                                />
                              )}
                              {selectedChoice && (
                                <DeleteChoiceDialog
                                  open={deleteDialogOpen}
                                  onClose={() => setDeleteDialogOpen(false)}
                                  choiceId={selectedChoice}
                                  token={token}
                                  fetchChoices={fetchChoices}
                                  questionId={question.id}
                                />
                              )}
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
              {/* Dialog box for add choice and delete question */}
              <AddChoiceDialog
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                questionId={currentQuestionId}
              />
              <DeleteQuestionDialog
                open={openDeleteDialog}
                
                onClose={() => setOpenDeleteDialog(false)}
                questionId={currentQuestionId}
              />

            </Table>
          </TableContainer>
        </Box>
       
      </div>
    </>
  );
}

export default DemoTable;
