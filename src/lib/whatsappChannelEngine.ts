/**
 * @file src/lib/whatsappChannelEngine.ts
 * 
 * Automated Viral WhatsApp Channel Content, Cross-Platform Funnel & Conversion Engine.
 * 
 * Powers:
 * 1. 7-Day High-Converting Viral WhatsApp Channel Content Rotation:
 *    - Monday: Industry Teardowns (High forwards to business groups)
 *    - Tuesday: Plug-and-Play Swipe Files / Templates (High saves & shares)
 *    - Wednesday: Live Case Studies & ROI Breakdowns (Authority proof)
 *    - Thursday: Interactive Polls & Reaction Spikes (Boosts WhatsApp Directory Ranking)
 *    - Friday: Direct 1-Tap Conversion DM Offers (Pre-filled wa.me links to 0802 279 1227)
 *    - Saturday: Behind-The-Scenes / Build In Public
 *    - Sunday: Weekly VIP Resource Pack & Recap
 * 2. Cross-Platform Feeder Bridges:
 *    - Generates matching X/Twitter Threads, LinkedIn Posts, and WhatsApp Status Teasers with direct channel invites.
 * 3. 1-Tap Direct wa.me Conversion Links into the Admin Desk (0802 279 1227).
 * 4. Dual-Line Baileys Gateway Dispatch Support & CRM Activity Logging.
 */

import { getRuntimeConfig } from '@/lib/localConfig';
import { addLog } from '@/lib/googleSheets';
import { baileysClient } from '@/lib/whatsapp/baileys_gateway_client';

export type ChannelPostCategory =
  | 'teardown'
  | 'swipe_file'
  | 'case_study'
  | 'reaction_trigger'
  | 'direct_offer'
  | 'build_in_public'
  | 'weekly_recap';

export interface ChannelPost {
  id: string;
  category: ChannelPostCategory;
  dayOfWeek: string;
  title: string;
  body: string;
  ctaText: string;
  ctaLink: string;
  channelLink: string;
  statusTeaser: string;
  socialFeederPost: {
    twitter: string;
    linkedin: string;
  };
  createdAt: string;
  status: 'draft' | 'published' | 'scheduled';
}

/**
 * High-Converting 7-Day Content Rotation Matrix
 */
export const VIRAL_CHANNEL_ROTATION: Array<Omit<ChannelPost, 'id' | 'createdAt' | 'status'>> = [
  {
    category: 'teardown',
    dayOfWeek: 'Monday',
    title: '🔍 *AUDIT: Why 8 Out of 10 Lagos Businesses Lose ₦500k/Month on WhatsApp*',
    body: `Over the weekend, our team audited the customer inquiry flow for 25 commercial businesses in Lekki, Ikeja, and Victoria Island (Clinics, Salons, Real Estate, and Auto Garages).

Here is the shocking leak:
❌ *Average first response time:* 42 minutes.
❌ *Payment friction:* Asking customers to "send receipt screenshot and hold on".
❌ *Lead leakage:* Over 60% of midnight/weekend inquiries are completely abandoned.

*The 3-Step Fix You Can Implement in 10 Minutes:*
1️⃣ Deploy an instant < 3-second WhatsApp conversational intake agent.
2️⃣ Use dynamic Moniepoint/OPay virtual bank transfer verification (instant receipt confirmation).
3️⃣ Connect an interactive mobile quote builder so customers customize their order before you even pick up the phone.

💡 *Takeaway:* Speed to lead is everything. When a customer reaches out, whoever replies in 3 seconds wins the deal.`,
    ctaText: '👉 Want us to run a free 60-second speed & conversion teardown on your current setup? Chat with our desk:',
    ctaLink: 'https://wa.me/2348022791227?text=Hi%20Tosin,%20I%20saw%20your%20Monday%20audit%20on%20the%20channel.%20I%20want%20a%20free%20setup%20teardown.',
    channelLink: 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
    statusTeaser: '🚨 8/10 Lagos businesses are losing ₦500k/mo on WhatsApp. Just dropped the 3-step fix in our Channel. Tap to read 👇',
    socialFeederPost: {
      twitter: 'I audited 25 Lagos businesses this weekend. 80% are bleeding ₦500k/month on slow WhatsApp response times.\n\nHere is the 3-step automation blueprint to fix it (Free breakdown in our WhatsApp channel):\nhttps://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      linkedin: 'Most businesses in Nigeria think they have a marketing problem. In reality, they have a speed-to-lead problem.\n\nHere is what happened when we audited 25 commercial businesses across Lagos:\n\n1. Average response time: 42 minutes\n2. Lost inquiries: 60%\n\nFull case breakdown posted in our private WhatsApp channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l'
    }
  },
  {
    category: 'swipe_file',
    dayOfWeek: 'Tuesday',
    title: '📋 *SWIPE FILE: The Exact 2-Step WhatsApp Script That Closed ₦3.8M in B2B Deals*',
    body: `Stop sending huge walls of text in your cold WhatsApp outreach. It triggers instant blocks and spam reports. 🛑

Here is the exact **2-Step Permission Script** we use for our B2B clients:

*STEP 1 (The Low-Friction Icebreaker):*
"Good day! Is this the management desk at [Business Name] in [Area]?"

*STEP 2 (Sent ONLY after they reply 'Yes, who is this?'):*
"Great connecting with you! We built a custom interactive mobile prototype for [Business Name] showing an automated 24/7 WhatsApp booking engine + instant Paystack/Moniepoint checkout.

You can preview the live demo here (₦0 upfront):
👉 [Preview Link]

Would you be open to a 2-minute review?"

📌 *Why this works:* It respects the prospect's attention and creates curiosity without spamming.`,
    ctaText: '📥 Forward this script to your sales lead or tap below to get our full template pack:',
    ctaLink: 'https://wa.me/2348022791227?text=Hi%20Tosin,%20please%20send%20me%20the%20full%20B2B%20WhatsApp%20Swipe%20File%20Pack.',
    channelLink: 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
    statusTeaser: '🔥 Just leaked the exact 2-step WhatsApp outreach script that closed ₦3.8M. Swipe it in our channel now 👇',
    socialFeederPost: {
      twitter: 'Sending walls of text on WhatsApp is killing your response rates.\n\nUse this 2-step permission loop instead. Full script & objection handlers dropped in the Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      linkedin: 'Cold outreach in Nigeria requires high trust and low friction.\n\nHere is the exact 2-Step Permission Framework our team uses to generate qualified B2B leads without triggering spam filters.\n\nGrab the template inside our WhatsApp Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l'
    }
  },
  {
    category: 'case_study',
    dayOfWeek: 'Wednesday',
    title: '📊 *CASE STUDY: How a Lagos Service SME Hit ₦4.2M in 30 Days on Autopilot*',
    body: `Here is the behind-the-scenes breakdown of how we deployed an automated client acquisition engine for a commercial service business in Lagos:

1️⃣ *Targeted Lead Harvest:* Extracted 300 verified commercial business owners on Google Maps.
2️⃣ *Instant Prototype Pre-Build:* Built an interactive, branded mobile website prototype with custom pricing calculators.
3️⃣ *2-Step Outreach Loop:* Delivered the prototype preview directly to decision makers via automated WhatsApp and verified email.
4️⃣ *The Result:*
   • 28 high-intent demo requests.
   • 6 closed contracts in 3 weeks.
   • ₦4,200,000 gross revenue generated.

💡 *Key Lesson:* When prospects can test-drive their custom solution on their phone before paying, the objection rate drops to near zero.`,
    ctaText: '📲 Want us to build a tailored client acquisition engine for your business? Chat with our team:',
    ctaLink: 'https://wa.me/2348022791227?text=Hi%20Tosin,%20I%20saw%20the%20Wednesday%20case%20study.%20Can%20we%20discuss%20a%20pipeline%20for%20my%20business?',
    channelLink: 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
    statusTeaser: '📈 How one Lagos business generated ₦4.2M in 30 days with automated client outreach. Read the full case study inside 👇',
    socialFeederPost: {
      twitter: 'How we built a ₦4.2M/mo B2B automated client pipeline in Lagos (step-by-step breakdown):\n\nFull case study & architecture inside our WhatsApp channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      linkedin: 'Case Study: Driving ₦4.2M in new client contracts for a Lagos SME using automated outreach and custom interactive prototypes.\n\nRead the full technical breakdown: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l'
    }
  },
  {
    category: 'reaction_trigger',
    dayOfWeek: 'Thursday',
    title: '⚡ *QUICK POLL: What is the #1 Bottleneck in Your Business Right Now?*',
    body: `We are preparing our next batch of free automation tools and templates for channel members.

React with an emoji to vote for what you need most:

🔥 = **"Getting more high-quality paying clients / lead generation"**
💡 = **"Automating WhatsApp customer replies & quote generation"**
🚀 = **"A modern, fast website with Paystack/Moniepoint checkout"**
💼 = **"Automated staff & daily task tracking system"**

Whichever gets the most reactions by 6 PM today, we will release the complete plug-and-play template for FREE tomorrow morning!`,
    ctaText: '👇 Drop your reaction on this post now!',
    ctaLink: 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
    channelLink: 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
    statusTeaser: '🗳️ What is your biggest business bottleneck right now? Vote in our WhatsApp Channel poll — winning tool drops tomorrow! 👇',
    socialFeederPost: {
      twitter: 'Quick poll for business owners: What is your #1 bottleneck right now? Lead gen, WhatsApp automation, or checkout?\n\nVote inside our WhatsApp channel to get the free tool tomorrow: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      linkedin: 'What is the biggest operational headache for Nigerian SMEs in 2026? We are dropping a free automation tool based on community votes. Cast your vote in our WhatsApp Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l'
    }
  },
  {
    category: 'direct_offer',
    dayOfWeek: 'Friday',
    title: '🚀 *EXCLUSIVE: 3 Done-For-You Business Website & Automation Slots (₦0 Upfront Preview)*',
    body: `Every Friday, our engineering team opens **3 private slots** for business owners who want to upgrade their digital presence without paying millions to slow agencies.

*What We Build For You:*
✅ Full Custom Mobile-Optimized Website (.com.ng domain + high-speed cloud hosting).
✅ 24/7 AI WhatsApp Auto-Closer & Instant Quote Generator.
✅ Direct Moniepoint / Paystack automated payment integration.
✅ Google Maps Local SEO Setup (so nearby customers find you first).

*Zero Risk Policy:*
We build your live interactive prototype first. You review and test-drive it on your phone before you pay a single kobo.

⚡ *Only 3 slots available this weekend on a first-come, first-served basis.*`,
    ctaText: '👉 Tap below to claim 1 of the 3 prototype slots directly with our CEO:',
    ctaLink: 'https://wa.me/2348022791227?text=Hi%20Tosin,%20I%20want%20to%20claim%201%20of%20the%203%20Friday%20prototype%20slots%20for%20my%20business.',
    channelLink: 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
    statusTeaser: '⚡ Opening 3 private Done-For-You website & WhatsApp automation slots this weekend (₦0 Upfront Preview). Tap to claim 👇',
    socialFeederPost: {
      twitter: 'Opening 3 slots this weekend to build a complete custom website + 24/7 WhatsApp AI lead engine for Nigerian businesses. ₦0 upfront prototype review.\n\nClaim your slot inside our WhatsApp Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      linkedin: 'We are accepting 3 businesses this week for our Done-For-You Website & WhatsApp Automation Engine. Zero upfront fee until you test-drive your prototype.\n\nDetails inside our VIP WhatsApp Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l'
    }
  },
  {
    category: 'build_in_public',
    dayOfWeek: 'Saturday',
    title: '🛠️ *BUILD IN PUBLIC: How We Scaled Our High-Speed Edge Infrastructure to Sub-15ms*',
    body: `Quick peek under the hood of Bethelmind Analytics:

When building website prototypes for Nigerian mobile users, standard WordPress templates take 6-10 seconds to load over local networks.

Here is what we engineered to make our client prototypes load in **under 15 milliseconds**:
1. **Edge SWR Caching:** Dynamic HTML pre-cached at regional cloud edges.
2. **Zero Render-Blocking Fonts:** Preloaded typography directly in the root header.
3. **Instant Hydration:** Custom React templates that paint immediately on frame 1.

The result? Bounce rates dropped by 74%, and inquiry conversions doubled. 🚀

*Quality engineering isn't an option — it's the difference between profit and lost traffic.*`,
    ctaText: '🌐 See our high-speed live prototypes in action:',
    ctaLink: 'https://www.bethelmindanalytics.com',
    channelLink: 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
    statusTeaser: '⚡ How we engineered sub-15ms page loads for Nigerian mobile users. Engineering breakdown inside the Channel 👇',
    socialFeederPost: {
      twitter: 'Why slow websites kill mobile sales in Nigeria, and how we cut load times to <15ms using Edge SWR caching.\n\nTech breakdown inside our WhatsApp channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      linkedin: 'Building for the Nigerian digital ecosystem requires extreme performance optimization. Here is how we engineered sub-15ms edge caching for our B2B client portals.\n\nRead more: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l'
    }
  },
  {
    category: 'weekly_recap',
    dayOfWeek: 'Sunday',
    title: '📚 *SUNDAY MASTER PACK: All 4 Automation Assets Released This Week*',
    body: `Welcome to all new members who joined the Bethelmind Growth Channel this week! 🎉

Here is your master recap and quick access links to everything we dropped:

1️⃣ *The ₦500k WhatsApp Leak Audit Breakdown* (Monday)
2️⃣ *The 2-Step B2B Cold Outreach Script* (Tuesday)
3️⃣ *The ₦4.2M Lagos Service SME Case Study* (Wednesday)
4️⃣ *High-Speed Edge Architecture Breakdown* (Saturday)

💡 *Tip:* Save this post or star it in your chat so you have these resources ready for your Monday strategy review!`,
    ctaText: '💼 Need a custom automation or website built this week? Book a strategy call with our desk:',
    ctaLink: 'https://wa.me/2348022791227?text=Hi%20Tosin,%20I%20am%20ready%20to%20deploy%20a%20website%20and%20automation%20engine%20for%20my%20business.',
    channelLink: 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
    statusTeaser: '📚 Sunday Master Pack: Grab all 4 business automation assets & scripts released this week inside our Channel 👇',
    socialFeederPost: {
      twitter: 'Sunday Recap: Here is every B2B growth asset, script, and teardown we released this week.\n\nAccess the master file in our WhatsApp Channel: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l',
      linkedin: 'Sunday Digest: 4 operational & marketing assets for business leaders aiming to scale client acquisition in Nigeria.\n\nJoin our private WhatsApp channel to access all templates: https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l'
    }
  }
];

/**
 * Formats a channel post into clean, engaging WhatsApp markdown.
 */
export function formatChannelBroadcastText(post: Omit<ChannelPost, 'id' | 'createdAt' | 'status'>): string {
  const config = getRuntimeConfig();
  const channelUrl = config.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l';
  const signature = config.businessSignature || 'Bethelmind Analytics Lagos Team';

  return `${post.title}

${post.body}

${post.ctaText}
🔗 ${post.ctaLink}

───────────────────
📢 *Stay updated with daily growth hacks:*
👉 Follow our VIP Channel: ${channelUrl}
✍️ _*${signature}*_`;
}

/**
 * Generates the day's viral post or picks from category.
 */
export function getTodaysViralPost(category?: ChannelPostCategory): {
  post: ChannelPost;
  formattedText: string;
} {
  const config = getRuntimeConfig();
  const channelUrl = config.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l';

  let selected = VIRAL_CHANNEL_ROTATION[0];
  if (category) {
    const match = VIRAL_CHANNEL_ROTATION.find(p => p.category === category);
    if (match) selected = match;
  } else {
    const day = new Date().getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    // Map Sunday (0) to index 6, Monday (1) to index 0, etc.
    const rotationIndex = day === 0 ? 6 : day - 1;
    selected = VIRAL_CHANNEL_ROTATION[rotationIndex] || VIRAL_CHANNEL_ROTATION[0];
  }

  const post: ChannelPost = {
    ...selected,
    id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    channelLink: channelUrl,
    createdAt: new Date().toISOString(),
    status: 'draft'
  };

  return {
    post,
    formattedText: formatChannelBroadcastText(post)
  };
}

/**
 * Dispatches the viral broadcast to the WhatsApp channel / admin broadcast link.
 */
export async function broadcastViralChannelUpdate(options?: {
  category?: ChannelPostCategory;
  customText?: string;
  dispatchDirectBaileys?: boolean;
}): Promise<{
  success: boolean;
  message: string;
  broadcastText: string;
  channelUrl: string;
  adminWhatsAppShareUrl: string;
  statusTeaser: string;
  socialFeeders: { twitter: string; linkedin: string };
  baileysDispatched?: boolean;
}> {
  const config = getRuntimeConfig();
  const channelUrl = config.whatsappChannelUrl || 'https://whatsapp.com/channel/0029VbDFgKP4o7qM58yY9v2l';

  let broadcastText = '';
  let statusTeaser = '';
  let socialFeeders = { twitter: '', linkedin: '' };

  if (options?.customText) {
    broadcastText = options.customText;
    statusTeaser = `📢 New update dropped in our VIP WhatsApp Channel! Tap to read: ${channelUrl}`;
    socialFeeders = {
      twitter: `New insights posted in our WhatsApp Channel: ${channelUrl}`,
      linkedin: `Read our latest update inside our WhatsApp Channel: ${channelUrl}`
    };
  } else {
    const generated = getTodaysViralPost(options?.category);
    broadcastText = generated.formattedText;
    statusTeaser = generated.post.statusTeaser;
    socialFeeders = generated.post.socialFeederPost;
  }

  // 1-Click Admin WhatsApp Share URL (opens pre-filled WhatsApp chat to broadcast or share)
  const adminWhatsAppShareUrl = `https://wa.me/?text=${encodeURIComponent(broadcastText)}`;

  let baileysDispatched = false;
  // Automatically attempt direct autonomous dispatch to Channel & Status via Baileys gateways
  for (const port of [3007, 3009]) {
    try {
      const resp = await fetch(`http://localhost:${port}/broadcast-channel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: broadcastText,
          inviteCode: '0029VbDFgKP4o7qM58yY9v2l'
        }),
        signal: AbortSignal.timeout(6000)
      });
      if (resp.ok) {
        baileysDispatched = true;
        break;
      }
    } catch (_) {}
  }

  if (options?.dispatchDirectBaileys && !baileysDispatched) {
    try {
      const adminPhone = config.adminWhatsAppPhone || '08022791227';
      await baileysClient.sendMessage({
        phone: adminPhone,
        message: `📢 *[AUTOMATED CHANNEL BROADCAST READY]*\n\n${broadcastText}\n\n👉 1-Click Share:\n${adminWhatsAppShareUrl}`,
        simulateTyping: false
      });
      baileysDispatched = true;
    } catch (err: any) {
      console.warn('[WhatsAppChannelEngine] Baileys dispatch warning:', err.message);
    }
  }

  // Audit log
  try {
    await addLog(
      'WhatsApp Viral Channel Engine',
      'SUCCESS',
      `Prepared daily viral broadcast (${options?.category || 'ROTATIONAL'}): "${broadcastText.slice(0, 50)}..."`
    );
  } catch (err: any) {
    console.warn('[WhatsAppChannelEngine] Log recording warning:', err.message);
  }

  return {
    success: true,
    message: 'Daily viral WhatsApp channel broadcast prepared successfully.',
    broadcastText,
    channelUrl,
    adminWhatsAppShareUrl,
    statusTeaser,
    socialFeeders,
    baileysDispatched
  };
}

// Backward compatibility alias
export const PREBUILT_CHANNEL_OFFERS = VIRAL_CHANNEL_ROTATION;
export const getNextChannelPost = getTodaysViralPost;
export const broadcastToWhatsAppChannel = broadcastViralChannelUpdate;
