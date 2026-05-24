import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

const sections = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const [active, setActive] = React.useState('about');
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      let current = 'about';
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          current = id;
        }
      }
      setActive(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          px: { xs: 3, sm: 6, md: 10 },
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: scrolled ? 'rgba(5,5,5,0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: `1px solid ${scrolled ? '#1c1c1c' : 'transparent'}`,
          transition: 'background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        }}
      >
        <Typography
          variant="h6"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            color: '#f0f0f0',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            userSelect: 'none',
          }}
        >
          ZY
        </Typography>

        {/* Desktop nav links */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5, alignItems: 'center' }}>
          {sections.map(({ label, id }) => {
            const isActive = active === id;
            return (
              <Box
                key={id}
                component="button"
                onClick={() => scrollToSection(id)}
                sx={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  px: 2.5,
                  py: 1,
                  borderRadius: 1.5,
                  color: isActive ? '#f0f0f0' : '#666',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.01em',
                  transition: 'color 0.2s ease, background-color 0.2s ease',
                  fontFamily: 'inherit',
                  '&:hover': {
                    color: '#c0c0c0',
                    bgcolor: 'rgba(255,255,255,0.04)',
                  },
                }}
              >
                {label}
              </Box>
            );
          })}
        </Box>

        {/* Mobile menu button */}
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            display: { xs: 'flex', sm: 'none' },
            color: '#f0f0f0',
            p: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            width: 220,
            bgcolor: '#0a0a0a',
            borderLeft: '1px solid #1c1c1c',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#888' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{ px: 1 }}>
          {sections.map(({ label, id }) => (
            <ListItem key={id} disablePadding>
              <ListItemButton
                onClick={() => { scrollToSection(id); setMobileOpen(false); }}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.5,
                  color: active === id ? '#f0f0f0' : '#666',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.04)', color: '#c0c0c0' },
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontWeight: active === id ? 600 : 400 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
