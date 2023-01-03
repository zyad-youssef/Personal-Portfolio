import './App.css';
import Navbar from './components/Navbar'
import About from './components/MenuPage';
import ProjectsPage from './components/ProjectsPage'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Router>
        <Routes>
        <Route path="/About" element={<About/>} />
        <Route path="/Projects" element={<ProjectsPage/>} />
	<Route path="/Resume" element={<ProjectsPage/>} />
	<Route path="/Experience" element={<ProjectsPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
