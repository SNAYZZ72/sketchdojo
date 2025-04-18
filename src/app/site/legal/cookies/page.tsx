import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "SketchDojo | Cookie Policy",
  description: "Comprehensive Cookie Policy for SketchDojo - Learn how we use cookies and how to manage your privacy preferences",
};

export default function CookiePolicy() {
  // Format date for better standardization
  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
      <p className="text-muted-foreground mb-4">Last Updated: {formattedDate}</p>
      
      <div className="mt-4 p-4 border border-sketchdojo-primary/20 rounded-md bg-sketchdojo-primary/5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm font-medium">
            Manage your cookie preferences at any time
          </p>
          <Link href="/site/legal/cookie-preferences">
            <Button size="sm" className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 transition-all">
              Manage Preferences
            </Button>
          </Link>
        </div>
      </div>
      
      <section className="mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-sketchdojo-primary" />
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
        </div>
        <div className="p-4 border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30 rounded-md">
          <p className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>This policy has been updated to comply with the General Data Protection Regulation (GDPR), ePrivacy Directive, and other applicable privacy laws.</span>
          </p>
        </div>
        <p>
          This Cookie Policy explains how SketchDojo (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies to recognize you when you visit our website and use our services. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
        <p>
          Please read this Cookie Policy carefully before using our services. By continuing to browse or use our website, you agree to our use of cookies as described in this Cookie Policy.
        </p>
        <p>
          We are committed to protecting your personal information and ensuring your experience with us is as safe and enjoyable as possible. We handle all personal data in accordance with applicable data protection laws.
        </p>
      </section>
      
      <section className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-6 w-6 text-sketchdojo-primary" />
          <h2 className="text-2xl font-semibold">2. What Are Cookies?</h2>
        </div>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p>
          Cookies set by the website owner (in this case, SketchDojo) are called &quot;first-party cookies&quot;. Cookies set by parties other than the website owner are called &quot;third-party cookies&quot;. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
        </p>
        <p>
          In addition to cookies, we may use other similar technologies like web beacons (sometimes called &quot;tracking pixels&quot; or &quot;clear gifs&quot;), browser storage (including local storage and session storage), and application data caches. These technologies are similar to cookies in that they are stored on your device and can be used to store certain information about your activities and preferences.
        </p>
      </section>
      
      <section className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-6 w-6 text-sketchdojo-primary" />
          <h2 className="text-2xl font-semibold">3. Types of Cookies We Use</h2>
        </div>
        <p>
          We use the following types of cookies. For each type, we&apos;ve included information about their purpose and legal basis for processing under applicable data protection laws:
        </p>
        
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md p-4 my-4">
          <h3 className="text-lg font-medium">3.1 Essential Cookies</h3>
          <p className="mt-2">
            These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in, or filling in forms.
          </p>
          <p className="mt-2">
            <strong>Legal basis:</strong> These cookies are processed on the basis of necessity to perform a contract (providing you with access to our services as requested).
          </p>
          <p className="mt-2">
            <strong>What happens if disabled:</strong> You can set your browser to block or alert you about these cookies, but some parts of the site will not function properly. These cookies do not store any personally identifiable information.
          </p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-md p-4 my-4">
          <h3 className="text-lg font-medium">3.2 Performance and Analytics Cookies</h3>
          <p className="mt-2">
            These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.
          </p>
          <p className="mt-2">
            <strong>Legal basis:</strong> These cookies are processed based on your consent, which you can withdraw at any time.
          </p>
          <p className="mt-2">
            <strong>What happens if disabled:</strong> If you do not allow these cookies, we will not know when you have visited our site and will not be able to monitor its performance. All information these cookies collect is aggregated and therefore anonymous.
          </p>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-md p-4 my-4">
          <h3 className="text-lg font-medium">3.3 Functional Cookies</h3>
          <p className="mt-2">
            These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
          </p>
          <p className="mt-2">
            <strong>Legal basis:</strong> These cookies are processed based on your consent, which you can withdraw at any time.
          </p>
          <p className="mt-2">
            <strong>What happens if disabled:</strong> If you do not allow these cookies, then some or all of these services may not function properly. These cookies may remember which language or region you prefer, or save personalization settings.
          </p>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-md p-4 my-4">
          <h3 className="text-lg font-medium">3.4 Targeting Cookies</h3>
          <p className="mt-2">
            These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
          </p>
          <p className="mt-2">
            <strong>Legal basis:</strong> These cookies are processed based on your consent, which you can withdraw at any time.
          </p>
          <p className="mt-2">
            <strong>What happens if disabled:</strong> If you do not allow these cookies, you will experience less targeted advertising. These cookies do not directly store personal information but are based on uniquely identifying your browser and internet device.
          </p>
        </div>
      </section>
      
      <section className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-6 w-6 text-sketchdojo-primary" />
          <h2 className="text-2xl font-semibold">4. Specific Cookies We Use</h2>
        </div>
        
        <p>
          Below is a detailed list of the cookies we use on our website. We regularly update this information to ensure it remains accurate and transparent.
        </p>
        
        <div className="overflow-x-auto mt-4 rounded-lg shadow-sm">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Cookie Name</th>
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Provider</th>
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Type</th>
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Purpose</th>
                <th className="border border-gray-300 dark:border-gray-700 p-3 text-left">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-3">sketchdojo_session</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">SketchDojo</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Essential</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Maintains your session state across page requests and ensures secure navigation between pages</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Session (expires when you close your browser)</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 p-3">sketchdojo_auth</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">SketchDojo</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Essential</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Used for authentication purposes, keeps you logged in and maintains your security settings</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">30 days</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-3">cookieConsent</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">SketchDojo</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Essential</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Stores your cookie consent preferences</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">1 year</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 p-3">cookiePreferences</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">SketchDojo</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Essential</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Stores your specific cookie category preferences when you select custom settings</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">1 year</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-3">_ga</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Google</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Analytics</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Google Analytics cookie used to distinguish unique users by assigning a randomly generated number as a client identifier</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">2 years</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 p-3">_gid</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Google</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Analytics</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Google Analytics cookie used to distinguish users and store information about how you use our website</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">24 hours</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-700 p-3">_gat</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Google</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Analytics</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Used to throttle request rate to Google Analytics</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">1 minute</td>
              </tr>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-700 p-3">user_preferences</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">SketchDojo</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Functional</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">Stores your user preferences such as theme selection, language preference, and interface customizations</td>
                <td className="border border-gray-300 dark:border-gray-700 p-3">1 year</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-md p-4 mt-4">
          <p className="text-sm">
            <strong>Note:</strong> Third-party services we use may set additional cookies. We recommend reviewing the privacy policies of these services for more information. We make every effort to keep this list up-to-date, but as technologies evolve, there may be cookies not listed here that are used temporarily for technical or security purposes.
          </p>
        </div>
      </section>
      
      <section className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-sketchdojo-primary" />
          <h2 className="text-2xl font-semibold">5. How to Control Cookies</h2>
        </div>
        
        <p>
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences in several ways as described below. Please keep in mind that removing or blocking cookies can negatively impact your user experience and parts of our website may no longer be fully accessible.
        </p>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mt-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sketchdojo-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              5.1 Our Cookie Preference Center
            </h3>
            <p className="mt-2">
              The easiest way to manage your cookie preferences is through our dedicated Cookie Preference Center. This tool allows you to selectively opt-in or opt-out of different cookie categories (except for essential cookies which are necessary for the website to function).
            </p>
            <div className="mt-4">
              <Link href="/site/legal/cookie-preferences">
                <Button className="bg-gradient-to-r from-sketchdojo-primary to-sketchdojo-accent text-white hover:opacity-90 transition-all">
                  Manage Cookie Preferences
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sketchdojo-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
              5.2 Browser Controls
            </h3>
            <p className="mt-2">
              Most web browsers allow you to manage your cookie preferences through their settings. You can usually find these settings in the &quot;Options&quot; or &quot;Preferences&quot; menu of your browser. Below are links to instructions for managing cookies in common browsers:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
              <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
              <li><a href="https://help.opera.com/en/latest/web-preferences/#cookies" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Opera</a></li>
            </ul>
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sketchdojo-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              5.3 Third-Party Opt-Out Tools
            </h3>
            <p className="mt-2">
              For cookies set by third-party services, you can manage your preferences through their dedicated opt-out mechanisms:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Install the Google Analytics Opt-out Browser Add-on</a></li>
              <li>Online advertising: <a href="https://www.youronlinechoices.com/" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Your Online Choices</a>, <a href="https://optout.networkadvertising.org/" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a>, or <a href="https://optout.aboutads.info/" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a></li>
            </ul>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sketchdojo-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              5.4 Do Not Track
            </h3>
            <p className="mt-2">
              Some browsers have a &quot;Do Not Track&quot; feature that lets you tell websites that you do not want to have your online activities tracked. These features are not yet uniform across browsers, so we do not currently respond to such signals. However, you can use the various other tools described above to manage your privacy preferences.
            </p>
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-md p-4 mt-4">
          <p className="text-sm">
            <strong>Important:</strong> If you delete cookies, block cookies, or choose not to accept cookies, certain features of our website may not work properly. For example, you may have to log in more frequently, or you may lose access to certain personalized features.
          </p>
        </div>
      </section>
      
      <section className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="h-6 w-6 text-sketchdojo-primary" />
          <h2 className="text-2xl font-semibold">6. Third-Party Services</h2>
        </div>
        
        <p>
          We may use third-party services on our website that set their own cookies or similar technologies. These services help us provide enhanced functionality, analyze our traffic, or display personalized content.
        </p>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mt-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium">6.1 Analytics Services</h3>
            <p className="mt-2">
              We use Google Analytics to help us understand how visitors interact with our website. Google Analytics collects information such as how often users visit our site, what pages they visit, and what other sites they used prior to coming to our site.
            </p>
            <p className="mt-2">
              Google Analytics collects only the IP address assigned to you on the date you visit our site, rather than your name or other identifying information. We do not combine the information collected through Google Analytics with personally identifiable information.
            </p>
            <p className="mt-2">
              You can learn more about Google&apos;s practices at <a href="https://policies.google.com/technologies/partner-sites" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/partner-sites</a> and opt out by downloading the Google Analytics opt-out browser add-on, available at <a href="https://tools.google.com/dlpage/gaoptout" className="text-sketchdojo-primary hover:underline" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout</a>.
            </p>
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium">6.2 Data Processing and Transfers</h3>
            <p className="mt-2">
              Some of our third-party service providers may be located outside of your country or region. By using our website, you consent to the transfer of your information to these countries, which may have different data protection rules than those in your country.
            </p>
            <p className="mt-2">
              We ensure that any such transfers comply with applicable data protection laws and that your information remains protected according to the standards described in this policy. We implement appropriate safeguards such as standard contractual clauses where required.
            </p>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-medium">6.3 Third-Party Privacy Policies</h3>
            <p className="mt-2">
              This Cookie Policy does not apply to third-party websites, products, or services, even if they link to our services. We encourage you to review the privacy policies of any third-party services before providing any information to them.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-6 w-6 text-sketchdojo-primary" />
          <h2 className="text-2xl font-semibold">7. Changes to This Cookie Policy</h2>
        </div>
        
        <p>
          We may update this Cookie Policy from time to time to reflect changes to the cookies we use, changes in technology, or for other operational, legal, or regulatory reasons. When we make significant changes, we will notify you in the following ways:
        </p>
        
        <ul className="list-disc pl-6 space-y-1">
          <li>Updating the date at the top of this Cookie Policy</li>
          <li>Displaying a prominent notice on our website</li>
          <li>For registered users, we may send an email notification</li>
        </ul>
        
        <p>
          We encourage you to periodically review this Cookie Policy to stay informed about our use of cookies and related technologies. Your continued use of our website after any changes to this Cookie Policy constitutes your acceptance of the updated policy.
        </p>
        
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-md p-4 mt-4">
          <p className="text-sm">
            <strong>Historical versions:</strong> If you would like to access previous versions of this Cookie Policy, please contact us using the details below.
          </p>
        </div>
      </section>
      
      <section className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sketchdojo-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-2xl font-semibold">8. Contact Us</h2>
        </div>
        
        <p>
          If you have any questions, concerns, or requests regarding this Cookie Policy or our data practices, please contact us using the information below:
        </p>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-4 mt-2">
          <p className="font-medium text-sketchdojo-primary">Email: privacy@sketchdojo.com</p>
          <p className="mt-2">Response time: We aim to respond to all legitimate inquiries within 5 business days.</p>
          <p className="mt-2">For urgent matters related to data protection or to exercise your rights under applicable data protection laws, please indicate this clearly in your communication.</p>
        </div>
        
        <p className="mt-4">
          If you are located in the European Economic Area (EEA), you also have the right to lodge a complaint with your local data protection authority if you believe we have not complied with applicable data protection laws.
        </p>
      </section>
      
      <section className="mt-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-sketchdojo-primary" />
          <h2 className="text-2xl font-semibold">9. Data Security</h2>
        </div>
        
        <p>
          We take the security of your data seriously and implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
        </p>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mt-4">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-medium">9.1 Security Measures</h3>
            <p className="mt-2">
              We use industry-standard encryption technologies when transferring and receiving data. Our security measures include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>HTTPS encryption for all data transfers</li>
              <li>Regular security assessments and vulnerability testing</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Server-side encryption of sensitive data</li>
              <li>Regular monitoring for suspicious activities</li>
            </ul>
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-medium">9.2 Data Retention</h3>
            <p className="mt-2">
              We retain cookie data only for as long as necessary to fulfill the purposes outlined in this Cookie Policy, unless a longer retention period is required or permitted by law.
            </p>
            <p className="mt-2">
              The retention periods for different types of cookies vary as indicated in the cookie table above. After the retention period expires, we securely delete or anonymize the data.
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md p-4 mt-4">
          <p className="text-sm flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span><strong>Security commitment:</strong> While we implement safeguards to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We continuously improve our security practices to enhance the safety of your data.</span>
          </p>
        </div>
      </section>
    </div>
  );
}