import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import personalPic from './personalPic.jpg';
import githubSVG from './github.svg';
import linkedinSVG from './linkedin.svg';
import mastodonSVG from './mastodon.svg';

const interests = [
  'Distributed Systems',
  'Data Science',
  'Machine Learning',
  'Software Engineering',
];

const skills: { label: string; items: string[] }[] = [
  {
    label: 'Languages',
    items: ['Java', 'Python', 'TypeScript', 'JavaScript', 'C'],
  },
  {
    label: 'Frameworks & Tools',
    items: ['Spring Boot', 'React', 'Flask', 'JUnit', 'Git'],
  },
  {
    label: 'Concepts',
    items: ['Distributed Systems', 'REST APIs', 'CI/CD', 'Agile', 'TDD'],
  },
];

function AboutPage() {
  return (
    <Box className="page-enter" sx={{ maxWidth: 720, mx: 'auto', py: 8, px: 3 }}>
      {/* Profile header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 4,
          mb: 5,
        }}
      >
        <Avatar
          src={personalPic}
          alt="Zyad Youssef"
          sx={{
            width: 150,
            height: 150,
            border: '3px solid #30363d',
            flexShrink: 0,
          }}
        />
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h4" sx={{ color: '#e6edf3', fontWeight: 700, mb: 0.5 }}>
            Zyad Youssef
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#58a6ff', mb: 2 }}>
            Software Engineer @ Goldman Sachs
          </Typography>
          <Typography variant="body1" sx={{ color: '#8b949e', lineHeight: 1.8 }}>
            Software Engineer with 3+ years of experience building and maintaining distributed Java/Spring
            applications at Goldman Sachs. Computer Engineering graduate from the University of Utah with a focus
            on secure, stable backend systems and distributed architectures.
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#21262d', mb: 5 }} />

      {/* Skills */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          sx={{ color: '#8b949e', letterSpacing: 1.5, fontSize: '0.7rem' }}
        >
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {skills.map(({ label, items }) => (
            <Box key={label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#484f58',
                  fontSize: '0.7rem',
                  minWidth: 110,
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
                      bgcolor: '#161b22',
                      color: '#c9d1d9',
                      border: '1px solid #30363d',
                      fontWeight: 500,
                      fontSize: '0.72rem',
                    }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#21262d', mb: 5 }} />

      {/* Interests */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          sx={{ color: '#8b949e', letterSpacing: 1.5, fontSize: '0.7rem' }}
        >
          Interests
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
          {interests.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              size="small"
              sx={{
                bgcolor: 'rgba(88,166,255,0.08)',
                color: '#58a6ff',
                border: '1px solid rgba(88,166,255,0.25)',
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Social links */}
      <Box>
        <Typography
          variant="overline"
          sx={{ color: '#8b949e', letterSpacing: 1.5, fontSize: '0.7rem' }}
        >
          Find me on
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5, alignItems: 'center' }}>
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
              style={{ width: 26, height: 26, filter: 'brightness(0) invert(0.7)' }}
            />
          </IconButton>
          <IconButton
            component="a"
            href="https://www.linkedin.com/in/zyad-youssef/"
            target="_blank"
            rel="noreferrer"
            sx={{ p: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
          >
            <img src={linkedinSVG} alt="LinkedIn" style={{ width: 26, height: 26 }} />
          </IconButton>
          <IconButton
            component="a"
            href="https://mastodon.social/@0xZy4d"
            target="_blank"
            rel="noreferrer"
            sx={{ p: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}
          >
            <img src={mastodonSVG} alt="Mastodon" style={{ width: 26, height: 26 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default AboutPage;
