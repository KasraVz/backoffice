import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Users = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Users</h1>
          </header>
          <main className="flex-1 p-6 bg-background">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">User Management</h2>
              <p className="text-muted-foreground mb-6">
                Manage user accounts, permissions, and access controls.
              </p>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Users Overview</h3>
                <p className="text-muted-foreground">User management features will be implemented here.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Users;