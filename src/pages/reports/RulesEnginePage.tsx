import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface Rule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: boolean;
}

interface Condition {
  id: string;
  type: string;
  operator: string;
  value: string;
}

const mockRules: Rule[] = [
  {
    id: "1",
    name: "High Performing Candidate Report",
    trigger: "FPA Assessment >= 85",
    action: "Generate Report, Issue Certificate",
    status: true,
  },
  {
    id: "2", 
    name: "Basic Competency Certificate",
    trigger: "Ethics Assessment >= 70",
    action: "Issue Certificate",
    status: true,
  },
  {
    id: "3",
    name: "Remedial Training Trigger",
    trigger: "Risk Management < 60",
    action: "Generate Report",
    status: false,
  },
];

const mockQuestionnaires = [
  "FPA Assessment",
  "Ethics Assessment", 
  "Risk Management Assessment",
  "Client Communications Assessment",
];

const mockReportTemplates = [
  "FPA Standard Report v1",
  "Detailed Analysis Report",
  "Performance Summary",
  "Remedial Training Report",
];

const mockCertificateTemplates = [
  "FPA Completion Certificate",
  "Excellence Award Certificate",
  "Basic Competency Certificate",
];

export default function RulesEnginePage() {
  const [rules, setRules] = useState<Rule[]>(mockRules);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [conditions, setConditions] = useState<Condition[]>([
    { id: "1", type: "questionnaire", operator: ">=", value: "85" }
  ]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("");
  const [generateReport, setGenerateReport] = useState(false);
  const [selectedReportTemplate, setSelectedReportTemplate] = useState("");
  const [issueCertificate, setIssueCertificate] = useState(false);
  const [selectedCertificateTemplate, setSelectedCertificateTemplate] = useState("");

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, status: !rule.status } : rule
    ));
  };

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      type: "kyc",
      operator: "=",
      value: "Verified"
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (conditionId: string) => {
    setConditions(conditions.filter(condition => condition.id !== conditionId));
  };

  const updateCondition = (conditionId: string, field: string, value: string) => {
    setConditions(conditions.map(condition =>
      condition.id === conditionId ? { ...condition, [field]: value } : condition
    ));
  };

  const saveRule = () => {
    const actions = [];
    if (generateReport) actions.push("Generate Report");
    if (issueCertificate) actions.push("Issue Certificate");

    const triggerText = conditions.map(condition => {
      if (condition.type === "questionnaire") {
        return `${selectedQuestionnaire} ${condition.operator} ${condition.value}`;
      } else {
        return `KYC Status = ${condition.value}`;
      }
    }).join(" AND ");

    const newRule: Rule = {
      id: Date.now().toString(),
      name: ruleName,
      trigger: triggerText,
      action: actions.join(", "),
      status: true,
    };

    setRules([...rules, newRule]);
    resetModal();
  };

  const resetModal = () => {
    setIsCreateModalOpen(false);
    setRuleName("");
    setConditions([{ id: "1", type: "questionnaire", operator: ">=", value: "85" }]);
    setSelectedQuestionnaire("");
    setGenerateReport(false);
    setSelectedReportTemplate("");
    setIssueCertificate(false);
    setSelectedCertificateTemplate("");
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 bg-background">
          <div className="p-6 mx-[27px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Issuance & Rules Engine</h1>
                <p className="text-muted-foreground">
                  Create automated rules to govern when reports and certificates are issued to users
                </p>
              </div>
              <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create New Rule
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Trigger</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.trigger}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {rule.action.split(", ").map((action, index) => (
                              <Badge key={index} variant="secondary">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={rule.status}
                            onCheckedChange={() => toggleRuleStatus(rule.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Rule</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input
                      id="rule-name"
                      placeholder="Enter rule name"
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">WHEN (Conditions)</h3>
                    
                    {conditions.map((condition, index) => (
                      <div key={condition.id} className="flex gap-4 items-end">
                        {condition.type === "questionnaire" ? (
                          <>
                            <div className="flex-1">
                              <Label>Questionnaire</Label>
                              <Select
                                value={selectedQuestionnaire}
                                onValueChange={setSelectedQuestionnaire}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select questionnaire" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockQuestionnaires.map((questionnaire) => (
                                    <SelectItem key={questionnaire} value={questionnaire}>
                                      {questionnaire}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="w-24">
                              <Label>Operator</Label>
                              <Select
                                value={condition.operator}
                                onValueChange={(value) => updateCondition(condition.id, "operator", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value=">=">≥</SelectItem>
                                  <SelectItem value=">">&gt;</SelectItem>
                                  <SelectItem value="<">&lt;</SelectItem>
                                  <SelectItem value="<=">≤</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="w-24">
                              <Label>Score</Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={condition.value}
                                onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1">
                              <Label>Condition Type</Label>
                              <Select value="kyc" disabled>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="kyc">KYC Status</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex-1">
                              <Label>Required Value</Label>
                              <Select
                                value={condition.value}
                                onValueChange={(value) => updateCondition(condition.id, "value", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Verified">Verified</SelectItem>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                        
                        {conditions.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeCondition(condition.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button variant="outline" onClick={addCondition} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Condition
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">THEN (Actions)</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          id="generate-report"
                          checked={generateReport}
                          onCheckedChange={(checked) => setGenerateReport(checked === true)}
                        />
                        <Label htmlFor="generate-report" className="text-sm font-medium">
                          Generate Report
                        </Label>
                        <Select
                          value={selectedReportTemplate}
                          onValueChange={setSelectedReportTemplate}
                          disabled={!generateReport}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select report template" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockReportTemplates.map((template) => (
                              <SelectItem key={template} value={template}>
                                {template}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Checkbox
                          id="issue-certificate"
                          checked={issueCertificate}
                          onCheckedChange={(checked) => setIssueCertificate(checked === true)}
                        />
                        <Label htmlFor="issue-certificate" className="text-sm font-medium">
                          Issue Certificate
                        </Label>
                        <Select
                          value={selectedCertificateTemplate}
                          onValueChange={setSelectedCertificateTemplate}
                          disabled={!issueCertificate}
                        >
                          <SelectTrigger className="w-[250px]">
                            <SelectValue placeholder="Select certificate template" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockCertificateTemplates.map((template) => (
                              <SelectItem key={template} value={template}>
                                {template}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={resetModal}>
                    Cancel
                  </Button>
                  <Button onClick={saveRule} disabled={!ruleName}>
                    Save Rule
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}