import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';

const experiences = [
  {
    company: 'Goldman Sachs',
    role: 'Global Banking & Markets — Software Engineer',
    period: 'May 2025 – Present',
    location: 'Salt Lake City, UT',
    description:
      'Develop and maintain Spring-based Java applications supporting Fees and Commissions workflows within Global Banking & Markets. Implement enhancements and fixes across backend services, ensuring correctness, stability, and adherence to internal controls. Participate in production support, debugging, and issue resolution.',
    tags: ['Java', 'Spring Boot', 'Distributed Systems', 'Backend'],
    current: true,
    type: 'work',
  },
  {
    company: 'Goldman Sachs',
    role: 'Wealth Management — Software Engineer',
    period: 'Feb 2022 – May 2025',
    location: 'Salt Lake City, UT',
    description:
      'Developed and maintained distributed Java Spring applications supporting a core platform responsible for delivering communications and content to PWM clients. Worked on services coordinated through an orchestrator service, enabling reliable, ordered delivery across distributed systems. Improved platform reliability through automation and workflow optimizations using Python.',
    tags: ['Java', 'Spring', 'Python', 'Distributed Systems'],
    current: false,
    type: 'work',
  },
  {
    company: 'Goldman Sachs',
    role: 'Software Engineering Summer Analyst',
    period: 'Jun 2022 – Aug 2022',
    location: 'Salt Lake City, UT',
    description:
      'Developed a self-service React application to support internal documentation workflows. Built an automated project management service using Python and Flask API, saving the team 30–50 hours per month. Implemented software versioning and deployment workflows aligned with internal SDLC pipelines.',
    tags: ['React', 'Python', 'Flask', 'SDLC'],
    current: false,
    type: 'work',
  },
  {
    company: 'Micro Focus',
    role: 'Software Engineering Intern',
    period: 'Oct 2021 – Jun 2022',
    location: 'Provo, UT',
    description:
      'Developed and executed automated test cases using JUnit and JavaScript. Identified, documented, and presented software defects across the development lifecycle in an Agile environment.',
    tags: ['JUnit', 'JavaScript', 'Agile', 'QA'],
    current: false,
    type: 'work',
  },
  {
    company: 'University of Utah',
    role: 'B.S. Computer Engineering',
    period: 'Dec 2022',
    location: 'Salt Lake City, UT',
    description:
      'Graduated with a GPA of 3.5. Studied both hardware and software engineering disciplines with a focus on software systems, algorithms, and distributed architectures.',
    tags: ['Computer Engineering', 'Algorithms', 'Systems'],
    current: false,
    type: 'education',
  },
];

function ExperiencePage() {
  return (
    <Box className="page-enter" sx={{ maxWidth: 720, mx: 'auto', py: 8, px: 3 }}>
      <Typography variant="h5" sx={{ color: '#e6edf3', fontWeight: 700, mb: 5 }}>
        Experience
      </Typography>

      <Box sx={{ position: 'relative' }}>
        {/* Timeline vertical line */}
        <Box
          sx={{
            position: 'absolute',
            left: 7,
            top: 10,
            bottom: 10,
            width: 2,
            bgcolor: '#21262d',
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {experiences.map((exp, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 3 }}>
              {/* Timeline dot */}
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  bgcolor: exp.current ? '#58a6ff' : exp.type === 'education' ? '#3fb950' : '#30363d',
                  border: `2px solid ${exp.current ? '#58a6ff' : '#0d1117'}`,
                  boxShadow: exp.current ? '0 0 0 3px rgba(88,166,255,0.2)' : 'none',
                  flexShrink: 0,
                  mt: 2.5,
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />

              <Card
                sx={{
                  flex: 1,
                  bgcolor: '#161b22',
                  border: `1px solid ${exp.current ? 'rgba(88,166,255,0.3)' : '#30363d'}`,
                  borderRadius: 2,
                  boxShadow: exp.current ? '0 0 0 1px rgba(88,166,255,0.05)' : 'none',
                  '&:hover': { borderColor: exp.current ? 'rgba(88,166,255,0.5)' : '#484f58', transition: 'border-color 0.2s' },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      mb: 0.5,
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {exp.type === 'education'
                        ? <SchoolIcon sx={{ fontSize: 16, color: '#3fb950' }} />
                        : <WorkIcon sx={{ fontSize: 16, color: exp.current ? '#58a6ff' : '#484f58' }} />
                      }
                      <Typography
                        variant="h6"
                        sx={{ color: '#e6edf3', fontWeight: 600, fontSize: '1rem' }}
                      >
                        {exp.role}
                      </Typography>
                      {exp.current && (
                        <Chip
                          label="Current"
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            fontWeight: 600,
                            bgcolor: 'rgba(88,166,255,0.15)',
                            color: '#58a6ff',
                            border: '1px solid rgba(88,166,255,0.3)',
                            '& .MuiChip-label': { px: 0.75 },
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#8b949e', mt: 0.3, whiteSpace: 'nowrap' }}>
                      {exp.period}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: exp.type === 'education' ? '#3fb950' : '#58a6ff' }}
                    >
                      {exp.company}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: '#30363d' }}>·</Typography>
                    <Typography variant="subtitle2" sx={{ color: '#8b949e' }}>
                      {exp.location}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ color: '#8b949e', lineHeight: 1.7, mb: 2.5 }}
                  >
                    {exp.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {exp.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          bgcolor: '#21262d',
                          color: '#8b949e',
                          border: '1px solid #30363d',
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default ExperiencePage;
