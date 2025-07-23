import { 
  Users, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  BookOpen, 
  Settings, 
  Layers, 
  Monitor, 
  BarChart3, 
  Handshake, 
  ShoppingCart 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainMenuItems = [
  { 
    title: "Users", 
    url: "/users", 
    icon: Users 
  },
  {
    title: "Questionnaires",
    url: "/questionnaires",
    icon: FileText,
    children: [
      { title: "Answer Item Library", url: "/questionnaires/answer-item-library" },
      { title: "Question Lifecycle Mgmt", url: "/questionnaires/question-lifecycle" },
      { title: "Question Properties", url: "/questionnaires/question-properties" },
      { title: "Questionnaire Assembly", url: "/questionnaires/assembly" },
      { title: "User Submission Review", url: "/questionnaires/submission-review" },
    ]
  },
  { 
    title: "FDE Simulator Management", 
    url: "/fde-simulator", 
    icon: Monitor 
  },
  { 
    title: "Performance Analytics", 
    url: "/analytics", 
    icon: BarChart3 
  },
  { 
    title: "Partners", 
    url: "/partners", 
    icon: Handshake 
  },
  { 
    title: "Orders", 
    url: "/orders", 
    icon: ShoppingCart 
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // For this layout, we'll always show the full sidebar (not collapsed)
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const isParentActive = (children: any[]) => children.some(child => isActive(child.url));

  const getNavClasses = (active: boolean) => {
    if (active) {
      return "bg-nav-active text-nav-active-foreground font-medium";
    }
    return "text-nav-text hover:bg-nav-hover hover:text-nav-active-foreground";
  };

  const getChildNavClasses = (active: boolean) => {
    if (active) {
      return "bg-nav-active text-nav-active-foreground font-medium ml-6";
    }
    return "text-nav-text hover:bg-nav-hover hover:text-nav-active-foreground ml-6";
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainMenuItems.map((item) => {
                const ItemIcon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = item.title === "Questionnaires"; // Always expand Questionnaires as requested
                const parentActive = hasChildren ? isParentActive(item.children!) : isActive(item.url);

                return (
                  <div key={item.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild={!hasChildren}
                        className={`w-full justify-start px-3 py-2 ${getNavClasses(parentActive && !hasChildren)}`}
                      >
                        {hasChildren ? (
                          <div className="flex items-center w-full cursor-pointer">
                            {isExpanded ? (
                              <ChevronDown className="mr-2 h-4 w-4 flex-shrink-0" />
                            ) : (
                              <ChevronRight className="mr-2 h-4 w-4 flex-shrink-0" />
                            )}
                            {ItemIcon && <ItemIcon className="mr-2 h-4 w-4 flex-shrink-0" />}
                            {!collapsed && <span className="truncate">{item.title}</span>}
                          </div>
                        ) : (
                          <NavLink to={item.url} className="flex items-center w-full">
                            {ItemIcon && <ItemIcon className="mr-2 h-4 w-4 flex-shrink-0" />}
                            {!collapsed && <span className="truncate">{item.title}</span>}
                          </NavLink>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Render children for Questionnaires */}
                    {hasChildren && isExpanded && !collapsed && (
                      <div className="mt-1 mb-2">
                        {item.children!.map((child) => (
                          <SidebarMenuItem key={child.title}>
                            <SidebarMenuButton asChild className={`w-full justify-start px-3 py-1.5 text-sm ${getChildNavClasses(isActive(child.url))}`}>
                              <NavLink to={child.url} className="flex items-center w-full">
                                <span className="truncate">{child.title}</span>
                              </NavLink>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}