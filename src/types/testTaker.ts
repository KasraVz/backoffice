export type TestTakerEditRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface TestTakerEditRequest {
  id: string;
  testTakerId: string;
  testTakerName: string;
  testTakerEmail: string;
  requestedAt: string;
  status: TestTakerEditRequestStatus;
  
  changes: {
    field: string;
    fieldLabel: string;
    oldValue: any;
    newValue: any;
    category: 'Identity' | 'Business' | 'Team';
  }[];
  
  justification?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}
