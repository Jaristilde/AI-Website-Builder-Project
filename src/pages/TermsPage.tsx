import React from 'react';
import { Header } from '../components/Header';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-black text-zinc-900 mb-2">Terms of Service</h1>
        <p className="text-zinc-400 text-sm mb-12">Last updated: March 4, 2026</p>

        <div className="prose prose-zinc max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-zinc-600 leading-relaxed">
              By accessing or using my1stwebsite ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. We reserve the right to update these terms at any time, and continued use of the Service constitutes acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">2. Description of Service</h2>
            <p className="text-zinc-600 leading-relaxed">
              my1stwebsite is an AI-powered website builder that allows users to create, manage, and publish business websites. The Service includes website generation, hosting, domain management, and related tools provided through our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">3. Account Responsibilities</h2>
            <p className="text-zinc-600 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">4. Acceptable Use</h2>
            <p className="text-zinc-600 leading-relaxed mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 text-zinc-600 space-y-2">
              <li>Create websites that contain illegal, harmful, threatening, abusive, or otherwise objectionable content</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Distribute malware, spam, or engage in phishing activities</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Use the Service for any purpose that violates applicable laws or regulations</li>
              <li>Resell or redistribute the Service without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">5. Intellectual Property</h2>
            <p className="text-zinc-600 leading-relaxed mb-3">
              <strong>Your Content:</strong> You retain all ownership rights to the content you create and upload through the Service, including text, images, and business information. By using the Service, you grant us a limited license to host and display your content as necessary to provide the Service.
            </p>
            <p className="text-zinc-600 leading-relaxed">
              <strong>Our Platform:</strong> The Service, including its design, code, AI models, templates, and all related technology, is owned by my1stwebsite and protected by intellectual property laws. You may not copy, modify, or reverse-engineer any part of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">6. Payment and Billing</h2>
            <p className="text-zinc-600 leading-relaxed">
              Paid plans are billed monthly. You may cancel your subscription at any time, and cancellation takes effect at the end of the current billing period. We do not offer prorated refunds for partial months. Prices are subject to change with 30 days' notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">7. Limitation of Liability</h2>
            <p className="text-zinc-600 leading-relaxed">
              The Service is provided "as is" without warranties of any kind, express or implied. To the maximum extent permitted by law, my1stwebsite shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">8. Termination</h2>
            <p className="text-zinc-600 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion. You may delete your account at any time. Upon termination, your right to use the Service ceases immediately, and we may delete your data after a reasonable retention period.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">9. Dispute Resolution</h2>
            <p className="text-zinc-600 leading-relaxed">
              Any disputes arising from these Terms or your use of the Service shall first be attempted to be resolved through informal negotiation. If a resolution cannot be reached, disputes shall be settled through binding arbitration in accordance with the rules of the American Arbitration Association. You agree to waive any right to participate in a class action lawsuit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">10. Governing Law</h2>
            <p className="text-zinc-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">11. Contact</h2>
            <p className="text-zinc-600 leading-relaxed">
              If you have questions about these Terms of Service, please contact us at <a href="mailto:support@my1stwebsite.com" className="text-purple-600 font-bold hover:underline">support@my1stwebsite.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200">
          <Link to="/privacy" className="text-purple-600 font-bold hover:underline text-sm">
            Read our Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
};

export default TermsPage;
