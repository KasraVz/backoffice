// Shared data structure for categories and industries across the application

export const assessmentCategories = {
  FPA: {
    general: [
      "Financial Management & Fundraising",
      "Business Strategy & Market Analysis", 
      "Technology & Product Development",
      "Operations & Human Resources",
      "Legal & Compliance"
    ],
    industrySpecific: [
      "Industry-Specific Regulations",
      "Sector Market Dynamics",
      "Specialized Technology Requirements",
      "Industry Best Practices",
      "Compliance & Standards"
    ]
  },
  EEA: {
    general: [
      "Market Research & Analysis",
      "Customer Development & Validation",
      "Competitive Intelligence",
      "Ecosystem Partnerships",
      "Regulatory Environment"
    ],
    industrySpecific: [
      "Industry-Specific Market Dynamics",
      "Sector-Specific Customer Behavior",
      "Regulatory Compliance Requirements",
      "Industry Partnership Opportunities",
      "Market Entry Strategies"
    ]
  },
  GEB: {
    general: [
      // Categories to be defined later
    ],
    industrySpecific: [
      // Categories to be defined later  
    ]
  }
};

export const industries = [
  "General",
  "Finance",
  "HR Tech",
  "Healthtech",
  "Fintech",
  "Edtech",
  "E-commerce",
  "SaaS",
  "Manufacturing",
  "Real Estate",
  "Agriculture",
  "Transportation",
  "Energy",
  "Entertainment",
  "Food & Beverage"
];

export const stages = [
  "Pre-seed",
  "Seed", 
  "Early Stage",
  "Growth Stage",
  "Scale-up",
  "Mature"
];

// Helper function to get all categories for a specific assessment type
export const getAllCategoriesForAssessment = (assessmentType: keyof typeof assessmentCategories): string[] => {
  const assessment = assessmentCategories[assessmentType];
  if (!assessment) return [];
  
  return [
    ...assessment.general,
    ...assessment.industrySpecific
  ];
};

// Helper function to get flat list of all categories (for backwards compatibility)
export const getAllCategories = (): string[] => {
  const allCategories = new Set<string>();
  
  Object.values(assessmentCategories).forEach(assessment => {
    assessment.general.forEach(cat => allCategories.add(cat));
    assessment.industrySpecific.forEach(cat => allCategories.add(cat));
  });
  
  return Array.from(allCategories);
};