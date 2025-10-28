import { TestTakerEditRequest } from '@/types/testTaker';

const generateMockEditRequests = (): TestTakerEditRequest[] => [
  {
    id: 'TER-001',
    testTakerId: '1',
    testTakerName: 'John Smith',
    testTakerEmail: 'john.smith@example.com',
    requestedAt: '2024-03-15T10:30:00Z',
    status: 'Pending',
    changes: [
      {
        field: 'startupName',
        fieldLabel: 'Startup Name',
        oldValue: 'TechVenture Inc.',
        newValue: 'TechVenture AI Inc.',
        category: 'Business'
      },
      {
        field: 'primaryIndustry',
        fieldLabel: 'Primary Industry',
        oldValue: 'AI & Machine Learning',
        newValue: 'Enterprise AI Solutions',
        category: 'Business'
      }
    ],
    justification: 'We recently pivoted to focus specifically on enterprise AI solutions and updated our company name to reflect this change.'
  },
  {
    id: 'TER-002',
    testTakerId: '2',
    testTakerName: 'Sarah Johnson',
    testTakerEmail: 'sarah.j@example.com',
    requestedAt: '2024-03-14T14:20:00Z',
    status: 'Pending',
    changes: [
      {
        field: 'countryOfResidence',
        fieldLabel: 'Country of Residence',
        oldValue: 'Canada',
        newValue: 'United States',
        category: 'Identity'
      },
      {
        field: 'currentTeamSize',
        fieldLabel: 'Current Team Size',
        oldValue: '1-5',
        newValue: '6-15',
        category: 'Business'
      }
    ],
    justification: 'Relocated to the US for business expansion and hired additional team members.'
  },
  {
    id: 'TER-003',
    testTakerId: '3',
    testTakerName: 'Mike Wilson',
    testTakerEmail: 'm.wilson@example.com',
    requestedAt: '2024-03-10T09:15:00Z',
    status: 'Approved',
    changes: [
      {
        field: 'teamMembers',
        fieldLabel: 'Team Members',
        oldValue: ['Mike Wilson'],
        newValue: ['Mike Wilson', 'Jane Doe', 'Bob Johnson'],
        category: 'Team'
      }
    ],
    justification: 'Added new team members who joined the company.',
    reviewedBy: 'Admin User',
    reviewedAt: '2024-03-11T10:00:00Z',
    reviewNotes: 'Changes verified and approved.'
  },
  {
    id: 'TER-004',
    testTakerId: '4',
    testTakerName: 'Emma Davis',
    testTakerEmail: 'emma.davis@example.com',
    requestedAt: '2024-03-08T16:45:00Z',
    status: 'Rejected',
    changes: [
      {
        field: 'dateOfBirth',
        fieldLabel: 'Date of Birth',
        oldValue: '1990-05-15',
        newValue: '1992-05-15',
        category: 'Identity'
      }
    ],
    justification: 'Incorrect date of birth was entered during initial registration.',
    reviewedBy: 'Admin User',
    reviewedAt: '2024-03-09T09:30:00Z',
    reviewNotes: 'Date of birth changes require additional documentation. Please submit proof of identity.'
  },
  {
    id: 'TER-005',
    testTakerId: '5',
    testTakerName: 'David Brown',
    testTakerEmail: 'd.brown@example.com',
    requestedAt: '2024-03-12T11:00:00Z',
    status: 'Pending',
    changes: [
      {
        field: 'developmentStage',
        fieldLabel: 'Development Stage',
        oldValue: 'Scaling',
        newValue: 'Revenue',
        category: 'Business'
      },
      {
        field: 'fundingSources',
        fieldLabel: 'Funding Sources',
        oldValue: ['VC', 'Angel'],
        newValue: ['VC', 'Angel', 'Revenue'],
        category: 'Business'
      }
    ],
    justification: 'Company has reached profitability and now generating revenue.'
  }
];

export const testTakerService = {
  getAllEditRequests: async (): Promise<TestTakerEditRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockEditRequests();
  },
  
  getEditRequestById: async (id: string): Promise<TestTakerEditRequest | null> => {
    const requests = generateMockEditRequests();
    return requests.find(r => r.id === id) || null;
  },
  
  reviewEditRequest: async (
    requestId: string,
    decision: 'Approved' | 'Rejected',
    notes?: string
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Edit request ${requestId} ${decision.toLowerCase()}`, notes);
  }
};
