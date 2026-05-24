import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { useInView } from '../hooks/useInView';

const experiences = [
  {
    company: 'Goldman Sachs',
    role: 'Global Banking & Markets — Software Engineer',
    period: 'May 2025 – Present',
    location: 'Salt Lake City, UT',
    description:
      'Develop and maintain Java/Spring Boot microservices supporting Fees & Commissions workflows across Global Banking & Markets. Design and deliver full-stack features across Angular/TypeScript frontends and Java backends, collaborating directly with traders, operations, and sales teams. Manage CI/CD pipelines, Kubernetes deployments, and Gradle build workflows. Use Terraform and HashiCorp tooling for infrastructure management, and Splunk for production observability and incident resolution.',
    tags: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'Kubernetes', 'Terraform', 'CI/CD', 'Splunk'],
    current: true,
    type: 'work',
  },
  {
    company: 'Goldman Sachs',
    role: 'Private Wealth Management — Software Engineer',
    period: 'January 2023 – May 2025',
    location: 'Salt Lake City, UT',
    description:
      'Built and maintained distributed Java/Spring microservices powering a core content delivery and communications platform for Private Wealth Management clients — processing over one million requests per day. Designed Kafka-based event-driven workflows for reliable, ordered delivery across orchestrator and downstream services. Designed MongoDB schemas for client delivery configurations, developed Python/Pandas scripts for production data validation, and led migration from legacy GSSO authentication to OIDC via Ping Federate. Used Splunk for end-to-end observability and incident triage.',
    tags: ['Java', 'Spring', 'Kafka', 'MongoDB', 'Python', 'Kubernetes', 'OIDC', 'Splunk'],
    current: false,
    type: 'work',
  },
  {
    company: 'Goldman Sachs',
    role: 'Software Engineering Summer Analyst',
    period: 'Jun 2022 – Aug 2022',
    location: 'Salt Lake City, UT',
    description:
      'Built an automated project management service using Python and Flask RESTful APIs, saving the team 30–50 engineering hours per month. Developed a self-service React application to streamline internal documentation workflows. Implemented software versioning and deployment workflows aligned with internal CI/CD and SDLC pipelines.',
    tags: ['React', 'Python', 'Flask', 'CI/CD'],
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

function ExperienceCard({ exp, index }: { exp: typeof experiences[0]; index: number }) {
  const { ref, inView } = useInView();

  return (
    <Box
      ref={ref}
      sx={{
        display: 'flex',
        gap: 3,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s`,
      }}
    >
      {/* Timeline dot */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2.5 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            bgcolor: exp.current ? '#f0f0f0' : exp.type === 'education' ? '#555' : '#2a2a2a',
            border: `2px solid ${exp.current ? '#f0f0f0' : '#242424'}`,
            boxShadow: exp.current ? '0 0 0 4px rgba(240,240,240,0.08)' : 'none',
            flexShrink: 0,
            zIndex: 1,
          }}
        />
        <Box sx={{ width: '1px', flex: 1, bgcolor: '#1e1e1e', mt: 1 }} />
      </Box>

      <Card
        sx={{
          flex: 1,
          bgcolor: '#0a0a0a',
          border: `1px solid ${exp.current ? '#333' : '#1c1c1c'}`,
          borderRadius: 2,
          boxShadow: 'none',
          mb: 2.5,
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderColor: exp.current ? '#484848' : '#2e2e2e',
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              {exp.type === 'education' ? (
                <SchoolIcon sx={{ fontSize: 15, color: '#555' }} />
              ) : (
                <WorkIcon sx={{ fontSize: 15, color: exp.current ? '#888' : '#3a3a3a' }} />
              )}
              <Typography variant="h6" sx={{ color: '#e8e8e8', fontWeight: 600, fontSize: '0.95rem' }}>
                {exp.role}
              </Typography>
              {exp.current && (
                <Chip
                  label="Current"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    bgcolor: 'rgba(255,255,255,0.07)',
                    color: '#aaa',
                    border: '1px solid #333',
                    '& .MuiChip-label': { px: 0.75 },
                  }}
                />
              )}
            </Box>
            <Typography variant="caption" sx={{ color: '#444', mt: 0.3, whiteSpace: 'nowrap', fontSize: '0.75rem' }}>
              {exp.period}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 500, fontSize: '0.85rem' }}>
              {exp.company}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: '#2a2a2a' }}>·</Typography>
            <Typography variant="subtitle2" sx={{ color: '#484848', fontSize: '0.82rem' }}>
              {exp.location}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.75, mb: 2.5, fontSize: '0.875rem' }}>
            {exp.description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {exp.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: '#0e0e0e',
                  color: '#555',
                  border: '1px solid #1e1e1e',
                  fontSize: '0.7rem',
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

function ExperiencePage() {
  const { ref: headingRef, inView: headingInView } = useInView();

  return (
    <Box
      id="experience"
      component="section"
      sx={{
        maxWidth: 760,
        mx: 'auto',
        px: { xs: 3, sm: 5 },
        py: { xs: 10, sm: 14 },
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
          Career
        </Typography>
        <Typography
          variant="h4"
          sx={{ color: '#f0f0f0', fontWeight: 700, letterSpacing: '-0.5px', fontSize: { xs: '1.6rem', sm: '2rem' } }}
        >
          Experience
        </Typography>
      </Box>

      <Box>
        {experiences.map((exp, i) => (
          <ExperienceCard key={i} exp={exp} index={i} />
        ))}
      </Box>
    </Box>
  );
}

export default ExperiencePage;
