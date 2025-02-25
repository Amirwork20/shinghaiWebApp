import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export default function ShippingHandling() {
  return (
    <>
    <Header />
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Shipping & Handling</h1>
      
      <div className="space-y-8">
        {/* Delivery within Pakistan Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Delivery within Pakistan</h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              All orders within Pakistan are routed through TCS, Leopards, Call Courier and many others courier services. All our domestic clients will be provided with a tracking ID when the order is dispatched.
            </p>

            <p className="text-gray-700">
              Upon placing an order, you will receive a verification call or SMS from our Customer Service to confirm the order. If you fail to verify, your order will be automatically cancelled after 3 days (only applicable to purchases made through Cash on Delivery method). Once the order is verified, it will be dispatched within 1-2 working days and will be delivered to you within 4-5 working days.
            </p>

            <p className="text-gray-700 font-medium">
              We offer free delivery on orders above Rs.4999 within Pakistan.
            </p>
          </div>
        </section>

        {/* International Orders Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">International orders</h2>
          
          <div className="space-y-4">
            <p className="text-gray-700">
              All our international clients will be provided with a tracking ID when the order is dispatched.
            </p>

            <p className="text-gray-700">
              International clients shall also receive a sales invoice via email and notification of shipment via email. The customer shall bear any additional charges for custom clearance or any other variation in price beyond our control.
            </p>
          </div>
        </section>
      </div>
    </div>
    <Footer />
    </>
  )
} 