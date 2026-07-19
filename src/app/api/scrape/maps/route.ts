import { NextRequest, NextResponse } from 'next/server';
import { Lead, saveLeads, addLog, normalizePhone } from '@/lib/googleSheets';
import { getRuntimeConfig, rotateKey } from '@/lib/localConfig';
import { enrichLeadContacts, validateLeadWithAI } from '@/lib/leadEnricher';
import { handleQueueDelegation } from '@/app/api/scrape/queue';

// Configure execution timeout for Vercel serverless execution
export const maxDuration = 60;

/**
 * POST /api/scrape/maps
 * Body: { query: string, limit?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 5 } = body;
    
    const queueResp = await handleQueueDelegation(req, 'maps', body);
    if (queueResp) return queueResp;
    
    if (!query) {
      return NextResponse.json({ error: "Missing required query string parameter." }, { status: 400 });
    }
    
    const config = getRuntimeConfig();
    const apiKey = rotateKey(config.googlePlacesApiKey);
    
    const isSandbox = query.toLowerCase().includes('sandbox') || query.toLowerCase().includes('mock') || !apiKey || apiKey.trim() === '';
    
    if (isSandbox) {
      await addLog('Google Maps Scraper', 'START', `Running in sandbox mode for query: "${query}"`);
      const mockLeads: Partial<Lead>[] = [
        {
          lead_id: `mock_places_1`,
          source: 'GOOGLE',
          name: 'Lagos Dental Clinic',
          category: 'dentist',
          address: '12 Toyin Street, Ikeja, Lagos',
          area: 'Ikeja',
          city: 'Lagos',
          phone_e164: '+2348012345678',
          phone_raw: '08012345678',
          email: '',
          website: 'https://lagosdentalclinic.com',
          rating: 4.5,
          reviews_count: 85,
          verified: true,
          listings_count: 1,
          profile_url: 'https://www.google.com/maps/place/?q=place_id:mock_places_1',
          source_query_or_seed: query,
          collected_at: new Date().toISOString(),
          status: 'NEW',
          last_contacted_at: '',
          duplicate_of_lead_id: '',
          business_summary: 'Lagos Dental Clinic is a premium dental service in Ikeja, Lagos. They provide state-of-the-art teeth whitening, cleaning, and dental implants.',
          notes: 'Sandbox mode lead.',
          business_hours: JSON.stringify([
            "Monday: 8:00 AM – 5:00 PM",
            "Tuesday: 8:00 AM – 5:00 PM",
            "Wednesday: 8:00 AM – 5:00 PM",
            "Thursday: 8:00 AM – 5:00 PM",
            "Friday: 8:00 AM – 5:00 PM",
            "Saturday: 9:00 AM – 2:00 PM",
            "Sunday: Closed"
          ]),
          reviews_data: JSON.stringify([
            { author_name: "Tobi Alabi", rating: 5, text: "Excellent dental services! Very professional and clean clinic." },
            { author_name: "Chinyere Oke", rating: 4, text: "Wait time was a bit long, but the dentist was very thorough and kind." },
            { author_name: "Abiodun Bello", rating: 5, text: "Super friendly staff and very affordable pricing for dental scaling!" }
          ]),
          photos_data: JSON.stringify([
            "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
            "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800"
          ]),
          social_links: JSON.stringify({
            facebook: "https://facebook.com/lagosdentalclinic",
            instagram: "https://instagram.com/lagosdentalclinic",
            linkedin: "https://linkedin.com/company/lagosdentalclinic"
          }),
          services_data: JSON.stringify([
            "Dental Consultation",
            "Teeth Whitening",
            "Scaling and Polishing",
            "Orthodontic Braces",
            "Dental Implants"
          ])
        },
        {
          lead_id: `mock_places_2`,
          source: 'GOOGLE',
          name: 'Ikeja Dental Care',
          category: 'dentist',
          address: '45 Allen Avenue, Ikeja, Lagos',
          area: 'Ikeja',
          city: 'Lagos',
          phone_e164: '+2348023456789',
          phone_raw: '08023456789',
          email: '',
          website: '',
          rating: 4.2,
          reviews_count: 31,
          verified: false,
          listings_count: 1,
          profile_url: 'https://www.google.com/maps/place/?q=place_id:mock_places_2',
          source_query_or_seed: query,
          collected_at: new Date().toISOString(),
          status: 'NEW',
          last_contacted_at: '',
          duplicate_of_lead_id: '',
          business_summary: 'Ikeja Dental Care is a local business in Ikeja, Lagos with a strong Google rating of 4.2 stars (31 reviews) — but no website yet.',
          notes: 'Sandbox mode lead.',
          business_hours: JSON.stringify([
            "Monday: 9:00 AM – 6:00 PM",
            "Tuesday: 9:00 AM – 6:00 PM",
            "Wednesday: 9:00 AM – 6:00 PM",
            "Thursday: 9:00 AM – 6:00 PM",
            "Friday: 9:00 AM – 6:00 PM",
            "Saturday: 10:00 AM – 4:00 PM",
            "Sunday: Closed"
          ]),
          reviews_data: JSON.stringify([
            { author_name: "Kemi Ade", rating: 4, text: "Affordable teeth cleaning. Simple setup but skilled doctors." },
            { author_name: "Emeka Obi", rating: 5, text: "They saved my tooth with a quick root canal. Great service!" }
          ]),
          photos_data: JSON.stringify([
            "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?w=800"
          ]),
          social_links: JSON.stringify({
            instagram: "https://instagram.com/ikejadentalcare"
          }),
          services_data: JSON.stringify([
            "Teeth Cleaning",
            "Tooth Extraction",
            "Root Canal Therapy",
            "Dental Fillings"
          ])
        }
      ];
      
      const dbResult = await saveLeads(mockLeads);
      await addLog('Google Maps Scraper', 'SUCCESS', `Places sandbox scraping complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
      return NextResponse.json({
        success: true,
        mode: 'sandbox',
        added: dbResult.added,
        skipped: dbResult.skipped,
        leads: mockLeads
      });
    }
    
    // Cloud Execution
    await addLog('Google Maps Scraper', 'START', `Triggering live Google Places API for query: "${query}"`);
    
    // Text search request
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
    const searchResp = await fetch(textSearchUrl);
    const searchData = await searchResp.json();
    
    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Google API returned status: ${searchData.status} - ${searchData.error_message || ''}`);
    }
    
    const placeRecords = (searchData.results || []).slice(0, limit);
    const newLeads: Partial<Lead>[] = [];
    
    const detailsPromises = placeRecords.map(async (record: any) => {
      const placeId = record.place_id;
      let rawPhone = '';
      let website = '';
      let address = record.formatted_address || '';
      
      let businessHours = '';
      let reviewsData = '';
      let photosData = '';
      let servicesData = '';
      let editorialSummary = '';
      
      // Fetch deep Place details in parallel
      try {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=international_phone_number,formatted_phone_number,website,editorial_summary,opening_hours,photos,reviews,types&key=${apiKey}`;
        const detailsResp = await fetch(detailsUrl);
        const detailsData = await detailsResp.json();
        if (detailsData.status === 'OK' && detailsData.result) {
          const res = detailsData.result;
          rawPhone = res.international_phone_number || res.formatted_phone_number || '';
          website = res.website || '';
          
          if (res.opening_hours && res.opening_hours.weekday_text) {
            businessHours = JSON.stringify(res.opening_hours.weekday_text);
          }
          if (res.reviews) {
            reviewsData = JSON.stringify(res.reviews.map((rev: any) => ({
              author_name: rev.author_name || 'Anonymous',
              rating: rev.rating || 5,
              text: rev.text || '',
              relative_time_description: rev.relative_time_description || ''
            })));
          }
          if (res.photos) {
            const photoUrls = res.photos.slice(0, 5).map((photo: any) => 
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`
            );
            photosData = JSON.stringify(photoUrls);
          }
          if (res.types) {
            const friendlyTypes = res.types.map((type: string) => 
              type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            );
            servicesData = JSON.stringify(friendlyTypes);
          }
          if (res.editorial_summary && res.editorial_summary.overview) {
            editorialSummary = res.editorial_summary.overview;
          }
        }
      } catch (err) {
        console.error('Failed to load deep details for place_id:', placeId, err);
      }
      
      // ── QUALITY FILTERS ──
      const minReviews = config.minReviews ?? 1;
      const minRating = config.minRating ?? 4.0;
      const rating = record.rating || 0;
      const reviews = record.user_ratings_total || 0;

      if (rating < minRating) {
        console.log(`[Google Maps Scraper] Filtering out lead "${record.name}" due to low rating (${rating} < ${minRating})`);
        return null;
      }
      if (reviews < minReviews) {
        console.log(`[Google Maps Scraper] Filtering out lead "${record.name}" due to low reviews count (${reviews} < ${minReviews})`);
        return null;
      }

      let normPhone = rawPhone ? normalizePhone(rawPhone, 'NG') : null;

      // Parse Lagos area/neighborhood if possible
      let area = 'Lagos';
      const areaMatches = address.match(/(Ikeja|Lekki|Yaba|Victoria Island|VI|Surulere|Ikoyi|Apapa|Maryland|Festac|Ebute Metta|Gbagada)/i);
      if (areaMatches) {
        area = areaMatches[0];
      }

      const hasWebsite = !!(website && website.trim());
      const leadObj: Partial<Lead> = {
        lead_id: `places_${placeId}`,
        source: 'GOOGLE',
        name: record.name || 'Local Business',
        category: (record.types && record.types[0]) || 'Business',
        address,
        area,
        city: 'Lagos',
        phone_e164: normPhone || '',
        phone_raw: rawPhone || '',
        email: '',
        website: website || '',
        rating,
        reviews_count: reviews,
        verified: !!record.opening_hours,
        listings_count: 1,
        profile_url: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
        source_query_or_seed: query,
        collected_at: new Date().toISOString(),
        status: 'NEW',
        last_contacted_at: '',
        duplicate_of_lead_id: '',
        business_summary: editorialSummary || (hasWebsite
          ? `${record.name} is a local business in ${area}, Lagos. They have a basic website: ${website} but lack online booking or payment gateway automation.`
          : `${record.name} is a local business in ${area}, Lagos with a strong Google rating of ${rating} stars (${reviews} reviews) — but no website yet.`),
        notes: hasWebsite
          ? `Imported via Google Places API. Has basic website: ${website}. Pitch: Automation & Premium Feature Upgrade.`
          : `Imported via Google Places API. No website detected on place details.`,
        business_hours: businessHours,
        reviews_data: reviewsData,
        photos_data: photosData,
        services_data: servicesData,
        social_links: ''
      };

      return { leadObj, hasWebsite };
    });

    const resolvedRecords = await Promise.all(detailsPromises);
    const validResolved = resolvedRecords.filter((item): item is Exclude<typeof item, null> => item !== null);
    
    // We want to enrich any lead missing email or phone_e164
    const toEnrich = validResolved.filter(item => !item.leadObj.email || !item.leadObj.phone_e164);
    const noEnrichNeeded = validResolved.filter(item => item.leadObj.email && item.leadObj.phone_e164);

    for (const item of noEnrichNeeded) {
      if (item.leadObj.phone_e164) {
        newLeads.push(item.leadObj);
      }
    }

    if (toEnrich.length > 0) {
      await addLog('Google Maps Scraper', 'INFO', `Enriching website/search contact info for ${toEnrich.length} leads in parallel...`);
      await Promise.allSettled(
        toEnrich.map(async (item) => {
          const lead = item.leadObj;
          try {
            const enriched = await enrichLeadContacts(lead);
            if (enriched.email) lead.email = enriched.email;
            if (enriched.phone) {
              lead.phone_e164 = enriched.phone;
              lead.phone_raw = enriched.phone;
            }
            if (enriched.socials && Object.keys(enriched.socials).length > 0) {
              lead.social_links = JSON.stringify(enriched.socials);
            }
            if (enriched.enriched) {
              lead.notes = lead.notes + ` | Enriched: phone=${enriched.phone || 'none'}, email=${enriched.email || 'none'}`;
            }
          } catch (enrichErr: any) {
            console.error(`Failed to enrich contacts for ${lead.name}:`, enrichErr.message);
          }
          if (lead.phone_e164) {
            newLeads.push(lead);
          }
        })
      );
    }
    
    const finalLeads: Partial<Lead>[] = [];
    const geminiApiKeyVal = config.geminiApiKey || config.antigravityApiKey || (config.antigravityApiKeys && config.antigravityApiKeys[0]) || '';
    if (geminiApiKeyVal && newLeads.length > 0) {
      console.log(`[Google Maps Scraper] Performing parallel AI relevance check for ${newLeads.length} leads...`);
      const aiChecks = await Promise.all(
        newLeads.map(async (leadObj) => {
          try {
            const aiCheck = await validateLeadWithAI(leadObj, geminiApiKeyVal);
            return { leadObj, aiCheck };
          } catch (err: any) {
            console.error(`AI check failed for lead ${leadObj.name}:`, err.message);
            return { leadObj, aiCheck: { isRelevant: true, score: 10, reason: 'AI check failed', pitchAngle: leadObj.website ? 'CRM Integration & WhatsApp Automation' : 'New Website Design' } };
          }
        })
      );

      for (const { leadObj, aiCheck } of aiChecks) {
        if (!aiCheck.isRelevant) {
          console.log(`[Google Maps Scraper] Filtering out lead "${leadObj.name}" due to AI scoring: ${aiCheck.score}/10. Reason: ${aiCheck.reason}`);
          continue;
        }
        leadObj.notes = `${leadObj.notes} AI Relevance Score: ${aiCheck.score}/10 (${aiCheck.reason})${(aiCheck as any).pitchAngle ? ` [pitch: ${(aiCheck as any).pitchAngle}]` : ''}`;
        finalLeads.push(leadObj);
      }
    } else {
      finalLeads.push(...newLeads);
    }
    
    const dbResult = await saveLeads(finalLeads);
    await addLog('Google Maps Scraper', 'SUCCESS', `Places scraping complete. Added: ${dbResult.added}, Skipped: ${dbResult.skipped}`);
    
    return NextResponse.json({
      success: true,
      mode: 'cloud',
      added: dbResult.added,
      skipped: dbResult.skipped,
      leads: finalLeads
    });
    
  } catch (e: any) {
    await addLog('Google Maps Scraper', 'ERROR', `Places scraping failed: ${e.message}`);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
