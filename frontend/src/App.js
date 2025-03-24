// import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import QuizList from './pages/QuizList';
import CreateQuiz from './pages/CreateQuiz';
import AddQuestion from './pages/AddQuestion';
import QuizDetail from './pages/QuizDetails';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './utils/navbar';

function App() {
  return (
      <>
        
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
            <Route path="/create-quiz" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
            <Route path="/quiz/:quizId" element={<ProtectedRoute><QuizDetail /></ProtectedRoute>} />
            <Route path="/quiz/:quizId/add-question" element={<ProtectedRoute><AddQuestion /></ProtectedRoute>} />
            {/* <Route path="/quiz/:quizId/edit-question/:question" element={<ProtectedRoute><AddQuestion /></ProtectedRoute>} /> */}

          </Routes>
        </Router>
    </>
  );
}

export default App;
