import React, { Component } from "react";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default class BookList extends Component {
     constructor(){
        super();
        this.state = {
            BookInfo : [],
        }
        
        fetch("http://localhost:9000/BookListInfo")
        .then((res) => res.json())
        .then((json) => {
          this.setState({BookInfo : json})
        });
        
        
    }
    
  render() {
    return (
      <div>
        <h1>BookList</h1>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Book Name</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Students Borrowed</TableCell>
                  <TableCell>Date of Borrow</TableCell>
                  <TableCell>Expected Date of Return</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {Array.from(this.state.BookInfo).map(
              (element) =>
              this.state.BookInfo != [] &&
              (<TableRow key={element}>
                <TableCell>{element.bname}</TableCell>
                <TableCell>{element.author}</TableCell>
                <TableCell>
                    {Array.from(element.borrowedBy).map((e) => (<TableCell>{e}</TableCell>))}
                </TableCell>
                <TableCell>
                    {Array.from(element.borrowDate).map((e) => (<TableCell>{e}</TableCell>))}
                </TableCell>
                <TableCell>
                    {Array.from(element.expDate).map((e) => (<TableCell>{e}</TableCell>))}
                </TableCell>
            </TableRow>))}
              </TableBody>
            </Table>
          </TableContainer>
      </div>
    );
  }
}
