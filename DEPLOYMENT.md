# 🚀 AutoLead - Quick Deployment Guide

## Step 1: Install Dependencies
```bash
cd autolead-nextjs
npm install
```

## Step 2: Run Development Server
```bash
npm run dev
```
Open http://localhost:3000 in your browser.

## Step 3: Test the Site
1. ✅ Check that the homepage loads in Hebrew/RTL
2. ✅ Fill out and submit the lead form
3. ✅ Navigate to /admin to see your submitted lead
4. ✅ Test CSV export
5. ✅ Verify all links work

## Step 4: Customize Content
Edit `pages/index.js` to update:
- Phone numbers (search for `+972501234567`)
- WhatsApp links
- Email address
- Physical address
- Company information

## Step 5: Replace Assets
Replace placeholder files in `/public/`:
- `favicon.ico` - 16x16 or 32x32 icon
- `apple-touch-icon.png` - 180x180 PNG
- `og-image.jpg` - 1200x630 social media image

## Step 6: Set Environment Variables (Optional)
Create `.env.local`:
```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

## Step 7: Build for Production
```bash
npm run build
npm start
```

## Step 8: Deploy to Vercel

### Option A: Deploy via Git
1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial AutoLead website"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel auto-detects Next.js settings
6. Add environment variables if needed
7. Click "Deploy"

### Option B: Deploy via CLI
```bash
npm install -g vercel
vercel login
vercel
```

## Step 9: Connect Custom Domain
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add `autolead.co.il`
4. Update DNS records as shown

## Step 10: Enable Analytics
1. Add your GTM ID in Vercel environment variables
2. Or use Vercel Analytics (free):
   - Go to "Analytics" tab in Vercel
   - Click "Enable"

## Important Notes

⚠️ **Security**: The `/admin` page has NO authentication. For production:
- Implement NextAuth.js or similar
- Move leads to a real database (MongoDB, PostgreSQL, etc.)
- Add API routes with proper auth

📱 **Phone Numbers**: Update all placeholder numbers:
- Hero section
- CTA sections  
- Footer
- WhatsApp links

📧 **Contact Info**: Update:
- Email: `info@autolead.co.il`
- Physical address in footer
- Social media links (if applicable)

🌐 **Domain**: Replace `https://autolead.co.il` in:
- `pages/index.js` (meta tags)
- `pages/api/sitemap.xml.js`

## Performance Checklist
- ✅ Run `npm run build` to check bundle size
- ✅ Test on mobile devices
- ✅ Check Lighthouse scores (aim for 90+)
- ✅ Verify all images load properly
- ✅ Test form submission
- ✅ Test admin page functionality

## Troubleshooting

**Issue**: Form not submitting
- Check browser console for errors
- Verify LocalStorage is enabled
- Test in incognito/private mode

**Issue**: Hebrew not displaying correctly
- Ensure font is loading (check Network tab)
- Verify RTL styles are applied
- Check browser language settings

**Issue**: Admin page empty
- Submit a lead first via homepage
- Check LocalStorage in DevTools
- Verify key is `autolead-leads`

## Support Resources
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- Vercel Support: https://vercel.com/support

---

**You're all set! 🎉**

The site is now ready to generate leads for AutoLead.
