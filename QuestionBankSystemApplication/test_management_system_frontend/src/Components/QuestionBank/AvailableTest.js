import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import axios from "axios";
import { useParams } from "react-router-dom";
import DeleteTestDialog from "./DeleteTestQuestion";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import FilePresentIcon from "@mui/icons-material/FilePresent";

function AvailableTest() {
  const { id: topicid } = useParams();
  const [testPapers, setTestPapers] = useState([]);
  const token = localStorage.getItem("token"); // Replace with your actual token
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentTestId, setCurrentTestId] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [menuItemId, setMenuItemId] = useState(null);
  const [state, setState] = useState([]);

  const columns = [
    { id: "id", name: "Test ID" },
    { id: "test_name", name: "Test Name" },
    { id: "time_to_solve", name: "Time To Solve" },
    { id: "view_test", name: "View Paper" },
    { id: "download", name: "Download" },
    { id: "delete", name: "Delete Paper" },
  ];

  useEffect(() => {
    // Fetch data from API with authorization header
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/showallpaper/${topicid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTestPapers(response.data);
      } catch (error) {
        console.error("There was an error fetching the test papers!", error);
      }
    };

    fetchData();
  }, [topicid, token]);

  // dowload excel
  const handleDownload = (testPaper) => {
    axios({
      url: `http://127.0.0.1:8000/testpaperdownload/${testPaper}`,
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
        link.setAttribute("download", "questions.csv");
        document.body.appendChild(link);
        link.click();
        this.setState({ fileUrl: url });
      })
      .catch((error) => {
        console.error("Error downloading Excel file: ", error);
      });
  };
  // download Pdf
  const handleDownloadPdf = (testPaper) => {
    axios({
      url: `http://127.0.0.1:8000/testpaperdownload/${testPaper}`,
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
        link.setAttribute("download", "questions.csv");
        document.body.appendChild(link);
        link.click();
        this.setState({ fileUrl: url });
      })
      .catch((error) => {
        console.error("Error downloading Excel file: ", error);
      });
  };

  // handle dialogbox

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setMenuItemId(null);
  };
  const handleDeleteTestPaper = (questionId) => {
    setCurrentTestId(questionId);
    setOpenDeleteDialog(true);
    handleCloseUserMenu();
  };

  return (
    <div style={{ margin: "5%" }}>
      <Box style={{ margin: "0.9%" }}>
        <TableContainer style={{ width: "100%" }} component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead style={{ background: "#ffffff", width: "140%" }}>
              <TableRow>
                <TableCell>
                  <span
                    style={{
                      paddingLeft: "38%",
                      color: "#003049",
                      fontSize: 21,
                      fontWeight: "bold",
                    }}
                  >
                    Available Test Paper
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
              <TableRow style={{ background: "#ffffff" }}>
                {columns.map((column) => (
                  <TableCell
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                    key={column.id}
                  >
                    {column.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {testPapers.map((testPaper) => (
                <TableRow key={testPaper.id}>
                  <TableCell align="center" style={{ fontSize: "16px" }}>
                    {testPaper.id}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "16px" }}>
                    {testPaper.test_name}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "16px" }}>
                    {testPaper.time_to_solve} min
                  </TableCell>
                  <TableCell align="center">
                    <Link to={`/generatepaperboard/${testPaper.id}`}>
                      <VisibilityRoundedIcon />
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <Link onClick={() => handleDownload(testPaper.id)} title="Excel Format">
                      <DocumentScannerIcon style={{ color: "green" }} />
                    </Link>
                    <Link onClick={() => handleDownloadPdf(testPaper.id)} title="PDF Format">
                      <FilePresentIcon style={{ color: "blue" }} />
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    <Link onClick={() => handleDeleteTestPaper(testPaper.id)}>
                      <DeleteForeverRoundedIcon color="error" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <DeleteTestDialog
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
              testid={currentTestId}
            />
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default AvailableTest;
