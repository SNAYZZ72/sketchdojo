import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SketchDojo | Terms of Service",
  description: "Terms of Service for SketchDojo",
};

export default function TermsOfService() {
  return (
    <div>
      <h1>Terms of Service</h1>
      <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      
      <section className="mt-8">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using SketchDojo (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>2. Description of Service</h2>
        <p>
          SketchDojo is an AI-powered illustration creation platform that allows users to generate, edit, and manage digital artwork through our web interface.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>3. User Accounts</h2>
        <p>
          To access certain features of the Service, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>
        <p className="mt-3">
          You agree to provide accurate and complete information when creating your account and to update your information to keep it accurate and current. We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, incomplete, or outdated.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>4. User Content</h2>
        <p>
          You retain all rights to any content you submit, upload, or display on or through the Service (&quot;User Content&quot;). By submitting User Content to the Service, you grant SketchDojo a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, translate, and distribute your User Content for the purpose of operating and improving the Service.
        </p>
        <p className="mt-3">
          You represent and warrant that:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>You own or have the necessary licenses, rights, consents, and permissions to use and authorize SketchDojo to use all intellectual property and User Content;</li>
          <li>Your User Content does not violate the rights of any third party, including copyright, trademark, privacy, personality, or other personal or proprietary rights;</li>
          <li>Your User Content does not contain material that is discriminatory, defamatory, libelous, pornographic, obscene, or otherwise objectionable.</li>
        </ul>
      </section>
      
      <section className="mt-6">
        <h2>5. Prohibited Uses</h2>
        <p>
          You agree not to use the Service:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>For any unlawful purpose or to violate any laws;</li>
          <li>To impersonate any person or entity;</li>
          <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others;</li>
          <li>To generate content that is discriminatory, defamatory, pornographic, or otherwise harmful;</li>
          <li>To harass, abuse, or harm another person;</li>
          <li>To upload or transmit viruses or any other type of malicious code;</li>
          <li>To interfere with or circumvent the security features of the Service;</li>
          <li>To engage in automated use of the system, such as using scripts to send comments or messages.</li>
        </ul>
      </section>
      
      <section className="mt-6">
        <h2>6. Intellectual Property</h2>
        <p>
          The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of SketchDojo and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
        </p>
        <p className="mt-3">
          Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of SketchDojo.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>7. Billing and Subscription</h2>
        <p>
          Some features of the Service require payment of fees. You agree to pay all fees associated with the Service that you purchase, and authorize us to charge your chosen payment provider for any paid features that you purchase.
        </p>
        <p className="mt-3">
          Subscriptions automatically renew until canceled. You may cancel your subscription at any time from your account settings.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>8. Termination</h2>
        <p>
          We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including, without limitation, if you breach the Terms.
        </p>
        <p className="mt-3">
          Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>9. Limitation of Liability</h2>
        <p>
          In no event shall SketchDojo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Your access to or use of or inability to access or use the Service;</li>
          <li>Any conduct or content of any third party on the Service;</li>
          <li>Any content obtained from the Service;</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content.</li>
        </ul>
      </section>
      
      <section className="mt-6">
        <h2>10. Disclaimer</h2>
        <p>
          Your use of the Service is at your sole risk. The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. The Service is provided without warranties of any kind, whether express or implied.
        </p>
        <p className="mt-3">
          SketchDojo, its subsidiaries, affiliates, and licensors do not warrant that:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>The Service will function uninterrupted, secure, or available at any particular time or location;</li>
          <li>Any errors or defects will be corrected;</li>
          <li>The Service is free of viruses or other harmful components;</li>
          <li>The results of using the Service will meet your requirements.</li>
        </ul>
      </section>
      
      <section className="mt-6">
        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
        </p>
        <p className="mt-3">
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>12. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice prior to any new terms taking effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>13. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mt-2 font-medium">
          support@sketchdojo.com
        </p>
      </section>
    </div>
  );
} 