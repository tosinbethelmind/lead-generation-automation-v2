/**
 * @file googleCalendar.ts
 * Google Calendar Auto-Booking & Meeting Link Engine (100% Free)
 * Generates instant Google Calendar consultation links and Google Meet call invites for WhatsApp & Chatbot leads.
 */

export interface CalendarBookingOptions {
  title: string;
  leadName: string;
  leadPhone?: string;
  leadEmail?: string;
  description?: string;
  durationMinutes?: number;
  startDateIso?: string;
}

export interface CalendarBookingResult {
  googleCalendarUrl: string;
  icsDownloadUrl: string;
  formattedTextResponse: string;
  suggestedTimes: string[];
}

/**
 * Formats a Date into UTC Google Calendar string format (YYYYMMDDTHHMMSSZ)
 */
function toGCalIsoString(date: Date): string {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
}

/**
 * Generates a 100% free Google Calendar invite URL and text response for sales discovery calls
 */
export function generateGoogleCalendarBooking(options: CalendarBookingOptions): CalendarBookingResult {
  const {
    title,
    leadName,
    leadPhone = '',
    leadEmail = '',
    description = 'Strategy & Consultation Call with Bethelmind Analytics Team',
    durationMinutes = 30,
    startDateIso
  } = options;

  // Default start date: tomorrow at 10:00 AM if not specified
  const startTime = startDateIso ? new Date(startDateIso) : new Date(Date.now() + 24 * 3600 * 1000);
  if (!startDateIso) {
    startTime.setHours(10, 0, 0, 0);
  }

  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

  const startGCal = toGCalIsoString(startTime);
  const endGCal = toGCalIsoString(endTime);

  const eventTitle = encodeURIComponent(`${title} - ${leadName}`);
  const eventDetails = encodeURIComponent(
    `${description}\n\nClient Name: ${leadName}\nPhone: ${leadPhone}\nEmail: ${leadEmail}\nHost: Bethelmind Analytics & Strategy`
  );
  const location = encodeURIComponent('Google Meet / WhatsApp Video Call');

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startGCal}/${endGCal}&details=${eventDetails}&location=${location}`;

  // ICS data URI for Apple/Outlook calendars
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title} - ${leadName}
DESCRIPTION:${description}
DTSTART:${startGCal}
DTEND:${endGCal}
LOCATION:Google Meet / WhatsApp Call
END:VEVENT
END:VCALENDAR`;

  const icsDownloadUrl = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

  // Generate 3 suggested time slots for Nigerian business hours
  const formatSlot = (d: Date) => d.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  const slot1 = new Date(startTime);
  const slot2 = new Date(startTime.getTime() + 4 * 3600 * 1000); // +4 hours
  const slot3 = new Date(startTime.getTime() + 24 * 3600 * 1000); // +1 day

  const suggestedTimes = [formatSlot(slot1), formatSlot(slot2), formatSlot(slot3)];

  const formattedTextResponse = `📅 *Schedule Your Strategy Session:*

Hi ${leadName}, you can lock in a 1-on-1 strategy call with our team instantly:

1️⃣ *Option 1:* ${suggestedTimes[0]}
2️⃣ *Option 2:* ${suggestedTimes[1]}
3️⃣ *Option 3:* ${suggestedTimes[2]}

👉 *Click here to add directly to your Google Calendar:*
${googleCalendarUrl}`;

  return {
    googleCalendarUrl,
    icsDownloadUrl,
    formattedTextResponse,
    suggestedTimes
  };
}
