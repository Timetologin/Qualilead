# AutoLead - Premium Israeli Telemarketing Website

A complete, production-ready Next.js website for AutoLead, an Israeli automotive lead generation company specializing in trade-ins and car financing.

## ✨ Features

- **100% Hebrew & RTL** - Full right-to-left support with Hebrew content
- **Premium Design** - Sleek, modern automotive tech aesthetic with glassmorphism
- **Responsive** - Mobile-first design that works on all devices
- **Lead Generation Form** - Client-side validation with Israeli phone format
- **Admin Dashboard** - Lead management with CSV export (development only)
- **SEO Optimized** - Full meta tags, JSON-LD schema, Open Graph, and Twitter Cards
- **Performance** - Optimized with Lighthouse 90+ scores target
- **Accessibility** - WCAG compliant with semantic HTML and ARIA labels
- **Cookie Consent** - GDPR-compliant cookie banner in Hebrew
- **Google Tag Manager** - Ready for analytics integration
- **Smooth Animations** - Framer Motion for elegant transitions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd autolead-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
autolead-nextjs/
├── pages/
│   ├── _app.js           # App wrapper with cookie consent
│   ├── _document.js      # HTML document structure
│   ├── index.js          # Homepage with all sections
│   ├── admin.js          # Lead management dashboard
│   └── api/
│       ├── robots.txt.js # SEO robots file
│       └── sitemap.xml.js # XML sitemap
├── public/
│   ├── logo.svg          # AutoLead logo
│   ├── favicon.ico       # Favicon (placeholder)
│   ├── apple-touch-icon.png # iOS icon (placeholder)
│   └── og-image.jpg      # Open Graph image (placeholder)
├── styles/
│   └── globals.css       # Global styles with RTL support
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── README.md
```

## 🎨 Key Sections

### Homepage (`/`)
- **Header** - Sticky navigation with AutoLead logo and CTA
- **Hero** - Bold headline with primary/secondary CTAs
- **Lead Form** - Hebrew form with validation and LocalStorage
- **Why Choose Us** - 6 feature cards with icons
- **How It Works** - 4-step process visualization
- **Testimonials** - Customer reviews
- **FAQ** - Accordion-style answers
- **CTA Section** - Phone and WhatsApp links
- **Footer** - Contact info and links

### Admin Dashboard (`/admin`)
- **Lead Table** - Display all submitted leads
- **Search & Filter** - Find leads by name, phone, or type
- **CSV Export** - Download leads data
- **Delete** - Remove individual leads
- **Stats** - Summary cards with counts

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

The Google Tag Manager will only load if:
1. The GTM ID is set
2. User accepts cookies

### Customization

#### Colors (tailwind.config.js)
```javascript
colors: {
  primary: '#e11d48',  // Red
  dark: '#111',        // Black
  'dark-gray': '#222', // Dark gray
}
```

#### Phone Numbers
Replace placeholder phone numbers throughout:
- `+972501234567` → Your actual number
- Update in Hero, CTA Section, Footer

#### Email & Address
Update in Footer component:
- `info@autolead.co.il` → Your email
- Add actual business address

#### Domain
Replace `https://autolead.co.il` in:
- `pages/index.js` (SEO meta tags)
- `pages/api/sitemap.xml.js`

## 🖼️ Assets to Replace

1. **favicon.ico** - Create a proper 32x32 or 16x16 ICO file
2. **apple-touch-icon.png** - 180x180 PNG for iOS
3. **og-image.jpg** - 1200x630 image for social sharing

## 📱 Lead Form Details

### Form Fields:
- **שם מלא** (Full Name) - Required
- **טלפון** (Phone) - Israeli format 05X-XXXXXXX with validation
- **סוג פנייה** (Inquiry Type) - Trade-in or Financing
- **תקנון** (Terms) - Checkbox required

### Data Storage:
- Saves to `localStorage` as `autolead-leads`
- Each lead includes: name, phone, type, timestamp, unique ID
- Admin page reads from same LocalStorage

### Validation:
- Name: Cannot be empty
- Phone: Must start with 05, 9-10 digits
- Type: Must select option
- Terms: Must be checked

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel auto-detects Next.js
   - Add environment variables if needed
   - Deploy!

### Build for Production

```bash
npm run build
npm start
```

## 📊 Performance Optimizations

- ✅ Preconnect to Google Fonts
- ✅ Image lazy loading with next/image
- ✅ Code splitting by route
- ✅ Minimal bundle size
- ✅ CSS purging via Tailwind
- ✅ Optimized animations
- ✅ Lighthouse 90+ targets

## ♿ Accessibility

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states
- Color contrast WCAG AA compliant
- Skip to content link
- Screen reader friendly

## 🔒 Security Notes

⚠️ **IMPORTANT:** The admin page (`/admin`) has NO authentication and is for development/demo purposes only.

For production:
- Implement proper authentication (NextAuth.js, Auth0, etc.)
- Move leads to a backend database
- Add API routes with authentication
- Remove LocalStorage dependency

## 📝 Content Management

All Hebrew content is in `pages/index.js`. Search for these sections to edit:
- Hero title/subtitle
- Feature bullets
- Process steps
- Testimonials
- FAQ questions/answers
- Footer contact info

## 🛠️ Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS 3
- **Animations:** Framer Motion
- **Language:** JavaScript (ES6+)
- **Deployment:** Vercel-ready

## 📞 Support

For questions or issues:
- Review this README
- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Tailwind CSS docs: [tailwindcss.com/docs](https://tailwindcss.com/docs)

## 📄 License

© 2025 AutoLead. All rights reserved.

---

**Built with ❤️ for AutoLead**
"# AutoLead" 
