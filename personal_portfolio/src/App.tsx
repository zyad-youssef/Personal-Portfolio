import './App.css';
import Navbar from './components/Navbar'
import About from './components/MenuPage';
import ProjectsPage from './components/ProjectsPage'
import background from "./background.png"

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
	<Route path="/" element={<ProjectsPage/>} />
	<Route path="/About" element={<ProjectsPage/>} />
        <Route path="/Projects" element={<ProjectsPage/>} />
	<Route path="/Resume" element={<ProjectsPage/>} />
	<Route path="/Experience" element={<ProjectsPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
