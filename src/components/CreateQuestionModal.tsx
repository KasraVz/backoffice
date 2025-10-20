import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionCreated: (question: any) => void;
  editingQuestion?: any;
}

const behavioralCodes = [
  "Comfortable with risk",
  "Comfortable with being the center of attention", 
  "Energetic",
  "Comfortable with long-term goals",
  "Curious",
  "Responsibility",
  "Achievement",
  "Organized",
  "Managing emotions",
  "Self-efficacy",
  "Resilience and persistence",
  "Ability to delegate responsibility to others"
];

const indexCodes = ["FPA", "EEA", "GEB"];

const questionTaxonomy = {
  FPA: {
    General: {
      "Market & Customer Discovery": [
        "Understanding Pain Points & Market Needs",
        "Customer Segmentation & Persona Development",
        "Validating Problem-Solution Fit",
        "Early Adopter Identification",
        "Competitive Research & Gap Analysis"
      ],
      "Business Model & Strategy": [
        "Developing a Viable Business Model",
        "Monetization & Revenue Strategy",
        "Strategic Differentiation & Positioning",
        "Market Sizing & Opportunity Assessment",
        "Building a Strategic Roadmap"
      ],
      "Product Development & MVP": [
        "MVP Definition & Scope",
        "Build vs. Buy Decisions",
        "Iterative Development & Testing",
        "Product-Market Fit Validation",
        "Technical Debt & Trade-offs"
      ],
      "Finance & Fundraising": [
        "Basic Financial Literacy & Projections",
        "Cash Flow Management",
        "Understanding Funding Stages",
        "Preparing Investor Materials",
        "Managing Dilution & Cap Tables"
      ],
      "Legal & Compliance": [
        "Choosing the Right Legal Structure",
        "Founder Agreements & Equity Split",
        "Intellectual Property Basics",
        "Regulatory Awareness",
        "Essential Contracts & Agreements"
      ],
      "Marketing & Sales": [
        "Defining Value Proposition",
        "Channel Strategy & Selection",
        "Building Initial Customer Pipeline",
        "Pricing & Packaging Strategy",
        "Measuring Marketing & Sales Effectiveness"
      ],
      "Team & Culture": [
        "Co-founder Dynamics & Complementary Skills",
        "Early Hiring & Role Clarity",
        "Building Culture from Day One",
        "Equity Compensation & Incentives",
        "Remote vs. In-Person Team Decisions"
      ],
      "Pitching & Storytelling": [
        "Crafting a Compelling Narrative",
        "Pitch Deck Essentials",
        "Delivering with Confidence",
        "Handling Tough Questions",
        "Tailoring Messages to Audiences"
      ],
      "Founder Mindset & Resilience": [
        "Managing Uncertainty & Stress",
        "Learning from Failure",
        "Building Founder Network & Support",
        "Time Management & Prioritization",
        "Maintaining Work-Life Balance"
      ],
      "Operations & Execution": [
        "Setting Up Core Processes",
        "Task Prioritization & Focus",
        "Tools & Systems Selection",
        "Measuring Progress & KPIs",
        "Balancing Speed with Quality"
      ]
    },
    "Industry-Specific": {
      "Deep Industry & Market Dynamics": [
        "Sector-Specific Trends & Evolution",
        "Key Players & Incumbent Analysis",
        "Customer Behavior Patterns in Industry",
        "Regulatory & Compliance Landscape",
        "Supply Chain & Distribution Channels"
      ],
      "Technology & Product Infrastructure": [
        "Industry-Standard Tech Stacks",
        "Integration & Interoperability Requirements",
        "Security & Data Privacy Standards",
        "Scalability Considerations",
        "Emerging Tech & Innovation Opportunities"
      ],
      "Legal, Regulatory & Compliance Frameworks": [
        "Industry-Specific Regulations",
        "Licensing & Certification Requirements",
        "Data Governance & Privacy Laws",
        "Industry Standards & Best Practices",
        "Risk Management & Insurance"
      ],
      "Financial & Economic Nuances": [
        "Industry-Specific Unit Economics",
        "Funding Landscape & Investor Expectations",
        "Pricing Models & Benchmarks",
        "Revenue Recognition & Accounting",
        "Economic Cycles & Industry Resilience"
      ],
      "Go-to-Market & Growth Channels": [
        "Effective Customer Acquisition Channels",
        "Partnership & Ecosystem Strategies",
        "Sales Cycles & Buying Processes",
        "Marketing Tactics & Messaging",
        "Community & Network Effects"
      ]
    }
  },
  EEA: {
    General: {
      "Funding & Capital Landscape": [
        "Venture Capital Availability",
        "Angel Investor Networks",
        "Government Funding Programs",
        "Alternative Funding Sources"
      ],
      "Talent & Human Capital": [
        "Skilled Workforce Availability",
        "Educational Institution Quality",
        "Entrepreneurial Experience Pool",
        "Talent Attraction & Retention"
      ],
      "General Regulatory & Legal Framework": [
        "Startup-Friendly Regulations",
        "Intellectual Property Protection",
        "Tax Policies & Incentives",
        "Ease of Doing Business"
      ],
      "Market Access & Commercialization Culture": [
        "Entrepreneurial Culture & Mindset",
        "Risk Tolerance",
        "Market Openness",
        "Success Stories & Role Models"
      ],
      "Infrastructure & Support Networks": [
        "Coworking Spaces & Innovation Hubs",
        "Incubators & Accelerators",
        "Mentorship Networks",
        "Physical & Digital Infrastructure"
      ]
    },
    "Industry-Specific": {
      "Sector-Specific Regulations & Compliance": [
        "Industry Regulatory Bodies",
        "Compliance Requirements",
        "Licensing & Certifications",
        "Industry Standards"
      ],
      "Value Chain & Supply Chain Dynamics": [
        "Supplier Networks",
        "Distribution Channels",
        "Logistics Infrastructure",
        "Value Chain Integration"
      ],
      "Industry-Specific Technology & Innovation Trends": [
        "Emerging Technologies",
        "Innovation Hotspots",
        "R&D Infrastructure",
        "Technology Adoption Rates"
      ],
      "Competitive Landscape & Incumbent Dynamics": [
        "Market Leaders & Incumbents",
        "Competitive Intensity",
        "Market Concentration",
        "Barriers to Entry"
      ],
      "Niche Customer Segments & Go-to-Market Channels": [
        "Target Customer Segments",
        "Distribution Networks",
        "Marketing Channels",
        "Partnership Opportunities"
      ]
    }
  },
  GEB: {
    "Core Mindset & Learning Orientation": [
      "Defining Failure: Personal Defeat vs. Learning Opportunity",
      "Mentoring & Fostering Resilience in Others",
      "Responding to a Subordinate's Costly Mistake",
      "Analyzing and Iterating After a Launch Failure",
      "Processing Harsh but Partially True Public Criticism"
    ],
    "Resilience & Response to Adversity": [
      "Coping with Sudden Market Shifts",
      "Navigating Unexpected Regulatory Setbacks",
      "Dealing with a Co-founder Departure",
      "Managing Financial Stress During Cash Flow Crisis",
      "Handling Public Relations Disasters"
    ],
    "Adaptability & Strategic Flexibility": [
      "Pivoting Business Model in Response to Market Feedback",
      "Adjusting Product Strategy Based on Competitive Moves",
      "Reacting to Technological Disruption",
      "Balancing Flexibility with Strategic Focus",
      "Experimenting with New Approaches"
    ],
    "Leadership & Team Empowerment": [
      "Delegating High-Stakes Decisions",
      "Empowering Team Members to Take Initiative",
      "Building Trust Through Transparency",
      "Handling Disagreements Among Leadership",
      "Motivating Teams During Uncertain Times"
    ],
    "Communication & Stakeholder Management": [
      "Delivering Bad News to Investors",
      "Managing Customer Expectations",
      "Communicating Vision to Diverse Audiences",
      "Handling Difficult Conversations with Co-founders",
      "Building Relationships with Key Partners"
    ],
    "Ethical Integrity & Foundational Values": [
      "Making Ethical Trade-offs Under Pressure",
      "Maintaining Transparency with Stakeholders",
      "Balancing Profit with Social Responsibility",
      "Handling Conflicts of Interest",
      "Standing by Core Values During Growth"
    ],
    "Decision-Making Under Ambiguity": [
      "Making Decisions with Incomplete Information",
      "Weighing Short-term vs. Long-term Outcomes",
      "Managing Multiple Conflicting Priorities",
      "Deciding When to Seek External Advice",
      "Evaluating Risk-Reward Trade-offs"
    ],
    "Calculated Risk-Taking & Opportunity Assessment": [
      "Identifying and Evaluating New Opportunities",
      "Deciding Whether to Enter a New Market",
      "Assessing Partnership Risks and Benefits",
      "Balancing Innovation with Operational Stability",
      "Committing Resources to Unproven Ideas"
    ],
    "Innovation & Creative Problem-Solving": [
      "Overcoming Resource Constraints",
      "Finding Creative Solutions to Complex Problems",
      "Encouraging Innovation Within the Team",
      "Balancing Innovation with Execution",
      "Leveraging Constraints as Opportunities"
    ],
    "External Focus & Market Responsiveness": [
      "Actively Seeking Customer Feedback",
      "Monitoring Competitive Landscape",
      "Responding to Changing Market Needs",
      "Building Customer-Centric Processes",
      "Staying Ahead of Industry Trends"
    ],
    "Strategic Vision & Long-Term Planning": [
      "Defining and Communicating Long-Term Vision",
      "Aligning Short-Term Actions with Long-Term Goals",
      "Scenario Planning for Future Uncertainties",
      "Building Strategic Partnerships",
      "Maintaining Strategic Focus Amid Distractions"
    ],
    "Resource Management & Scalability": [
      "Allocating Limited Resources Effectively",
      "Planning for Sustainable Growth",
      "Managing Burn Rate and Runway",
      "Building Scalable Processes",
      "Deciding When to Invest in Infrastructure"
    ],
    "Founder Self-Awareness & Negative Pattern Mitigation": [
      "Recognizing Personal Biases and Blind Spots",
      "Managing Ego and Overconfidence",
      "Seeking and Acting on Feedback",
      "Addressing Negative Behavioral Patterns",
      "Building Self-Awareness Through Reflection"
    ],
    "Building & Leveraging Relationships": [
      "Networking Effectively",
      "Building Strategic Alliances",
      "Leveraging Mentors and Advisors",
      "Cultivating Investor Relationships",
      "Building Community and Ecosystem Ties"
    ],
    "Governance & Principled Competition": [
      "Establishing Board Governance Practices",
      "Competing Ethically in the Market",
      "Managing Conflicts with Investors",
      "Balancing Control with Collaboration",
      "Maintaining Accountability to Stakeholders"
    ]
  }
};

// Export the taxonomy for use in other components
export { questionTaxonomy };

export function CreateQuestionModal({ open, onOpenChange, onQuestionCreated, editingQuestion }: CreateQuestionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedColumnAIndex, setSelectedColumnAIndex] = useState<number | null>(null);
  const [selectedColumnBIndex, setSelectedColumnBIndex] = useState<number | null>(null);
  const [usedItems, setUsedItems] = useState<{ columnA: number[], columnB: number[] }>({ columnA: [], columnB: [] });
  
  const [questionData, setQuestionData] = useState({
    questionText: "",
    behavioralCode: "",
    indexCode: "",
    stage: "",
    targetEcosystem: "",
    category: "",
    subCategory: "",
    scope: "General" as "" | "General" | "Industry-Specific",
    industry: "",
    answerType: "" as "" | "single-choice" | "multiple-choice" | "ranking" | "matching",
    choices: [] as string[],
    columnA: [] as string[],
    columnB: [] as string[],
    columnAHeader: "Column A",
    columnBHeader: "Column B",
    weights: {} as Record<string, { weight?: number; expertWeight?: number; machineWeight?: number }>,
    rankings: {} as Record<string, number>,
    matchedPairs: [] as Array<{ a: string; b: string; aIndex: number; bIndex: number }>,
    correctAnswers: [] as number[], // For single/multiple choice
    correctRanking: {} as Record<string, number> // For ranking
  });
  
  const { toast } = useToast();

  // Pre-populate form when editing
  useEffect(() => {
    if (editingQuestion && open) {
      setQuestionData({
        questionText: editingQuestion.questionText || editingQuestion.title || "",
        behavioralCode: editingQuestion.behavioralCode || "",
        indexCode: editingQuestion.indexCode || "",
        stage: editingQuestion.stage || "",
        targetEcosystem: editingQuestion.targetEcosystem || "",
        category: editingQuestion.category || "",
        subCategory: editingQuestion.subCategory || "",
        scope: editingQuestion.scope || "General",
        industry: editingQuestion.industry || "",
        answerType: editingQuestion.answerType || editingQuestion.type || "" as any,
        choices: editingQuestion.choices || [],
        columnA: editingQuestion.columnA || [],
        columnB: editingQuestion.columnB || [],
        columnAHeader: editingQuestion.columnAHeader || "Column A",
        columnBHeader: editingQuestion.columnBHeader || "Column B",
        weights: editingQuestion.weights || {},
        rankings: editingQuestion.rankings || {},
        matchedPairs: editingQuestion.matchedPairs || [],
        correctAnswers: editingQuestion.correctAnswers || [],
        correctRanking: editingQuestion.correctRanking || {}
      });

      // Restore used items for matching questions
      if (editingQuestion.matchedPairs && editingQuestion.matchedPairs.length > 0) {
        const usedColumnA: number[] = [];
        const usedColumnB: number[] = [];
        
        editingQuestion.matchedPairs.forEach((pair: any) => {
          if (typeof pair.aIndex === 'number') usedColumnA.push(pair.aIndex);
          if (typeof pair.bIndex === 'number') usedColumnB.push(pair.bIndex);
        });

        setUsedItems({ columnA: usedColumnA, columnB: usedColumnB });
      }
    } else if (!editingQuestion && open) {
      resetForm();
    }
  }, [editingQuestion, open]);

  const steps = [
    { number: 1, title: "Details & Properties" },
    { number: 2, title: "Define Choices & Scoring" }, 
    { number: 3, title: "Preview & Confirm" }
  ];

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedColumnAIndex(null);
    setSelectedColumnBIndex(null);
    setUsedItems({ columnA: [], columnB: [] });
    setQuestionData({
      questionText: "",
      behavioralCode: "",
      indexCode: "",
      stage: "",
      targetEcosystem: "",
      category: "",
      subCategory: "",
      scope: "General",
      industry: "",
      answerType: "" as any,
      choices: [],
      columnA: [],
      columnB: [],
      columnAHeader: "Column A",
      columnBHeader: "Column B",
      weights: {},
      rankings: {},
      matchedPairs: [],
      correctAnswers: [],
      correctRanking: {}
    });
  };

  const isStep1Valid = () => {
    const baseValid = questionData.questionText.trim() !== "" &&
                      questionData.answerType !== "" &&
                      questionData.behavioralCode !== "" &&
                      questionData.indexCode !== "";
    
    if (questionData.indexCode === "FPA") {
      const fpaValid = questionData.stage !== "" &&
                       questionData.scope !== "" &&
                       questionData.category !== "" &&
                       questionData.subCategory !== "";
      
      if (questionData.scope === "Industry-Specific") {
        return baseValid && fpaValid && questionData.industry !== "";
      }
      return baseValid && fpaValid;
    }
    
    if (questionData.indexCode === "EEA") {
      const eeaValid = questionData.targetEcosystem !== "" &&
                       questionData.scope !== "" &&
                       questionData.category !== "" &&
                       questionData.subCategory !== "";
      
      if (questionData.scope === "Industry-Specific") {
        return baseValid && eeaValid && questionData.industry !== "";
      }
      return baseValid && eeaValid;
    }
    
    if (questionData.indexCode === "GEB") {
      return baseValid && 
             questionData.category !== "" && 
             questionData.subCategory !== "";
    }
    
    return false;
  };

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields before proceeding to the next step.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = (status: "draft" | "published") => {
    const newQuestion = {
      id: editingQuestion?.id || Date.now(),
      title: questionData.questionText,
      type: questionData.answerType,
      category: questionData.category,
      status: status === "draft" ? "Draft" : "Published",
      lastModified: new Date().toISOString().split('T')[0],
      // Save all question data for editing
      questionText: questionData.questionText,
      behavioralCode: questionData.behavioralCode,
      indexCode: questionData.indexCode,
      stage: questionData.stage,
      targetEcosystem: questionData.targetEcosystem,
      subCategory: questionData.subCategory,
      scope: questionData.scope,
      industry: questionData.industry,
      answerType: questionData.answerType,
      choices: questionData.choices,
      columnA: questionData.columnA,
      columnB: questionData.columnB,
      weights: questionData.weights,
      rankings: questionData.rankings,
      matchedPairs: questionData.matchedPairs,
      correctAnswers: questionData.correctAnswers,
      correctRanking: questionData.correctRanking
    };

    onQuestionCreated(newQuestion);
    toast({
      title: `Question ${status === "draft" ? "saved as draft" : "published"} successfully`,
      description: "The question has been added to the assessment bank."
    });
    onOpenChange(false);
    resetForm();
  };

  const addChoice = () => {
    setQuestionData(prev => ({
      ...prev,
      choices: [...prev.choices, ""]
    }));
  };

  const updateChoice = (index: number, value: string) => {
    setQuestionData(prev => ({
      ...prev,
      choices: prev.choices.map((choice, i) => i === index ? value : choice)
    }));
  };

  const removeChoice = (index: number) => {
    setQuestionData(prev => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index)
    }));
  };

  // Helper functions for matching pairs
  const handleColumnASelection = (index: number) => {
    if (usedItems.columnA.includes(index)) return;
    setSelectedColumnAIndex(selectedColumnAIndex === index ? null : index);
  };

  const handleColumnBSelection = (index: number) => {
    if (usedItems.columnB.includes(index)) return;
    setSelectedColumnBIndex(selectedColumnBIndex === index ? null : index);
  };

  const canCreatePair = selectedColumnAIndex !== null && selectedColumnBIndex !== null;

  const createPair = () => {
    if (!canCreatePair || selectedColumnAIndex === null || selectedColumnBIndex === null) return;
    
    const newPair = {
      a: questionData.columnA[selectedColumnAIndex],
      b: questionData.columnB[selectedColumnBIndex],
      aIndex: selectedColumnAIndex,
      bIndex: selectedColumnBIndex
    };

    setQuestionData(prev => ({
      ...prev,
      matchedPairs: [...prev.matchedPairs, newPair]
    }));

    setUsedItems(prev => ({
      columnA: [...prev.columnA, selectedColumnAIndex],
      columnB: [...prev.columnB, selectedColumnBIndex]
    }));

    setSelectedColumnAIndex(null);
    setSelectedColumnBIndex(null);
  };

  const removePair = (pairIndex: number) => {
    const pair = questionData.matchedPairs[pairIndex];
    
    setQuestionData(prev => ({
      ...prev,
      matchedPairs: prev.matchedPairs.filter((_, i) => i !== pairIndex)
    }));

    setUsedItems(prev => ({
      columnA: prev.columnA.filter(index => index !== pair.aIndex),
      columnB: prev.columnB.filter(index => index !== pair.bIndex)
    }));
  };

  const WeightPopover = ({ choiceId, choiceText }: { choiceId: string; choiceText: string }) => {
    const [weights, setWeights] = useState(questionData.weights[choiceId] || {});

    // Update local weights when parent weights change (for editing)
    useEffect(() => {
      setWeights(questionData.weights[choiceId] || {});
    }, [questionData.weights, choiceId]);

    const handleSaveWeights = () => {
      setQuestionData(prev => ({
        ...prev,
        weights: {
          ...prev.weights,
          [choiceId]: weights
        }
      }));
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Set Weights
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium">Set Weights for: {choiceText}</h4>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter weight"
                value={weights.weight || ""}
                onChange={(e) => setWeights(prev => ({ ...prev, weight: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expert-weight">Expert Weight</Label>
              <Input
                id="expert-weight"
                type="number"
                placeholder="Enter expert weight"
                value={weights.expertWeight || ""}
                onChange={(e) => setWeights(prev => ({ ...prev, expertWeight: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machine-weight">Machine Weight</Label>
              <Input
                id="machine-weight"
                type="number"
                placeholder="Enter machine weight"
                value={weights.machineWeight || ""}
                onChange={(e) => setWeights(prev => ({ ...prev, machineWeight: Number(e.target.value) }))}
              />
            </div>
            <Button onClick={handleSaveWeights} className="w-full">Done</Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="question-text">Question Text</Label>
              <Textarea
                id="question-text"
                placeholder="Enter your question..."
                value={questionData.questionText}
                onChange={(e) => setQuestionData(prev => ({ ...prev, questionText: e.target.value }))}
                className="min-h-24 w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer-type">Question Type</Label>
              <Select 
                value={questionData.answerType} 
                onValueChange={(value: any) => setQuestionData(prev => ({ ...prev, answerType: value, choices: [], columnA: [], columnB: [], correctAnswers: [], rankings: {} }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-choice">Single Choice</SelectItem>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="ranking">Ranking</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="question-weight">Score Weight</Label>
              <Input
                id="question-weight"
                type="number"
                min="0"
                step="0.1"
                placeholder="Enter question weight (optional)"
                value={questionData.weights.question?.weight || ''}
                onChange={(e) => setQuestionData(prev => ({
                  ...prev,
                  weights: {
                    ...prev.weights,
                    question: {
                      ...prev.weights.question,
                      weight: e.target.value ? parseFloat(e.target.value) : undefined
                    }
                  }
                }))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="behavioral-code">Select a Behavioral Code</Label>
              <Select 
                value={questionData.behavioralCode} 
                onValueChange={(value) => setQuestionData(prev => ({ ...prev, behavioralCode: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a behavioral code" />
                </SelectTrigger>
                <SelectContent>
                  {behavioralCodes.map((code) => (
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="index-code">Select an Index Code</Label>
              <Select 
                value={questionData.indexCode} 
                onValueChange={(value) => setQuestionData(prev => ({ 
                  ...prev, 
                  indexCode: value, 
                  stage: "",
                  targetEcosystem: "",
                  category: "", 
                  subCategory: "",
                  scope: "General",
                  industry: ""
                }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an index code" />
                </SelectTrigger>
                <SelectContent>
                  {indexCodes.map((code) => (
                    <SelectItem key={code} value={code}>{code}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* FPA-specific fields */}
            {questionData.indexCode === "FPA" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select 
                    value={questionData.stage} 
                    onValueChange={(value) => setQuestionData(prev => ({ ...prev, stage: value }))}
                  >
                    <SelectTrigger id="stage">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                      <SelectItem value="Seed">Seed</SelectItem>
                      <SelectItem value="Early Stage">Early Stage</SelectItem>
                      <SelectItem value="Growth Stage">Growth Stage</SelectItem>
                      <SelectItem value="Scale-up">Scale-up</SelectItem>
                      <SelectItem value="Mature">Mature</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Scope</Label>
                  <RadioGroup 
                    value={questionData.scope} 
                  onValueChange={(value: "" | "General" | "Industry-Specific") => setQuestionData(prev => ({
                      ...prev, 
                      scope: value,
                      category: "",
                      subCategory: ""
                    }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="General" id="fpa-general" />
                      <Label htmlFor="fpa-general">General</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Industry-Specific" id="fpa-industry" />
                      <Label htmlFor="fpa-industry">Industry-Specific</Label>
                    </div>
                  </RadioGroup>
                </div>

                {questionData.scope && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={questionData.category} 
                      onValueChange={(value) => setQuestionData(prev => ({ ...prev, category: value, subCategory: "" }))}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(questionTaxonomy.FPA[questionData.scope]).map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {questionData.category && (
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub-Category</Label>
                    <Select 
                      value={questionData.subCategory} 
                      onValueChange={(value) => setQuestionData(prev => ({ ...prev, subCategory: value }))}
                    >
                      <SelectTrigger id="subCategory">
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTaxonomy.FPA[questionData.scope][questionData.category]?.map((subCat) => (
                          <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {questionData.scope === "Industry-Specific" && (
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={questionData.industry} 
                      onValueChange={(value) => setQuestionData(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {/* EEA-specific fields */}
            {questionData.indexCode === "EEA" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="target-ecosystem">Target Ecosystem</Label>
                  <Select 
                    value={questionData.targetEcosystem} 
                    onValueChange={(value) => setQuestionData(prev => ({ ...prev, targetEcosystem: value }))}
                  >
                    <SelectTrigger id="target-ecosystem">
                      <SelectValue placeholder="Select target ecosystem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia">Asia</SelectItem>
                      <SelectItem value="Latin America">Latin America</SelectItem>
                      <SelectItem value="Middle East">Middle East</SelectItem>
                      <SelectItem value="Africa">Africa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Scope</Label>
                  <RadioGroup 
                    value={questionData.scope} 
                    onValueChange={(value: "" | "General" | "Industry-Specific") => setQuestionData(prev => ({ 
                      ...prev, 
                      scope: value,
                      category: "",
                      subCategory: ""
                    }))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="General" id="eea-general" />
                      <Label htmlFor="eea-general">General</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Industry-Specific" id="eea-industry" />
                      <Label htmlFor="eea-industry">Industry-Specific</Label>
                    </div>
                  </RadioGroup>
                </div>

                {questionData.scope && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={questionData.category} 
                      onValueChange={(value) => setQuestionData(prev => ({ ...prev, category: value, subCategory: "" }))}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(questionTaxonomy.EEA[questionData.scope]).map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {questionData.category && (
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub-Category</Label>
                    <Select 
                      value={questionData.subCategory} 
                      onValueChange={(value) => setQuestionData(prev => ({ ...prev, subCategory: value }))}
                    >
                      <SelectTrigger id="subCategory">
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTaxonomy.EEA[questionData.scope][questionData.category]?.map((subCat) => (
                          <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {questionData.scope === "Industry-Specific" && (
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={questionData.industry} 
                      onValueChange={(value) => setQuestionData(prev => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EdTech">EdTech</SelectItem>
                        <SelectItem value="FinTech">FinTech</SelectItem>
                        <SelectItem value="HealthTech">HealthTech</SelectItem>
                        <SelectItem value="SaaS">SaaS</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            {/* GEB-specific fields */}
            {questionData.indexCode === "GEB" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={questionData.category} 
                    onValueChange={(value) => setQuestionData(prev => ({ ...prev, category: value, subCategory: "" }))}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(questionTaxonomy.GEB).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {questionData.category && (
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub-Category</Label>
                    <Select 
                      value={questionData.subCategory} 
                      onValueChange={(value) => setQuestionData(prev => ({ ...prev, subCategory: value }))}
                    >
                      <SelectTrigger id="subCategory">
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTaxonomy.GEB[questionData.category]?.map((subCat) => (
                          <SelectItem key={subCat} value={subCat}>{subCat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="p-4 bg-muted/50 rounded-lg border border-border mt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> GEB (General Entrepreneurial Behavior) questions focus on behavioral competencies and don't require Stage, Scope, or Industry selection.
                  </p>
                </div>
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">

            {/* Single Choice and Multiple Choice */}
            {(questionData.answerType === "single-choice" || questionData.answerType === "multiple-choice") && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Define Choices, Correctness, and Weights</h4>
                  <div className="space-y-4">
                    {questionData.choices.map((choice, index) => (
                      <div key={index} className="space-y-3 border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          {questionData.answerType === "single-choice" ? (
                            <input 
                              type="radio" 
                              name="correct-answer"
                              checked={questionData.correctAnswers.includes(index)}
                              onChange={() => setQuestionData(prev => ({ 
                                ...prev, 
                                correctAnswers: [index] 
                              }))}
                              disabled={!choice.trim()}
                              className="w-4 h-4"
                            />
                          ) : (
                            <Checkbox
                              checked={questionData.correctAnswers.includes(index)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setQuestionData(prev => ({ 
                                    ...prev, 
                                    correctAnswers: [...prev.correctAnswers, index] 
                                  }));
                                } else {
                                  setQuestionData(prev => ({ 
                                    ...prev, 
                                    correctAnswers: prev.correctAnswers.filter(i => i !== index) 
                                  }));
                                }
                              }}
                              disabled={!choice.trim()}
                            />
                          )}
                          <Input
                            placeholder={`Choice ${index + 1}`}
                            value={choice}
                            onChange={(e) => updateChoice(index, e.target.value)}
                            className="flex-1"
                          />
                          <WeightPopover choiceId={`choice-${index}`} choiceText={choice} />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeChoice(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addChoice}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Choice
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Ranking */}
            {questionData.answerType === "ranking" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Define Items and Correct Rank</h4>
                  <div className="space-y-4">
                    {questionData.choices.map((choice, index) => (
                      <div key={index} className="space-y-3 border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`rank-${index}`}>Rank:</Label>
                            <Input
                              id={`rank-${index}`}
                              type="number"
                              min="1"
                              className="w-20"
                              placeholder="1"
                              value={questionData.rankings[`choice-${index}`] || ""}
                              onChange={(e) => setQuestionData(prev => ({
                                ...prev,
                                rankings: { ...prev.rankings, [`choice-${index}`]: Number(e.target.value) }
                              }))}
                              disabled={!choice.trim()}
                            />
                          </div>
                          <Input
                            placeholder={`Item ${index + 1}`}
                            value={choice}
                            onChange={(e) => updateChoice(index, e.target.value)}
                            className="flex-1"
                          />
                          <WeightPopover choiceId={`choice-${index}`} choiceText={choice} />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeChoice(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" onClick={addChoice}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Matching */}
            {questionData.answerType === "matching" && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Define Items and Create Correct Pairs</h4>
                  
                  {/* Column Headers */}
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="column-a-header">Column A Header</Label>
                      <Input
                        id="column-a-header"
                        placeholder="Enter column A header"
                        value={questionData.columnAHeader}
                        onChange={(e) => setQuestionData(prev => ({ ...prev, columnAHeader: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="column-b-header">Column B Header</Label>
                      <Input
                        id="column-b-header"
                        placeholder="Enter column B header"
                        value={questionData.columnBHeader}
                        onChange={(e) => setQuestionData(prev => ({ ...prev, columnBHeader: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Column Inputs */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <Label>{questionData.columnAHeader}</Label>
                      <div className="space-y-2">
                        {questionData.columnA.map((item, index) => (
                          <Input
                            key={index}
                            placeholder={`Item ${index + 1}`}
                            value={item}
                            onChange={(e) => {
                              const newColumnA = [...questionData.columnA];
                              newColumnA[index] = e.target.value;
                              setQuestionData(prev => ({ ...prev, columnA: newColumnA }));
                            }}
                          />
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setQuestionData(prev => ({ ...prev, columnA: [...prev.columnA, ""] }))}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label>{questionData.columnBHeader}</Label>
                      <div className="space-y-2">
                        {questionData.columnB.map((item, index) => (
                          <Input
                            key={index}
                            placeholder={`Item ${index + 1}`}
                            value={item}
                            onChange={(e) => {
                              const newColumnB = [...questionData.columnB];
                              newColumnB[index] = e.target.value;
                              setQuestionData(prev => ({ ...prev, columnB: newColumnB }));
                            }}
                          />
                        ))}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setQuestionData(prev => ({ ...prev, columnB: [...prev.columnB, ""] }))}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Pairing Interface */}
                  {questionData.columnA.some(item => item.trim()) && questionData.columnB.some(item => item.trim()) && (
                    <div className="space-y-4">
                      <h5 className="font-medium">Click items to create pairs:</h5>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        {/* Column A */}
                        <div className="space-y-2">
                          <Label className="font-medium">{questionData.columnAHeader}</Label>
                          {questionData.columnA.filter(item => item.trim()).map((item, index) => (
                            <Button
                              key={index}
                              variant={selectedColumnAIndex === index ? "default" : "outline"}
                              className={`w-full h-auto p-3 text-left justify-start ${
                                usedItems.columnA.includes(index) 
                                  ? "opacity-50 cursor-not-allowed bg-muted" 
                                  : selectedColumnAIndex === index 
                                    ? "border-2 border-primary" 
                                    : ""
                              }`}
                              onClick={() => handleColumnASelection(index)}
                              disabled={usedItems.columnA.includes(index)}
                            >
                              {item}
                            </Button>
                          ))}
                        </div>

                        {/* Create Pair Button */}
                        <div className="flex justify-center">
                          <Button
                            variant="default"
                            disabled={!canCreatePair}
                            onClick={createPair}
                            className="whitespace-nowrap"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Create Pair
                          </Button>
                        </div>

                        {/* Column B */}
                        <div className="space-y-2">
                          <Label className="font-medium">{questionData.columnBHeader}</Label>
                          {questionData.columnB.filter(item => item.trim()).map((item, index) => (
                            <Button
                              key={index}
                              variant={selectedColumnBIndex === index ? "default" : "outline"}
                              className={`w-full h-auto p-3 text-left justify-start ${
                                usedItems.columnB.includes(index) 
                                  ? "opacity-50 cursor-not-allowed bg-muted" 
                                  : selectedColumnBIndex === index 
                                    ? "border-2 border-primary" 
                                    : ""
                              }`}
                              onClick={() => handleColumnBSelection(index)}
                              disabled={usedItems.columnB.includes(index)}
                            >
                              {item}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Matched Pairs with Weights */}
                      {questionData.matchedPairs.length > 0 && (
                        <div className="space-y-3 mt-6">
                          <h6 className="font-medium">Matched Pairs - Set Weights:</h6>
                          {questionData.matchedPairs.map((pair, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                              <span className="font-medium">{pair.a} ↔ {pair.b}</span>
                              <div className="flex items-center gap-2">
                                <WeightPopover choiceId={`pair-${index}`} choiceText={`${pair.a} ↔ ${pair.b}`} />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removePair(index)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Section 1: Properties Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Question Details Summary</h3>
              <div className="grid grid-cols-2 gap-6 p-4 border rounded-lg bg-muted/10">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Behavioral Code</Label>
                    <p className="text-sm">{questionData.behavioralCode || "Not selected"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                    <p className="text-sm">{questionData.category || "Not selected"}</p>
                  </div>
                  {questionData.subCategory && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Sub-Category</Label>
                      <p className="text-sm">{questionData.subCategory}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Scope</Label>
                    <p className="text-sm">{questionData.scope}</p>
                  </div>
                  {questionData.scope === "Industry-Specific" && questionData.industry && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
                      <p className="text-sm">{questionData.industry}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Answer Type</Label>
                    <p className="text-sm capitalize">{questionData.answerType.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: End-User Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">End-User Preview</h3>
              <div className="p-6 border rounded-lg bg-background">
                <div className="space-y-6">
                  {/* Question Text */}
                  <div>
                    <p className="text-lg font-medium">{questionData.questionText}</p>
                  </div>
                  
                  {/* Answer Options */}
                  <div className="space-y-4">
                    {questionData.answerType === "single-choice" && (
                      <div className="space-y-3">
                        {questionData.choices.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input type="radio" name="preview-radio" disabled className="text-primary" />
                            <span className="text-sm">{choice}</span>
                            {questionData.correctAnswers.includes(index) && (
                              <Badge variant="default" className="ml-2">Correct Answer</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {questionData.answerType === "multiple-choice" && (
                      <div className="space-y-3">
                        {questionData.choices.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input type="checkbox" disabled className="text-primary" />
                            <span className="text-sm">{choice}</span>
                            {questionData.correctAnswers.includes(index) && (
                              <Badge variant="default" className="ml-2">Correct Answer</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {questionData.answerType === "ranking" && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Rank the following options (drag to reorder):</Label>
                        {questionData.choices.map((choice, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 border rounded bg-muted/20">
                            <span className="text-sm font-medium text-muted-foreground">{index + 1}.</span>
                            <span className="text-sm">{choice}</span>
                            {questionData.rankings[`choice-${index}`] && (
                              <Badge variant="outline" className="ml-auto">
                                Correct Rank: {questionData.rankings[`choice-${index}`]}
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {questionData.answerType === "matching" && (
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">Match items from Column A with Column B:</Label>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">{questionData.columnAHeader}</Label>
                            {questionData.columnA.map((item, index) => (
                              <div key={index} className="p-2 border rounded bg-muted/20">
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">{questionData.columnBHeader}</Label>
                            {questionData.columnB.map((item, index) => (
                              <div key={index} className="p-2 border rounded bg-muted/20">
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {questionData.matchedPairs.length > 0 && (
                          <div className="space-y-2 mt-4">
                            <Label className="text-sm font-medium">Correct Pairs:</Label>
                            {questionData.matchedPairs.map((pair, index) => (
                              <Badge key={index} variant="outline" className="mr-2">
                                {pair.a} ↔ {pair.b}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingQuestion ? "Edit Question" : "Create New Question"}</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.number 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.number}
              </div>
              <span className={`ml-2 text-sm ${currentStep === step.number ? "font-medium" : "text-muted-foreground"}`}>
                {step.title}
              </span>
              {step.number < 3 && <div className="w-8 h-px bg-muted mx-4" />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {currentStep === 3 ? (
              <>
                <Button variant="outline" onClick={() => handleSave("draft")}>
                  Save as Draft
                </Button>
                <Button onClick={() => handleSave("published")}>
                  Confirm & Publish
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={currentStep === 1 && !isStep1Valid()}
              >
                Next →
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}