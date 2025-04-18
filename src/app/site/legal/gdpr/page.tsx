import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SketchDojo | GDPR Compliance",
  description: "GDPR Compliance information for SketchDojo",
};

export default function GDPRCompliance() {
  return (
    <div>
      <h1>GDPR Compliance</h1>
      <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      
      <section className="mt-8">
        <h2>1. Introduction</h2>
        <p>
          At SketchDojo, we are committed to protecting the privacy and rights of our users. This page explains how we comply with the General Data Protection Regulation (GDPR), which is a regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>2. Data Controller</h2>
        <p>
          For the purposes of the GDPR, SketchDojo is the data controller of your personal information. This means that we determine the purposes for which and the means by which your personal data is processed.
        </p>
        <p className="mt-3">
          Our contact details are:
        </p>
        <p className="mt-2">
          SketchDojo<br />
          123 AI Avenue<br />
          San Francisco, CA 94103<br />
          United States<br />
          Email: privacy@sketchdojo.com
        </p>
      </section>
      
      <section className="mt-6">
        <h2>3. Data Protection Officer</h2>
        <p>
          We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this privacy notice. If you have any questions about this privacy notice, including any requests to exercise your legal rights, please contact the DPO using the details set out below:
        </p>
        <p className="mt-2">
          Data Protection Officer<br />
          Email: dpo@sketchdojo.com<br />
          Address: SketchDojo, 123 AI Avenue, San Francisco, CA 94103, United States
        </p>
      </section>
      
      <section className="mt-6">
        <h2>4. Your GDPR Rights</h2>
        <p>
          Under the GDPR, you have several important rights. In summary, those include rights to:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Access your personal data:</strong> You have the right to request a copy of the personal information we hold about you.</li>
          <li><strong>Rectification:</strong> You can request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
          <li><strong>Erasure (right to be forgotten):</strong> You can request that we erase your personal data, under certain conditions.</li>
          <li><strong>Restrict processing:</strong> You can request that we restrict the processing of your personal data, under certain conditions.</li>
          <li><strong>Object to processing:</strong> You can object to our processing of your personal data, under certain conditions.</li>
          <li><strong>Data portability:</strong> You can request that we transfer the data that we&apos;ve collected to another organization, or directly to you, under certain conditions.</li>
          <li><strong>Withdraw consent:</strong> If we rely on your consent to process your personal data, you have the right to withdraw that consent at any time.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact our Data Protection Officer using the contact details provided above.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>5. How to Exercise Your Rights</h2>
        <p>
          To exercise your rights under the GDPR, you can:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Log into your account and use the privacy settings and tools we provide</li>
          <li>Email our Data Protection Officer at dpo@sketchdojo.com</li>
          <li>Submit a request through our contact form on our website</li>
          <li>Write to us at: SketchDojo, Attn: Data Protection Officer, 123 AI Avenue, San Francisco, CA 94103, United States</li>
        </ul>
        <p className="mt-3">
          We will respond to all legitimate requests within one month. Occasionally it may take us longer than a month if your request is particularly complex or you have made a number of requests. In this case, we will notify you and keep you updated.
        </p>
        <p className="mt-3">
          You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive. Alternatively, we may refuse to comply with your request in these circumstances.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>6. Legal Basis for Processing Personal Data</h2>
        <p>
          Under the GDPR, we must have a legal basis for processing your personal data. We may rely on one or more of the following legal bases:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Consent:</strong> You have given clear consent for us to process your personal data for a specific purpose.</li>
          <li><strong>Contract:</strong> The processing is necessary for a contract we have with you, or because you have asked us to take specific steps before entering into a contract.</li>
          <li><strong>Legal obligation:</strong> The processing is necessary for us to comply with the law.</li>
          <li><strong>Legitimate interests:</strong> The processing is necessary for our legitimate interests or the legitimate interests of a third party, unless there is a good reason to protect your personal data which overrides those legitimate interests.</li>
        </ul>
        <p className="mt-3">
          For more detailed information about the specific legal basis we rely on for the different types of data we process, please see our Privacy Policy.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>7. Data Transfers Outside the EU/EEA</h2>
        <p>
          We are based in the United States, which means that your data will be transferred outside the European Union (EU) and European Economic Area (EEA). Whenever we transfer your personal data out of the EU/EEA, we ensure a similar degree of protection is afforded to it by implementing at least one of the following safeguards:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><strong>Standard Contractual Clauses:</strong> We use specific contracts approved by the European Commission which give personal data the same protection it has in Europe.</li>
          <li><strong>Adequacy decisions:</strong> We transfer data to countries that the European Commission has determined provide an adequate level of protection for personal data.</li>
          <li><strong>Binding Corporate Rules:</strong> Where applicable, we implement legally binding corporate rules for transfers of personal data within our corporate group.</li>
        </ul>
        <p className="mt-3">
          For more information about our data transfer mechanisms, please contact our Data Protection Officer.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>8. Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.
        </p>
        <p className="mt-3">
          We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>9. Data Retention</h2>
        <p>
          We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
        </p>
        <p className="mt-3">
          To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal requirements.
        </p>
        <p className="mt-3">
          In some circumstances, you can ask us to delete your data. See the section on &quot;Your Rights&quot; above for more information.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>10. Data Protection Impact Assessment</h2>
        <p>
          Where our processing of personal data is likely to result in a high risk to your rights and freedoms, we will conduct a Data Protection Impact Assessment (DPIA) before commencing the processing. The DPIA helps us ensure that we comply with the requirements of the GDPR, and helps us identify and minimize the data protection risks of a project.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>11. Children's Data</h2>
        <p>
          Our services are not intended for children under 16 years of age. We do not knowingly collect personal data from children under 16. If you are under 16, please do not use our services or provide any personal information to us.
        </p>
        <p className="mt-3">
          If we learn we have collected or received personal data from a child under 16 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 16, please contact our Data Protection Officer.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>12. Complaints</h2>
        <p>
          You have the right to make a complaint at any time to your local data protection authority. We would, however, appreciate the chance to deal with your concerns before you approach the authority, so please contact us in the first instance.
        </p>
        <p className="mt-3">
          For users in the EU, a list of data protection authorities can be found at: <a href="https://edpb.europa.eu/about-edpb/board/members_en" className="text-primary hover:underline">https://edpb.europa.eu/about-edpb/board/members_en</a>
        </p>
      </section>
      
      <section className="mt-6">
        <h2>13. Changes to This GDPR Compliance Notice</h2>
        <p>
          We may update this GDPR compliance notice from time to time. When we update this notice, we will revise the &quot;Last Updated&quot; date at the top of this notice and, in some cases, we may provide you with additional notice (such as by sending you a notification or adding a statement to our website&#39;s homepage).
        </p>
        <p className="mt-3">
          We encourage you to review this notice regularly to stay informed about our data protection practices.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>14. Contact Us</h2>
        <p>
          If you have any questions about this GDPR compliance notice or our data protection practices, please contact our Data Protection Officer at:
        </p>
        <p className="mt-2 font-medium">
          dpo@sketchdojo.com
        </p>
      </section>
    </div>
  );
} 