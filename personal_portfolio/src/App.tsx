import './App.css';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import AboutPage from './components/AboutPage';
import ExperiencePage from './components/ExperiencePage';
import ProjectsPage from './components/ProjectsPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#050505',
      paper: '#0e0e0e',
    },
    primary: {
      main: '#ffffff',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#888888',
    },
    divider: '#242424',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar />
      <main>
        <AboutPage />
        <ExperiencePage />
        <ProjectsPage />
      </main>
    </ThemeProvider>
  );
}

export default App;
