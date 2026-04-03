import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import GitHubIcon from '@mui/icons-material/GitHub';

const projects = [
  {
    name: 'UDash',
    description:
      'Designed a remote-controlled car to deliver food and objects on the University of Utah campus. Built a React UI to control the car\'s direction, track its location, and live stream its view. Developed an asynchronous Python client-server system to process user commands and convert them into PWM signals for movement control.',
    tags: ['React', 'Python', 'Hardware', 'Raspberry Pi'],
    github: 'https://github.com/zyad-youssef',
  },
];

function ProjectsPage() {
  return (
    <Box className="page-enter" sx={{ maxWidth: 800, mx: 'auto', py: 8, px: 3 }}>
      <Typography variant="h5" sx={{ color: '#e6edf3', fontWeight: 700, mb: 5 }}>
        Projects
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2.5,
        }}
      >
        {projects.map((project) => (
          <Card
            key={project.name}
            sx={{
              bgcolor: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 2,
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              transition: 'border-color 0.2s, transform 0.2s',
              '&:hover': {
                borderColor: '#58a6ff',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <CardContent sx={{ flex: 1, pb: 1 }}>
              <Typography variant="h6" sx={{ color: '#e6edf3', fontWeight: 600, mb: 1 }}>
                {project.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#8b949e', lineHeight: 1.7, mb: 2.5 }}
              >
                {project.description}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {project.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(88,166,255,0.08)',
                      color: '#58a6ff',
                      border: '1px solid rgba(88,166,255,0.2)',
                      fontSize: '0.7rem',
                    }}
                  />
                ))}
              </Box>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                size="small"
                startIcon={<GitHubIcon sx={{ fontSize: 16 }} />}
                href={project.github}
                target="_blank"
                rel="noreferrer"
                sx={{
                  color: '#8b949e',
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  '&:hover': { color: '#e6edf3', bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                View Code
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      <Typography
        variant="caption"
        sx={{ display: 'block', color: '#484f58', mt: 4, textAlign: 'center' }}
      >
        More projects coming soon
      </Typography>
    </Box>
  );
}

export default ProjectsPage;
