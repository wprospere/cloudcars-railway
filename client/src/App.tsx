import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";

import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToHash from "./components/ScrollToHash";
import { ThemeProvider } from "./contexts/ThemeContext";

// ✅ Home is eagerly loaded so the landing page paints instantly (no flash).
import Home from "./pages/Home";

// ✅ Everything else is lazy-loaded: each route's JS only downloads when the
//    user actually visits it. This trims the initial bundle the homepage ships.
const NotFound = lazy(() => import("@/pages/NotFound"));

const Faqs = lazy(() => import("./pages/Faqs"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));

const TaxiBeeston = lazy(() => import("./pages/TaxiBeeston"));
const TaxiWestBridgford = lazy(() => import("./pages/TaxiWestBridgford"));
const TaxiWollaton = lazy(() => import("./pages/TaxiWollaton"));
const TaxiEdwalton = lazy(() => import("./pages/TaxiEdwalton"));

const EastMidlandsAirportTaxi = lazy(
  () => import("./pages/EastMidlandsAirportTaxi")
);
const NottinghamToEMATaxi = lazy(() => import("./pages/NottinghamToEMATaxi"));

const TaxiNottingham = lazy(() => import("./pages/TaxiNottingham"));
const AirportTransfers = lazy(() => import("./pages/AirportTransfers"));
const ExecutiveCar = lazy(() => import("./pages/ExecutiveCar"));
const SevenSeater = lazy(() => import("./pages/SevenSeater"));
const CourierServices = lazy(() => import("./pages/CourierServices"));
const CorporateTransport = lazy(() => import("./pages/CorporateTransport"));

const DriveForCloudCars = lazy(() => import("./pages/DriveForCloudCars"));
const DriverOnboardingPage = lazy(() => import("@/pages/DriverOnboarding"));

const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLoginPage = lazy(() => import("./pages/admin/Login"));
const ContentEditor = lazy(() => import("./pages/admin/ContentEditor"));
const ImageManager = lazy(() => import("./pages/admin/ImageManager"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const Inquiries = lazy(() => import("./pages/admin/Inquiries"));
const TeamMembers = lazy(() => import("./pages/admin/TeamMembers"));
const PoliciesAdmin = lazy(() => import("./pages/admin/PoliciesAdmin"));
const DriverOnboardingReview = lazy(
  () => import("@/pages/admin/DriverOnboardingReview")
);

function Router() {
  return (
    <Switch>
      {/* Main pages */}
      <Route path="/" component={Home} />
      <Route path="/faqs" component={Faqs} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/cookies" component={Cookies} />

      {/* Area pages */}
      <Route path="/taxi-beeston" component={TaxiBeeston} />
      <Route path="/taxi-west-bridgford" component={TaxiWestBridgford} />
      <Route path="/taxi-wollaton" component={TaxiWollaton} />
      <Route path="/taxi-edwalton" component={TaxiEdwalton} />

      {/* Airport pages */}
      <Route
        path="/east-midlands-airport-taxi"
        component={EastMidlandsAirportTaxi}
      />
      <Route
        path="/nottingham-to-east-midlands-airport"
        component={NottinghamToEMATaxi}
      />

      {/* Service pages */}
      <Route path="/taxi-nottingham" component={TaxiNottingham} />
      <Route
        path="/airport-transfers-nottingham"
        component={AirportTransfers}
      />
      <Route path="/executive-car-nottingham" component={ExecutiveCar} />
      <Route path="/7-seater-taxi-nottingham" component={SevenSeater} />
      <Route
        path="/courier-services-nottingham"
        component={CourierServices}
      />
      <Route
        path="/corporate-transport-nottingham"
        component={CorporateTransport}
      />

      {/* Driver pages */}
      <Route path="/drive-for-cloud-cars" component={DriveForCloudCars} />
      <Route path="/driver/onboarding" component={DriverOnboardingPage} />
      <Route path="/driver/onboarding/:token" component={DriverOnboardingPage} />

      {/* Admin */}
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/inquiries" component={Inquiries} />
      <Route path="/admin/team-members" component={TeamMembers} />
      <Route path="/admin/content" component={ContentEditor} />
      <Route path="/admin/images" component={ImageManager} />
      <Route path="/admin/policies" component={PoliciesAdmin} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route
        path="/admin/driver-onboarding/:id"
        component={DriverOnboardingReview}
      />
      <Route path="/admin" component={AdminDashboard} />

      {/* Fallbacks */}
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
          <ScrollToHash />
          {/* Suspense fallback shows briefly while a lazy route's chunk loads. */}
          <Suspense
            fallback={
              <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            }
          >
            <Router />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
