import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import StudentsList from './components/StudentsList';
import BookList from './components/BookList';



 
function App() {
  let Navigate = useNavigate
  return (
    <div>
      <h1>Books and Students Application</h1>

    <Button variant= 'outlined' sx={{ m: 2 }}><Link to="/StudentList">Student List</Link></Button>
    <Button variant= 'outlined' sx={{ ml: 14 }}><Link to="/BookList">Book List</Link></Button>

    <Routes>
        <Route path="/StudentList" element={<StudentsList/>} />
        <Route path="BookList" element={<BookList/>} />
      </Routes>
    
   </div>
  );
}

export default App;
