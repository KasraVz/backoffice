const Index = () => {
  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Admin Panel</h2>
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
  );
};

export default Index;