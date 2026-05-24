import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useInView } from '../hooks/useInView';

const projects = [
  {
    name: 'Crypto-Tracker',
    description:
      'A Python-based client/server application that monitors cryptocurrency market prices in real time and notifies users of significant price changes. Designed backend logic for retrieving, processing, and distributing live pricing updates across client/server components.',
    tags: ['Python', 'Client/Server', 'Fintech', 'Real-Time'],
    github: 'https://github.com/zyad-youssef/Crypto-Tracker',
  },
  {
    name: 'UDash',
    description:
      "Designed a remote-controlled campus delivery system with a React UI for directional control, live location tracking, and real-time video streaming. Built an asynchronous Python client-server system to process user commands and convert them into PWM control signals for movement.",
    tags: ['React', 'Python', 'Raspberry Pi', 'Real-Time'],
    github: 'https://github.com/zyad-youssef',
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const { ref, inView } = useInView();

  return (
    <Card
      ref={ref}
      sx={{
        bgcolor: '#0a0a0a',
        border: '1px solid #1c1c1c',
        borderRadius: 2,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s, border-color 0.2s ease`,
        ...(inView && {
          '&:hover': {
            borderColor: '#333',
            transform: 'translateY(-3px)',
          },
        }),
      }}
    >
      <CardContent sx={{ flex: 1, p: 3, pb: 1 }}>
        <Typography variant="h6" sx={{ color: '#e8e8e8', fontWeight: 600, mb: 1.5, fontSize: '1rem' }}>
          {project.name}
        </Typography>
        <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.75, mb: 2.5, fontSize: '0.875rem' }}>
          {project.description}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {project.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.04)',
                color: '#666',
                border: '1px solid #242424',
                fontSize: '0.7rem',
              }}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2.5, pb: 2.5 }}>
        <Button
          size="small"
          startIcon={<GitHubIcon sx={{ fontSize: 15 }} />}
          href={project.github}
          target="_blank"
          rel="noreferrer"
          sx={{
            color: '#555',
            textTransform: 'none',
            fontSize: '0.8rem',
            fontWeight: 400,
            '&:hover': { color: '#aaa', bgcolor: 'rgba(255,255,255,0.04)' },
          }}
        >
          View Code
        </Button>
      </CardActions>
    </Card>
  );
}

function ProjectsPage() {
  const { ref: headingRef, inView: headingInView } = useInView();

  return (
    <Box
      id="projects"
      component="section"
      sx={{
        maxWidth: 760,
        mx: 'auto',
        px: { xs: 3, sm: 5 },
        py: { xs: 10, sm: 14 },
        pb: { xs: 16, sm: 20 },
      }}
    >
      <Box
        sx={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #1e1e1e 30%, #1e1e1e 70%, transparent)',
          mb: 10,
        }}
      />

      <Box
        ref={headingRef}
        sx={{
          mb: 7,
          opacity: headingInView ? 1 : 0,
          transform: headingInView ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: '#444', letterSpacing: 2, fontSize: '0.68rem', display: 'block', mb: 1 }}
        >
          Work
        </Typography>
        <Typography
          variant="h4"
          sx={{ color: '#f0f0f0', fontWeight: 700, letterSpacing: '-0.5px', fontSize: { xs: '1.6rem', sm: '2rem' } }}
        >
          Projects
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.name} project={project} index={i} />
        ))}
      </Box>

      <Typography
        variant="caption"
        sx={{ display: 'block', color: '#2e2e2e', mt: 6, textAlign: 'center', letterSpacing: 1 }}
      >
        More projects coming soon
      </Typography>
    </Box>
  );
}

export default ProjectsPage;
