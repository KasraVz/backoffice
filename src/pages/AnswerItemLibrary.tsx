import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const AnswerItemLibrary = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-6 mx-[27px]">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-lg font-semibold">Answer Item Library</h1>
          </header>
          <main className="flex-1 p-6 bg-background mx-[27px]">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-4">Answer Item Library</h2>
              <p className="text-muted-foreground mb-6">
                Manage reusable answer options, templates, and response formats.
              </p>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Library Overview</h3>
                <p className="text-muted-foreground">Answer item management features will be implemented here.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AnswerItemLibrary;