export default function OrderCancellationPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Order Cancellation Policy</h1>
      
      <div className="space-y-6">
        <p className="text-gray-700">
          You can cancel your order at any time before the order has been processed. Once the product has been shipped, You will receive the tracking information, and our "Exchange Policy" will apply. Instead of refunding, we will provide the customer with a credit note or a discount code.
        </p>

        <p className="text-gray-700">
          SHINGHAI may cancel orders for any reason. Common reasons include:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>The item is out of stock</li>
          <li>The issuing financial institution declines</li>
          <li>Price errors</li>
          <li>The credit card payment</li>
        </ul>
      </div>
    </div>
  )
} 