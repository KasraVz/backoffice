import { Users, ChevronRight, ChevronDown, FileText, Handshake, ShoppingCart, CreditCard, FileBarChart, Ticket, MessageCircle, Zap, Award, UserCog, UserCheck, Shield, CheckCircle, Activity, MessageSquare, Database, BarChart3, Settings, Globe, DollarSign, Receipt, TrendingUp, AlertTriangle, Wrench, FileCheck, History, Edit, Coins, Trophy, Gavel, Lock, UserPlus, Eye, GraduationCap, BookOpen, ClipboardList, Users2, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
const mainMenuItems = [{
  title: "Users",
  icon: Users,
  children: [{
    title: "User Directory",
    url: "/users/directory"
  }, {
    title: "Team Profiles",
    url: "/users/teams"
  }, {
    title: "Feedback Submissions",
    url: "/users/feedback"
  }]
  }, {
  title: "Questionnaires",
  icon: FileText,
  children: [{
    title: "Questionnaire Management",
    url: "/questionnaires/management"
  }, {
    title: "Assessment Bank",
    url: "/questionnaires/assessment-bank"
  }, {
    title: "User Submission Review",
    url: "/questionnaires/submission-review"
  }, {
    title: "FDE Simulator Management",
    url: "/questionnaires/fde-simulator"
  }, {
    title: "Performance Analytics",
    url: "/questionnaires/analytics"
  }]
}, {
  title: "Partners",
  icon: Handshake,
  children: [{
    title: "Functional Partners",
    children: [{
      title: "Partner Directory",
      url: "/partners/functional/directory"
    }, {
      title: "Referral Dashboard",
      url: "/partners/functional/referrals"
    }, {
      title: "Portal Settings",
      url: "/partners/functional/settings"
    }]
  }, {
    title: "Operational Partners",
    children: [{
      title: "Partner Directory",
      url: "/partners/operational/directory"
    }, {
      title: "Question Review Dashboard",
      url: "/partners/operational/review-dashboard"
    }, {
      title: "Prompt Criteria Library",
      url: "/partners/operational/prompt-criteria"
    }]
  }]
}, {
  title: "Orders",
  icon: ShoppingCart,
  children: [{
    title: "Order History",
    url: "/orders/history"
  }, {
    title: "Subscription Dashboard",
    url: "/orders/subscriptions"
  }, {
    title: "Discount & Coupon Codes",
    url: "/orders/coupons"
  }, {
    title: "Create Order / Invoice",
    url: "/orders/create"
  }]
}, {
  title: "Payments",
  icon: CreditCard,
  children: [{
    title: "Pricing Table",
    url: "/payments/pricing"
  }, {
    title: "Transaction Log",
    url: "/payments/transactions"
  }, {
    title: "Revenue Dashboard",
    url: "/payments/revenue"
  }, {
    title: "Dispute Management",
    url: "/payments/disputes"
  }, {
    title: "Gateway Configuration",
    url: "/payments/gateway"
  }]
}, {
  title: "Report & Certs",
  icon: FileBarChart,
  children: [{
    title: "Template Editor",
    url: "/reports/editor"
  }, {
    title: "Issuance & Rules Engine",
    url: "/reports/rules-engine"
  }]
}, {
  title: "Tickets",
  icon: Ticket,
  children: [{
    title: "Ticket Dashboard",
    url: "/tickets/dashboard"
  }, {
    title: "Active Queues",
    url: "/tickets/queues"
  }, {
    title: "Support Knowledge Base",
    url: "/tickets/knowledge"
  }, {
    title: "Support Performance",
    url: "/tickets/performance"
  }]
}, {
  title: "Community",
  icon: MessageCircle,
  children: [{
    title: "Content Moderation Queue",
    url: "/community/moderation"
  }, {
    title: "Leaderboard Management",
    url: "/community/leaderboard"
  }, {
    title: "Ambassador Program",
    url: "/community/ambassadors"
  }, {
    title: "Community Events",
    url: "/community/events"
  }, {
    title: "Member Directory",
    url: "/community/members"
  }]
}, {
  title: "SupEx (Token)",
  icon: Zap,
  children: [{
    title: "Token Dashboard",
    url: "/supex/dashboard"
  }, {
    title: "Distribution Engine",
    url: "/supex/distribution"
  }, {
    title: "Transaction Ledger",
    url: "/supex/ledger"
  }, {
    title: "Tokenomics Configuration",
    url: "/supex/config"
  }]
}, {
  title: "Awards",
  icon: Award,
  children: [{
    title: "Award Management",
    url: "/awards/management"
  }, {
    title: "Judging & Nominations & Nominators",
    url: "/awards/judging"
  }]
}, {
  title: "Manage Admins",
  icon: UserCog,
  children: [{
    title: "Admin Directory",
    url: "/manage-admins/directory"
  }, {
    title: "Role Management",
    url: "/manage-admins/roles"
  }]
}];
export function AppSidebar() {
  const {
    state
  } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [manuallyCollapsed, setManuallyCollapsed] = useState<string[]>([]);
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const isActive = (path: string) => currentPath === path;
  
  const isParentActive = (children: any[]) => {
    return children.some(child => {
      if (child.url) return isActive(child.url);
      if (child.children) return isParentActive(child.children);
      return false;
    });
  };
  
  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title) 
        : [...prev, title]
    );
  };

  // Auto-expand parent when child is active
  const isExpanded = (title: string, children: any[]) => {
    const hasActiveChild = isParentActive(children);
    if (hasActiveChild) return true;
    return expandedItems.includes(title);
  };
  const getParentNavClasses = (active: boolean) => {
    if (active) {
      return "bg-blue-600 text-white font-medium";
    }
    return "text-gray-300 hover:bg-gray-700 hover:text-white";
  };
  const getChildNavClasses = (active: boolean) => {
    if (active) {
      return "bg-blue-600 text-white font-bold ml-6";
    }
    return "text-gray-400 hover:bg-gray-700 hover:text-white ml-6";
  };
  return <Sidebar className="w-[280px] bg-gray-800 border-r border-gray-700 fixed left-0 top-0 h-screen">
      <SidebarContent className="bg-gray-800 px-0 mx-px py-[15px]">
        <SidebarGroup className="px-0 py-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {mainMenuItems.map(item => {
              const ItemIcon = item.icon;
              const hasChildren = item.children && item.children.length > 0;
              const itemExpanded = isExpanded(item.title, item.children || []);
              const parentActive = hasChildren ? isParentActive(item.children!) : false;
              return <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={hasChildren ? () => toggleExpanded(item.title) : undefined} className={`w-full justify-start px-4 py-3 ${getParentNavClasses(parentActive)} transition-all duration-200`}>
                        <div className="flex items-center w-full cursor-pointer">
                          {hasChildren && (itemExpanded ? <ChevronDown className="mr-3 h-4 w-4 flex-shrink-0 transition-transform duration-200" /> : <ChevronRight className="mr-3 h-4 w-4 flex-shrink-0 transition-transform duration-200" />)}
                          {ItemIcon && <ItemIcon className="mr-3 h-4 w-4 flex-shrink-0" />}
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Render children */}
                    {hasChildren && itemExpanded && !collapsed && <div className="bg-gray-900 my-1">
                        {item.children!.map(child => {
                          const hasGrandchildren = child.children && child.children.length > 0;
                          const childExpanded = hasGrandchildren && isExpanded(child.title, child.children);
                          const childActive = child.url ? isActive(child.url) : isParentActive(child.children || []);
                          
                          return <div key={child.title}>
                            <SidebarMenuItem>
                              {child.url ? (
                                <SidebarMenuButton asChild className={`w-full justify-start px-4 py-2.5 text-sm ${getChildNavClasses(childActive)} transition-all duration-200 my-0.5`}>
                                  <NavLink to={child.url} className="flex items-center w-full">
                                    <span className="truncate pl-7">{child.title}</span>
                                  </NavLink>
                                </SidebarMenuButton>
                              ) : (
                                <SidebarMenuButton 
                                  onClick={() => toggleExpanded(child.title)} 
                                  className={`w-full justify-start px-4 py-2.5 text-sm ${getChildNavClasses(childActive)} transition-all duration-200 my-0.5`}
                                >
                                  <div className="flex items-center w-full cursor-pointer">
                                    {hasGrandchildren && (childExpanded ? 
                                      <ChevronDown className="mr-2 h-3 w-3 flex-shrink-0 transition-transform duration-200" /> : 
                                      <ChevronRight className="mr-2 h-3 w-3 flex-shrink-0 transition-transform duration-200" />
                                    )}
                                    <span className="truncate pl-5">{child.title}</span>
                                  </div>
                                </SidebarMenuButton>
                              )}
                            </SidebarMenuItem>
                            
                            {/* Render grandchildren */}
                            {hasGrandchildren && childExpanded && (
                              <div className="bg-gray-950 ml-4">
                                {child.children!.map((grandchild: any) => (
                                  <SidebarMenuItem key={grandchild.title}>
                                    <SidebarMenuButton asChild className={`w-full justify-start px-4 py-2 text-xs ${getChildNavClasses(isActive(grandchild.url))} transition-all duration-200 my-0.5`}>
                                      <NavLink to={grandchild.url} className="flex items-center w-full">
                                        <span className="truncate pl-8">{grandchild.title}</span>
                                      </NavLink>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                ))}
                              </div>
                            )}
                          </div>
                        })}
                      </div>}
                  </div>;
            })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Sign Out Section */}
        <div className="mt-auto p-4 border-t border-gray-700">
          <Button
            onClick={signOut}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="mr-3 h-4 w-4" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>;
}