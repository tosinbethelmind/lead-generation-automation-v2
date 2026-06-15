import { NextRequest, NextResponse } from 'next/server';
import { getActiveLeadRepository } from '@/lib/googleSheets';
import { getDesignTheme, buildFallbackCopy } from '../generate/route';
import { parseScalingConfig } from '@/lib/scalingHelper';
import fs from 'fs';
import path from 'path';

const OVERRIDES_DIR = path.join(process.cwd(), 'src', 'data', 'overrides');

export async function GET(req: NextRequest) {
  try {
    const { searchParams, origin } = new URL(req.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Missing leadId parameter' }, { status: 400 });
    }

    const repo = getActiveLeadRepository();
    const lead = await repo.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: `Lead ${leadId} not found` }, { status: 404 });
    }

    // Load Default Theme & Copy
    const defaultTheme = getDesignTheme(lead.category);
    const defaultCopy = buildFallbackCopy(lead);

    // Merge custom overrides if available
    const overridesPath = path.join(OVERRIDES_DIR, `${leadId}.json`);
    let overrides: any = {};
    if (fs.existsSync(overridesPath)) {
      try {
        overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
      } catch (err) {
        console.warn('Failed to parse overrides for export:', err);
      }
    }

    const theme = { ...defaultTheme, ...overrides.theme };
    const copy = { ...defaultCopy, ...overrides.copy };
    const visibility = {
      showTestimonials: true,
      showServices: true,
      showEstimator: true,
      showAbout: true,
      ...overrides.visibility
    };
    const services = overrides.services || copy.services;

    // Load Scaling & Booking Submission configurations
    const scaling = parseScalingConfig(lead.notes);
    const submissionType = scaling.submissionType;
    const submissionKey = scaling.submissionKey;

    // Central target URL for central-CRM option
    const centralActionUrl = `${origin}/api/preview/test-lead`;

    // Compile standalone HTML template
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lead.name} | Professional Services</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700&family=DM+Serif+Display&family=Lora:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;600;700&family=Barlow:wght@600;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Lucide Vector Icons script -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              primary: '${theme.primary}',
              accent: '${theme.accent}',
              bg: '${theme.bg}',
              text: '${theme.text}'
            }
          },
          fontFamily: {
            sans: ['${theme.font === 'Playfair Display' || theme.font === 'DM Serif Display' ? 'Lora' : 'Inter'}', 'sans-serif'],
            title: ['${theme.font}', 'sans-serif']
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: ${theme.bg};
      color: ${theme.text};
    }
  </style>
</head>
<body class="font-sans antialiased min-h-screen relative overflow-x-hidden">

  <!-- Floating background gradients -->
  <div class="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none"></div>
  <div class="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-brand-accent/15 blur-3xl pointer-events-none"></div>

  <!-- Header Section -->
  <header class="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-brand-primary/10 transition-all">
    <div class="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="font-title text-2xl font-bold tracking-tight text-brand-primary">${lead.name}</span>
      </div>
      
      <div class="flex items-center gap-6">
        <a href="tel:${lead.phone_e164}" class="hidden sm:flex items-center gap-2 text-brand-text/80 font-semibold hover:text-brand-primary">
          <i data-lucide="phone" class="w-4 h-4"></i>
          <span>${lead.phone_raw}</span>
        </a>
        <a href="#booking" class="bg-brand-primary text-white hover:opacity-90 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all shadow-md shadow-brand-primary/20">
          Book Appointment
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="max-w-6xl mx-auto px-6 py-16 sm:py-24 grid md:grid-cols-12 gap-12 items-center">
    <div class="md:col-span-7 flex flex-col gap-6 text-left">
      <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider self-start">
        <i data-lucide="award" class="w-3.5 h-3.5"></i> Top-Rated Local Business
      </span>
      <h1 class="font-title text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight text-brand-primary">
        ${copy.heroTitle}
      </h1>
      <p class="text-lg sm:text-xl text-brand-text/80 font-medium leading-relaxed">
        ${copy.heroSubtitle}
      </p>
      <div class="flex flex-wrap gap-4 pt-2">
        <a href="#booking" class="bg-brand-primary text-white hover:opacity-95 px-8 py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/25 transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2">
          ${copy.ctaText} <i data-lucide="arrow-right" class="w-5 h-5"></i>
        </a>
        <a href="#services" class="border border-brand-primary/25 bg-white/40 text-brand-primary hover:bg-brand-primary/5 px-8 py-4 rounded-xl font-bold transition-all inline-flex items-center gap-2">
          Our Services
        </a>
      </div>
    </div>
    <div class="md:col-span-5 relative">
      <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-brand-primary/10">
        <img src="${theme.heroImage}" alt="${lead.name}" class="w-full h-full object-cover">
      </div>
      <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-brand-primary/5 flex items-center gap-3">
        <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center text-green-600">
          <i data-lucide="shield-check" class="w-6 h-6"></i>
        </div>
        <div>
          <div class="font-bold text-sm text-gray-800">Google Verified</div>
          <div class="text-xs text-gray-500">${lead.rating} Stars • ${lead.reviews_count} Reviews</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  ${visibility.showServices ? `
  <section id="services" class="bg-white/40 py-20 border-t border-b border-brand-primary/5">
    <div class="max-w-6xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="font-title text-3xl sm:text-4xl font-extrabold text-brand-primary mb-4">Our Services & Solutions</h2>
        <p class="text-brand-text/80 font-medium">We deliver reliable, top-quality results tailored to meet your unique business objectives.</p>
      </div>
      
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        ${services.map((svc: any) => `
          <div class="bg-white p-8 rounded-xl border border-brand-primary/10 shadow-sm hover:shadow-md transition-all hover:border-brand-primary/30 group">
            <div class="w-12 h-12 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
              <span class="text-2xl">${svc.icon || '⭐'}</span>
            </div>
            <h3 class="font-title text-xl font-bold text-brand-primary mb-3">${svc.title}</h3>
            <p class="text-brand-text/75 text-sm leading-relaxed">${svc.description}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- About Us Section -->
  ${visibility.showAbout ? `
  <section class="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
    <div>
      <h2 class="font-title text-3xl sm:text-4xl font-extrabold text-brand-primary mb-6">About ${lead.name}</h2>
      <p class="text-brand-text/85 text-base leading-relaxed mb-6">
        ${copy.aboutText}
      </p>
      <div class="grid grid-cols-2 gap-6 bg-white/50 p-6 rounded-xl border border-brand-primary/10">
        <div>
          <div class="text-3xl font-extrabold text-brand-primary">${lead.rating} ★</div>
          <div class="text-xs text-brand-text/70 uppercase tracking-wider font-bold mt-1">Google Rating</div>
        </div>
        <div>
          <div class="text-3xl font-extrabold text-brand-primary">${lead.reviews_count}+</div>
          <div class="text-xs text-brand-text/70 uppercase tracking-wider font-bold mt-1">Happy Clients</div>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4 bg-white p-8 rounded-2xl border border-brand-primary/10 shadow-lg">
      <h3 class="font-title text-xl font-bold text-brand-primary mb-2">Our Local Presence</h3>
      <div class="flex gap-3 text-brand-text/80 text-sm">
        <i data-lucide="map-pin" class="w-5 h-5 text-brand-primary shrink-0"></i>
        <span>${lead.address || `${lead.area}, ${lead.city}, Nigeria`}</span>
      </div>
      <div class="flex gap-3 text-brand-text/80 text-sm mt-2">
        <i data-lucide="phone" class="w-5 h-5 text-brand-primary shrink-0"></i>
        <span>${lead.phone_raw}</span>
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Booking & Custom Form Widget Section -->
  <section id="booking" class="bg-brand-primary/5 py-20 border-t border-brand-primary/5">
    <div class="max-w-xl mx-auto px-6">
      <div class="bg-white p-8 sm:p-10 rounded-2xl border border-brand-primary/15 shadow-xl">
        <div class="text-center mb-8">
          <h2 class="font-title text-2xl sm:text-3xl font-extrabold text-brand-primary mb-2">Book an Appointment</h2>
          <p class="text-sm text-brand-text/75">Fill out the quick form below and our team will get in touch with you shortly.</p>
        </div>

        <div id="status-msg" class="mb-6"></div>

        <form id="booking-form" class="flex flex-col gap-5">
          <div>
            <label class="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Your Name</label>
            <input id="client-name" type="text" required placeholder="e.g. Kolawole Alao" class="w-full px-4 py-3 rounded-lg border border-brand-primary/15 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all">
          </div>
          <div>
            <label class="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Email Address</label>
            <input id="client-email" type="email" required placeholder="name@company.com" class="w-full px-4 py-3 rounded-lg border border-brand-primary/15 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all">
          </div>
          <div>
            <label class="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Phone Number</label>
            <input id="client-phone" type="tel" required placeholder="e.g. +234 803 123 4567" class="w-full px-4 py-3 rounded-lg border border-brand-primary/15 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all">
          </div>
          <div>
            <label class="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">Special Request / Details</label>
            <textarea id="client-message" rows="3" placeholder="Tell us more about how we can help you..." class="w-full px-4 py-3 rounded-lg border border-brand-primary/15 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"></textarea>
          </div>
          <button id="submit-btn" type="submit" class="w-full bg-brand-primary hover:opacity-95 text-white py-4 rounded-lg font-bold shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 mt-2">
            ${copy.ctaText}
          </button>
        </form>
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  ${visibility.showTestimonials ? `
  <section class="max-w-6xl mx-auto px-6 py-20 border-t border-brand-primary/5">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="font-title text-3xl font-extrabold text-brand-primary mb-4">What Our Clients Say</h2>
      <p class="text-brand-text/75">We are proud of our Google Maps verified rating of ${lead.rating} ★, built on real client stories.</p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      ${copy.testimonials.map((t: any) => `
        <div class="bg-white p-8 rounded-xl border border-brand-primary/10 shadow-sm flex flex-col gap-4">
          <div class="flex text-yellow-500 gap-1">
            ${Array.from({ length: t.rating || 5 }).map(() => `<i data-lucide="star" class="w-4 h-4 fill-yellow-500"></i>`).join('')}
          </div>
          <p class="text-brand-text/80 italic text-sm leading-relaxed">"${t.text}"</p>
          <div class="font-bold text-xs uppercase tracking-wider text-brand-primary">— ${t.name}</div>
        </div>
      `).join('')}
    </div>
  </section>
  ` : ''}

  <!-- Footer Section -->
  <footer class="bg-brand-primary text-white py-12 border-t border-brand-primary/15">
    <div class="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div>
        <span class="font-title text-xl font-bold tracking-tight">${lead.name}</span>
        <p class="text-xs opacity-70 mt-1">© ${new Date().getFullYear()} All Rights Reserved.</p>
      </div>
      <div class="flex gap-6 text-sm opacity-90">
        <a href="#services" class="hover:underline">Services</a>
        <a href="#booking" class="hover:underline">Contact Us</a>
      </div>
    </div>
  </footer>

  <!-- Lucide Icon Initialization -->
  <script>
    lucide.createIcons();
  </script>

  <!-- Form Submission Handler Script -->
  <script>
    document.getElementById('booking-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-btn');
      const statusDiv = document.getElementById('status-msg');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Submitting...';
      
      const payload = {
        name: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        message: document.getElementById('client-message').value,
        leadId: "${leadId}"
      };
      
      try {
        let url = "${centralActionUrl}";
        let options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        };
        
        const type = "${submissionType}";
        const key = "${submissionKey}";
        
        if (type === 'web3forms') {
          url = 'https://api.web3forms.com/submit';
          const formData = new FormData();
          formData.append('access_key', key);
          formData.append('name', payload.name);
          formData.append('email', payload.email);
          formData.append('phone', payload.phone);
          formData.append('message', payload.message);
          formData.append('subject', 'New Website Booking - ' + "${lead.name}");
          options = {
            method: 'POST',
            body: formData
          };
        } else if (type === 'sheets') {
          url = key;
          options = {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          };
        } else if (type === 'supabase') {
          const parts = key.split('::');
          const supabaseUrl = parts[0];
          const supabaseAnonKey = parts[1];
          url = supabaseUrl + '/rest/v1/bookings';
          options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseAnonKey,
              'Authorization': 'Bearer ' + supabaseAnonKey,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              name: payload.name,
              email: payload.email,
              phone: payload.phone,
              message: payload.message,
              created_at: new Date().toISOString()
            })
          };
        }
        
        const response = await fetch(url, options);
        statusDiv.innerHTML = '<div class="p-4 bg-green-500/20 text-green-300 rounded-lg text-center font-medium border border-green-500/30">✓ Booking Submitted Successfully!</div>';
        document.getElementById('booking-form').reset();
      } catch (err) {
        console.error(err);
        statusDiv.innerHTML = '<div class="p-4 bg-red-500/20 text-red-300 rounded-lg text-center font-medium border border-red-500/30">✗ Failed to submit booking. Please try again.</div>';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "${copy.ctaText}";
      }
    });
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${leadId}-website.html"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
