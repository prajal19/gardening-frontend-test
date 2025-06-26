import React from 'react';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader 
        title="Privacy Policy"
        description="Our commitment to protecting your personal information"
        backgroundImage="/images/privacy-policy-header.jpg"
      />
      
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <p>
              Last Updated: June 1, 2023
            </p>
            
            <p>
              This Privacy Policy describes how your personal information is collected, used, and 
              shared when you visit or make a purchase from our website or use our services.
            </p>

            <h2>Information We Collect</h2>
            
            <p>
              When you visit our website, we automatically collect certain information about your 
              device, including information about your web browser, IP address, time zone, and some 
              of the cookies that are installed on your device.
            </p>
            
            <p>
              Additionally, as you browse the site, we collect information about the individual web 
              pages that you view, what websites or search terms referred you to our site, and 
              information about how you interact with the site. We refer to this automatically-collected 
              information as "Device Information."
            </p>
            
            <p>
              When you request a quote, schedule a service, or contact us through our website, we 
              collect certain information from you, including your:
            </p>
            
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Address</li>
              <li>Service interests and requirements</li>
              <li>Property details (as relevant to services requested)</li>
            </ul>
            
            <p>
              We refer to this information as "Service Information."
            </p>
            
            <h2>How We Use Your Information</h2>
            
            <p>
              We use the information that we collect to:
            </p>
            
            <ul>
              <li>Communicate with you about our services</li>
              <li>Fulfill any service requests or obligations to you</li>
              <li>Schedule and manage appointments</li>
              <li>Process payments and refunds</li>
              <li>Send you marketing and promotional communications (if you have opted in)</li>
              <li>Improve and optimize our website</li>
              <li>Protect our website and services</li>
            </ul>
            
            <h2>Sharing Your Information</h2>
            
            <p>
              We share your Personal Information with third parties to help us use your Personal 
              Information, as described above. These include:
            </p>
            
            <ul>
              <li>Service providers who help us process payments</li>
              <li>Marketing and analytics partners who help us understand our customers</li>
              <li>Technology providers who help us operate our website and services</li>
            </ul>
            
            <p>
              We may also share your Personal Information to comply with applicable laws and 
              regulations, to respond to a subpoena, search warrant or other lawful request for 
              information we receive, or to otherwise protect our rights.
            </p>
            
            <h2>Behavioral Advertising</h2>
            
            <p>
              We use your Personal Information to provide you with targeted advertisements or 
              marketing communications we believe may be of interest to you. For more information 
              about how targeted advertising works, you can visit the Network Advertising Initiative's 
              educational page at <a href="http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work" target="_blank" rel="noopener noreferrer">http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work</a>.
            </p>
            
            <h2>Your Rights</h2>
            
            <p>
              Depending on your location, you may have certain rights regarding your personal 
              information, such as:
            </p>
            
            <ul>
              <li>The right to access the personal information we have about you</li>
              <li>The right to request that we correct or update any personal information we have about you</li>
              <li>The right to request that we delete any personal information we have about you</li>
              <li>The right to opt out of marketing communications</li>
            </ul>
            
            <p>
              To exercise these rights, please contact us using the contact information provided below.
            </p>
            
            <h2>Data Retention</h2>
            
            <p>
              We will retain your Personal Information only for as long as necessary to fulfill the 
              purposes for which we collected it, including for the purposes of satisfying any legal, 
              accounting, or reporting requirements.
            </p>
            
            <h2>Changes</h2>
            
            <p>
              We may update this privacy policy from time to time in order to reflect, for example, 
              changes to our practices or for other operational, legal or regulatory reasons. We will 
              notify you of any significant changes by posting the new Privacy Policy on this page 
              and, where appropriate, contacting you directly.
            </p>
            
            <h2>Cookies</h2>
            
            <p>
              Cookies are data files that are placed on your device or computer and often include 
              an anonymous unique identifier. For more information about cookies, and how to disable 
              cookies, visit <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">http://www.allaboutcookies.org</a>.
            </p>
            
            <p>
              Our website uses cookies to:
            </p>
            
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Understand how visitors interact with our website</li>
              <li>Analyze the performance of our website</li>
              <li>Personalize content and advertising</li>
            </ul>
            
            <h2>Contact Us</h2>
            
            <p>
              For more information about our privacy practices, if you have questions, or if you would 
              like to make a complaint, please contact us by e-mail at privacy@yourlandscapingcompany.com 
              or by mail using the details provided below:
            </p>
            
            <address className="not-italic">
              Your Landscaping Company<br />
              123 Green Avenue, Suite 456<br />
              Anytown, ST 12345<br />
              United States
            </address>
          </div>
        </div>
      </Container>
    </>
  );
} 