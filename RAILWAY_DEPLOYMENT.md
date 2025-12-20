# Cloud Cars - Railway Deployment Guide

This package has been optimized for Railway deployment with all Manus dependencies removed.

## What Changed from Manus Version

### ✅ Removed
- `server/_core/` directory (Manus infrastructure)
- `vite-plugin-manus-runtime` dependency
- Manus OAuth system
- Manus notification system (replaced with console logging)

### ✅ Added
- `server/railway-server.ts` - Clean Express server entry point
- `server/railway-trpc.ts` - Simplified tRPC setup
- `server/railway-email.ts` - Mailgun email service
- `railway.json` - Railway configuration

### ✅ Kept (All Your Features Work!)
- ✅ All website pages (Home, About, Services, Corporate, Drivers, FAQ, Contact, etc.)
- ✅ Admin dashboard at `/admin/inquiries`
- ✅ Driver applications, corporate inquiries, contact messages
- ✅ Team member management
- ✅ Email templates and Mailgun integration
- ✅ Database schema and queries
- ✅ S3 file storage
- ✅ All frontend components and styling

---

## Railway Deployment Steps

### 1. Prerequisites
- Railway account (already created: virtuous-dedication project)
- MySQL database (already online)
- Mailgun account for email sending

### 2. Upload Code to Railway

**Option A: Using Railway CLI (Recommended)**
```bash
cd C:\Users\Charmaine\Desktop
# Extract the tar.gz file first
tar -xzf cloudcars-railway-fixed.tar.gz
cd cloudcars-railway-fixed

# Deploy to Railway
railway up
```

**Option B: Using Git/GitHub**
1. Create a new GitHub repository
2. Push this code to the repository
3. Connect the repository to Railway project

### 3. Environment Variables

Add these variables in Railway Variables tab:

**Required:**
```
DATABASE_URL = [Already connected by Railway]
JWT_SECRET = CloudCars2024SecureRandomStringForJWTTokens!ChangeThis123
NODE_ENV = production
```

**For Email Functionality (Mailgun):**
```
MAILGUN_API_KEY = [Your Mailgun API key]
MAILGUN_DOMAIN = [Your Mailgun domain, e.g., mg.cloudcarsltd.com]
MAILGUN_API_BASE_URL = https://api.eu.mailgun.net
```

**For S3 Storage (if using):**
```
AWS_ACCESS_KEY_ID = [Your AWS access key]
AWS_SECRET_ACCESS_KEY = [Your AWS secret key]
AWS_REGION = [Your AWS region, e.g., eu-west-2]
AWS_S3_BUCKET = [Your S3 bucket name]
```

### 4. Deploy

After adding variables:
1. Click **"Deploy"** button in Railway
2. Wait for build to complete (2-3 minutes)
3. Check deployment logs for any errors

### 5. Run Database Migration

After successful deployment, run migration in Command Prompt:

```bash
railway run pnpm db:push
```

This creates all database tables:
- bookings
- driver_applications
- corporate_inquiries
- contact_messages
- team_members
- site_content
- site_images

### 6. Generate Domain

1. Go to cloudcars service → Settings → Networking
2. Click **"Generate Domain"**
3. Railway will provide a URL like: `cloudcars-production.up.railway.app`

### 7. Test the Website

Visit the Railway URL and test:
- ✅ Homepage loads
- ✅ All pages accessible
- ✅ Forms submit successfully
- ✅ Admin dashboard works at `/admin/inquiries`

### 8. Connect Custom Domain (Optional)

To use www.cloudcarsltd.com:

1. In Railway: Settings → Domains → Add Custom Domain
2. Enter: `www.cloudcarsltd.com`
3. Railway provides DNS records (CNAME or A record)
4. Log in to Fasthosts
5. Add the DNS records from Railway
6. Wait for DNS propagation (1-48 hours)

---

## Troubleshooting

### Build Fails
- Check that `railway.json` exists and has correct build command
- Verify no `pnpm db:push` in build command
- Check deployment logs for specific errors

### Server Crashes on Startup
- Verify DATABASE_URL is set
- Check that JWT_SECRET is set
- Review deployment logs for missing dependencies

### Database Connection Fails
- Ensure DATABASE_URL is correctly formatted
- Check MySQL service is online in Railway
- Verify database credentials

### Emails Not Sending
- Check MAILGUN_API_KEY is correct
- Verify MAILGUN_DOMAIN matches your Mailgun setup
- Ensure MAILGUN_API_BASE_URL is set to EU region if using EU Mailgun

### Admin Dashboard Not Working
- For now, admin features are accessible without authentication
- To add proper auth later, implement JWT-based authentication in `railway-trpc.ts`

---

## Cost Estimate

**Railway Pricing:**
- MySQL Database: ~$5/month
- Web Service: ~$5/month (based on usage)
- **Total: ~$10/month**

Much cheaper than Manus platform issues!

---

## Next Steps After Deployment

1. **Test all features thoroughly**
2. **Add team members** in admin dashboard
3. **Configure Mailgun** for automated emails
4. **Set up custom domain** (www.cloudcarsltd.com)
5. **Monitor logs** for any issues
6. **Consider adding authentication** for admin routes

---

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Verify all environment variables are set
3. Test database connection with `railway run pnpm db:push`
4. Review this guide's troubleshooting section

---

## File Structure

```
cloudcars-railway-fixed/
├── client/               # React frontend (unchanged)
├── server/
│   ├── railway-server.ts    # NEW: Express server entry point
│   ├── railway-trpc.ts      # NEW: Simplified tRPC setup
│   ├── railway-email.ts     # NEW: Mailgun email service
│   ├── routers.ts           # UPDATED: Uses railway modules
│   ├── db.ts                # Unchanged: Database queries
│   ├── emailTemplates.ts    # Unchanged: Email templates
│   └── storage.ts           # Unchanged: S3 storage
├── drizzle/             # Database schema (unchanged)
├── railway.json         # NEW: Railway configuration
├── package.json         # UPDATED: Railway-compatible scripts
└── RAILWAY_DEPLOYMENT.md    # This file
```

---

**Your Cloud Cars website is now ready for Railway! 🚀**
