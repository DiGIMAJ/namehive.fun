import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import ScrollToTop from '@/components/common/ScrollToTop';
import Footer from '@/components/layout/Footer';
import Index from '@/pages/Index';
import SignUp from '@/pages/auth/SignUp';
import SignIn from '@/pages/auth/SignIn';
import AdminSignIn from '@/pages/auth/AdminSignIn';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';
import GeneratorsPage from '@/pages/GeneratorsPage';
import BlogPage from '@/pages/BlogPage';
import BlogPostPage from '@/pages/BlogPostPage';
import SitemapPage from '@/pages/SitemapPage';
import PricingPage from '@/pages/PricingPage';
import CheckoutPage from '@/pages/CheckoutPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import SubscriptionSuccessPage from '@/pages/SubscriptionSuccessPage';

// Generator pages
import RandomNameGenerator from '@/pages/RandomNameGenerator';
import PodcastNameGenerator from '@/pages/PodcastNameGenerator';
import PetNameGenerator from '@/pages/PetNameGenerator';

// Category pages
import BusinessBrandPage from '@/pages/BusinessBrandPage';
import PersonalSocialPage from '@/pages/PersonalSocialPage';
import WritingCreativePage from '@/pages/WritingCreativePage';
import NicheSpecificPage from '@/pages/NicheSpecificPage';
import TechIndustryPage from '@/pages/TechIndustryPage';
import GeographicalLocalPage from '@/pages/GeographicalLocalPage';
import FantasyGamingPage from '@/pages/FantasyGamingPage';
import SpecialtyFunPage from '@/pages/SpecialtyFunPage';

// New Pages
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import RefundPage from '@/pages/RefundPage';
import '@/App.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/admin-sign-in" element={<AdminSignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/generators" element={<GeneratorsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/checkout/:plan" element={<CheckoutPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />

          {/* Generator pages */}
          <Route path="/generator/random" element={<RandomNameGenerator />} />
          <Route path="/ai-podcast-name-generator" element={<PodcastNameGenerator />} />
          <Route path="/ai-pet-name-generator" element={<PetNameGenerator />} />

          {/* Category pages */}
          <Route path="/business-brand" element={<BusinessBrandPage />} />
          <Route path="/personal-social" element={<PersonalSocialPage />} />
          <Route path="/writing-creative" element={<WritingCreativePage />} />
          <Route path="/niche-specific" element={<NicheSpecificPage />} />
          <Route path="/tech-industry" element={<TechIndustryPage />} />
          <Route path="/geographical-local" element={<GeographicalLocalPage />} />
          <Route path="/fantasy-gaming" element={<FantasyGamingPage />} />
          <Route path="/specialty-fun" element={<SpecialtyFunPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;