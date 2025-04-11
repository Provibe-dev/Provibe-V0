import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | ProVibe",
  description: "Privacy Policy for ProVibe - How we collect, use, and protect your data",
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: April 10, 2025</p>

      <div className="prose prose-lg dark:prose-invert">
        <h2>1. Introduction</h2>
        <p>
          Welcome to ProVibe ("we," "our," or "us"). We are committed to protecting your privacy and handling your data
          with transparency and care. This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you use our website and services.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>2.1 Information You Provide to Us</h3>
        <p>We may collect information that you provide directly to us, including:</p>
        <ul>
          <li>Account information (name, email address, password)</li>
          <li>Profile information (job title, company, profile picture)</li>
          <li>Content you create, upload, or generate using our services</li>
          <li>Communications you send to us</li>
          <li>Payment and billing information</li>
        </ul>

        <h3>2.2 Information We Collect Automatically</h3>
        <p>When you use our services, we may automatically collect certain information, including:</p>
        <ul>
          <li>Usage data (features used, time spent, interactions)</li>
          <li>Device information (IP address, browser type, operating system)</li>
          <li>Log data (access times, pages viewed, referring websites)</li>
          <li>Cookies and similar technologies</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect for various purposes, including to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and manage your account</li>
          <li>Send you technical notices, updates, and administrative messages</li>
          <li>Respond to your comments, questions, and customer service requests</li>
          <li>Communicate with you about products, services, and events</li>
          <li>Monitor and analyze trends, usage, and activities</li>
          <li>Detect, prevent, and address technical issues and fraudulent activities</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. How We Share Your Information</h2>
        <p>We may share your information in the following circumstances:</p>
        <ul>
          <li>With service providers who perform services on our behalf</li>
          <li>With business partners with your consent</li>
          <li>In connection with a business transaction (merger, acquisition, sale)</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights, privacy, safety, or property</li>
          <li>With your consent or at your direction</li>
        </ul>

        <h2>5. Your Rights and Choices</h2>
        <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
        <ul>
          <li>Access to your personal information</li>
          <li>Correction of inaccurate or incomplete information</li>
          <li>Deletion of your personal information</li>
          <li>Restriction or objection to processing</li>
          <li>Data portability</li>
          <li>Withdrawal of consent</li>
        </ul>
        <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section.</p>

        <h2>6. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against
          unauthorized access, accidental loss, alteration, or destruction. However, no method of transmission over the
          Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy
          Policy, unless a longer retention period is required or permitted by law.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our services are not directed to children under the age of 13, and we do not knowingly collect personal
          information from children under 13. If we learn that we have collected personal information from a child under
          13, we will promptly delete that information.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to, and processed in, countries other than the country in which you
          reside. These countries may have data protection laws that are different from the laws of your country. We
          have implemented appropriate safeguards to protect your personal information when transferred internationally.
        </p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email
          or by posting a notice on our website prior to the change becoming effective. We encourage you to review this
          Privacy Policy periodically.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices,
          please contact us at:
        </p>
        <p>
          Email: privacy@provibe.com
          <br />
          Address: 123 ProVibe Way, San Francisco, CA 94103, USA
        </p>

        <h2>12. Additional Information for Specific Jurisdictions</h2>

        <h3>12.1 California Privacy Rights</h3>
        <p>
          If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA)
          and the California Privacy Rights Act (CPRA). These include the right to know what personal information we
          collect, the right to delete your personal information, the right to opt-out of the sale of your personal
          information, and the right to non-discrimination for exercising your privacy rights.
        </p>

        <h3>12.2 European Economic Area, United Kingdom, and Switzerland</h3>
        <p>
          If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, we process your
          personal information in accordance with the General Data Protection Regulation (GDPR) or equivalent local
          laws. The legal bases for processing your information include consent, contractual necessity, and our
          legitimate interests.
        </p>

        <div className="mt-8 border-t pt-8">
          <p>By using our services, you acknowledge that you have read and understood this Privacy Policy.</p>
          <p className="mt-4">
            <Link href="/" className="text-emerald-500 hover:text-emerald-600">
              Return to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
