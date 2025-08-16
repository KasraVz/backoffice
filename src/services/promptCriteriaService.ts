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
  {
    id: 1,
    promptText: "Based on your expertise in Financial Management for Seed-stage startups, please review the following questions for clarity, relevance, and accuracy.",
    tags: ["FPA", "Seed", "Financial Management"],
    indexCode: "FPA",
    stage: "Seed",
    category: "Financial Management",
    industry: "General"
  },
  {
    id: 2,
    promptText: "As an expert in HR Tech for Early Stage companies, evaluate these questions for technical accuracy and practical applicability.",
    tags: ["EEA", "Early Stage", "Human Resources"],
    indexCode: "EEA",
    stage: "Early Stage",
    category: "Human Resources",
    industry: "HR Tech"
  },
  {
    id: 3,
    promptText: "Review these marketing and customer acquisition questions for Growth stage companies. Focus on scalability and market fit considerations.",
    tags: ["FPA", "Growth", "Marketing"],
    indexCode: "FPA",
    stage: "Growth",
    category: "Marketing",
    industry: "General"
  },
  {
    id: 4,
    promptText: "Evaluate these operational efficiency questions for Scale stage startups. Consider enterprise-level processes and systems.",
    tags: ["EEA", "Scale", "Operations"],
    indexCode: "EEA",
    stage: "Scale",
    category: "Operations",
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