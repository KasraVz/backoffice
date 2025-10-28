export type FinancialAidStatus = 
  | 'Pending' 
  | 'Under Review' 
  | 'More Info Needed' 
  | 'Approved' 
  | 'Rejected';

export interface FinancialAidApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicationDate: string;
  status: FinancialAidStatus;
  
  // Application Details
  requestedAssessments: {
    assessmentId: string;
    assessmentName: string;
    assessmentType: 'FPA' | 'EEA' | 'GEB';
    stage?: string;
    industry?: string;
  }[];
  
  requestedAmount?: number;
  
  // Justification
  financialSituation: string;
  reasonForRequest: string;
  howItHelps: string;
  
  // Supporting Documents
  supportingDocuments?: {
    id: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }[];
  
  // Review Information
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  approvedAmount?: number;
  aidType?: 'Full Waiver' | 'Partial Discount' | 'Deferred Payment';
  
  // Communication
  infoRequests?: {
    requestedAt: string;
    requestedBy: string;
    message: string;
    respondedAt?: string;
    response?: string;
  }[];
  
  // Associated Order
  orderId?: string;
}
