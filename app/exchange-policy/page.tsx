import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export default function ExchangePolicy() {
  return (
   <>
   <Header />
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Returns & Exchange Guidelines</h1>
      
      <div className="space-y-6">
        <p className="text-gray-700">
          Products bought from our website can be exchanged at any of our physical locations or through courier service by contacting our support team.
        </p>

        <p className="text-gray-700">
          We offer product exchanges to our valued customers under the following conditions:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Exchange requests must be initiated within 7 business days of receiving your order</li>
          <li>A valid reason for exchange must be provided when submitting the request</li>
          <li>Products must be returned in their original packaging with tags attached</li>
          <li>The original purchase receipt must accompany the returned item</li>
          <li>The product must be unworn, unwashed, and free from any scents or stains</li>
        </ul>

        <p className="text-gray-700">
          Please note that discounted items are not eligible for exchange. Regular-priced items that go on sale will be exchanged at the sale price.
        </p>

        <p className="text-gray-700">
          We reserve the right to evaluate and make final decisions on all exchange requests.
        </p>

        <p className="text-gray-700">
          Our customer service team will contact you once your exchange request has been reviewed.
        </p>

        <p className="text-gray-700">
          These exchange terms apply only to domestic orders within Pakistan.
        </p>

        <div className="py-4">
          <h2 className="text-xl font-semibold mb-4">No Cash Refund Policy</h2>
          <p className="text-gray-700">
            We maintain a strict no-refund policy. Once an order is placed and delivered, or payment processed, only exchanges are possible according to our guidelines.
          </p>
        </div>

        <div className="py-4">
          <h2 className="text-xl font-semibold mb-4">Quality Issues & Complaints</h2>
          <p className="text-gray-700">
            We accept exchanges for manufacturing defects, incorrect sizes, or wrong items shipped. Such issues must be reported within 48 hours of delivery, accompanied by the original invoice.
          </p>
          <p className="text-gray-700 mt-2">
            Quality-related claims typically require 7 days for processing.
          </p>
        </div>

        <div className="py-4">
          <p className="text-gray-700 font-semibold">
            In-store purchases must be exchanged at our physical locations only - courier returns are not accepted.
          </p>
          <p className="text-gray-700">
            Visit any of our retail stores for in-store exchanges. <a href="/store-locations" className="text-blue-600 hover:underline">Find Our Stores</a>
          </p>
        </div>

        <div className="py-4">
          <h2 className="text-xl font-semibold mb-4">Global Shipping Policy</h2>
          <p className="text-gray-700">
            At present, we do not offer exchanges or returns for international shipments.
          </p>
          <p className="text-gray-700 mt-2">
            For international orders with quality issues or incorrect items, we may offer store credit, special discounts, or refunds. We recommend documenting the package condition before and after opening.
          </p>
          <p className="text-gray-700 mt-2">
            International customers must report any issues within 7 days of delivery. Claims made after this period cannot be processed.
          </p>
        </div>

        <p className="text-gray-700">
          We are not responsible for providing refunds or compensation if delivery is refused at the time of arrival.
        </p>

        <p className="text-gray-700">
          We carefully review all claims and maintain the right to deny compensation in cases of suspected misuse.
        </p>
      </div>
    </div>
    <Footer />
   </>
  )
} 