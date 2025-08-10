import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Users from "./pages/Users";
import UserDirectory from "./pages/users/UserDirectory";
import IdentityVerificationQueue from "./pages/users/IdentityVerificationQueue";
import TeamProfilesPage from "./pages/users/TeamProfilesPage";
import FeedbackSubmissions from "./pages/users/FeedbackSubmissions";
import Questionnaires from "./pages/Questionnaires";
import QuestionnaireManagement from "./pages/QuestionnaireManagement";
import QuestionnaireBuilder from "./pages/QuestionnaireBuilder";
import AssessmentBank from "./pages/AssessmentBank";
import CreateQuestion from "./pages/CreateQuestion";
import UserSubmissionReview from "./pages/UserSubmissionReview";
import SubmissionDetails from "./pages/SubmissionDetails";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import OperationalPartnerDirectory from "./pages/partners/operational/PartnerDirectory";

import QuestionReviewDashboard from "./pages/partners/operational/QuestionReviewDashboard";
import PromptCriteriaLibrary from "./pages/partners/operational/PromptCriteriaLibrary";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import QuestionReview from "./pages/faculty/QuestionReview";
import ReviewSetDetails from "./pages/partners/operational/ReviewSetDetails";
import AdminDirectory from "./pages/manage-admins/AdminDirectory";
import RoleManagement from "./pages/manage-admins/RoleManagement";


import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";


import LoginTwoFactorPage from "./pages/LoginTwoFactorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/login/2fa" element={<LoginTwoFactorPage />} />
            <Route path="/set-password/:token" element={<SetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            
            {/* User Management Routes */}
            <Route path="/users/directory" element={<ProtectedRoute><UserDirectory /></ProtectedRoute>} />
            <Route path="/users/teams" element={<ProtectedRoute><TeamProfilesPage /></ProtectedRoute>} />
            <Route path="/users/verification" element={<ProtectedRoute><IdentityVerificationQueue /></ProtectedRoute>} />
            
            <Route path="/users/feedback" element={<ProtectedRoute><FeedbackSubmissions /></ProtectedRoute>} />
            
            <Route path="/questionnaires" element={<ProtectedRoute><Questionnaires /></ProtectedRoute>} />
            <Route path="/questionnaires/management" element={<ProtectedRoute><QuestionnaireManagement /></ProtectedRoute>} />
            <Route path="/questionnaires/assessment-bank" element={<ProtectedRoute><AssessmentBank /></ProtectedRoute>} />
            <Route path="/questionnaires/assessment-bank/create" element={<ProtectedRoute><CreateQuestion /></ProtectedRoute>} />
            <Route path="/questionnaires/submission-review" element={<ProtectedRoute><UserSubmissionReview /></ProtectedRoute>} />
            <Route path="/questionnaires/submission-review/:id" element={<ProtectedRoute><SubmissionDetails /></ProtectedRoute>} />
            <Route path="/questionnaires/analytics" element={<ProtectedRoute><PerformanceAnalytics /></ProtectedRoute>} />
            <Route path="/questionnaires/builder/:id" element={<ProtectedRoute><QuestionnaireBuilder /></ProtectedRoute>} />
            
            {/* Admin Management Routes */}
            <Route path="/manage-admins/directory" element={<ProtectedRoute><AdminDirectory /></ProtectedRoute>} />
            <Route path="/manage-admins/roles" element={<ProtectedRoute><RoleManagement /></ProtectedRoute>} />
            
            
            
            {/* Operational Partners Routes */}
            <Route path="/partners/operational/directory" element={<ProtectedRoute><OperationalPartnerDirectory /></ProtectedRoute>} />
            
            <Route path="/partners/operational/review-dashboard" element={<ProtectedRoute><QuestionReviewDashboard /></ProtectedRoute>} />
            <Route path="/partners/operational/review-set/:setId" element={<ProtectedRoute><ReviewSetDetails /></ProtectedRoute>} />
            <Route path="/partners/operational/prompt-criteria" element={<ProtectedRoute><PromptCriteriaLibrary /></ProtectedRoute>} />
            
            {/* Faculty Portal Routes */}
            <Route path="/faculty/dashboard" element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty/review/:setId" element={<ProtectedRoute><QuestionReview /></ProtectedRoute>} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
