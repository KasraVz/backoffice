import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Users from "./pages/Users";
import UserDirectory from "./pages/users/UserDirectory";
import UserProfilePage from "./pages/users/UserProfilePage";
import IdentityVerificationQueue from "./pages/users/IdentityVerificationQueue";
import TeamProfilesPage from "./pages/users/TeamProfilesPage";
import FeedbackSubmissions from "./pages/users/FeedbackSubmissions";
import TestTakerEditRequests from "./pages/users/TestTakerEditRequests";
import LeaderboardConfigPage from "./pages/gamification/LeaderboardConfigPage";
import BadgeManagementPage from "./pages/gamification/BadgeManagementPage";
import Questionnaires from "./pages/Questionnaires";
import QuestionnaireManagement from "./pages/QuestionnaireManagement";
import QuestionnaireBuilder from "./pages/QuestionnaireBuilder";
import AssessmentBank from "./pages/AssessmentBank";
import CreateQuestion from "./pages/CreateQuestion";
import UserSubmissionReview from "./pages/UserSubmissionReview";
import SubmissionDetails from "./pages/SubmissionDetails";
import PerformanceAnalytics from "./pages/PerformanceAnalytics";
import OperationalPartnerDirectory from "./pages/partners/operational/PartnerDirectory";
import FunctionalPartnerDirectory from "./pages/partners/functional/FunctionalPartnerDirectory";
import FunctionalPartnerProfilePage from "./pages/partners/functional/FunctionalPartnerProfilePage";
import PartnerEditRequests from "./pages/partners/functional/PartnerEditRequests";
import ReferralDashboard from "./pages/partners/functional/ReferralDashboard";
import PortalSettings from "./pages/partners/functional/PortalSettings";
import FinancialAidApplicationsPage from "./pages/financials/FinancialAidApplicationsPage";

import AssignQuestionnaireReview from "./pages/partners/operational/AssignQuestionnaireReview";
import PromptCriteriaLibrary from "./pages/partners/operational/PromptCriteriaLibrary";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import QuestionReview from "./pages/faculty/QuestionReview";
import QuestionReviewEnhanced from "./pages/faculty/QuestionReviewEnhanced";
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
import PricingDashboardPage from "./pages/orders/PricingDashboardPage";
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
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            
            {/* Test Takers Routes */}
            <Route path="/test-takers/directory" element={<ProtectedRoute><UserDirectory /></ProtectedRoute>} />
            <Route path="/test-takers/profile/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/test-takers/edit-requests" element={<ProtectedRoute><TestTakerEditRequests /></ProtectedRoute>} />
            <Route path="/test-takers/teams" element={<ProtectedRoute><TeamProfilesPage /></ProtectedRoute>} />
            <Route path="/test-takers/feedback" element={<ProtectedRoute><FeedbackSubmissions /></ProtectedRoute>} />
            <Route path="/test-takers/verification" element={<ProtectedRoute><IdentityVerificationQueue /></ProtectedRoute>} />
            
            {/* Gamification Routes */}
            <Route path="/gamification/leaderboard" element={<ProtectedRoute><LeaderboardConfigPage /></ProtectedRoute>} />
            <Route path="/gamification/badges" element={<ProtectedRoute><BadgeManagementPage /></ProtectedRoute>} />
            
            {/* Backward compatibility redirects */}
            <Route path="/users/directory" element={<Navigate to="/test-takers/directory" replace />} />
            <Route path="/users/profile/:userId" element={<Navigate to="/test-takers/profile/:userId" replace />} />
            <Route path="/users/teams" element={<Navigate to="/test-takers/teams" replace />} />
            <Route path="/users/feedback" element={<Navigate to="/test-takers/feedback" replace />} />
            <Route path="/users/verification" element={<Navigate to="/test-takers/verification" replace />} />
            
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
            
            
            
            {/* Functional Partners Routes */}
            <Route path="/partners/functional/directory" element={<ProtectedRoute><FunctionalPartnerDirectory /></ProtectedRoute>} />
            <Route path="/partners/functional/profile/:partnerId" element={<ProtectedRoute><FunctionalPartnerProfilePage /></ProtectedRoute>} />
            <Route path="/partners/functional/edit-requests" element={<ProtectedRoute><PartnerEditRequests /></ProtectedRoute>} />
            <Route path="/partners/functional/referrals" element={<ProtectedRoute><ReferralDashboard /></ProtectedRoute>} />
            <Route path="/partners/functional/settings" element={<ProtectedRoute><PortalSettings /></ProtectedRoute>} />
            
            {/* Operational Partners Routes */}
            <Route path="/partners/operational/directory" element={<ProtectedRoute><OperationalPartnerDirectory /></ProtectedRoute>} />
            
            <Route path="/partners/operational/assign-questionnaire-review" element={<ProtectedRoute><AssignQuestionnaireReview /></ProtectedRoute>} />
            <Route path="/partners/operational/review-set/:setId" element={<ProtectedRoute><ReviewSetDetails /></ProtectedRoute>} />
            <Route path="/partners/operational/prompt-criteria" element={<ProtectedRoute><PromptCriteriaLibrary /></ProtectedRoute>} />
            
            {/* Faculty Portal Routes */}
            <Route path="/faculty/dashboard" element={<ProtectedRoute><FacultyDashboard /></ProtectedRoute>} />
            <Route path="/faculty/review/:setId" element={<ProtectedRoute><QuestionReviewEnhanced /></ProtectedRoute>} />
            
            {/* Template Editor Routes */}
            <Route path="/reports/editor" element={<ProtectedRoute><TemplateEditor /></ProtectedRoute>} />
            <Route path="/reports/editor/reports" element={<ProtectedRoute><ReportTemplateGallery /></ProtectedRoute>} />
            <Route path="/reports/editor/reports/new-template" element={<ProtectedRoute><ReportTemplateEditor /></ProtectedRoute>} />
            <Route path="/reports/editor/reports/:templateId" element={<ProtectedRoute><ReportTemplateEditor /></ProtectedRoute>} />
            <Route path="/reports/editor/certificates" element={<ProtectedRoute><CertificateTemplateGallery /></ProtectedRoute>} />
            <Route path="/reports/editor/certificates/:templateId" element={<ProtectedRoute><CertificateTemplateEditor /></ProtectedRoute>} />
            
            {/* Rules Engine Route */}
            <Route path="/reports/rules-engine" element={<ProtectedRoute><RulesEnginePage /></ProtectedRoute>} />

            {/* Orders Routes */}
            <Route path="/orders/history" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
            <Route path="/orders/pricing" element={<ProtectedRoute><PricingDashboardPage /></ProtectedRoute>} />
            <Route path="/orders/coupons" element={<ProtectedRoute><DiscountCodesPage /></ProtectedRoute>} />
            <Route path="/orders/create" element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>} />

            {/* Financial Aid Routes */}
            <Route path="/financials/aid-applications" element={<ProtectedRoute><FinancialAidApplicationsPage /></ProtectedRoute>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
