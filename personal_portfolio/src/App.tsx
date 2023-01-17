import './App.css';
import Navbar from './components/Navbar'
import AboutPage from './components/AboutPage'
import ProjectsPage from './components/ProjectsPage';
import background from "./background.jpg"
import personalPic from "./personalPic.jpg"

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
     <div className="App" style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          height: "100vh",
          color: "#f5f5f5"
        }}>
      <Navbar></Navbar>
      <Router>
        <Routes>  
	<Route path="/" element={<AboutPage/>} />
	<Route path="/About" element={<AboutPage/>} />
        <Route path="/Projects" element={<ProjectsPage/>} />
	<Route path="/Resume" element={<AboutPage/>} />
	<Route path="/Experience" element={<AboutPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
