import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          <div className="prose prose-purple max-w-none">
            <p className="text-lg text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Eligibility</h2>
              <p className="text-gray-600">We offer refunds within 30 days of purchase if you are not satisfied with our service. To request a refund, please contact our support team.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refund Process</h2>
              <p className="text-gray-600">Once approved, refunds will be processed within 5-7 business days. The refund will be issued to the original payment method used for the purchase.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}