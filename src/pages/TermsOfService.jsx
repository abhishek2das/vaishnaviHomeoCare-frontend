import PageHero from '../components/common/PageHero'

export default function TermsOfService() {
  return (
    <div>
      <PageHero
        title="Terms of Service"
        subtitle="Read the terms and conditions that govern your use of our website and services."
        breadcrumbs={[{ label: 'Terms of Service' }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 space-y-10">
          <div className="prose prose-neutral">
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing or using the Vaishnavi Homeo Care website, you agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use the website.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Use of the Website</h2>
            <p>
              You may use the website for lawful purposes only. You agree not to misuse the website, submit false information, or engage in any activity that interferes with the operation of the website.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Appointments and Consultations</h2>
            <p>
              Appointment requests submitted through the website are subject to availability and confirmation by our clinic staff. All bookings are subject to our appointment policies and fees, as communicated to you during the booking process.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Intellectual Property</h2>
            <p>
              All content on this website, including text, images, logos, and design, is the property of Vaishnavi Homeo Care or its content partners. You may not reproduce or reuse the content without written permission.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, we are not liable for any indirect, incidental, special, or consequential damages arising from your use of the website or any services offered through the website.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Third-Party Links</h2>
            <p>
              Our website may include links to third-party websites. We are not responsible for the content, privacy practices, or accuracy of any third-party sites.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Modifications</h2>
            <p>
              We may change these Terms of Service at any time. Continued use of the website after updates means you accept the revised terms.
            </p>
          </div>

          <div className="prose prose-neutral">
            <h2>Governing Law</h2>
            <p>
              These terms are governed by the laws of India. Any disputes arising from the use of this website will be subject to the jurisdiction of the courts in New Delhi.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
