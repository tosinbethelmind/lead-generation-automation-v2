/**
 * ApexReach Universal Integration SDK (v2.5)
 * Seamlessly connects external websites (WordPress, Shopify, Webflow, Wix, Squarespace, React, HTML)
 * to platform tracking, Meta CAPI, GA4, lead scoring, WhatsApp automation, and live chat widgets.
 */
(function (window, document) {
  'use strict';

  if (window.ApexSDK && window.ApexSDK.initialized) {
    return;
  }

  var scriptEl = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var siteId = scriptEl ? scriptEl.getAttribute('data-site-id') : null;
  var apiKey = scriptEl ? scriptEl.getAttribute('data-api-key') : null;
  var endpoint = scriptEl ? scriptEl.getAttribute('data-endpoint') : 'https://apexreach-leads.vercel.app/api/tracking/collect';
  var capiEndpoint = scriptEl ? scriptEl.getAttribute('data-capi-endpoint') : 'https://apexreach-leads.vercel.app/api/tracking/capi';

  var sessionId = 'apex_sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  var clickHistory = [];
  var rageClickThreshold = 4;
  var rageClickWindowMs = 1000;

  var ApexSDK = {
    initialized: true,
    siteId: siteId,
    apiKey: apiKey,
    sessionId: sessionId,
    config: {
      enableHeatmaps: true,
      enableRageClick: true,
      enableCapiBridge: true,
      enableLeadPopup: true
    },

    init: function (options) {
      if (options) {
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            this.config[key] = options[key];
          }
        }
      }
      this._bindEvents();
      this.trackEvent('pageview', {
        title: document.title,
        url: window.location.href,
        referrer: document.referrer,
        screen_resolution: window.screen.width + 'x' + window.screen.height,
        user_agent: navigator.userAgent
      });
      console.log('🚀 ApexReach Integration SDK Initialized for Site:', this.siteId || 'Universal');
    },

    trackEvent: function (eventName, eventData, customUserId) {
      var payload = {
        siteId: this.siteId || 'generic-site',
        apiKey: this.apiKey || 'public-key',
        sessionId: this.sessionId,
        eventName: eventName,
        eventData: eventData || {},
        timestamp: new Date().toISOString(),
        location: {
          href: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search
        },
        user: customUserId ? { id: customUserId } : {}
      };

      // 1. Send to platform analytics endpoint
      this._sendPayload(endpoint, payload);

      // 2. Dual-Tracking Bridge to Meta CAPI & GA4 if enabled
      if (this.config.enableCapiBridge) {
        this.trackCapi(eventName, eventData);
      }
    },

    trackCapi: function (eventName, eventData) {
      var eventId = 'evt_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      var capiPayload = {
        siteId: this.siteId,
        eventName: this._mapToStandardCapiEvent(eventName),
        eventId: eventId,
        eventTime: Math.floor(Date.now() / 1000),
        eventSourceUrl: window.location.href,
        userData: {
          clientIpAddress: '', // Resolved server-side
          clientUserAgent: navigator.userAgent,
          email: eventData.email || '',
          phone: eventData.phone || '',
          firstName: eventData.firstName || '',
          lastName: eventData.lastName || ''
        },
        customData: eventData
      };

      this._sendPayload(capiEndpoint, capiPayload);

      // Trigger browser Meta Pixel if available locally for deduplication
      if (window.fbq) {
        window.fbq('track', capiPayload.eventName, eventData, { eventID: eventId });
      }
      // Trigger browser GA4 if available
      if (window.gtag) {
        window.gtag('event', eventName, eventData);
      }
    },

    _mapToStandardCapiEvent: function (name) {
      var lower = (name || '').toLowerCase();
      if (lower.indexOf('lead') !== -1 || lower.indexOf('form') !== -1) return 'Lead';
      if (lower.indexOf('purchase') !== -1 || lower.indexOf('buy') !== -1) return 'Purchase';
      if (lower.indexOf('contact') !== -1) return 'Contact';
      if (lower.indexOf('search') !== -1) return 'Search';
      if (lower.indexOf('view') !== -1 || lower === 'pageview') return 'PageView';
      return 'CustomEvent';
    },

    _sendPayload: function (targetUrl, data) {
      try {
        if (navigator.sendBeacon) {
          var blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
          navigator.sendBeacon(targetUrl, blob);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('POST', targetUrl, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(data));
        }
      } catch (err) {
        console.warn('ApexSDK payload dispatch error:', err);
      }
    },

    _bindEvents: function () {
      var self = this;

      // Track Rage Clicks & Click Heatmaps
      document.addEventListener('click', function (e) {
        var now = Date.now();
        var target = e.target;
        var elementSelector = target.tagName.toLowerCase() + (target.id ? '#' + target.id : '') + (target.className ? '.' + String(target.className).split(' ').join('.') : '');

        // Click Heatmap
        if (self.config.enableHeatmaps) {
          self.trackEvent('click', {
            x: e.pageX,
            y: e.pageY,
            viewportW: window.innerWidth,
            viewportH: window.innerHeight,
            element: elementSelector,
            text: (target.innerText || '').substring(0, 50)
          });
        }

        // Rage click detection
        if (self.config.enableRageClick) {
          clickHistory.push({ time: now, target: target });
          clickHistory = clickHistory.filter(function (item) {
            return now - item.time < rageClickWindowMs;
          });

          var recentSameTargetClicks = clickHistory.filter(function (item) {
            return item.target === target;
          });

          if (recentSameTargetClicks.length >= rageClickThreshold) {
            self.trackEvent('rage_click', {
              element: elementSelector,
              clickCount: recentSameTargetClicks.length,
              timeWindowMs: rageClickWindowMs
            });
            clickHistory = []; // Reset after trigger
          }
        }
      }, true);

      // Auto-detect form submissions for instant lead sync & Meta CAPI Lead event
      document.addEventListener('submit', function (e) {
        var form = e.target;
        var formData = {};
        if (form && form.elements) {
          for (var i = 0; i < form.elements.length; i++) {
            var el = form.elements[i];
            if (el.name && el.value && el.type !== 'password') {
              formData[el.name] = el.value;
            }
          }
        }
        self.trackEvent('lead_form_submit', {
          formId: form.id || 'unnamed_form',
          formAction: form.action || '',
          fieldsCaptured: Object.keys(formData),
          email: formData.email || formData.user_email || formData['contact[email]'] || '',
          phone: formData.phone || formData.tel || formData.mobile || ''
        });
      }, true);
    }
  };

  window.ApexSDK = ApexSDK;
  ApexSDK.init();

})(window, document);
