import fs from 'fs';

const seoTitle = 'Vaishnavi Homeo Care Clinic — Trusted Homeopathic Care in Raipur'
const seoDescription = 'Vaishnavi Homeo Care Clinic offers personalized homeopathic treatment for migraines, gynecological concerns, piles and more. Book online or in-clinic consultations with experienced practitioners.'
const seoKeywords = 'homeopathy clinic, homeopathic treatment, homeopathic doctor, migraines treatment, gynecological homeopathy, piles treatment, Vaishnavi Homeo Care, Raipur homeopathy, online consultation, natural remedies'
const seoUrl = 'https://vaishnavihomeocare.com/'
const seoImage = '/assets/hero_image-Dxyz.webp'

const jsonLd = `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "name": "Vaishnavi Homeo Care",
      "description": "${seoDescription}",
      "url": "${seoUrl}",
      "logo": "${seoImage}",
      "telephone": "+918103828005",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "C-302, Wallfort Woods, Vidhan sabha road",
        "addressLocality": "Raipur",
        "addressRegion": "Chhattisgarh",
        "postalCode": "492001",
        "addressCountry": "IN"
      },
      "openingHours": ["Mo-Thu 11:00-13:30", "Fri 11:00-13:00"],
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 21.292918468904922,
        "longitude": 81.71982356729511
      }
    },
    {
      "@type": "WebSite",
      "url": "${seoUrl}",
      "name": "Vaishnavi Homeo Care",
      "description": "${seoDescription}"
    }
  ]
}`;

try {
  JSON.parse(jsonLd);
  console.log("JSON is valid!");
} catch (e) {
  console.log("Error parsing JSON:", e.message);
}
