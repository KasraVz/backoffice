export const getPartnerStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Inactive':
      return 'destructive';
    default:
      return 'outline';
  }
};

export const getFinancialAidStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Approved':
      return 'default';
    case 'Pending':
    case 'Under Review':
      return 'secondary';
    case 'Rejected':
      return 'destructive';
    case 'More Info Needed':
      return 'outline';
    default:
      return 'outline';
  }
};

export const getClaimStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'Paid':
      return 'default';
    case 'Approved':
      return 'secondary';
    case 'Pending':
      return 'outline';
    case 'Rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};
