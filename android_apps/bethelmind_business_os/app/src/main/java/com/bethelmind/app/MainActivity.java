package com.bethelmind.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.JavascriptInterface;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private static final String TARGET_URL = "https://www.bethelmindanalytics.com";
    private static final int FILE_CHOOSER_REQUEST_CODE = 1001;

    private WebView mWebView;
    private SwipeRefreshLayout mSwipeRefresh;
    private ProgressBar mProgressBar;
    private ValueCallback<Uri[]> mFilePathCallback;
    private boolean isErrorPageLoaded = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mWebView = findViewById(R.id.webview);
        mSwipeRefresh = findViewById(R.id.swipe_refresh);
        mProgressBar = findViewById(R.id.progress_bar);

        configureWebSettings();
        setupWebViewClients();
        setupSwipeRefresh();
        setupDownloadListener();

        // Deep linking & Intent handling
        Intent intent = getIntent();
        Uri intentData = (intent != null) ? intent.getData() : null;

        if (intentData != null) {
            mWebView.loadUrl(intentData.toString());
        } else if (savedInstanceState != null) {
            mWebView.restoreState(savedInstanceState);
        } else {
            mWebView.loadUrl(TARGET_URL);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void configureWebSettings() {
        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Touch smoothing for HTML5 Signature Pad
        mWebView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

        // Mobile-first identification
        String userAgent = settings.getUserAgentString();
        settings.setUserAgentString(userAgent + " BethelmindMobileApp/2.0 (LASRERA Mandate & Mobile Desk)");

        mWebView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        mWebView.setOverScrollMode(View.OVER_SCROLL_NEVER);

        // Expose JavaScript Interface for Native Android Printing & Spooling
        mWebView.addJavascriptInterface(new AndroidBridge(this), "AndroidApp");
    }

    private void setupWebViewClients() {
        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                return handleNigerianIntents(url, view);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                return handleNigerianIntents(url, view);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                mProgressBar.setVisibility(View.VISIBLE);
                isErrorPageLoaded = false;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                mProgressBar.setVisibility(View.GONE);
                mSwipeRefresh.setRefreshing(false);

                // Auto-bridge window.print() to Android native print spooler
                view.evaluateJavascript(
                    "window.print = function() { if (window.AndroidApp && window.AndroidApp.printPage) { window.AndroidApp.printPage(document.title || 'Bethelmind_Statutory_Instrument'); } };",
                    null
                );
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    isErrorPageLoaded = true;
                    view.loadUrl("file:///android_asset/offline.html");
                }
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                mProgressBar.setProgress(newProgress);
                if (newProgress == 100) {
                    mProgressBar.setVisibility(View.GONE);
                } else {
                    mProgressBar.setVisibility(View.VISIBLE);
                }
            }

            // Support receipt / statutory document upload from phone gallery or camera
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback,
                                            FileChooserParams fileChooserParams) {
                if (mFilePathCallback != null) {
                    mFilePathCallback.onReceiveValue(null);
                }
                mFilePathCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
                } catch (Exception e) {
                    mFilePathCallback = null;
                    Toast.makeText(MainActivity.this, "Cannot open file picker", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }
        });
    }

    /**
     * Native Android Print Spooler Bridge
     */
    public class AndroidBridge {
        Context mContext;

        AndroidBridge(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void printPage(final String docTitle) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                    if (printManager != null) {
                        String cleanTitle = (docTitle != null && !docTitle.isEmpty()) ? docTitle.replaceAll("[^a-zA-Z0-9_-]", "_") : "Bethelmind_Instrument";
                        PrintDocumentAdapter printAdapter = mWebView.createPrintDocumentAdapter(cleanTitle);
                        printManager.print(cleanTitle, printAdapter, new PrintAttributes.Builder().build());
                    }
                }
            });
        }
    }

    /**
     * Native Download Listener for PDF Statutory Packs and Offline Instruments
     */
    private void setupDownloadListener() {
        mWebView.setDownloadListener(new DownloadListener() {
            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
                try {
                    DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                    request.setMimeType(mimeType);
                    String cookies = CookieManager.getInstance().getCookie(url);
                    request.addRequestHeader("cookie", cookies);
                    request.addRequestHeader("User-Agent", userAgent);
                    request.setDescription("Downloading statutory document...");
                    String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
                    request.setTitle(fileName);
                    request.allowScanningByMediaScanner();
                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
                    
                    DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                    if (dm != null) {
                        dm.enqueue(request);
                        Toast.makeText(getApplicationContext(), "Downloading " + fileName + " to Downloads...", Toast.LENGTH_SHORT).show();
                    }
                } catch (Exception e) {
                    // Fallback to external browser intent
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                }
            }
        });
    }

    /**
     * Handles Nigerian-specific URL schemes:
     * - WhatsApp (wa.me, api.whatsapp.com, whatsapp://)
     * - Phone calls (tel:)
     * - SMS (sms:)
     * - Email (mailto:)
     * - Nigerian Fintech deep links (opay://, moniepoint://, kuda://, palmpay://)
     */
    private boolean handleNigerianIntents(String url, WebView view) {
        if (url == null) return false;

        // WhatsApp Direct Link Handling
        if (url.startsWith("whatsapp://") || url.contains("wa.me") || url.contains("api.whatsapp.com")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                startActivity(intent);
                return true;
            } catch (Exception e) {
                Toast.makeText(this, "WhatsApp is not installed on this device", Toast.LENGTH_SHORT).show();
                return true;
            }
        }

        // Phone call handling
        if (url.startsWith("tel:")) {
            Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
            startActivity(intent);
            return true;
        }

        // SMS handling
        if (url.startsWith("sms:")) {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(intent);
            return true;
        }

        // Email handling
        if (url.startsWith("mailto:")) {
            Intent intent = new Intent(Intent.ACTION_SENDTO, Uri.parse(url));
            startActivity(intent);
            return true;
        }

        // Internal app domains / paths (Allow WebView to navigate natively)
        if (url.contains("bethelmindanalytics.com") || url.contains("localhost:3006") || url.startsWith("/")) {
            return false;
        }

        // External URLs or Fintech Deep Links (OPay, Moniepoint, etc.)
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return false; // let webview handle standard web pages
        }

        // Custom application intents (OPay, Moniepoint, banking apps)
        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            startActivity(intent);
            return true;
        } catch (Exception e) {
            return true;
        }
    }

    private void setupSwipeRefresh() {
        mSwipeRefresh.setColorSchemeResources(R.color.colorPrimary, R.color.colorAccent);
        mSwipeRefresh.setOnRefreshListener(() -> {
            if (isErrorPageLoaded) {
                mWebView.loadUrl(TARGET_URL);
            } else {
                mWebView.reload();
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (mFilePathCallback != null) {
                Uri[] results = null;
                if (resultCode == Activity.RESULT_OK && data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
                mFilePathCallback.onReceiveValue(results);
                mFilePathCallback = null;
            }
        }
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && mWebView.canGoBack()) {
            mWebView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mWebView.saveState(outState);
    }
}
