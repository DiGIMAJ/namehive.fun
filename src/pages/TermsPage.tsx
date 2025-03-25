
const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose max-w-none">
        <h2>1. Service Usage</h2>
        <p>By using our service, you agree to these terms and conditions. Our name generation service is provided "as is" without warranties.</p>

        <h2>2. User Responsibilities</h2>
        <p>Users are responsible for:</p>
        <ul>
          <li>Complying with applicable laws</li>
          <li>Maintaining account security</li>
          <li>Using the service appropriately</li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <p>Generated names are provided for reference. We do not guarantee trademark availability or rights.</p>
      </div>
    </div>
  );
};

export default TermsPage;
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <div className="prose prose-purple max-w-none">
            <p className="text-lg text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">By accessing and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600">We grant you a limited, non-exclusive, non-transferable license to use our services for personal or commercial purposes in accordance with these terms.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Limitations</h2>
              <p className="text-gray-600">You may not modify, copy, distribute, transmit, display, perform, reproduce, publish, license, transfer, or sell any information obtained from our services.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
