import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./pages/Home";
import Faqs from "./pages/Faqs";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminLoginPage from "./pages/admin/Login";
import ContentEditor from "./pages/admin/ContentEditor";
import ImageManager from "./pages/admin/ImageManager";
import AdminSettings from "./pages/admin/Settings";
import Inquiries from "./pages/admin/Inquiries";
import TeamMembers from "./pages/admin/TeamMembers";
import PoliciesAdmin from "./pages/admin/PoliciesAdmin";

import DriverOnboardingPage from "@/pages/DriverOnboarding";
import DriverOnboardingReview from "@/pages/admin/DriverOnboardingReview";


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={Cookies} />

<Route path="/faqs" component={Faqs} />

      {/* Driver onboarding (public) */}
      <Route path="/driver/onboarding" component={DriverOnboardingPage} />

      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/inquiries" component={Inquiries} />
      <Route path="/admin/team-members" component={TeamMembers} />
      <Route path="/admin/content" component={ContentEditor} />
      <Route path="/admin/images" component={ImageManager} />
      <Route path="/admin/policies" component={PoliciesAdmin} />
      <Route path="/admin/settings" component={AdminSettings} />

      {/* Review onboarding docs (admin) */}
      <Route
        path="/admin/driver-onboarding/:id"
        component={DriverOnboardingReview}
      />

      <Route path="/admin" component={AdminDashboard} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
