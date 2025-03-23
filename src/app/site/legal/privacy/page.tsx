import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SketchDojo | Privacy Policy",
  description: "Privacy Policy for SketchDojo",
};

export default function PrivacyPolicy() {
  return (
    <div>
      <h1>Privacy Policy</h1>
      <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      
      <section className="mt-8">
        <h2>1. Introduction</h2>
        <p>
          At SketchDojo, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, and share information about you when you use our website and services.
        </p>
        <p className="mt-3">
          By using SketchDojo, you consent to the data practices described in this policy. Please read this policy carefully to understand our practices regarding your personal data.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>2. Information We Collect</h2>
        <h3 className="text-lg font-medium mt-4">2.1 Information You Provide to Us</h3>
        <p>
          We collect information you provide directly to us when you:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Create an account (name, email address, password)</li>
          <li>Complete your profile (profile picture, bio, social media handles)</li>
          <li>Use our services (prompts, generated content, saved projects)</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact our support team</li>
          <li>Respond to surveys or promotions</li>
          <li>Make payments (billing information, payment method details)</li>
        </ul>
        
        <h3 className="text-lg font-medium mt-4">2.2 Information We Collect Automatically</h3>
        <p>
          When you use our services, we automatically collect certain information, including:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Device information (IP address, browser type, operating system)</li>
          <li>Usage information (pages visited, features used, actions taken)</li>
          <li>Time spent on the platform</li>
          <li>Referring websites</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>
      
      <section className="mt-6">
        <h2>3. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Provide, maintain, and improve our services</li>
          <li>Process and complete transactions</li>
          <li>Send you technical notices, updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Communicate with you about products, services, offers, promotions, and events</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
          <li>Personalize and improve your experience</li>
          <li>Train and improve our AI models (with your consent)</li>
        </ul>
      </section>
      
      <section className="mt-6">
        <h2>4. Sharing of Information</h2>
        <p>
          We may share your information with:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Service Providers:</strong> Third-party vendors who provide services on our behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.</li>
          <li><strong>Business Partners:</strong> With your consent, we may share your information with business partners to offer certain products, services, or promotions.</li>
          <li><strong>Legal Requirements:</strong> When required by law or to protect our rights, property, or safety, or the rights, property, or safety of others.</li>
          <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</li>
          <li><strong>With Your Consent:</strong> We may share information with third parties when you consent to such sharing.</li>
        </ul>
        <p className="mt-3">
          We will never sell your personal information to third parties for their own marketing purposes.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>5. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to provide the services you have requested, or for other essential purposes such as complying with our legal obligations, resolving disputes, and enforcing our agreements.
        </p>
        <p className="mt-3">
          You can request deletion of your account and associated data at any time through your account settings or by contacting our support team.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>6. Your Rights and Choices</h2>
        <p>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
          <li><strong>Correction:</strong> You can ask us to correct inaccurate or incomplete information.</li>
          <li><strong>Deletion:</strong> You can ask us to delete your personal information in certain circumstances.</li>
          <li><strong>Restriction:</strong> You can ask us to restrict the processing of your information in certain circumstances.</li>
          <li><strong>Data Portability:</strong> You can request a copy of your information in a structured, commonly used, and machine-readable format.</li>
          <li><strong>Objection:</strong> You can object to our processing of your information in certain circumstances.</li>
        </ul>
        <p className="mt-3">
          To exercise these rights, please contact us using the details provided in the "Contact Us" section.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>7. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
        </p>
        <p className="mt-3">
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
        </p>
        <p className="mt-3">
          For more information about cookies and how we use them, please see our Cookie Policy.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>8. Data Security</h2>
        <p>
          We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
        </p>
        <p className="mt-3">
          Your account information is protected by a password. It is important that you protect against unauthorized access to your account and information by choosing your password carefully and keeping your password and computer secure, such as by signing out after using our services.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>9. International Data Transfers</h2>
        <p>
          Our services are operated in the United States. If you are located outside of the United States, please be aware that information we collect will be transferred to and processed in the United States. By using our services, you consent to this transfer and processing of your personal information in the United States, which may not have the same data protection laws as the country in which you initially provided the information.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>10. Children's Privacy</h2>
        <p>
          Our service is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
        </p>
        <p className="mt-3">
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="mt-2 font-medium">
          privacy@sketchdojo.com
        </p>
        <p className="mt-2">
          SketchDojo<br />
          123 AI Avenue<br />
          San Francisco, CA 94103<br />
          United States
        </p>
      </section>
    </div>
  );
} 