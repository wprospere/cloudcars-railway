import { Link } from "wouter";
import { ArrowLeft, Shield, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <img src="/logo.png" alt="Cloud Cars" className="h-10 w-auto" />
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-primary font-medium">Your Data, Protected</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Notice
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Cloud Cars Ltd is committed to protecting and respecting your privacy. 
            This notice explains how we collect, use, and protect your personal data.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: 15th August 2019
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container max-w-4xl">
          <div className="prose prose-invert max-w-none space-y-8">
            
            {/* Introduction */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cloud Cars Ltd ("we", "our", "us") is committed to protecting and respecting your privacy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cloud Cars Ltd is a limited liability company established in England with a registered office at 
                Unit 5 Medway Street, Nottingham, NG8 1PN.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For the purpose of the General Data Protection Regulation (the "GDPR"), if you book services 
                as a passenger in England, the data controller is Cloud Cars Ltd.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This policy sets out the basis on which we will process any personal data or usage information 
                we collect from you, or that you provide to us, in connection with your use of our websites at 
                www.cloudcarsltd.com (the "Websites"), our mobile apps (the "Apps") or our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">What Information Do We Collect?</h2>
              
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Information You Give Us</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may provide information by contacting us via our Websites, Apps or by email, telephone, 
                social media or otherwise, or by signing up for our newsletters or alerts, or by creating 
                an account and then using our services.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">CCTV Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Some of our vehicles may be fitted with outward-looking dashboard cameras. These dashboard 
                cameras do not film inside the vehicles, and they do not record audio, but your image may 
                be picked up by them when you enter or exit the vehicle.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Corporate Customer Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In the case of our corporate customers only, your employer may provide us with information 
                about you when it signs up to use our services, for example your name and business email address.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Technical Usage Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                When you visit our Websites or use our Apps, we automatically collect information including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Your IP address</li>
                <li>Device information including identifier, name, and type of operating system</li>
                <li>Mobile network information</li>
                <li>Browser type and pages accessed</li>
                <li>Mobile device UUID and/or fingerprint</li>
                <li>Hardware models, software, and device motion information</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">How Do We Use Your Information?</h2>
              
              <h3 className="text-lg font-semibold text-foreground mt-4 mb-3">To Perform Our Contract With You</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
                <li>To communicate with you</li>
                <li>To provide you with ground transportation services</li>
                <li>To create records of bookings and send acknowledgements, confirmations, receipts and invoices</li>
                <li>To maintain records of lost property</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">For Our Legitimate Business Interests</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>To detect and prevent fraud and crime</li>
                <li>For reporting and data analysis purposes</li>
                <li>To administer our membership and loyalty schemes</li>
                <li>For insurance purposes</li>
                <li>To comply with legal and regulatory obligations</li>
                <li>For customer service and complaint handling</li>
                <li>To monitor and assess service quality</li>
                <li>To personalise our services for you</li>
                <li>To enforce our terms and conditions</li>
                <li>To communicate about products, services, and promotions (if opted in)</li>
              </ul>
            </div>

            {/* Cookies */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Do We Use Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies to collect information about your browsing activities over time and across 
                different websites following your use of our services, to measure the performance of our 
                Websites and Apps and to remember your details and store your preferences.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use Google Analytics, which is a web analytics tool that helps us understand how users 
                engage with our Websites. You can opt out of Google Analytics by visiting: 
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" 
                   className="text-primary hover:underline ml-1">
                  tools.google.com/dlpage/gaoptout
                </a>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For more information about cookies and how to manage them, visit: 
                <a href="http://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" 
                   className="text-primary hover:underline ml-1">
                  www.allaboutcookies.org
                </a>
              </p>
            </div>

            {/* Data Sharing */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">How Do We Share Your Personal Data?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, rent or lease your personal information to others except as described in 
                this Privacy Notice. We share your information with selected recipients including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Cloud storage providers located in the UK for data storage and disaster recovery</li>
                <li>Advertisers and e-marketing companies (with your consent) for relevant marketing</li>
                <li>Analytics and search engine providers to improve our Websites and Apps</li>
                <li>Merchant acquirers for processing payments</li>
                <li>Fraud prevention tools for preventing fraud</li>
                <li>Partner drivers based in the territory where you request services</li>
                <li>IT support service providers who maintain our booking platform</li>
                <li>Our insurance company and claims handling companies</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We will share your information with law enforcement agencies, public authorities or other 
                organisations if legally required to do so, or to protect rights, property or safety.
              </p>
            </div>

            {/* Data Storage */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Where Do We Store Your Personal Data?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your personal data may be processed by staff operating outside the EEA who work for us or 
                for one of our suppliers or partner drivers. We will take all steps reasonably necessary 
                to ensure that your personal data is treated securely and in accordance with this policy.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We export your personal data outside of the EEA to whitelisted countries (considered to 
                provide an adequate level of protection by the European Commission) or under the Commission's 
                model contracts for the transfer of personal data to third countries.
              </p>
            </div>

            {/* Data Retention */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">How Long Do We Store Your Personal Data?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We retain your information as follows:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Customer profile and account information:</strong> 7 years after you last use our services</li>
                <li><strong>Email correspondence:</strong> 5 years</li>
                <li><strong>Records of bookings, lost property and complaints:</strong> Minimum 12 months (regulatory requirement)</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                After you have terminated your use of our services, we will store your information in an 
                aggregated and anonymised format.
              </p>
            </div>

            {/* Your Rights */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have rights in relation to the personal data we hold about you:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal data and information about how we use it</li>
                <li><strong>Correction:</strong> Ask us to correct inaccurate or incomplete personal data</li>
                <li><strong>Portability:</strong> Request your data in a structured, machine-readable format</li>
                <li><strong>Erasure:</strong> In certain circumstances, ask us to delete your personal data</li>
                <li><strong>Restriction:</strong> Ask us to restrict processing of your personal data</li>
                <li><strong>Objection:</strong> Object to processing based on our legitimate interests</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You also have the right to complain to the Information Commissioner's Office or other 
                applicable data protection supervisory authority.
              </p>
            </div>

            {/* Marketing */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Objection to Marketing</h2>
              <p className="text-muted-foreground leading-relaxed">
                At any time you have the right to object to our processing of data about you in order to 
                send you marketing communications, and we will stop processing the data for that purpose. 
                You can change your marketing preferences at any time by contacting us at 
                <a href="mailto:info@cloudcarsltd.com" className="text-primary hover:underline ml-1">
                  info@cloudcarsltd.com
                </a> or via our App.
              </p>
            </div>

            {/* Complaints */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Complaints</h2>
              <p className="text-muted-foreground leading-relaxed">
                In the event that you wish to make a complaint about how we process your personal data, 
                please contact us in the first instance at 
                <a href="mailto:info@cloudcarsltd.com" className="text-primary hover:underline ml-1">
                  info@cloudcarsltd.com
                </a> and we will endeavour to deal with your request as soon as possible. This is without 
                prejudice to your right to launch a claim with the Information Commissioner's Office.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Questions, comments and requests regarding this policy are welcomed and should be addressed to:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a href="mailto:info@cloudcarsltd.com" className="text-primary hover:underline">
                      info@cloudcarsltd.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Data Protection Officer</p>
                    <p className="text-muted-foreground">
                      Unit 5 Medway Street<br />
                      Nottingham, NG8 1PN
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Back to Home */}
          <div className="mt-12 text-center">
            <Link href="/">
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
