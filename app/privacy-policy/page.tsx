import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export default function PrivacyPolicy() {
  return (
   <>
   <Header/>
   <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Privacy Policy</h1>
      
      <div className="space-y-8">
        <p className="text-gray-700">
          Shinghai is committed to ensuring that your personal information is used properly and is kept securely. This Privacy Policy explains how we will collect and use your personal information through a website [www.shinghai.pk]. Please read our Privacy Policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your personal information. We will not sell or redistribute your information to anyone.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-4">What personal information do we collect from the people that visit our website?</h2>
          <p className="text-gray-700">
            When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, contact number, mailing address, credit card information or other details to help you with your experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">When do we collect information</h2>
          <p className="text-gray-700">
            We collect information from you when you register on our site, place an order, subscribe to updates, leave a message on Customer Service, or enter information on our site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Use and storage of your personal information</h2>
          <p className="text-gray-700">
            We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in the following ways:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700">
            <li>To be able to contact you in the event of any problem with the delivery of your items</li>
            <li>To process orders and to send information and updates pertaining to orders</li>
            <li>To be able to send text message notifications of delivery status</li>
            <li>To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested</li>
            <li>To allow us to better service you in responding to your customer service requests</li>
            <li>To quickly process your transactions</li>
            <li>To ask for ratings and reviews of services or products</li>
          </ul>
          <p className="text-gray-700 mt-4">
            We will only keep your information for as long as necessary to carry out our services to you or for as long as we are required by law. After this your personal information will be deleted. Rest assured, your personal information is protected by an additional security layer called SSL which ensures your sensitive information is transmitted securely through an encrypted link.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">COOKIES</h2>
          <p className="text-gray-700">
            We also use non-personal data such as third-party cookies to collect statistics to enhance and simplify your visit. A cookie is a piece of information that is held on the hard drive of your computer which records how you have used a website. Cookies make it easier for you to log on and use the Website during future visits.
          </p>
          <p className="text-gray-700 mt-4">
            The permanent cookies are stored on your computer or mobile device for no longer than 24 months. You can easily erase cookies from your computer or mobile device using your browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">YOUR RIGHTS</h2>
          <p className="text-gray-700">
            You have the right to request information about the personal data we hold on you. If your data is incorrect, incomplete or irrelevant, you can ask to have the information corrected or removed.
          </p>
        </section>
      </div>
    </div>
   <Footer/>
   </>
  )
} 