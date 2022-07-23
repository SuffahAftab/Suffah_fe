import React, { Component } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default class studentsList extends Component {
  constructor() {
    super();
    this.state = {
      StudentName: [],
      detail: false,
      dailogOpen: false,
      StudentDetail: "",
      BookInfo: "",
      BookBorrowed: [],
      selectBook : ""
    };
    console.log("I am StudentList Constructor");
    fetch("http://localhost:9000/StudentListInfo")
      .then((res) => res.json())
      .then((json) => {
        this.setState({ StudentName: json });
      });
    
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.returnBook = this.returnBook.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.borrow = this.borrow.bind(this);
  }

  
  handleClickOpen = (student) => {
    fetch("http://localhost:9000/BookListInfo")
      .then((res) => res.json())
      .then((json) => {
        this.setState({ BookInfo: json });
        let temp = [];
        Array.from(json).forEach((element) => {
          if (
            element.borrowedBy.indexOf(student.fname + " " + student.lname) !==
            -1
          ) {
            temp.push(element.bname);
            this.setState({ BookBorrowed: temp });
            //  this.setState({ BookBorrowed: [...this.state.BookBorrowed, element.bname] })
          }
        });
      });
    this.setState({ dailogOpen: true });
    this.setState({ StudentDetail: student });
  };

  handleClose = () => {
    this.setState({ dailogOpen: false });
    this.setState({ StudentDetail: "" });
    this.setState({ BookBorrowed: [] });
    this.setState({selectBook : ""})
  };
  returnBook = (book) => {
      console.log('I am returning book: ', book)
      let temp = this.state.BookBorrowed
      let idx = temp.indexOf(book)
      temp.splice(idx , 1)
      this.setState({BookBorrowed : temp})
    
      const response = fetch("http://localhost:9000/BookListInfo/ReturnBook", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookName: book,
        studentName: this.state.StudentDetail.fname + " " + this.state.StudentDetail.lname,
      }),
    })
    .then((res) => res.json())
    .then((res) => {
      console.log(res)
      this.setState({bookInfo : res})
  });

  }

   handleChange = (event) => {
    this.setState({selectBook : event.target.value});
  };

  borrow = () => {
    if(this.state.selectBook != ""){
        let temp = this.state.BookBorrowed
        if(temp.indexOf(this.state.selectBook == -1)){
            temp.push(this.state.selectBook)
            this.setState({BookBorrowed : temp})
        }

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var ddRet = String(today.getDate() + 2).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        var retDay = ddRet + '/' + mm + '/' + yyyy;

        temp = this.state.BookInfo
        let count = 0
        let index = 0
        temp.forEach(element => {
            if(element.bname == this.state.selectBook){
                element.borrowedBy.push(this.state.StudentDetail.fname + " " + this.state.StudentDetail.lname)
                element.borrowDate.push(today)
                element.expDate.push(retDay)
                index = count
            }
            count++
        });

        const response = fetch("http://localhost:9000/BookListInfo/BorrowBook", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bname: temp[index].bname,
              author: temp[index].author,
              borrowedBy : temp[index].borrowedBy,
              borrowDate: temp[index].borrowDate,
              expDate:temp[index].expDate
            }),
          })
          .then((res) => res.json())
          .then((res) => {
            console.log(res)
         this.setState({bookInfo : res})
        });

        
    }

  }

  render() {
    return (
      <div>
        <h1>Students Information</h1>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>First Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Last Name</TableCell>
                <TableCell style={{ fontWeight: "bold" }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(this.state.StudentName).map(
                (element) =>
                  this.state.StudentName != [] && (
                    <TableRow key={element.fname + element.lname}>
                      <TableCell>{element.fname}</TableCell>
                      <TableCell>{element.lname}</TableCell>
                      <TableCell
                        onClick={() => {
                          this.handleClickOpen(element);
                        }}
                      >
                        View Details
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={this.state.dailogOpen}
          // fullScreen
          // TransitionComponent={Transition}
          maxWidth="500px"
          keepMounted
          onClose={this.handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Student Details"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
            <h3>first Name: {this.state.StudentDetail.fname}</h3>
            <h3>Last Name: {this.state.StudentDetail.lname}</h3>
            <div>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow  style={{ fontWeight: "bold" }}>Borrowed Books:</TableRow>
                </TableHead>
                {Array.from(this.state.BookBorrowed).map((e) => (
                  <TableRow key = {e}>
                    <TableCell key = {e}>{e}</TableCell>
                    <TableCell onClick={() => {this.returnBook(e)}}>Return Book</TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>

            <div>Borrow New Books</div>
            <InputLabel id="demo-simple-select-label">Books</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
        //   value={age}
          label="Books"
           onChange={this.handleChange}
        >
         {Array.from(this.state.BookInfo).map((e) => (
             this.state.BookBorrowed.indexOf(e.bname) == -1 &&
                 <MenuItem value={e.bname} key={e}>{e.bname}</MenuItem>
                ))}
        </Select>
        <Button variant= 'outlined' sx={{ ml: 6 }}onClick={this.borrow}>Borrow</Button>
          </DialogContent>
          {/* <DialogActions> */}
          <Button onClick={this.handleClose}>Back</Button>
          {/* </DialogActions> */}
        </Dialog>
      </div>
    );
  }
}
