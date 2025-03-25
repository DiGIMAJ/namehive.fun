
const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose max-w-none">
        <h2>1. Data Collection and Usage</h2>
        <p>We collect and process your data in accordance with GDPR and CCPA requirements. This includes:</p>
        <ul>
          <li>Information you provide (email, name)</li>
          <li>Usage data and analytics</li>
          <li>Cookies and tracking technologies</li>
        </ul>

        <h2>2. Your Rights</h2>
        <p>Under GDPR and CCPA, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request data deletion</li>
          <li>Opt-out of data collection</li>
          <li>Data portability</li>
        </ul>

        <h2>3. Data Protection</h2>
        <p>We implement appropriate technical and organizational measures to ensure data security.</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
