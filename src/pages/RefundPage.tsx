
const RefundPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
      <div className="prose max-w-none">
        <p>We do not provide refunds for our services. All purchases are final.</p>
        
        <h2>Why We Don't Offer Refunds</h2>
        <ul>
          <li>Our services are delivered instantly upon purchase</li>
          <li>Name generation results are unique and non-transferable</li>
          <li>We provide clear service descriptions before purchase</li>
        </ul>

        <p>If you have questions about our services before making a purchase, please contact our support team.</p>
      </div>
    </div>
  );
};

export default RefundPage;
