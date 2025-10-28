export type FunctionalPartnerType = 'Individual' | 'Organizational';
export type PartnerStatus = 'Pending' | 'Approved' | 'Active' | 'Inactive' | 'Suspended';

export interface FunctionalPartner {
  id: string;
  type: FunctionalPartnerType;
  status: PartnerStatus;
  createdAt: string;
  approvedAt?: string;
  
  // Contact Information
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  
  // Organization Info (for Organizational partners)
  organizationName?: string;
  organizationType?: 'Accelerator' | 'Incubator' | 'University' | 'VC' | 'Company' | 'Other';
  
  // Affiliation Codes
  affiliationCodes: AffiliationCode[];
  
  // Performance Metrics
  totalReferrals: number;
  activeReferrals: number;
  completionRate: number;
  
  // Earnings (Individual only)
  totalEarnings?: number;
  pendingClaims?: number;
  
  // Team (Organizational only)
  teamMembers?: TeamMember[];
  activeScholarships?: number;
}

export interface AffiliationCode {
  id: string;
  code: string;
  partnerId: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  
  // Benefits
  discountPercent?: number;
  includesTests: string[]; // Assessment IDs
  
  // Performance
  totalUses: number;
  candidatesReferred: number;
  completionRate: number;
  revenue: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  affiliationCodeId: string;
  affiliationCode: string;
  partnerId: string;
  
  // Assessment Progress
  assessmentsOrdered: number;
  assessmentsCompleted: number;
  assessmentsPending: number;
  
  // Status
  status: 'Active' | 'Completed' | 'Inactive';
  registeredAt: string;
  lastActivity?: string;
  
  // Permissions
  canViewReports: boolean;
}

export interface PartnerClaim {
  id: string;
  partnerId: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  submittedAt: string;
  processedAt?: string;
  period: string;
  notes?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Viewer';
  addedAt: string;
}

export interface PartnerEditRequest {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerType: FunctionalPartnerType;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  justification?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}
