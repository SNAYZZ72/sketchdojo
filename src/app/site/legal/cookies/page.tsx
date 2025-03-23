import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "SketchDojo | Cookie Policy",
  description: "Cookie Policy for SketchDojo",
};

export default function CookiePolicy() {
  return (
    <div>
      <h1>Cookie Policy</h1>
      <p className="text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      
      <div className="mt-4 p-4 border border-sketchdojo-primary/20 rounded-md bg-sketchdojo-primary/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm font-medium">
            Manage your cookie preferences at any time
          </p>
          <Link href="/site/legal/cookie-preferences">
            <Button size="sm" className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90">
              Manage Preferences
            </Button>
          </Link>
        </div>
      </div>
      
      <section className="mt-8">
        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how SketchDojo ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website and use our services. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
        <p className="mt-3">
          Please read this Cookie Policy carefully before using our services. By continuing to browse or use our website, you agree to our use of cookies as described in this Cookie Policy.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>2. What Are Cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p className="mt-3">
          Cookies set by the website owner (in this case, SketchDojo) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
        </p>
      </section>
      
      <section className="mt-6">
        <h2>3. Types of Cookies We Use</h2>
        <p>
          We use the following types of cookies:
        </p>
        
        <h3 className="text-lg font-medium mt-4">3.1 Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work.
        </p>
        
        <h3 className="text-lg font-medium mt-4">3.2 Performance and Analytics Cookies</h3>
        <p>
          These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous.
        </p>
        
        <h3 className="text-lg font-medium mt-4">3.3 Functional Cookies</h3>
        <p>
          These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages. If you do not allow these cookies, then some or all of these services may not function properly.
        </p>
        
        <h3 className="text-lg font-medium mt-4">3.4 Targeting Cookies</h3>
        <p>
          These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal information but are based on uniquely identifying your browser and internet device.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>4. Specific Cookies We Use</h2>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Cookie Name</th>
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Type</th>
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Purpose</th>
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-3">sketchdojo_session</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Essential</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Maintains your session state across page requests</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Session</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 p-3">sketchdojo_auth</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Essential</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Used for authentication purposes</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">30 days</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-3">_ga</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Analytics</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Google Analytics cookie used to distinguish users</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">2 years</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 p-3">_gid</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Analytics</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Google Analytics cookie used to distinguish users</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">24 hours</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-3">user_preferences</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Functional</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Stores user preferences (e.g., theme, language)</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">1 year</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="mt-6">
        <h2>5. How to Control Cookies</h2>
        <p>
          You can control and manage cookies in various ways. Please keep in mind that removing or blocking cookies can negatively impact your user experience and parts of our website may no longer be fully accessible.
        </p>
        
        <h3 className="text-lg font-medium mt-4">5.1 Browser Controls</h3>
        <p>
          Most browsers automatically accept cookies, but you can choose whether or not to accept cookies through your browser controls, often found in your browser's "Tools" or "Preferences" menu. For more information on how to modify your browser settings or how to block, manage or filter cookies, you can visit:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-primary hover:underline">Mozilla Firefox</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-primary hover:underline">Microsoft Edge</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-primary hover:underline">Safari</a></li>
        </ul>
        
        <h3 className="text-lg font-medium mt-4">5.2 Cookie Preference Tool</h3>
        <p>
          We provide a cookie preference tool on our website that allows you to manage which categories of cookies you accept or reject. You can access this tool at any time by visiting our <Link href="/site/legal/cookie-preferences" className="text-primary hover:underline">Cookie Preferences</Link> page or by clicking the "Cookie Preferences" link in the footer of our website.
        </p>
        
        <h3 className="text-lg font-medium mt-4">5.3 Do Not Track</h3>
        <p>
          Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to have your online activities tracked. These features are not yet uniform, so we do not currently respond to such signals.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>6. Third-Party Services</h2>
        <p>
          We may use third-party analytics services, such as Google Analytics, to help us understand how users engage with our website. These services may use cookies and similar technologies to collect information about your use of the website and report website trends. You can learn more about Google's practices at <a href="https://policies.google.com/technologies/partner-sites" className="text-primary hover:underline">https://policies.google.com/technologies/partner-sites</a> and opt out by downloading the Google Analytics opt-out browser add-on, available at <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">https://tools.google.com/dlpage/gaoptout</a>.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>7. Changes to This Cookie Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
        <p className="mt-3">
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>
      </section>
      
      <section className="mt-6">
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
        </p>
        <p className="mt-2 font-medium">
          privacy@sketchdojo.com
        </p>
      </section>
    </div>
  );
} 