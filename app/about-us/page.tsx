import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export default function AboutUs() {
  return (
   <>
   <Header />
   <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-center mb-8">About Us</h1>
      
      <div className="space-y-6">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed">
            Shinghai (Maypole Pvt. Ltd) is a renowned Pakistan fashion brand founded in 2010 offering high-quality trending products at affordable prices on an almost daily basis!
          </p>

          <p className="text-gray-700 leading-relaxed">
            The Eastern and Western apparel, accessories and fragrances for Women, Men and Girls are available in our 85 stores across Pakistan and online.
          </p>
        </div>

        {/* Additional sections can be added here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
            <p className="text-gray-700">
              To provide high-quality fashion at affordable prices while maintaining the highest standards of customer service.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
            <p className="text-gray-700">
              To be Pakistan's leading fashion retailer, setting trends and making fashion accessible to everyone.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Our Values</h3>
            <p className="text-gray-700">
              Quality, affordability, and customer satisfaction are at the heart of everything we do.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#101b2f] mb-2">85+</div>
            <div className="text-gray-600">Retail Stores</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#101b2f] mb-2">2010</div>
            <div className="text-gray-600">Founded</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#101b2f] mb-2">1M+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#101b2f] mb-2">5000+</div>
            <div className="text-gray-600">Products</div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 p-8 rounded-lg mt-12">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-700 mb-4">
            We'd love to hear from you. Contact us for any queries or feedback.
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              <strong>Email:</strong> info@shinghai.pk
            </p>
            <p className="text-gray-700">
              <strong>Customer Service:</strong> +92 XXX XXXXXXX
            </p>
            <p className="text-gray-700">
              <strong>Hours:</strong> Monday - Sunday, 9:00 AM - 10:00 PM (PKT)
            </p>
          </div>
        </div>
      </div>
    </div>
   <Footer />
   </>
  )
} 