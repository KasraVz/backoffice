import { Badge } from "@/components/ui/badge";
import { User, Building2 } from "lucide-react";

interface PartnerTypeBadgeProps {
  type: 'Individual' | 'Organizational';
}

export const PartnerTypeBadge = ({ type }: PartnerTypeBadgeProps) => {
  return (
    <Badge 
      variant={type === 'Individual' ? 'default' : 'secondary'}
      className="flex items-center gap-1 w-fit"
    >
      {type === 'Individual' ? (
        <User className="h-3 w-3" />
      ) : (
        <Building2 className="h-3 w-3" />
      )}
      {type}
    </Badge>
  );
};
