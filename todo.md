# Cloud Cars Website TODO

## Core Pages & Sections
- [x] Hero section with professional imagery and booking CTA
- [x] Service tiers display (Standard, Executive, Corporate)
- [x] Corporate accounts section for business clients
- [x] Driver recruitment section with benefits and application
- [x] Trust indicators section (British heritage, local expertise)
- [x] Online booking system with quote generation
- [x] About section highlighting Nottingham presence
- [x] Contact information and comprehensive footer

## Database & Backend
- [x] Booking requests table schema
- [x] Driver applications table schema
- [x] Corporate inquiries table schema
- [x] Contact messages table schema
- [x] Booking request procedure
- [x] Driver application procedure
- [x] Corporate inquiry procedure
- [x] Contact form procedure
- [x] Quote calculation procedure

## Frontend Components
- [x] Navigation header with logo and menu
- [x] Hero component with background and CTA
- [x] Service cards component
- [x] Corporate benefits component
- [x] Driver recruitment component
- [x] Trust indicators component
- [x] Booking form component
- [x] Quote display component
- [x] About section component
- [x] Footer component

## Styling & Design
- [x] Professional color scheme (navy, gold accents)
- [x] Typography setup with professional fonts
- [x] Responsive design for all screen sizes
- [x] Dark theme with premium feel

## Branding Updates
- [x] Replace placeholder logo with official Cloud Cars logo
- [x] Update colour scheme from gold/yellow to brand green (#2EAE4E)
- [x] Update all accent colours throughout the site

## Content Updates
- [x] Rewrite hero section with original content
- [x] Rewrite services section with unique descriptions
- [x] Rewrite trust indicators with original messaging
- [x] Rewrite corporate section with unique content
- [x] Rewrite driver recruitment section with original copy
- [x] Rewrite about section with unique story
- [x] Rewrite contact section messaging
- [x] Update footer content

## Phone Number Update
- [x] Update phone number to 0118 8 244 244 in Header
- [x] Update phone number to 0118 8 244 244 in Hero (not needed - no phone in Hero)
- [x] Update phone number to 0118 8 244 244 in Booking
- [x] Update phone number to 0118 8 244 244 in Contact
- [x] Update phone number to 0118 8 244 244 in Footer

## Content Management System (CMS)
- [x] Create site_content table for editable text content
- [x] Create site_images table for uploadable images
- [x] Create CMS API procedures for CRUD operations
- [x] Build admin dashboard layout with sidebar navigation
- [x] Create content editor page for text sections
- [x] Create image manager page for uploading/managing images
- [x] Update Hero component to use CMS content
- [x] Update Services component to use CMS content
- [x] Update About component to use CMS content
- [x] Update Trust component to use CMS content
- [x] Update Corporate component to use CMS content
- [x] Update Drivers component to use CMS content
- [x] Update Contact component to use CMS content
- [x] Add image upload functionality with S3 storage
- [x] Add admin-only access control to CMS dashboard

## New Services Update
- [x] Reorganise services: Car Service, Courier Service, Airport Transfers, Executive Service
- [x] Add Courier Service section with details
- [x] Add Larger Vehicles section (7-16 seaters)
- [x] Add email booking info for larger vehicles (bookings@cloudcarsltd.com)
- [x] Add 72-hour notice requirement for larger vehicle bookings
- [x] Update Services component with new service cards
- [x] Update booking form to include new service types

## External Booking Portal
- [x] Update Hero "Book Your Ride" button to link to https://book.cloudcarsltd.com/portal/#/booking
- [x] Update Header "Book Now" button to link to external portal
- [x] Update all service card "Book Now" buttons to link to external portal
- [x] Simplify booking section to redirect to external portal

## Bug Fixes
- [x] Fix CMS getContent procedure to return default object instead of undefined
- [x] Fix CMS getImage procedure to return default object instead of undefined

## UI Changes
- [x] Remove map from Contact section

## About & Stats Updates
- [x] Add Nottingham/UK road images to About section (keep handshake)
- [x] Fix broken Cloud Cars logo in footer
- [x] Change 50k journeys to 100k+ journeys
- [x] Remove driver count stat (100+ drivers)
- [x] Remove per-mile pricing from Services section

## Pricing & App Updates
- [x] Remove "metered fares" - change to fixed pricing text
- [x] Add mobile app promotion section (iPhone & Android)

## App Links & Image Updates
- [x] Update Google Play link to actual URL
- [x] Update App Store link to actual URL
- [x] Replace American road image with UK M1 motorway image in About section

## Nottingham Image Update
- [x] Replace countryside road image with iconic Nottingham landmark image in About section

## Terms and Conditions Page
- [x] Create Terms page component with formatted content
- [x] Add route to App.tsx
- [x] Add link in footer

## Updated Terms Page
- [x] Replace Terms page with comprehensive version including privacy, cookies, and all policies

## Footer Updates
- [x] Add licensing info (Rushcliffe and Nottingham City Council)
- [x] Add social media icons (X, Instagram, Facebook) with links

## Privacy Policy Page
- [x] Create Privacy page component with formatted content
- [x] Add route to App.tsx
- [x] Update footer Privacy link to /privacy

## Sustainability & Cookies
- [x] Create Sustainability section component (hybrid fleet, low emissions, carbon footprint)
- [x] Add Sustainability section to Home page
- [x] Create Cookies Policy page
- [x] Add route to App.tsx for Cookies page
- [x] Update footer Cookies link to /cookies

## Bug Fixes & FAQ Page
- [ ] Fix founding year from 2009 to 2012 across the website
- [ ] Create FAQ page based on existing Squarespace FAQ
- [ ] Update footer FAQ link to /faq

## Multiple Updates Requested
- [ ] Fix phone number from 0118 8 244 244 to 0115 8 244 244 across the website
- [ ] Remove Find Us and We're Always Open boxes from Contact section
- [ ] Remove address from footer
- [ ] Add TikTok icon to social media in footer (https://www.tiktok.com/@cloudcars1)
- [ ] Remove Experian, Capital One, Games Workshop, Nottingham Trent University from corporate clients
- [ ] Add Nottinghamshire Healthcare Trust to corporate clients
- [ ] Fix founding year from 2009 to 2012
- [ ] Create FAQ page based on existing Squarespace FAQ

## Advanced Inquiry Management Features
- [x] Add assignedTo field to all inquiry tables
- [ ] Add email tracking table to log sent emails (deferred)
- [ ] Create email sending service with SendGrid/Mailgun integration (deferred)
- [x] Add assignment dropdown to inquiry cards
- [x] Add response time badges with color coding
- [ ] Add filter by assigned person (future enhancement)
- [ ] Request email service API key from user (deferred)

## Team Members Management
- [x] Create team_members table in database
- [x] Add CRUD procedures for team members
- [x] Create Team Members settings page
- [x] Update Inquiries page to fetch team members dynamically
- [x] Add validation to prevent deleting assigned team members

## Mailgun Email Integration
- [x] Install Mailgun SDK
- [x] Create email templates system
- [x] Update email service to use Mailgun API
- [x] Add email sending procedures with template support
- [ ] Request Mailgun API credentials from user
- [ ] Add email dialog with template selector in Inquiries page
- [ ] Track sent emails in database

## Inquiry Analytics Dashboard
- [ ] Create analytics queries (trends, conversion rates, response times)
- [ ] Build Analytics dashboard page with charts
- [ ] Add date range filters
- [ ] Show key metrics (total inquiries, conversion rates, avg response time)
- [ ] Add trend charts for each inquiry type
- [ ] Add route to admin navigation

## SEO and Content Issues
- [x] Fix corporate clients list - verify only 3 businesses showing (Boots UK, Speedo, Nottinghamshire Healthcare Trust)
- [x] Add meta keywords to homepage
- [x] Add meta description to all pages
- [x] Add structured data for local business SEO

## Mailgun EU Region Support
- [x] Update email service to support MAILGUN_API_BASE_URL for EU region
- [ ] Request Mailgun credentials from user (API key, domain, base URL)
- [ ] Test email sending functionality

## CRITICAL: Corporate Clients List Reverting
- [x] Investigate why corporate clients list keeps reverting to 6 companies
- [x] Fix to show only 3: Boots UK, Speedo, Nottinghamshire Healthcare Trust
- [ ] Verify fix persists after publish

## CRITICAL: Driver Application Form Error
- [x] Fix database insertion error when submitting driver applications
- [x] Test form submission works correctly
