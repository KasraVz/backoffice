import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Users from "./pages/Users";
import Questionnaires from "./pages/Questionnaires";
import QuestionnaireManagement from "./pages/QuestionnaireManagement";
import QuestionnaireBuilder from "./pages/QuestionnaireBuilder";
import AssessmentBank from "./pages/AssessmentBank";
import CreateQuestion from "./pages/CreateQuestion";
import UserSubmissionReview from "./pages/UserSubmissionReview";
import SubmissionDetails from "./pages/SubmissionDetails";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import OperationalPartnerDirectory from "./pages/partners/operational/PartnerDirectory";
import FacultyExpertiseProfiles from "./pages/partners/operational/FacultyExpertise";
import QuestionReviewDashboard from "./pages/partners/operational/QuestionReviewDashboard";
import PromptCriteriaLibrary from "./pages/partners/operational/PromptCriteriaLibrary";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import QuestionReview from "./pages/faculty/QuestionReview";
import ReviewSetDetails from "./pages/partners/operational/ReviewSetDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/users" element={<Users />} />
          <Route path="/questionnaires" element={<Questionnaires />} />
          <Route path="/questionnaires/management" element={<QuestionnaireManagement />} />
        <Route path="/questionnaires/assessment-bank" element={<AssessmentBank />} />
        <Route path="/questionnaires/assessment-bank/create" element={<CreateQuestion />} />
          <Route path="/questionnaires/submission-review" element={<UserSubmissionReview />} />
          <Route path="/questionnaires/submission-review/:id" element={<SubmissionDetails />} />
          <Route path="/questionnaires/analytics" element={<PerformanceAnalytics />} />
          <Route path="/questionnaires/builder/:id" element={<QuestionnaireBuilder />} />
          
          {/* Operational Partners Routes */}
          <Route path="/partners/operational/directory" element={<OperationalPartnerDirectory />} />
          <Route path="/partners/operational/expertise" element={<FacultyExpertiseProfiles />} />
          <Route path="/partners/operational/review-dashboard" element={<QuestionReviewDashboard />} />
          <Route path="/partners/operational/review-set/:setId" element={<ReviewSetDetails />} />
          <Route path="/partners/operational/prompt-criteria" element={<PromptCriteriaLibrary />} />
          
          {/* Faculty Portal Routes */}
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/review/:setId" element={<QuestionReview />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
