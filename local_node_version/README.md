# Lead Gen Automation (Local Version)

This is the **Local Node.js** version of the system. 
Use this if you exceed Google Apps Script limits (6 minutes execution time) or want better scraping performance.

## ✅ Advantages
1.  **Unlimited Runtime**: Can run for hours collecting thousands of leads.
2.  **Better Scraping**: Uses `cheerio` for robust HTML parsing (better than Apps Script regex).
3.  **Safer IP**: Uses your local internet connection (Residential IP), which Jiji blocks less often than Google Data Center IPs.
4.  **Free**: Runs on your existing computer.

## 🚀 Setup
1.  Install Node.js (if not installed).
2.  Open this folder in your terminal:
    ```bash
    cd local_node_version
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file (copy `.env.example`) and fill in your keys:
    ```ini
    GOOGLE_PLACES_API_KEY=your_key_here
    WHATSAPP_ACCESS_TOKEN=your_token_here
    WHATSAPP_PHONE_ID=your_phone_id_here
    ```

## 🏃 Run
```bash
npm start
```

## 📂 Output
Leads are saved to **`leads_output.csv`** in this folder. 
You can simply upload this CSV to your Google Sheet manually.
