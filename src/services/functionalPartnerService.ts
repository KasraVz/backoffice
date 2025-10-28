import { FunctionalPartner, AffiliationCode, Candidate, PartnerClaim, PartnerEditRequest, PartnerStatus } from '@/types/functionalPartner';

const generateMockPartners = (): FunctionalPartner[] => [
  {
    id: 'fp1',
    type: 'Individual',
    status: 'Active',
    primaryContactName: 'Dr. Sarah Johnson',
    primaryContactEmail: 'sarah.johnson@example.com',
    primaryContactPhone: '+1 (555) 123-4567',
    createdAt: '2024-01-15T10:00:00Z',
    approvedAt: '2024-01-16T14:30:00Z',
    affiliationCodes: [],
    totalReferrals: 45,
    activeReferrals: 32,
    completionRate: 78,
    totalEarnings: 12500,
    pendingClaims: 2
  },
  {
    id: 'fp2',
    type: 'Organizational',
    status: 'Active',
    primaryContactName: 'Michael Chen',
    primaryContactEmail: 'contact@techventures.com',
    primaryContactPhone: '+1 (555) 987-6543',
    organizationName: 'TechVentures Accelerator',
    organizationType: 'Accelerator',
    createdAt: '2023-11-20T09:00:00Z',
    approvedAt: '2023-11-22T11:00:00Z',
    affiliationCodes: [],
    totalReferrals: 120,
    activeReferrals: 95,
    completionRate: 85,
    activeScholarships: 15,
    teamMembers: [
      { id: 'tm1', name: 'Michael Chen', email: 'michael@techventures.com', role: 'Admin', addedAt: '2023-11-20T09:00:00Z' },
      { id: 'tm2', name: 'Lisa Wang', email: 'lisa@techventures.com', role: 'Manager', addedAt: '2023-12-01T10:00:00Z' }
    ]
  },
  {
    id: 'fp3',
    type: 'Individual',
    status: 'Inactive',
    primaryContactName: 'Emma Rodriguez',
    primaryContactEmail: 'emma.rodriguez@example.com',
    primaryContactPhone: '+1 (555) 456-7890',
    createdAt: '2025-01-10T15:30:00Z',
    affiliationCodes: [],
    totalReferrals: 0,
    activeReferrals: 0,
    completionRate: 0
  },
  {
    id: 'fp4',
    type: 'Organizational',
    status: 'Active',
    primaryContactName: 'David Kim',
    primaryContactEmail: 'david@innovationhub.edu',
    organizationName: 'Innovation Hub University',
    organizationType: 'University',
    createdAt: '2024-03-05T08:00:00Z',
    approvedAt: '2024-03-07T16:00:00Z',
    affiliationCodes: [],
    totalReferrals: 200,
    activeReferrals: 150,
    completionRate: 92,
    activeScholarships: 25,
    teamMembers: [
      { id: 'tm3', name: 'David Kim', email: 'david@innovationhub.edu', role: 'Admin', addedAt: '2024-03-05T08:00:00Z' }
    ]
  },
  {
    id: 'fp5',
    type: 'Individual',
    status: 'Inactive',
    primaryContactName: 'James Wilson',
    primaryContactEmail: 'james.wilson@example.com',
    createdAt: '2023-08-12T12:00:00Z',
    approvedAt: '2023-08-14T10:00:00Z',
    affiliationCodes: [],
    totalReferrals: 15,
    activeReferrals: 0,
    completionRate: 60,
    totalEarnings: 3200,
    pendingClaims: 0
  }
];

const generateMockAffiliationCodes = (partnerId: string): AffiliationCode[] => {
  const codes: Record<string, AffiliationCode[]> = {
    'fp1': [
      {
        id: 'ac1',
        code: 'SARAH2024',
        partnerId: 'fp1',
        createdAt: '2024-01-16T14:30:00Z',
        isActive: true,
        discountPercent: 15,
        includesTests: ['FPA', 'EEA'],
        totalUses: 45,
        candidatesReferred: 45,
        completionRate: 78,
        revenue: 25600
      }
    ],
    'fp2': [
      {
        id: 'ac2',
        code: 'TECHVENT-Q1',
        partnerId: 'fp2',
        createdAt: '2024-01-01T00:00:00Z',
        expiresAt: '2024-03-31T23:59:59Z',
        isActive: false,
        discountPercent: 20,
        includesTests: ['FPA', 'EEA', 'GEB'],
        totalUses: 50,
        candidatesReferred: 50,
        completionRate: 88,
        revenue: 45000
      },
      {
        id: 'ac3',
        code: 'TECHVENT-2024',
        partnerId: 'fp2',
        createdAt: '2024-04-01T00:00:00Z',
        isActive: true,
        discountPercent: 20,
        includesTests: ['FPA', 'EEA', 'GEB'],
        totalUses: 70,
        candidatesReferred: 70,
        completionRate: 83,
        revenue: 62000
      }
    ],
    'fp4': [
      {
        id: 'ac4',
        code: 'INNOHUB-SCHOLARS',
        partnerId: 'fp4',
        createdAt: '2024-03-07T16:00:00Z',
        isActive: true,
        discountPercent: 25,
        includesTests: ['FPA', 'EEA', 'GEB'],
        totalUses: 200,
        candidatesReferred: 200,
        completionRate: 92,
        revenue: 150000
      }
    ]
  };
  
  return codes[partnerId] || [];
};

const generateMockCandidates = (partnerId: string): Candidate[] => {
  const candidates: Record<string, Candidate[]> = {
    'fp1': [
      {
        id: 'c1',
        name: 'Alice Thompson',
        email: 'alice.thompson@startup.com',
        affiliationCodeId: 'ac1',
        affiliationCode: 'SARAH2024',
        partnerId: 'fp1',
        assessmentsOrdered: 2,
        assessmentsCompleted: 2,
        assessmentsPending: 0,
        status: 'Completed',
        registeredAt: '2024-02-10T10:00:00Z',
        lastActivity: '2024-03-15T14:00:00Z',
        canViewReports: true
      },
      {
        id: 'c2',
        name: 'Bob Martinez',
        email: 'bob.martinez@venture.io',
        affiliationCodeId: 'ac1',
        affiliationCode: 'SARAH2024',
        partnerId: 'fp1',
        assessmentsOrdered: 1,
        assessmentsCompleted: 0,
        assessmentsPending: 1,
        status: 'Active',
        registeredAt: '2024-03-05T09:00:00Z',
        lastActivity: '2025-01-20T16:30:00Z',
        canViewReports: false
      }
    ],
    'fp2': [
      {
        id: 'c3',
        name: 'Carol Singh',
        email: 'carol.singh@tech.com',
        affiliationCodeId: 'ac3',
        affiliationCode: 'TECHVENT-2024',
        partnerId: 'fp2',
        assessmentsOrdered: 3,
        assessmentsCompleted: 2,
        assessmentsPending: 1,
        status: 'Active',
        registeredAt: '2024-05-12T11:00:00Z',
        lastActivity: '2025-01-22T10:00:00Z',
        canViewReports: true
      }
    ]
  };
  
  return candidates[partnerId] || [];
};

const generateMockClaims = (partnerId: string): PartnerClaim[] => {
  const claims: Record<string, PartnerClaim[]> = {
    'fp1': [
      {
        id: 'cl1',
        partnerId: 'fp1',
        amount: 2500,
        status: 'Pending',
        submittedAt: '2025-01-15T10:00:00Z',
        period: 'Q4 2024',
        notes: 'Regular quarterly claim'
      },
      {
        id: 'cl2',
        partnerId: 'fp1',
        amount: 3200,
        status: 'Paid',
        submittedAt: '2024-10-15T10:00:00Z',
        processedAt: '2024-10-20T14:00:00Z',
        period: 'Q3 2024'
      }
    ]
  };
  
  return claims[partnerId] || [];
};

const generateMockEditRequests = (): PartnerEditRequest[] => [
  {
    id: 'per1',
    partnerId: 'fp1',
    partnerName: 'Dr. Sarah Johnson',
    partnerType: 'Individual',
    requestedAt: '2025-01-20T14:30:00Z',
    status: 'Pending',
    changes: [
      {
        field: 'Primary Contact Phone',
        oldValue: '+1 (555) 123-4567',
        newValue: '+1 (555) 999-8888'
      },
      {
        field: 'Email',
        oldValue: 'sarah.johnson@example.com',
        newValue: 'sarah.j@newdomain.com'
      }
    ],
    justification: 'Updated contact information due to change in personal circumstances'
  },
  {
    id: 'per2',
    partnerId: 'fp2',
    partnerName: 'TechVentures Accelerator',
    partnerType: 'Organizational',
    requestedAt: '2025-01-18T09:00:00Z',
    status: 'Pending',
    changes: [
      {
        field: 'Organization Name',
        oldValue: 'TechVentures Accelerator',
        newValue: 'TechVentures Global Accelerator'
      }
    ],
    justification: 'Company rebrand and expansion to reflect global operations'
  }
];

export const functionalPartnerService = {
  getAllPartners: async (): Promise<FunctionalPartner[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const partners = generateMockPartners();
    return partners.map(partner => ({
      ...partner,
      affiliationCodes: generateMockAffiliationCodes(partner.id)
    }));
  },
  
  getPartnerById: async (id: string): Promise<FunctionalPartner | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const partners = generateMockPartners();
    const partner = partners.find(p => p.id === id);
    if (!partner) return null;
    
    return {
      ...partner,
      affiliationCodes: generateMockAffiliationCodes(id)
    };
  },
  
  updatePartnerStatus: async (id: string, status: PartnerStatus): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Updated partner ${id} status to ${status}`);
  },
  
  updatePartner: async (id: string, updates: Partial<FunctionalPartner>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Updated partner ${id}:`, updates);
  },
  
  getAffiliationCodes: async (partnerId: string): Promise<AffiliationCode[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateMockAffiliationCodes(partnerId);
  },
  
  getCandidates: async (partnerId: string): Promise<Candidate[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateMockCandidates(partnerId);
  },
  
  getClaims: async (partnerId: string): Promise<PartnerClaim[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateMockClaims(partnerId);
  },
  
  getPendingEditRequests: async (): Promise<PartnerEditRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return generateMockEditRequests();
  },
  
  reviewEditRequest: async (
    requestId: string, 
    decision: 'Approved' | 'Rejected', 
    notes?: string
  ): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Edit request ${requestId} ${decision}:`, notes);
  }
};
