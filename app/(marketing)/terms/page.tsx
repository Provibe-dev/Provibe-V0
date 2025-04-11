import Link from "next/link"

export const metadata = {
  title: "Terms of Use | ProVibe",
  description: "Terms of Use for ProVibe - The rules and guidelines for using our services",
}

export default function TermsOfUse() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: April 10, 2025</p>

      <div className="prose prose-lg dark:prose-invert">
        <h2>1. Acceptance of Terms</h2>
        <p>
          Welcome to ProVibe. These Terms of Use ("Terms") govern your access to and use of the ProVibe website,
          applications, and services (collectively, the "Services"). By accessing or using the Services, you agree to be
          bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
        </p>

        <h2>2. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. If we make material changes, we will notify you by email or by posting
          a notice on our website prior to the changes becoming effective. Your continued use of the Services after the
          effective date of the revised Terms constitutes your acceptance of the changes.
        </p>

        <h2>3. Account Registration and Security</h2>
        <p>To access certain features of the Services, you may need to create an account. You are responsible for:</p>
        <ul>
          <li>Providing accurate and complete information during registration</li>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized use of your account</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate your account if any information provided is inaccurate, false, or
          no longer valid.
        </p>

        <h2>4. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe the rights of others, including intellectual property rights</li>
          <li>Use the Services to transmit harmful code or malware</li>
          <li>Interfere with or disrupt the Services or servers connected to the Services</li>
          <li>Attempt to gain unauthorized access to any part of the Services</li>
          <li>Use the Services for any illegal or unauthorized purpose</li>
          <li>Harass, abuse, or harm another person</li>
          <li>Collect or store personal data about other users without their consent</li>
        </ul>

        <h2>5. User Content</h2>
        <p>
          The Services may allow you to create, upload, post, send, receive, and store content ("User Content"). You
          retain all rights in your User Content, and you grant us a non-exclusive, royalty-free, worldwide,
          sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, create
          derivative works from, distribute, and display your User Content in connection with operating and providing
          the Services.
        </p>
        <p>
          You are solely responsible for your User Content and represent that you have all necessary rights to grant us
          the license above. You agree not to create, upload, or share User Content that:
        </p>
        <ul>
          <li>Violates these Terms</li>
          <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, or invasive of privacy</li>
          <li>Infringes any intellectual property or other rights of any party</li>
          <li>
            Contains software viruses or any other code designed to interrupt, destroy, or limit the functionality of
            any computer software or hardware
          </li>
        </ul>
        <p>We reserve the right to remove any User Content that violates these Terms or that we find objectionable.</p>

        <h2>6. Intellectual Property Rights</h2>
        <p>
          The Services and their contents, features, and functionality are owned by ProVibe, its licensors, or other
          providers and are protected by copyright, trademark, patent, and other intellectual property laws. You may not
          use, reproduce, distribute, modify, create derivative works of, publicly display, or exploit the Services or
          any content in any way not expressly authorized by these Terms.
        </p>

        <h2>7. Third-Party Links and Services</h2>
        <p>
          The Services may contain links to third-party websites or services that are not owned or controlled by
          ProVibe. We have no control over, and assume no responsibility for, the content, privacy policies, or
          practices of any third-party websites or services. You acknowledge and agree that ProVibe shall not be
          responsible or liable for any damage or loss caused by your use of any such websites or services.
        </p>

        <h2>8. Subscription and Payments</h2>
        <p>
          Some aspects of the Services may be available only with a paid subscription. You agree to pay all fees and
          charges associated with your account on a timely basis and in accordance with the pricing and payment terms
          presented to you. All payments are non-refundable except as expressly set forth in these Terms or as required
          by applicable law.
        </p>

        <h2>9. Termination</h2>
        <p>
          We may terminate or suspend your access to the Services immediately, without prior notice or liability, for
          any reason, including if you breach these Terms. Upon termination, your right to use the Services will
          immediately cease. All provisions of these Terms that by their nature should survive termination shall
          survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
        </p>

        <h2>10. Disclaimer of Warranties</h2>
        <p>
          THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
          IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT
          DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR
          OTHER HARMFUL COMPONENTS.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PROVIBE, ITS AFFILIATES, DIRECTORS,
          EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          EXEMPLARY DAMAGES, INCLUDING DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES,
          ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE SERVICES.
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to defend, indemnify, and hold harmless ProVibe, its affiliates, licensors, and service providers,
          and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers,
          successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs,
          expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these
          Terms or your use of the Services.
        </p>

        <h2>13. Governing Law and Jurisdiction</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the State of California, without
          regard to its conflict of law provisions. Any legal action or proceeding arising out of or relating to these
          Terms or your use of the Services shall be brought exclusively in the federal or state courts located in San
          Francisco County, California, and you consent to the personal jurisdiction of such courts.
        </p>

        <h2>14. Severability</h2>
        <p>
          If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining provisions
          shall continue in full force and effect.
        </p>

        <h2>15. Entire Agreement</h2>
        <p>
          These Terms, together with our Privacy Policy and any other agreements expressly incorporated by reference
          herein, constitute the entire agreement between you and ProVibe concerning the Services.
        </p>

        <h2>16. Contact Information</h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <p>
          Email: legal@provibe.com
          <br />
          Address: 123 ProVibe Way, San Francisco, CA 94103, USA
        </p>

        <div className="mt-8 border-t pt-8">
          <p>By using our services, you acknowledge that you have read and understood these Terms of Use.</p>
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
