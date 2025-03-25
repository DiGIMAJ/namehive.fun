
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
