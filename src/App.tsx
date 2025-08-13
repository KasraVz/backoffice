import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/MainLayout";
import Index from "./pages/Index";
import Users from "./pages/Users";
import UserDirectory from "./pages/users/UserDirectory";
import UserProfilePage from "./pages/users/UserProfilePage";
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
import TemplateEditor from "./pages/TemplateEditor";
import ReportTemplateGallery from "./pages/ReportTemplateGallery";
import ReportTemplateEditor from "./pages/ReportTemplateEditor";
import CertificateTemplateGallery from "./pages/CertificateTemplateGallery";
import CertificateTemplateEditor from "./pages/CertificateTemplateEditor";
import RulesEnginePage from "./pages/reports/RulesEnginePage";
import OrderHistoryPage from "./pages/orders/OrderHistoryPage";
import SubscriptionDashboardPage from "./pages/orders/SubscriptionDashboardPage";
import DiscountCodesPage from "./pages/orders/DiscountCodesPage";
import CreateOrderPage from "./pages/orders/CreateOrderPage";


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
            <Route path="/" element={<ProtectedRoute><MainLayout><Index /></MainLayout></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><MainLayout><Users /></MainLayout></ProtectedRoute>} />
            
            {/* User Management Routes */}
            <Route path="/users/directory" element={<ProtectedRoute><MainLayout><UserDirectory /></MainLayout></ProtectedRoute>} />
            <Route path="/users/profile/:userId" element={<ProtectedRoute><MainLayout><UserProfilePage /></MainLayout></ProtectedRoute>} />
            <Route path="/users/teams" element={<ProtectedRoute><MainLayout><TeamProfilesPage /></MainLayout></ProtectedRoute>} />
            <Route path="/users/verification" element={<ProtectedRoute><MainLayout><IdentityVerificationQueue /></MainLayout></ProtectedRoute>} />
            
            <Route path="/users/feedback" element={<ProtectedRoute><MainLayout><FeedbackSubmissions /></MainLayout></ProtectedRoute>} />
            
            <Route path="/questionnaires" element={<ProtectedRoute><MainLayout><Questionnaires /></MainLayout></ProtectedRoute>} />
            <Route path="/questionnaires/management" element={<ProtectedRoute><MainLayout><QuestionnaireManagement /></MainLayout></ProtectedRoute>} />
            <Route path="/questionnaires/assessment-bank" element={<ProtectedRoute><MainLayout><AssessmentBank /></MainLayout></ProtectedRoute>} />
            <Route path="/questionnaires/assessment-bank/create" element={<ProtectedRoute><MainLayout><CreateQuestion /></MainLayout></ProtectedRoute>} />
            <Route path="/questionnaires/submission-review" element={<ProtectedRoute><MainLayout><UserSubmissionReview /></MainLayout></ProtectedRoute>} />
            <Route path="/questionnaires/submission-review/:id" element={<ProtectedRoute><MainLayout><SubmissionDetails /></MainLayout></ProtectedRoute>} />
            <Route path="/questionnaires/analytics" element={<ProtectedRoute><MainLayout><PerformanceAnalytics /></MainLayout></ProtectedRoute>} />
            <Route path="/questionnaires/builder/:id" element={<ProtectedRoute><MainLayout><QuestionnaireBuilder /></MainLayout></ProtectedRoute>} />
            
            {/* Admin Management Routes */}
            <Route path="/manage-admins/directory" element={<ProtectedRoute><MainLayout><AdminDirectory /></MainLayout></ProtectedRoute>} />
            <Route path="/manage-admins/roles" element={<ProtectedRoute><MainLayout><RoleManagement /></MainLayout></ProtectedRoute>} />
            
            
            
            {/* Operational Partners Routes */}
            <Route path="/partners/operational/directory" element={<ProtectedRoute><MainLayout><OperationalPartnerDirectory /></MainLayout></ProtectedRoute>} />
            
            <Route path="/partners/operational/review-dashboard" element={<ProtectedRoute><MainLayout><QuestionReviewDashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/partners/operational/review-set/:setId" element={<ProtectedRoute><MainLayout><ReviewSetDetails /></MainLayout></ProtectedRoute>} />
            <Route path="/partners/operational/prompt-criteria" element={<ProtectedRoute><MainLayout><PromptCriteriaLibrary /></MainLayout></ProtectedRoute>} />
            
            {/* Faculty Portal Routes */}
            <Route path="/faculty/dashboard" element={<ProtectedRoute><MainLayout><FacultyDashboard /></MainLayout></ProtectedRoute>} />
            <Route path="/faculty/review/:setId" element={<ProtectedRoute><MainLayout><QuestionReview /></MainLayout></ProtectedRoute>} />
            
            {/* Template Editor Routes */}
            <Route path="/reports/editor" element={<ProtectedRoute><MainLayout><TemplateEditor /></MainLayout></ProtectedRoute>} />
            <Route path="/reports/editor/reports" element={<ProtectedRoute><MainLayout><ReportTemplateGallery /></MainLayout></ProtectedRoute>} />
            <Route path="/reports/editor/reports/new-template" element={<ProtectedRoute><MainLayout><ReportTemplateEditor /></MainLayout></ProtectedRoute>} />
            <Route path="/reports/editor/reports/:templateId" element={<ProtectedRoute><MainLayout><ReportTemplateEditor /></MainLayout></ProtectedRoute>} />
            <Route path="/reports/editor/certificates" element={<ProtectedRoute><MainLayout><CertificateTemplateGallery /></MainLayout></ProtectedRoute>} />
            <Route path="/reports/editor/certificates/:templateId" element={<ProtectedRoute><MainLayout><CertificateTemplateEditor /></MainLayout></ProtectedRoute>} />
            
            {/* Rules Engine Route */}
            <Route path="/reports/rules-engine" element={<ProtectedRoute><MainLayout><RulesEnginePage /></MainLayout></ProtectedRoute>} />

            {/* Orders Routes */}
            <Route path="/orders/history" element={<ProtectedRoute><MainLayout><OrderHistoryPage /></MainLayout></ProtectedRoute>} />
            <Route path="/orders/subscriptions" element={<ProtectedRoute><MainLayout><SubscriptionDashboardPage /></MainLayout></ProtectedRoute>} />
            <Route path="/orders/coupons" element={<ProtectedRoute><MainLayout><DiscountCodesPage /></MainLayout></ProtectedRoute>} />
            <Route path="/orders/create" element={<ProtectedRoute><MainLayout><CreateOrderPage /></MainLayout></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
