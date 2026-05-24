import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import personalPic from './personalPic.jpg';
import githubSVG from './github.svg';
import linkedinSVG from './linkedin.svg';
import mastodonSVG from './mastodon.svg';

const skills: { label: string; items: string[] }[] = [
  { label: 'Languages', items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL'] },
  { label: 'Frameworks', items: ['Spring Boot', 'Angular', 'React', 'Flask', 'JUnit'] },
  { label: 'Infra', items: ['Kubernetes', 'Kafka', 'Docker', 'Terraform', 'CI/CD'] },
  { label: 'Concepts', items: ['Distributed Systems', 'Microservices', 'REST APIs', 'Event-Driven', 'TDD'] },
];

const interests = ['Distributed Systems', 'Data Science', 'Machine Learning', 'Software Engineering'];

function AboutPage() {
  return (
    <Box
      id="about"
      component="section"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        maxWidth: 760,
        mx: 'auto',
        px: { xs: 3, sm: 5 },
        pt: '100px',
        pb: 10,
      }}
    >
      {/* Profile header */}
      <Box
        className="hero-animate-1"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 3, sm: 5 },
          mb: 6,
        }}
      >
        <Avatar
          src={personalPic}
          alt="Zyad Youssef"
          sx={{
            width: { xs: 90, sm: 110 },
            height: { xs: 90, sm: 110 },
            border: '2px solid #242424',
            flexShrink: 0,
          }}
        />
        <Box>
          <Typography
            variant="h3"
            sx={{
              color: '#f0f0f0',
              fontWeight: 700,
              letterSpacing: '-1px',
              lineHeight: 1.1,
              mb: 1,
              fontSize: { xs: '2rem', sm: '2.6rem' },
            }}
          >
            Zyad Youssef
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: '#888', fontWeight: 400, letterSpacing: '0.01em' }}
          >
            Software Engineer · Goldman Sachs
          </Typography>
        </Box>
      </Box>

      {/* Bio */}
      <Box className="hero-animate-2" sx={{ mb: 6 }}>
        <Typography
          variant="body1"
          sx={{
            color: '#999',
            lineHeight: 1.85,
            maxWidth: 600,
            fontSize: '0.975rem',
          }}
        >
          Software Engineer with 3+ years of experience building and maintaining distributed
          Java/Spring applications at Goldman Sachs. Computer Engineering graduate from the University
          of Utah with a focus on secure, stable backend systems and distributed architectures.
        </Typography>
      </Box>

      <Box
        sx={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, #1e1e1e 30%, #1e1e1e 70%, transparent)',
          mb: 6,
        }}
      />

      {/* Skills */}
      <Box className="hero-animate-3" sx={{ mb: 6 }}>
        <Typography
          variant="overline"
          sx={{ color: '#444', letterSpacing: 2, fontSize: '0.68rem', display: 'block', mb: 2.5 }}
        >
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {skills.map(({ label, items }) => (
            <Box key={label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#3a3a3a',
                  fontSize: '0.68rem',
                  minWidth: 90,
                  pt: 0.5,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {items.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    sx={{
                      bgcolor: '#0e0e0e',
                      color: '#aaa',
                      border: '1px solid #242424',
                      fontWeight: 500,
                      fontSize: '0.72rem',
                      '&:hover': { borderColor: '#3a3a3a', color: '#d0d0d0' },
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Interests */}
      <Box className="hero-animate-4" sx={{ mb: 6 }}>
        <Typography
          variant="overline"
          sx={{ color: '#444', letterSpacing: 2, fontSize: '0.68rem', display: 'block', mb: 2 }}
        >
          Interests
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {interests.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              size="small"
              sx={{
                bgcolor: 'rgba(255,255,255,0.04)',
                color: '#888',
                border: '1px solid #2a2a2a',
                fontWeight: 500,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.07)', color: '#c0c0c0' },
                transition: 'background-color 0.2s, color 0.2s',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Social links */}
      <Box className="hero-animate-5">
        <Typography
          variant="overline"
          sx={{ color: '#444', letterSpacing: 2, fontSize: '0.68rem', display: 'block', mb: 1.5 }}
        >
          Find me on
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          <IconButton
            component="a"
            href="https://github.com/zyad-youssef"
            target="_blank"
            rel="noreferrer"
            sx={{ p: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
          >
            <img
              src={githubSVG}
              alt="GitHub"
              style={{ width: 22, height: 22, filter: 'brightness(0) invert(0.55)' }}
            />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/zyad-youssef/"
            target="_blank"
            rel="noreferrer"
            sx={{ p: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
          >
            <img src={linkedinSVG} alt="LinkedIn" style={{ width: 22, height: 22, opacity: 0.55 }} />
          </IconButton>
          <IconButton
            component="a"
            href="https://mastodon.social/@0xZy4d"
            target="_blank"
            rel="noreferrer"
            sx={{ p: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
          >
            <img src={mastodonSVG} alt="Mastodon" style={{ width: 22, height: 22, opacity: 0.55 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Scroll indicator */}
      <Box
        className="scroll-indicator"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
          color: '#3a3a3a',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <KeyboardArrowDownIcon sx={{ fontSize: 28 }} />
      </Box>
    </Box>
  );
}

export default AboutPage;
