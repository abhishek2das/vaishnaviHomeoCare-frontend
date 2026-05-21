import PageHero from '../components/common/PageHero'

export default function PrivacyPolicy() {
  return (
    <div>
      <PageHero
        title="Privacy Policy"
        subtitle="Learn how we collect, use, protect, and manage your personal information while using our website."
        breadcrumbs={[{ label: 'Privacy Policy' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="prose prose-neutral">
            <h2>Introduction</h2>
            <p>
              At Vaishnavi Homeo Care, your privacy is very important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Information We Collect</h2>
            <p>We may collect the following personal information when you interact with our site:</p>
            <ul>
              <li>Contact details such as name, email address and phone number.</li>
              <li>Appointment and inquiry details submitted through forms.</li>
              <li>Usage data including pages visited, clicks, and session duration.</li>
              <li>Technical data such as browser type, IP address, and device information.</li>
            </ul>
          </div>

          <div className="prose prose-neutral">
            <h2>How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Respond to your inquiries and appointment requests.</li>
              <li>Manage your consultation or booking preferences.</li>
              <li>Improve our website, services, and user experience.</li>
              <li>Send administrative updates and service-related notifications.</li>
            </ul>
          </div>

          <div className="prose prose-neutral">
            <h2>Data Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your information with:</p>
            <ul>
              <li>Trusted service providers that help us operate the website.</li>
              <li>Healthcare professionals and clinic staff when required to process appointments.</li>
              <li>Authorities when required by law or to protect our legal rights.</li>
            </ul>
          </div>

          <div className="prose prose-neutral">
            <h2>Security</h2>
            <p>
              We implement administrative, physical, and technical safeguards to help protect your information. While we strive to keep your data secure, no internet transmission or storage method is completely secure.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Your Rights</h2>
            <p>You may have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate or incomplete information.</li>
              <li>Request deletion of your personal information where permitted by law.</li>
            </ul>
          </div>

          <div className="prose prose-neutral">
            <h2>Changes to this Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make significant changes, we will notify you by posting the revised policy on our website.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:dr.prachijha15@gmail.com" className="text-teal-600 hover:text-teal-800">dr.prachijha15@gmail.com</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
