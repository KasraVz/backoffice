import { FinancialAidApplication, FinancialAidStatus } from '@/types/financialAid';

const generateMockApplications = (): FinancialAidApplication[] => [
  {
    id: 'fa1',
    applicantId: 'u1',
    applicantName: 'Jennifer Martinez',
    applicantEmail: 'jennifer.martinez@startup.com',
    applicationDate: '2025-01-15T10:00:00Z',
    status: 'Pending',
    requestedAssessments: [
      {
        assessmentId: 'fpa-seed-tech',
        assessmentName: 'FPA - Seed Stage - Technology',
        assessmentType: 'FPA',
        stage: 'Seed',
        industry: 'Technology'
      }
    ],
    requestedAmount: 1500,
    financialSituation: 'I am a solo founder bootstrapping my startup. Currently have limited runway and need to validate my business model before seeking investment.',
    reasonForRequest: 'The assessment cost represents a significant portion of my available funds. Receiving financial aid would allow me to access this valuable evaluation without depleting resources needed for product development.',
    howItHelps: 'This assessment will help me identify blind spots in my business plan and strengthen my pitch for seed funding. The structured feedback will be invaluable as I prepare for investor meetings.',
    supportingDocuments: [
      {
        id: 'doc1',
        fileName: 'financial-statement-2024.pdf',
        fileUrl: '/mock/documents/financial-statement.pdf',
        uploadedAt: '2025-01-15T10:05:00Z'
      }
    ]
  },
  {
    id: 'fa2',
    applicantId: 'u2',
    applicantName: 'David Chen',
    applicantEmail: 'david.chen@socialimpact.org',
    applicationDate: '2025-01-10T14:30:00Z',
    status: 'Under Review',
    requestedAssessments: [
      {
        assessmentId: 'eea-early-social',
        assessmentName: 'EEA - Early Stage - Social Enterprise',
        assessmentType: 'EEA',
        stage: 'Early',
        industry: 'Social Enterprise'
      }
    ],
    requestedAmount: 2000,
    financialSituation: 'Running a social enterprise focused on education in underserved communities. Operating on a non-profit model with minimal margins.',
    reasonForRequest: 'Our mission prioritizes impact over profit. Assessment costs would divert funds from our core programs serving students.',
    howItHelps: 'Professional assessment will help us demonstrate our impact to potential donors and partners, ultimately helping us scale our reach.',
    supportingDocuments: [
      {
        id: 'doc2',
        fileName: 'non-profit-status.pdf',
        fileUrl: '/mock/documents/non-profit.pdf',
        uploadedAt: '2025-01-10T14:35:00Z'
      },
      {
        id: 'doc3',
        fileName: 'impact-report-2024.pdf',
        fileUrl: '/mock/documents/impact-report.pdf',
        uploadedAt: '2025-01-10T14:40:00Z'
      }
    ]
  },
  {
    id: 'fa3',
    applicantId: 'u3',
    applicantName: 'Sarah Williams',
    applicantEmail: 'sarah.williams@greentech.io',
    applicationDate: '2025-01-05T09:00:00Z',
    status: 'Approved',
    requestedAssessments: [
      {
        assessmentId: 'fpa-series-cleantech',
        assessmentName: 'FPA - Series A - Clean Tech',
        assessmentType: 'FPA',
        stage: 'Series A',
        industry: 'Clean Tech'
      }
    ],
    requestedAmount: 2500,
    financialSituation: 'Early-stage clean tech startup with recent grant funding that must be allocated to R&D.',
    reasonForRequest: 'Grant restrictions prevent using funds for assessment services. Need independent validation before Series A.',
    howItHelps: 'Assessment will validate our approach and provide credibility with institutional investors.',
    reviewedBy: 'admin@suspindex.com',
    reviewedAt: '2025-01-08T11:00:00Z',
    approvedAmount: 2000,
    aidType: 'Partial Discount',
    reviewNotes: 'Strong social impact mission. Approved 80% discount based on non-profit status and demonstrated need.'
  },
  {
    id: 'fa4',
    applicantId: 'u4',
    applicantName: 'Michael Brown',
    applicantEmail: 'michael.brown@venture.com',
    applicationDate: '2024-12-20T16:00:00Z',
    status: 'Rejected',
    requestedAssessments: [
      {
        assessmentId: 'geb-growth-fintech',
        assessmentName: 'GEB - Growth Stage - FinTech',
        assessmentType: 'GEB',
        stage: 'Growth',
        industry: 'FinTech'
      }
    ],
    requestedAmount: 3000,
    financialSituation: 'Growth-stage startup with recent Series B funding.',
    reasonForRequest: 'Want to reduce costs.',
    howItHelps: 'Will use assessment for strategic planning.',
    reviewedBy: 'admin@suspindex.com',
    reviewedAt: '2024-12-22T10:00:00Z',
    reviewNotes: 'Application does not demonstrate financial need. Company recently raised significant funding. Recommend standard pricing.'
  },
  {
    id: 'fa5',
    applicantId: 'u5',
    applicantName: 'Lisa Anderson',
    applicantEmail: 'lisa.anderson@womenfounders.org',
    applicationDate: '2025-01-12T11:30:00Z',
    status: 'More Info Needed',
    requestedAssessments: [
      {
        assessmentId: 'fpa-seed-healthcare',
        assessmentName: 'FPA - Seed Stage - Healthcare',
        assessmentType: 'FPA',
        stage: 'Seed',
        industry: 'Healthcare'
      }
    ],
    financialSituation: 'First-time founder from underrepresented background. Limited access to capital.',
    reasonForRequest: 'Assessment cost is prohibitive given current financial situation.',
    howItHelps: 'Professional validation needed for grant applications and investor outreach.',
    infoRequests: [
      {
        requestedAt: '2025-01-14T09:00:00Z',
        requestedBy: 'admin@suspindex.com',
        message: 'Thank you for your application. Could you please provide more details about your current funding sources and any financial documentation?'
      }
    ]
  }
];

export const financialAidService = {
  getAllApplications: async (): Promise<FinancialAidApplication[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockApplications();
  },
  
  getApplicationById: async (id: string): Promise<FinancialAidApplication | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const applications = generateMockApplications();
    return applications.find(app => app.id === id) || null;
  },
  
  updateApplicationStatus: async (
    id: string, 
    status: FinancialAidStatus, 
    notes?: string
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Updated application ${id} status to ${status}:`, notes);
  },
  
  approveApplication: async (
    id: string,
    approvedAmount: number,
    aidType: string,
    notes?: string
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    console.log(`Approved application ${id}:`, { approvedAmount, aidType, notes });
  },
  
  rejectApplication: async (id: string, reason: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Rejected application ${id}:`, reason);
  },
  
  requestMoreInfo: async (id: string, message: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Requested more info for application ${id}:`, message);
  }
};
