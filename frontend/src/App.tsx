import { useState, ChangeEvent, FormEvent, useRef } from "react";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import { Backdrop, Box, Button, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import TextInput from "./components/TextInput/TextInput";
import { AttritionData, Data } from "./models/Model";
import { attrApi } from "./models/api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function App() {
  const [name, setName] = useState("");
  const [monthExp, setMonthExp] = useState("");
  const [totalOrgs, setTotalOrgs] = useState("");
  const [lastPay, setLastPay] = useState("");
  const [feedback, setFeedback] = useState("");
  const [promotion, setPoromotion] = useState("");
  const [monthsInOrg, setMonthsInOrg] = useState("");
  const [attritionData, setAttritionData] = useState<AttritionData | null>(
    null
  );
  const [rows, setRows] = useState<number[][]>();
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearData = () => {
    setName("");
    setMonthExp("");
    setTotalOrgs("");
    setMonthsInOrg("");
    setLastPay("");
    setFeedback("");
    setPoromotion("");
    setAttritionData(null);
  };

  const onSubmit = async () => {
    const formData: Data = {
      name: name,
      totalExp: monthExp,
      totalWorkOrgs: totalOrgs,
      monthsInOrg: monthsInOrg,
      lastPay: lastPay,
      averageFeedback: feedback,
      promotion: promotion,
    };
    setIsLoading(true)
    try {
      //clearData();
      const response = await attrApi(formData);
      setAttritionData({
        name: name,
        attrition: response.attrition,
      });

      console.log("oooo");
    } catch (e) {
      alert(e);
    } finally {
      setIsLoading(false)
    }
  };

  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const selectedFile = files[0];
    if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
    } else {
      // Raise an alert if not a CSV file
      alert('Please upload a CSV file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
    }
    
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    setIsLoading(true)
    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something Went Wrong on Server. Please chek CSV columns")

      setRows(result)
      console.log(result);
    } catch (error) {
      console.error("Error:", error);
      alert(error)

    } finally {
      setIsLoading(false)
    }
  };

  const handleDownloadCSV = async () => {
    console.log(rows)
    const formData1 = {
      "data": rows
    }
  try {
    const response = await fetch('/down', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData1),
    });

    if (response.ok) {
      console.log("ok")
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'data.csv');  // The default filename for downloading
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }
catch(error){
  alert(error)
}
};

  return (
    <>
      <NavBar />
      <Box sx={{ mx: 8, my: 4 }}>
        <Typography variant="h4" sx={{ textAlign: "center", my: 2 }}>
          AI Attrition Prediction
        </Typography>
        <TextInput lable={"Candidate Name*"} value={name} setValue={setName} />
        <Grid container columnSpacing={4}>
          <Grid item md={6} sm={12}>
            <TextInput
              lable={"Total Month of Experiance*"}
              value={monthExp}
              setValue={setMonthExp}
              isNumber={true}
            />
            <TextInput
              lable={"Total Work Orgs*"}
              value={totalOrgs}
              setValue={setTotalOrgs}
              isNumber={true}
            />
            <TextInput
              lable={"Months in Org*"}
              value={monthsInOrg}
              setValue={setMonthsInOrg}
              isNumber={true}
            />
          </Grid>
          <Grid item md={6} sm={12}>
            <TextInput
              lable={"Last Pay Increment Band*"}
              value={lastPay}
              setValue={setLastPay}
              isNumber={true}
            />
            <TextInput
              lable={"Average Feedback*"}
              value={feedback}
              setValue={setFeedback}
              isNumber={true}
            />
            <TextInput
              lable={"Last Promotion Years*"}
              value={promotion}
              setValue={setPoromotion}
              isNumber={true}
            />
          </Grid>
        </Grid>

        {attritionData && (
          <Box sx={{ display: "flex", justifyContent: "center", m: 1 }}>
            <Typography variant="h3" color={"green"}>
              Chances of Attrition for {attritionData.name}:{" "}
              {attritionData.attrition}%
            </Typography>
          </Box>
        )}
        <Box
          sx={{ display: "flex", gap: "4rem", justifyContent: "center", m: 4 }}
        >
          <Button
            variant="contained"
            sx={{ minWidth: "8rem" }}
            onClick={onSubmit}
            disabled={
              !name ||
              !monthExp ||
              !promotion ||
              !totalOrgs ||
              !lastPay ||
              !feedback
            }
          >
            {" "}
            Submit Data
          </Button>
          <Button
            variant="contained"
            onClick={clearData}
            color="error"
            sx={{ width: "8rem" }}
          >
            Clear
          </Button>
        </Box>

        <Divider sx={{ my: 1 }}>Bulk Upload</Divider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 3,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                border: "2px dotted black",
                px: 4,
                py: 2,
                borderRadius: "16px",
              }}
            >
              <input type="file" onChange={handleFileChange} ref={fileInputRef}/>
              <Button variant="contained" type="submit" disabled={file === null}>
                Submit File
              </Button>
            </Box>
          </form>
        </Box>
        { rows == null ? <></> :
        <Box sx={{mx: 3}}>
        <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Candidate Name</TableCell>
            <TableCell align="right">Total Experiance</TableCell>
            <TableCell align="right">Total Orgs</TableCell>
            <TableCell align="right">Month in Current Org</TableCell>
            <TableCell align="right">Last Increment Band</TableCell>
            <TableCell align="right">Avg Feedback</TableCell>
            <TableCell align="right">Last Promotion</TableCell>
            <TableCell align="right">Attrition %</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} align={cellIndex === 0 ? 'left' : 'center'}>
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Box  sx={{display: "flex", justifyContent: "center" , my: 2}} >
      <Button variant="contained" color="success" onClick={handleDownloadCSV}>Download Output</Button>
    </Box>
    </Box>
    }
      </Box>
      <Backdrop
  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
  open={isLoading}

>
  <CircularProgress color="inherit" />
</Backdrop>
    </>
  );
}

export default App;
