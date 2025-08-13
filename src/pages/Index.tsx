const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Panel</h1>
        <p className="text-muted-foreground mb-6">
          Navigate through the sidebar to access different sections of the application.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Users</h3>
            <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Questionnaires</h3>
            <p className="text-sm text-muted-foreground">Create and manage survey questionnaires</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-muted-foreground">View performance metrics and reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;