import React from 'react';
import { Header } from '../components/Header';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-black text-zinc-900 mb-2">Privacy Policy</h1>
        <p className="text-zinc-400 text-sm mb-12">Last updated: March 4, 2026</p>

        <div className="prose prose-zinc max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">1. Information We Collect</h2>
            <p className="text-zinc-600 leading-relaxed mb-3">We collect the following types of information:</p>
            <ul className="list-disc pl-6 text-zinc-600 space-y-2">
              <li><strong>Account Information:</strong> Email address and password when you create an account</li>
              <li><strong>Business Information:</strong> Business name, type, services, contact details, and other information you provide when building your website</li>
              <li><strong>Usage Data:</strong> How you interact with the Service, including pages visited, features used, and timestamps</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and IP address</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-zinc-600 space-y-2">
              <li>To provide, maintain, and improve the Service</li>
              <li>To generate and host your website</li>
              <li>To communicate with you about your account and updates to the Service</li>
              <li>To provide customer support</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">3. Third-Party Services</h2>
            <p className="text-zinc-600 leading-relaxed mb-3">We use the following third-party services that may process your data:</p>
            <ul className="list-disc pl-6 text-zinc-600 space-y-2">
              <li><strong>Firebase (Google):</strong> Authentication, database, and hosting services. Subject to <a href="https://policies.google.com/privacy" className="text-purple-600 hover:underline" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a></li>
              <li><strong>Google AI (Gemini):</strong> AI-powered website generation. Your business information is sent to Google's AI services to generate website content</li>
              <li><strong>Payment Processors:</strong> If you subscribe to a paid plan, your payment information is handled by our payment processor and is not stored on our servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">4. Data Retention</h2>
            <p className="text-zinc-600 leading-relaxed">
              We retain your account and website data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes. Anonymized, aggregated data may be retained indefinitely for analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">5. Your Rights</h2>
            <p className="text-zinc-600 leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 text-zinc-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate personal data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data and account</li>
              <li><strong>Export:</strong> Request a machine-readable export of your data</li>
              <li><strong>Opt-out:</strong> Opt out of marketing communications at any time</li>
            </ul>
            <p className="text-zinc-600 leading-relaxed mt-3">
              To exercise any of these rights, contact us at <a href="mailto:support@my1stwebsite.com" className="text-purple-600 font-bold hover:underline">support@my1stwebsite.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">6. Cookies</h2>
            <p className="text-zinc-600 leading-relaxed">
              We use essential cookies required for authentication and Service functionality. We do not use tracking or advertising cookies. Firebase may set cookies as part of its authentication service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">7. Data Security</h2>
            <p className="text-zinc-600 leading-relaxed">
              We implement industry-standard security measures to protect your data, including encryption in transit (HTTPS) and at rest. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">8. Children's Privacy</h2>
            <p className="text-zinc-600 leading-relaxed">
              The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected data from a child under 13, we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">9. Changes to This Policy</h2>
            <p className="text-zinc-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through a notice on the Service. Continued use of the Service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 mb-3">10. Contact</h2>
            <p className="text-zinc-600 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:support@my1stwebsite.com" className="text-purple-600 font-bold hover:underline">support@my1stwebsite.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200">
          <Link to="/terms" className="text-purple-600 font-bold hover:underline text-sm">
            Read our Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
