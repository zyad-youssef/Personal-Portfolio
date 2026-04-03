import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import CodeIcon from '@mui/icons-material/Code';
import { Link, useLocation } from 'react-router-dom';
import { drawerWidth } from '../App';
import githubSVG from './github.svg';
import linkedinSVG from './linkedin.svg';

const navItems = [
  { label: 'About', path: '/About', icon: <PersonIcon fontSize="small" /> },
  { label: 'Experience', path: '/Experience', icon: <WorkIcon fontSize="small" /> },
  { label: 'Projects', path: '/Projects', icon: <CodeIcon fontSize="small" /> },
];

interface Props {
  window?: () => Window;
}

export default function Navbar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path: string) =>
    location.pathname === path || (path === '/About' && location.pathname === '/');

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#0d1117', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h6" sx={{ color: '#e6edf3', fontWeight: 700, letterSpacing: '-0.3px' }}>
          Zyad Youssef
        </Typography>
        <Typography variant="caption" sx={{ color: '#58a6ff' }}>
          Software Engineer
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#30363d' }} />
      <List sx={{ mt: 1, px: 1 }}>
        {navItems.map(({ label, path, icon }) => {
          const active = isActive(path);
          return (
            <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  borderRadius: 1,
                  color: active ? '#58a6ff' : '#8b949e',
                  bgcolor: active ? 'rgba(88,166,255,0.1)' : 'transparent',
                  gap: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(88,166,255,0.07)',
                    color: '#e6edf3',
                  },
                }}
              >
                {icon}
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: active ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Spacer */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: '#21262d' }} />
      <Box sx={{ px: 2, py: 2, display: 'flex', gap: 0.5 }}>
        <IconButton
          component="a"
          href="https://github.com/zyad-youssef"
          target="_blank"
          rel="noreferrer"
          size="small"
          sx={{ p: 0.75, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
        >
          <img
            src={githubSVG}
            alt="GitHub"
            style={{ width: 18, height: 18, filter: 'brightness(0) invert(0.5)' }}
          />
        </IconButton>
        <IconButton
          component="a"
          href="https://www.linkedin.com/in/zyad-youssef/"
          target="_blank"
          rel="noreferrer"
          size="small"
          sx={{ p: 0.75, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
        >
          <img src={linkedinSVG} alt="LinkedIn" style={{ width: 18, height: 18, opacity: 0.5 }} />
        </IconButton>
      </Box>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          display: { sm: 'none' },
          bgcolor: '#0d1117',
          borderBottom: '1px solid #30363d',
          boxShadow: 'none',
        }}
      >
        <Toolbar variant="dense">
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Zyad Youssef
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#0d1117',
              borderRight: '1px solid #30363d',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#0d1117',
              borderRight: '1px solid #30363d',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}
