import './App.css';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import AboutPage from './components/AboutPage';
import ExperiencePage from './components/ExperiencePage';
import ProjectsPage from './components/ProjectsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export const drawerWidth = 220;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d1117',
      paper: '#161b22',
    },
    primary: {
      main: '#58a6ff',
    },
    text: {
      primary: '#e6edf3',
      secondary: '#8b949e',
    },
    divider: '#30363d',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0d1117' }}>
          <Navbar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              ml: { sm: `${drawerWidth}px` },
              mt: { xs: '56px', sm: 0 },
              minHeight: '100vh',
            }}
          >
            <Routes>
              <Route path="/" element={<AboutPage />} />
              <Route path="/About" element={<AboutPage />} />
              <Route path="/Projects" element={<ProjectsPage />} />
              <Route path="/Experience" element={<ExperiencePage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
