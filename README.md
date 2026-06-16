# 🏥 MediCare Hospital Website

A complete, modern, responsive multi-page hospital website built with **React + Vite + Tailwind CSS**.

---

## ✨ Features

- **14 fully-built pages** with responsive layout
- **Sticky header** with mega dropdown navigation + mobile hamburger menu
- **Professional design system** — Playfair Display + Pliant Variable (local variable font) fonts, blue/teal/white palette
- **Smooth animations** — fade-in, slide-up, float effects
- **Dark footer** with quick links, social icons, and contact info
- **Form validation** — Appointment, Enquiry, Contact forms with error states + success UI
- **Mock API simulation** — Loading skeletons on dynamic pages (Awards, FAQ, Testimonials, etc.)
- **Lightbox gallery** — Photo Gallery with keyboard navigation
- **Video modal** — Video Gallery with overlay player
- **Search & filter** — Doctors, FAQ, Press Release, Testimonials all filterable
- **Pagination** — Testimonials paginated
- **Accordion FAQ** — Category-grouped, searchable
- **Testimonials carousel** — Auto-advancing with dot navigation on Home page
- **Star ratings** — Doctors, Testimonials, Enquiry form
- **Accessibility** — ARIA labels, keyboard navigation, focus states

---

## 📄 Pages

| Page | Route |
|------|-------|
| Home | `/` |
| About Us | `/about` |
| Services | `/services` |
| Our Doctors | `/doctors` |
| Awards | `/awards` |
| Patient FAQ | `/faq` |
| Infrastructure | `/hospital/infrastructure` |
| Hospital Gallery | `/hospital/gallery` |
| Facilities | `/hospital/facilities` |
| Testimonials | `/testimonials` |
| Blog | `/press` |
| Photo Gallery | `/gallery` |
| Video Gallery | `/videos` |
| Book Appointment | `/appointment` |
| Enquiry / Feedback | `/enquiry` |
| Contact Us | `/contact` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

---

## 🗂️ Project Structure

```
src/
├── components/
│   └── common/
│       ├── Header.jsx          # Sticky nav with dropdowns + mobile menu
│       ├── Footer.jsx          # Dark footer with links + social
│       ├── PageHero.jsx        # Reusable page banner with breadcrumbs
│       ├── LoadingSkeleton.jsx # Skeleton loaders for dynamic content
│       └── StarRating.jsx      # Reusable star rating component
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Doctors.jsx
│   ├── Awards.jsx
│   ├── FAQ.jsx
│   ├── Testimonials.jsx
│   ├── PressRelease.jsx
│   ├── PhotoGallery.jsx
│   ├── VideoGallery.jsx
│   ├── BookAppointment.jsx
│   ├── Enquiry.jsx
│   ├── Contact.jsx
│   └── hospital/
│       ├── Infrastructure.jsx
│       ├── PhotoGalleryHospital.jsx
│       └── Facilities.jsx
├── data/
│   └── mockData.js             # All mock API data
├── App.jsx                     # Router setup
├── main.jsx
└── index.css                   # Tailwind + custom styles
```

---

## 🎨 Design System

### Colors
- **Primary**: Blue (`#1e6fe6` base) — main actions, headers
- **Teal**: Green-teal (`#0d9488` base) — accents, highlights
- **Neutral**: Slate grays — text, backgrounds, borders

### Typography
- **Display**: Playfair Display (headings)
- **Body**: Pliant Variable (local variable font for body text and UI)

### Components
- `.btn-primary` — Blue CTA button
- `.btn-secondary` — Outlined button
- `.btn-teal` — Teal CTA button
- `.card` — Rounded card with soft shadow
- `.input-field` — Styled form input
- `.section-label` — Small uppercase label above headings
- `.section-title` — Large display heading

---

## 🔧 Customization

### Hospital Name & Info
Update in:
- `src/data/mockData.js` — All doctors, services, awards, etc.
- `src/components/common/Header.jsx` — Hospital name + logo
- `src/components/common/Footer.jsx` — Contact details

### Colors
Update `tailwind.config.js` `theme.extend.colors` to change the brand palette.

### Google Maps
Replace the `src` URL in `src/pages/Contact.jsx` with your actual Google Maps embed URL.

### Backend Integration
- Forms in `BookAppointment.jsx`, `Enquiry.jsx`, `Contact.jsx` have `handleSubmit` functions ready to replace the `setTimeout` simulation with real API calls.
- Dynamic pages simulate `useEffect` API calls — replace with `fetch()` or Axios.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| react | UI framework |
| react-dom | DOM rendering |
| react-router-dom | Client-side routing |
| lucide-react | Icon library |
| tailwindcss | Utility CSS framework |
| vite | Build tool |

---

## 🏗️ Production Deployment

```bash
npm run build
# Output in /dist — deploy to Vercel, Netlify, or any static host
```

For Vercel: Add a `vercel.json` with rewrites for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

Built with ❤️ for MediCare Hospital
