import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Questionnaires = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Questionnaires</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px]">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">Questionnaire Management</h2>
              <p className="text-muted-foreground mb-6">
                Create, manage, and analyze survey questionnaires and responses.
              </p>
              <div className="grid gap-4">
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Answer Item Library</h3>
                  <p className="text-muted-foreground">Manage reusable answer options and templates.</p>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Question Lifecycle Management</h3>
                  <p className="text-muted-foreground">Track and manage the lifecycle of survey questions.</p>
                </div>
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Question Properties</h3>
                  <p className="text-muted-foreground">Configure question types, validation, and properties.</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Questionnaires;