# 🚀 הוראות העלאה ל-Vercel

## שלבים פשוטים להעלאת האתר:

### דרך 1: דרך האתר של Vercel (מומלץ)

1. **היכנס ל-Vercel:**
   - גש ל-[vercel.com](https://vercel.com)
   - לחץ על "Sign Up" או "Log In"
   - התחבר עם חשבון GitHub שלך

2. **הוסף פרויקט חדש:**
   - לחץ על "Add New..." ובחר "Project"
   - בחר את הריפוזיטורי `AutoLead` מרשימת הריפוזיטוריות שלך
   - Vercel יזהה אוטומטית שזה פרויקט Next.js

3. **הגדרות הפרויקט:**
   - **Framework Preset:** Next.js (יזוהה אוטומטית)
   - **Root Directory:** `.` (ברירת מחדל)
   - **Build Command:** `npm run build` (אוטומטי)
   - **Output Directory:** `.next` (אוטומטי)

4. **משתני סביבה (אופציונלי):**
   - אם יש לך Google Tag Manager ID:
     ```
     NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
     ```

5. **לחץ על "Deploy":**
   - הפריסה תתחיל אוטומטית
   - ייקח בערך 1-2 דקות
   - אתה תקבל URL ייעודי מהסוג: `https://autolead-xxx.vercel.app`

### דרך 2: דרך ה-CLI (למתקדמים)

```bash
# התקן את Vercel CLI
npm install -g vercel

# היכנס לחשבון
vercel login

# העלה את הפרויקט
vercel

# לפריסה לפרודקשן
vercel --prod
```

## ⚙️ הגדרות מומלצות לאחר ההעלאה:

### 1. הגדרת דומיין מותאם אישית
- בדף הפרויקט ב-Vercel, לך ל-"Settings" > "Domains"
- הוסף את הדומיין שלך (למשל: `autolead.co.il`)
- עקוב אחר ההוראות להגדרת DNS

### 2. אופטימיזציית ביצועים
- Vercel מאפשר אוטומטית:
  - ✅ Automatic HTTPS
  - ✅ Edge Network (CDN)
  - ✅ Image Optimization
  - ✅ Serverless Functions

### 3. Analytics (אופציונלי)
- הפעל Vercel Analytics בהגדרות הפרויקט
- הוסף Google Analytics דרך GTM ID

### 4. הגדרות סביבה לפרודקשן
```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_SITE_URL=https://autolead.co.il
```

## 🔄 עדכונים אוטומטיים:

Vercel יפרוס אוטומטית כל push ל-branch הראשי:
- ✅ כל commit חדש → פריסה אוטומטית
- ✅ Preview deployments לכל PR
- ✅ Rollback פשוט לגרסאות קודמות

## 📱 בדיקת האתר לאחר העלאה:

### בדוק את הדברים הבאים:
- ✅ האתר נטען במהירות
- ✅ כל התמונות והאייקונים מוצגים
- ✅ הטופס עובד ושומר נתונים
- ✅ עמוד האדמין זמין ב-`/admin`
- ✅ האתר נראה טוב במובייל
- ✅ RTL (עברית) עובד כראוי

### כלי בדיקה:
1. **Lighthouse** - לבדיקת ביצועים ו-SEO
   - פתח Chrome DevTools
   - לחץ על טאב "Lighthouse"
   - הרץ audit

2. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - בדוק ציונים במובייל ובדסקטופ

3. **בדיקת Open Graph**
   - https://www.opengraph.xyz/
   - בדוק איך האתר ייראה בשיתוף ברשתות חברתיות

## 🐛 פתרון בעיות נפוצות:

### 1. האתר לא נטען:
- בדוק את ה-logs ב-Vercel Dashboard
- וודא שכל התלויות מותקנות: `npm install`

### 2. תמונות לא מוצגות:
- וודא שכל הקבצים בתיקיית `public/` קיימים
- בדוק נתיבי קבצים (`/logo.svg`, `/favicon.svg`)

### 3. שגיאות בבנייה:
- הרץ `npm run build` מקומית כדי לזהות שגיאות
- תקן שגיאות TypeScript/ESLint

### 4. LocalStorage לא עובד:
- זה נורמלי - LocalStorage עובד רק בצד הלקוח
- עבור לפתרון backend אמיתי (Supabase, Firebase, MongoDB)

## 📊 מעקב אחר ביצועים:

Vercel Dashboard מציג:
- 📈 מספר ביקורים
- ⚡ זמני טעינה
- 🌍 גיאוגרפיה של משתמשים
- 📱 סוגי מכשירים

## 🎉 סיימת!

האתר שלך עכשיו חי ב-:
- Production URL: `https://autolead.vercel.app` (או הדומיין המותאם שלך)
- Admin: `https://autolead.vercel.app/admin`

## 📝 הערות חשובות:

1. **אבטחת עמוד Admin:**
   - כרגע אין אימות!
   - בפרודקשן אמיתית - הוסף NextAuth.js או Auth0
   - העבר נתונים למסד נתונים אמיתי

2. **מסד נתונים:**
   - כרגע משתמש ב-LocalStorage
   - עבור ל-Supabase/Firebase/MongoDB לפרודקשן

3. **דומיין מותאם:**
   - רכוש דומיין (namecheap, godaddy)
   - חבר אותו ב-Vercel Settings

---

**זקוק לעזרה?**
- תיעוד Vercel: https://vercel.com/docs
- תיעוד Next.js: https://nextjs.org/docs
- תמיכה: support@vercel.com
