// Service to manage prompt criteria and their association with categories
export interface PromptCriterion {
  id: number;
  promptText: string;
  tags: string[];
  indexCode: string;
  stage: string;
  category: string;
  industry: string;
}

export interface ReviewSetCategory {
  category: string;
  promptCriterion?: PromptCriterion;
  questionCount: number;
}

export interface ReviewSetData {
  id: string;
  assigneeName: string;
  questionnaireName: string;
  description: string;
  totalQuestions: number;
  categories: ReviewSetCategory[];
  assessmentType: string; // FPA, EEA, GEB
  stage: string;
  industry: string;
}

// Mock prompt criteria data (should eventually come from database)
const mockPromptCriteria: PromptCriterion[] = [
  // FPA Assessment Criteria - General Categories
  {
    id: 1,
    promptText: "As a financial expert, review these Financial Management & Fundraising questions for Seed stage startups. Focus on early-stage funding, cash flow management, and basic financial planning requirements.",
    tags: ["FPA", "Seed", "Financial Management & Fundraising"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Financial Management & Fundraising",
    industry: "General"
  },
  {
    id: 2,
    promptText: "Evaluate these Business Strategy & Market Analysis questions for Seed stage companies. Consider market validation, competitive positioning, and strategic planning for early-stage startups.",
    tags: ["FPA", "Seed", "Business Strategy & Market Analysis"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Business Strategy & Market Analysis",
    industry: "General"
  },
  {
    id: 3,
    promptText: "Review these Technology & Product Development questions for Seed stage startups. Focus on technical feasibility, product-market fit, and development roadmap considerations.",
    tags: ["FPA", "Seed", "Technology & Product Development"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Technology & Product Development",
    industry: "General"
  },
  {
    id: 4,
    promptText: "Evaluate these Operations & Human Resources questions for Seed stage companies. Consider team building, operational efficiency, and HR processes for early-stage startups.",
    tags: ["FPA", "Seed", "Operations & Human Resources"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Operations & Human Resources",
    industry: "General"
  },
  {
    id: 5,
    promptText: "Review these Legal & Compliance questions for Seed stage startups. Focus on regulatory requirements, legal structure, and compliance considerations.",
    tags: ["FPA", "Seed", "Legal & Compliance"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Legal & Compliance",
    industry: "General"
  },
  
  // FPA Assessment Criteria - Industry-Specific Categories
  {
    id: 6,
    promptText: "As an industry expert, evaluate these Industry-Specific Regulations questions for Seed stage companies. Consider sector-specific compliance and regulatory requirements.",
    tags: ["FPA", "Seed", "Industry-Specific Regulations"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Industry-Specific Regulations",
    industry: "General"
  },
  {
    id: 7,
    promptText: "Review these Sector Market Dynamics questions for Seed stage startups. Focus on industry-specific market conditions and competitive landscape.",
    tags: ["FPA", "Seed", "Sector Market Dynamics"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Sector Market Dynamics",
    industry: "General"
  },
  {
    id: 8,
    promptText: "Evaluate these Specialized Technology Requirements questions for Seed stage companies. Consider industry-specific technical needs and standards.",
    tags: ["FPA", "Seed", "Specialized Technology Requirements"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Specialized Technology Requirements",
    industry: "General"
  },
  
  // EEA Assessment Criteria - General Categories
  {
    id: 9,
    promptText: "As a market research expert, evaluate these Market Research & Analysis questions for Early Stage companies. Focus on market validation methodologies and analytical frameworks.",
    tags: ["EEA", "Early Stage", "Market Research & Analysis"],
    indexCode: "EEA",
    stage: "Early Stage",
    category: "Market Research & Analysis",
    industry: "General"
  },
  {
    id: 10,
    promptText: "Review these Customer Development & Validation questions for Early Stage startups. Consider customer discovery processes and validation strategies.",
    tags: ["EEA", "Early Stage", "Customer Development & Validation"],
    indexCode: "EEA",
    stage: "Early Stage",
    category: "Customer Development & Validation",
    industry: "General"
  }
];

// Parse questionnaire name to extract assessment type, stage, and industry
export const parseQuestionnaireName = (questionnaireName: string) => {
  const parts = questionnaireName.split('-');
  if (parts.length >= 3) {
    return {
      assessmentType: parts[0], // FPA, EEA, GEB
      industry: parts[1], // GEN, FIN, HEA, SAA, etc.
      stage: parts[2] // PRE, SEE, EAR, GRO, etc.
    };
  }
  return {
    assessmentType: '',
    industry: '',
    stage: ''
  };
};

// Map stage codes to full names
const stageMapping: Record<string, string> = {
  'PRE': 'Pre-seed',
  'SEE': 'Seed',
  'EAR': 'Early Stage',
  'GRO': 'Growth',
  'SCA': 'Scale'
};

// Get full stage name from code
export const getFullStageName = (stageCode: string): string => {
  return stageMapping[stageCode] || stageCode;
};

// Find matching prompt criterion for a category
export const findPromptCriterion = (
  category: string, 
  assessmentType: string, 
  stage: string, 
  industry: string = 'General'
): PromptCriterion | undefined => {
  // First try exact match
  let criterion = mockPromptCriteria.find(pc => 
    pc.category === category && 
    pc.indexCode === assessmentType && 
    pc.stage === stage &&
    pc.industry === industry
  );

  // If no exact match, try with General industry
  if (!criterion && industry !== 'General') {
    criterion = mockPromptCriteria.find(pc => 
      pc.category === category && 
      pc.indexCode === assessmentType && 
      pc.stage === stage &&
      pc.industry === 'General'
    );
  }

  // If still no match, try any stage for same category and assessment type
  if (!criterion) {
    criterion = mockPromptCriteria.find(pc => 
      pc.category === category && 
      pc.indexCode === assessmentType
    );
  }

  return criterion;
};

// Create default prompt criterion when none exists
export const createDefaultPromptCriterion = (
  category: string, 
  assessmentType: string, 
  stage: string, 
  industry: string = 'General'
): PromptCriterion => {
  return {
    id: 0,
    promptText: `Please review the following ${category} questions for ${stage} stage companies. Evaluate them for clarity, relevance, and accuracy based on your expertise.`,
    tags: [assessmentType, stage, category],
    indexCode: assessmentType,
    stage,
    category,
    industry
  };
};

// Get prompt criteria for multiple categories
export const getPromptCriteriaForCategories = (
  categories: string[], 
  questionnaireName: string
): ReviewSetCategory[] => {
  const { assessmentType, industry, stage: stageCode } = parseQuestionnaireName(questionnaireName);
  const fullStageName = getFullStageName(stageCode);
  
  return categories.map(category => {
    const promptCriterion = findPromptCriterion(category, assessmentType, fullStageName, industry) ||
                           createDefaultPromptCriterion(category, assessmentType, fullStageName, industry);
    
    // Mock question count for each category (this would come from actual question data)
    const questionCount = Math.floor(Math.random() * 5) + 3; // 3-7 questions per category
    
    return {
      category,
      promptCriterion,
      questionCount
    };
  });
};

// Create complete review set data
export const createReviewSetData = (
  assignmentData: {
    assigneeName: string;
    questionnaireName: string;
    description: string;
    questionCount: number;
  },
  selectedCategories: string[]
): ReviewSetData => {
  const { assessmentType, industry, stage: stageCode } = parseQuestionnaireName(assignmentData.questionnaireName);
  const fullStageName = getFullStageName(stageCode);
  
  const categories = getPromptCriteriaForCategories(selectedCategories, assignmentData.questionnaireName);
  
  return {
    id: `${Date.now()}`, // Generate unique ID
    assigneeName: assignmentData.assigneeName,
    questionnaireName: assignmentData.questionnaireName,
    description: assignmentData.description,
    totalQuestions: assignmentData.questionCount,
    categories,
    assessmentType,
    stage: fullStageName,
    industry
  };
};