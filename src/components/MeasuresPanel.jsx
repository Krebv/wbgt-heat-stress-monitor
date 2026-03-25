import React from 'react';
import { 
  Card, CardContent, Typography, List, ListItem, 
  ListItemIcon, ListItemText, Chip, Box, Divider, 
  Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import { 
  ExpandMore, CheckCircle, Warning, LocalDrink, 
  AccessTime, WbSunny, People, AcUnit, Schedule 
} from '@mui/icons-material';

const measuresData = {
  low: {
    color: '#4caf50',
    categories: [
      {
        title: 'Acclimatise',
        icon: <Schedule />,
        requirements: [
          'Acclimatise workers new to Singapore or returning from prolonged leave (>1 week)',
          'Gradually increase daily heat exposure over at least 7 days',
          'Ensure workers rehydrate regularly'
        ],
        recommendations: [
          'Provide cool or cold drinking water supply near work areas'
        ]
      },
      {
        title: 'Rest & Shade',
        icon: <WbSunny />,
        requirements: [
          'Ensure workers get adequate rest under shade for recovery from heat'
        ],
        recommendations: [
          'Provide rest areas near work areas, where feasible'
        ]
      },
      {
        title: 'Monitor Worker',
        icon: <People />,
        requirements: [
          'Identify workers vulnerable to heat stress',
          'Make re-deployment arrangements where required'
        ],
        recommendations: []
      }
    ]
  },
  
  medium: {
    color: '#ff9800',
    categories: [
      {
        title: 'Acclimatise',
        icon: <Schedule />,
        requirements: [
          'Acclimatise workers new to Singapore or returning from prolonged leave (>1 week)',
          'Gradually increase daily heat exposure over at least 7 days'
        ],
        recommendations: []
      },
      {
        title: 'Monitor WBGT',
        icon: <AccessTime />,
        requirements: [
          'Monitor WBGT every hour during work hours',
          'Extra vigilance during hotter periods of the day'
        ],
        recommendations: []
      },
      {
        title: 'Drink',
        icon: <LocalDrink />,
        requirements: [
          'Ensure workers rehydrate at least hourly',
          'Recommended intake: 300ml per hour minimum',
          'Increase based on work intensity'
        ],
        recommendations: [
          'Provide cool or cold drinking water supply near work areas'
        ]
      },
      {
        title: 'Reschedule',
        icon: <Schedule />,
        requirements: [],
        recommendations: [
          'Reschedule outdoor physical work to cooler parts of the day where feasible'
        ]
      },
      {
        title: 'Rest & Shade',
        icon: <WbSunny />,
        requirements: [],
        recommendations: [
          'Rest areas to be provided near work areas, where feasible'
        ]
      }
    ]
  },
  
  'high-medium': {
    color: '#ff5722',
    categories: [
      {
        title: 'Rest & Shade',
        icon: <WbSunny />,
        requirements: [
          'Provide hourly rest breaks of minimum 10 minutes for heavy physical work'
        ],
        recommendations: []
      },
      {
        title: 'Monitor Worker',
        icon: <People />,
        requirements: [
          'Identify workers vulnerable to heat stress',
          'Make re-deployment arrangements where required',
          'Close monitoring of worker health condition',
          'Implement buddy system - workers look out for each other',
          'Watch for signs of heat-related illnesses'
        ],
        recommendations: []
      },
      {
        title: 'Ventilation',
        icon: <AcUnit />,
        requirements: [],
        recommendations: [
          'Provide cool rest and work areas with fans, air coolers, etc.',
          'Provide loose-fitting and light-coloured clothing'
        ]
      }
    ],
    additionalNote: 'Includes all Medium Risk measures'
  },
  
  high: {
    color: '#f44336',
    categories: [
      {
        title: 'Acclimatise',
        icon: <Schedule />,
        requirements: [
          'Acclimatise workers new to Singapore or returning from prolonged leave (>1 week)',
          'Gradually increase daily heat exposure over at least 7 days'
        ],
        recommendations: []
      },
      {
        title: 'Monitor WBGT',
        icon: <AccessTime />,
        requirements: [
          'Monitor WBGT every hour during work hours',
          'Extra vigilance during hotter periods'
        ],
        recommendations: []
      },
      {
        title: 'Drink',
        icon: <LocalDrink />,
        requirements: [
          'Ensure workers rehydrate at least hourly',
          'Recommended intake: 300ml per hour minimum',
          'Increase based on work intensity'
        ],
        recommendations: [
          'Provide cool or cold drinking water supply near work areas'
        ]
      },
      {
        title: 'Reschedule',
        icon: <Schedule />,
        requirements: [],
        recommendations: [
          'Reschedule outdoor physical work to cooler parts of the day where feasible'
        ]
      },
      {
        title: 'Rest & Shade',
        icon: <WbSunny />,
        requirements: [
          'Provide hourly rest breaks of minimum 15 minutes for heavy physical work',
          'Increase rest periods as WBGT increases'
        ],
        recommendations: [
          'Rest areas to be provided near work areas, where feasible'
        ]
      },
      {
        title: 'Monitor Worker',
        icon: <People />,
        requirements: [
          'Close monitoring of worker health condition',
          'Implement buddy system - workers look out for each other',
          'Watch for signs of heat-related illnesses',
          'Redeploy vulnerable workers to non-outdoor work'
        ],
        recommendations: []
      },
      {
        title: 'Ventilation',
        icon: <AcUnit />,
        requirements: [],
        recommendations: [
          'Provide cool rest and work areas with fans, air coolers, etc.',
          'Provide loose-fitting and light-coloured clothing'
        ]
      }
    ]
  }
};

export default function MeasuresPanel({ riskLevel }) {
  const data = measuresData[riskLevel] || measuresData.low;
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: data.color }}>
          Required Safety Measures
        </Typography>
        
        {data.additionalNote && (
          <Chip 
            label={data.additionalNote} 
            color="warning" 
            sx={{ mb: 2 }} 
          />
        )}
        
        {data.categories.map((category, idx) => (
          <Accordion key={idx} defaultExpanded={category.requirements.length > 0}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {category.icon}
                <Typography variant="h6">{category.title}</Typography>
                {category.requirements.length > 0 && (
                  <Chip 
                    size="small" 
                    label="REQUIRED" 
                    color="error" 
                    sx={{ ml: 1 }} 
                  />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {category.requirements.length > 0 && (
                <>
                  <Typography variant="subtitle2" color="error" gutterBottom>
                    Mandatory Requirements:
                  </Typography>
                  <List dense>
                    {category.requirements.map((req, i) => (
                      <ListItem key={i}>
                        <ListItemIcon>
                          <Warning color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={req}
                          primaryTypographyProps={{ color: 'error.light' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              
              {category.recommendations.length > 0 && (
                <>
                  {category.requirements.length > 0 && <Divider sx={{ my: 1 }} />}
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Recommendations:
                  </Typography>
                  <List dense>
                    {category.recommendations.map((rec, i) => (
                      <ListItem key={i}>
                        <ListItemIcon>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
}
