import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";

export default function TermsOfUse() {
  return (
   <>
   <Header/>
   <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Terms of Use</h1>
      
      <div className="space-y-6 text-gray-700">
        <section className="space-y-4">
          <p>
            This website is operated by SHINGHAI. Throughout the site, the terms "we", "us" and "our" refer to SHINGHAI. SHINGHAI offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
          </p>
          
          <p>
            By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Use", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Use apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
          </p>

          <p>
            Please read these Terms of Use carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Use. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
          </p>

          <p>
            Any new features or tools which are added to the current store shall also be subject to the Terms of Use. You can review the most current version of the Terms of Use at any time on this page. We reserve the right to update, change or replace any part of these Terms of Use by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">USE OF THE SITE</h2>
          <div className="space-y-4">
            <p>
              All billing and registration information provided must be truthful and accurate. Providing any untruthful or inaccurate information constitutes a breach of these Terms. By confirming your purchase at the end of the checkout process, you agree to accept and pay for the item(s) requested.
            </p>
            <p>
              You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
            <p>
              We reserve the right to refuse service to anyone at any time.
            </p>
            <p>
              You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">MODIFICATIONS TO THE SERVICE AND PRICES</h2>
          <div className="space-y-4">
            <p>
              Prices for our products are subject to change without notice.
            </p>
            <p>
              We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
            </p>
            <p>
              We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">PRODUCTS OR SERVICES</h2>
          <div className="space-y-4">
            <p>
              Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to our Exchange Policy.
            </p>
            <p>
              We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.
            </p>
            <p>
              We reserve the right to limit the sales of our products or services to any person, geographic region or jurisdiction.
            </p>
          </div>
        </section>

        {/* Additional sections continue with the same pattern */}
        <section>
          <h2 className="text-xl font-semibold mb-4">GOVERNING LAW</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Islamic Republic of Pakistan.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">CHANGES TO TERMS OF SERVICE</h2>
          <div className="space-y-4">
            <p>
              You can review the most current version of the Terms of Use at any time at this page.
            </p>
            <p>
              We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Use by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Use constitutes acceptance of those changes.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">CONTACT INFORMATION</h2>
          <p>
            Questions about the Terms of Service should be sent to us at online@shinghai.pk
          </p>
        </section>
      </div>
    </div>
   <Footer/>
   </>
  )
} 