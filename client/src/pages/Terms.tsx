import { ArrowLeft, Phone } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <div className="bg-card border-b border-border">
          <div className="container py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Terms & Conditions</h1>
            <p className="text-muted-foreground mt-2">Last updated: 2024</p>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-4xl mx-auto prose prose-invert prose-green">
            
            {/* Introduction */}
            <div className="bg-card/50 border border-border rounded-lg p-6 mb-8">
              <p className="text-muted-foreground leading-relaxed m-0">
                These terms and conditions apply to the contract between you (the Customer) and CLOUD CARS when it provides car services to you. These terms and conditions are divided into several sections covering Account Bookings, Non-Account Bookings, General Conditions, and Data Protection.
              </p>
            </div>

            {/* Company Information */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
              <h3 className="text-primary mt-0 mb-3">Company Information</h3>
              <p className="text-foreground m-0">
                <strong>CLOUD CARS LTD</strong> has company number <strong>07913651</strong> and its registered address is <strong>Unit 5 Medway Street, Nottingham, England, NG8 1PN</strong>.
              </p>
              <p className="text-muted-foreground mt-3 mb-0 text-sm">
                Please read these terms and conditions carefully. Your application to register an account and your continued use of the Website and/or our App will constitute your acceptance of these terms and conditions.
              </p>
            </div>

            {/* Section 1: Account Bookings */}
            <h2 className="text-primary border-b border-border pb-2">Section 1: Account Bookings</h2>
            
            <h3>1. General</h3>
            <p><strong>1.1.</strong> To make bookings on account with CLOUD CARS, you need to open an account.</p>
            <p><strong>1.2.</strong> Your account application form, once filled in and sent to CLOUD CARS is an offer from the Customer to enter into a contract with CLOUD CARS for the provision of the Services on an account basis. A contract will be concluded only upon issue by CLOUD CARS to the Customer of written confirmation that the application has been accepted.</p>
            <p><strong>1.3.</strong> CLOUD CARS reserve the right in its absolute discretion, and without giving reasons, to reject an account application and to decline to enter into a contract.</p>
            <p><strong>1.4.</strong> A contract shall only be concluded on the terms and conditions contained in this Section 1 and Sections 3 and 4 of these terms and conditions. The contract shall be personal to both parties and non-assignable.</p>
            <p><strong>1.5.</strong> The Customer shall notify CLOUD CARS of any change in the information provided on your account application form. Alterations take effect on the date of the email from CLOUD CARS to the Customer confirming changes have been made.</p>

            <h3>2. Bookings</h3>
            <p><strong>2.1.</strong> Unless agreed otherwise, no bookings will be accepted by CLOUD CARS unless the Account Number or other agreed account security information is quoted. The Customer is responsible for ensuring that the Account Number or other agreed account security information is kept confidential and secure and that it is not disclosed to any unauthorised person. CLOUD CARS is entitled to assume that any person who correctly quotes the Customer's name and Account Number or other agreed account security information has authority to make the booking on behalf of the Customer.</p>
            <p><strong>2.2.</strong> The Customer is solely responsible for safeguarding the confidentiality of such information and shall be liable for the cost of all bookings made by any such person whether or not in fact authorised by themselves. CLOUD CARS do not accept any liability for any unauthorised access to an account arising from a Customer's failure to comply with this clause.</p>

            <h3>3. Payment</h3>
            <p><strong>3.1.</strong> Unless agreed otherwise, invoices are issued fortnightly to the email address and relevant person indicated on the account application form. Each invoice only covers bookings up to the tax date stated on it.</p>
            <p><strong>3.2.</strong> Settlement in full is due 14 days from the invoice date.</p>
            <p><strong>3.3.</strong> CLOUD CARS reserves the right to charge interest on unpaid accounts at the base rate of Barclays Bank Plc plus 3% accruing daily and compounded on a six-monthly basis from the due date until full settlement. For companies that settle by invoice, we reserve the right to charge a late settlement fee of 4% of the amount of the invoice, should your invoice not be paid in accordance with the payment terms of your account.</p>
            <p><strong>3.4.</strong> Account Customers paying fortnightly by individual credit card are invoiced on the 14th and 28th of every month and have 12-day payment terms and are debited on the 14th day after invoice date. Account Customers paying weekly by individual credit card are invoiced and debited on the first working day of the week following travel. Account Customers paying daily by individual credit card are invoiced and debited on the first working day following travel.</p>
            <p><strong>3.5.</strong> The Customer shall pay to CLOUD CARS any reasonable expenses (including those charged by any debt collection agency) together with all legal and court costs incurred in the collection of any overdue payment and the minimum charge in this respect shall be £10.</p>
            <p><strong>3.6.</strong> Pre-authorised payment can be set up by providing relevant credit card details.</p>
            <p><strong>3.7.</strong> Queries must be notified in writing to CLOUD CARS within 5 days of receipt of the invoice after which date the Customer shall not be entitled to dispute the amount shown save for manifest or gross error.</p>
            <p><strong>3.8.</strong> Any deposit paid about your account may be forfeit in the event of ongoing late payment of invoices.</p>

            {/* Section 2: Non-Account Bookings */}
            <h2 className="text-primary border-b border-border pb-2 mt-12">Section 2: Non-Account Bookings</h2>
            <p><strong>1.1.</strong> When you make a non-account booking with CLOUD CARS, CLOUD CARS is acting as an agent between you and the driver. CLOUD CARS offers your booking to a driver and when he accepts it, a contract is formed between you and the driver. That contract is subject to these terms and conditions.</p>
            <p><strong>1.2.</strong> In consideration for the driver carrying out your journey, you will pay that driver indirectly via CLOUD CARS's credit card payment mechanism.</p>
            <p><strong>1.3.</strong> Credit card bookings are not subject to VAT unless the driver carrying out your booking is VAT registered, in which case VAT will be charged in addition to the fare.</p>

            {/* Section 3: General Conditions */}
            <h2 className="text-primary border-b border-border pb-2 mt-12">Section 3: Conditions Applying to All Services</h2>
            
            <h3>1. Extent of CLOUD CARS' Liability</h3>
            <p><strong>1.1.</strong> Any quoted pick up or journey times are best estimates only and whilst it uses reasonable efforts to convey passenger(s) to their destinations in the shortest possible time, CLOUD CARS shall have no liability if a pick up or journey time exceeds any estimate given or otherwise exceeds the Customer's or the passenger(s)' expectations for whatever reason.</p>
            <p><strong>1.2.</strong> CLOUD CARS shall only be liable for losses suffered by a Customer that are a direct result of a breach by CLOUD CARS of these terms and conditions.</p>
            <p><strong>1.3.</strong> It shall be for the Customer and/or the passenger(s) to ensure that valuable, unusual or any other items are covered by appropriate insurance. CLOUD CARS cannot entertain any claim for loss of or damage to any such items.</p>
            <p><strong>1.4.</strong> If CLOUD CARS cancels a booking it shall have no liability to the Customer or intended passenger(s) if it has used reasonable endeavours to fulfil the booking and to notify the Customer of the cancellation.</p>
            <p><strong>1.5.</strong> If you are a business customer, CLOUD CARS will not be liable to you for: loss of profits, sales, business, or revenue; business interruption; loss of anticipated savings; loss of business opportunity, goodwill or reputation; or any indirect or consequential loss or damage.</p>
            <p><strong>1.6.</strong> If you are a consumer customer you are only permitted to use the Website for domestic and private use, and not for any commercial or business purposes.</p>
            <p><strong>1.7.</strong> Any claim or complaint shall be notified by the Customer to CLOUD CARS within 14 days of the date of the invoice containing the relevant booking for account bookings and within 7 days of the date of the journey for all non-account bookings.</p>
            <p><strong>1.8.</strong> Subject to the provisions of this clause and except in the case of death or personal injury, CLOUD CARS' aggregate liability arising from or in connection with the provision of the Services shall not exceed £500.</p>

            <h3>2. Your Use of the Website and the App</h3>
            <p><strong>2.1.</strong> CLOUD CARS may revise these Terms of Use at any time. Please check this page from time to time to take note of any changes.</p>
            <p><strong>2.2.</strong> CLOUD CARS may update the Website from time to time, and may change the content at any time.</p>
            <p><strong>2.3.</strong> CLOUD CARS do not guarantee that the Website, or any content on it, will be free from errors or omissions.</p>
            <p><strong>2.4.</strong> There is no guarantee that the Website will always be available or uninterrupted.</p>
            <p><strong>2.5.</strong> You are responsible for making all arrangements necessary to have access to the Website.</p>
            <p><strong>2.6.</strong> We do not guarantee that the Website will be secure or free from bugs or viruses.</p>
            <p><strong>2.7.</strong> You are responsible for configuring your information technology, computer programmes and platform to access the Website. You should use your own virus protection software.</p>
            <p><strong>2.8.</strong> You must not misuse the Website by knowingly introducing viruses, trojans, worms, logic bombs or other malicious material.</p>
            <p><strong>2.9.</strong> CLOUD CARS grant you a non-exclusive, limited, non-transferable licence to download, install and use the App for personal use only.</p>

            <h3>3. Your Obligations</h3>
            <p>You agree:</p>
            <ul>
              <li>To pay all charges arising out of your use of the Services</li>
              <li>Not to use CLOUD CARS for any unlawful or illegal purpose</li>
              <li>That all personal information provided is true, accurate and up-to-date</li>
              <li>Not to do anything to damage the reputation of CLOUD CARS or any of its drivers</li>
              <li>To treat with respect and not be abusive or violent towards any CLOUD CARS employees, staff or other customers</li>
              <li>Not to consume alcohol while in a car - we reserve the right to decline carriage to any person who is intoxicated</li>
              <li>To be responsible at all times for your luggage</li>
              <li>To wear a seatbelt at all times whilst travelling in our vehicles</li>
              <li>To indemnify CLOUD CARS against any claims arising from breach of these terms</li>
              <li>That if you cancel a booking outside the time allowed you will be liable for the cancellation fee</li>
              <li>That if you or another passenger soils or damages the car you will be liable</li>
            </ul>

            <h3>4. Booking Confirmation and Cancellation</h3>
            <p><strong>4.1.</strong> CLOUD CARS may in its absolute discretion without liability and without giving reasons refuse to accept any booking.</p>
            <p><strong>4.2.</strong> All accepted bookings are confirmed at the time of the booking by SMS, email, oral confirmation or the screen on the App.</p>
            <p><strong>4.3.</strong> Customers may cancel their bookings by calling the call centre, online or through the App.</p>
            <p><strong>4.4.</strong> In the event of cancellation by the Customer or passenger(s), the Customer may be liable for cancellation charges.</p>

            {/* Section 4: Data Protection */}
            <h2 className="text-primary border-b border-border pb-2 mt-12">Section 4: Data Protection, Privacy and Cookies</h2>
            <p>CLOUD CARS are committed to protecting and respecting your privacy. Under the Data Protection Act 1998 and GDPR, CLOUD CARS are the data controller.</p>

            <h3>Data Protection</h3>
            <p>Data types that CLOUD CARS may collect and store include:</p>
            <ul>
              <li>Personal and company information provided via telephone, website or mobile app for booking and use of services (names, addresses, telephone numbers, email addresses, journey details)</li>
              <li>All correspondences and transactions for future reference</li>
              <li>Phone calls may be recorded for quality and training purposes</li>
              <li>Website and booking platforms collect cookies to distinguish customers</li>
              <li>The CLOUD CARS booking app uses location-tracking technology when you use location-enabled services</li>
            </ul>
            <p>The data is stored on secure servers with encrypted backups. All enquiries on data retention, requests for or removal of personal data must be sent to <a href="mailto:info@cloudcarsltd.com" className="text-primary hover:underline">info@cloudcarsltd.com</a></p>

            <h3>Privacy</h3>
            <ul>
              <li>CLOUD CARS will not disclose Customers personal information unless required by law or regulatory body</li>
              <li>We use your personal information to provide our services and may contact you about changes or updates</li>
              <li>We will not disclose personal information to people or companies outside our group</li>
              <li>All data is encrypted and stored on secure servers</li>
              <li>If you no longer wish to receive updates, click unsubscribe in any email</li>
            </ul>

            <h3>Cookies</h3>
            <p>Our Website uses cookies to distinguish you from other users. This helps us provide you with a pleasant experience and allows us to improve our Website. You can block cookies by activating the setting on your browser, however you may not be able to access all parts of our Website.</p>

            {/* Section 5: Pricing and Charges */}
            <h2 className="text-primary border-b border-border pb-2 mt-12">Section 5: Pricing and Charges</h2>
            
            <h3>Pricing</h3>
            <p>Prices for our services can be obtained on request and will be provided automatically at the time of booking for App or online bookings. Journeys within the City of Nottingham are priced on a fixed route basis between postal codes. Journeys involving a leg outside of the City of Nottingham will be priced on a minimum charge, plus mileage calculation, unless otherwise agreed.</p>

            <h3>Charges</h3>
            <p>Charges applicable include:</p>
            <ul>
              <li>A minimum fixed charge for every hiring</li>
              <li>A charge for waiting time over a set threshold</li>
              <li>A 'soiling charge' if a vehicle is soiled by a passenger</li>
              <li>Cancellation charges as set out in our Cancellation Policy</li>
              <li>An administration charge of 5% if you choose not to pay by Direct Debit</li>
              <li>VAT as appropriate</li>
            </ul>

            <h3>Waiting Time Charges</h3>
            <p>Like most car services, we charge if you keep the car waiting over a certain period. However, for our Account customers, we pay if we keep you waiting.</p>
            
            <h4>Grace Periods:</h4>
            <ul>
              <li><strong>Standard (non-airport) pick-ups:</strong> 10 minutes grace. If you get into the car within the first 10 minutes of the booked time, there is no waiting charge.</li>
              <li><strong>Airport pick-ups:</strong> 30 minutes grace. If you get into the car within the first 30 minutes of the booked time, there is no waiting charge.</li>
            </ul>

            <h3>Card Bookings</h3>
            <p>When you make a booking to pay by credit or debit card, your card is pre-authorised to confirm available funds. This does not take money from your account but ring-fences the fare. If you cancel, we automatically release the pre-authorisation (3-5 days for funds to be released, determined by your card issuer).</p>
            <p>We do not charge a card handling fee, however we will add a £1 booking fee to all cash and card bookings for private customers.</p>

            <h3>Airport Pick-ups</h3>
            <p><strong>Flight Tracking:</strong> For all airport pick-ups we require the flight number. This enables us to track your flight and ensure your driver is at the airport at the right time. If the flight lands late, we will send the driver 15 minutes after the actual flight arrival time.</p>
            <p>The driver will be waiting at arrivals with a Cloud Cars nameboard with your name on it.</p>
            <p><strong>Car Parking:</strong> For all airport pick-ups, car parking is an additional cost charged at cost. Some airports charge for dropping off passengers (East Midlands, Birmingham, Stansted, Luton) - these charges are included in the quoted fare.</p>

            {/* Section 6: Cancellation Policy */}
            <h2 className="text-primary border-b border-border pb-2 mt-12">Section 6: Cancellation Policy</h2>
            
            <div className="bg-card border border-border rounded-lg p-6 my-6">
              <h4 className="text-foreground mt-0">Pick-up within the City of Nottingham</h4>
              <p className="mb-0">A minimum of <strong>15 minutes notice</strong> is required to cancel without charge. If less than 15 minutes' notice is given and the booking is allocated to a driver, a cancellation charge will be due.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 my-6">
              <h4 className="text-foreground mt-0">Pick-up outside City of Nottingham (within Nottinghamshire)</h4>
              <p className="mb-0"><strong>1 hour's notice</strong> is required. If less than 1 hour's notice is given and the booking has been allocated to a driver, a cancellation charge will be due.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 my-6">
              <h4 className="text-foreground mt-0">Pick-up outside Nottinghamshire / London / Heathrow</h4>
              <p className="mb-0">A minimum of <strong>4 hours' notice</strong> is required. If less than 4 hours' notice is given and the driver is at the pickup point, a full fare cancellation charge will be made.</p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 my-6">
              <h4 className="text-foreground mt-0">As Soon As Possible Cancellations</h4>
              <p className="mb-0">A cancellation charge applies if you book a car for as soon as possible and cancel after the driver is allocated. We provide a <strong>2-minute leeway</strong> - if you cancel within 2 minutes, no charge applies.</p>
            </div>

            <h3>No Show Cancellation Policy</h3>
            <ul>
              <li><strong>Non-Airport collections:</strong> Driver will be removed 30 minutes after pickup time if no contact has been made, and cancellation charges will apply.</li>
              <li><strong>Airport collections:</strong> Driver will consult with our call centre after 30 minutes. Cancellation charges will apply up to a maximum of 90 minutes after pickup time.</li>
            </ul>

            {/* Section 7: Legal */}
            <h2 className="text-primary border-b border-border pb-2 mt-12">Section 7: Legal</h2>
            
            <h3>Termination of Account</h3>
            <p>Business and credit/debit card accounts are terminable by either party in writing on seven days' notice. CLOUD CARS may terminate immediately if any amount is due and unpaid. Upon termination, all sums payable become immediately due.</p>

            <h3>No Waiver</h3>
            <p>Any failure by us or you in exercising any right under these terms will not act as a waiver.</p>

            <h3>Severance</h3>
            <p>If any part of these terms are found to be unlawful, invalid or unenforceable, that part shall be deemed deleted and the remaining terms shall continue to apply.</p>

            <h3>Third Party Rights</h3>
            <p>No rights shall arise under these terms to any person who is not a party to them.</p>

            <h3>Assignment</h3>
            <p>The contract is personal to you and you may not assign your rights without our prior written consent.</p>

            <h3>Applicable Law</h3>
            <p>The laws of England and Wales apply to these terms and conditions and any dispute shall be subject to the exclusive jurisdiction of the Courts of England and Wales.</p>

            {/* Contact Section */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mt-12">
              <h3 className="text-primary mt-0">Questions?</h3>
              <p className="text-foreground mb-4">If you have any questions about these terms and conditions, please contact us:</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="tel:01188244244" 
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Us: 0118 8 244 244
                </a>
                <a 
                  href="mailto:info@cloudcarsltd.com" 
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Email: info@cloudcarsltd.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
