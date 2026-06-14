import os
import sys
from playwright.sync_api import sync_playwright

def run_test():
    print("=== STARTING WEBAPP UI TEST ===")
    
    with sync_playwright() as p:
        print("Launching Chromium browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Navigate to home page
        url = 'http://127.0.0.1:3060'
        print(f"Navigating to {url}...")
        page.goto(url)
        
        print("Waiting for page load and network idle...")
        page.wait_for_load_state('networkidle')
        
        # Verify page title
        title = page.title()
        print(f"Page title: '{title}'")
        assert "ApexReach" in title, "ApexReach not in page title"
        
        header_text = page.locator('h1').inner_text()
        print(f"Main Header found: '{header_text}'")
        
        # Let's locate the navigation buttons
        console_tab = page.locator('button:has-text("Console")')
        crm_tab = page.locator('button:has-text("Leads CRM")')
        scraper_tab = page.locator('button:has-text("Maps Scraper")')
        logs_tab = page.locator('button:has-text("Sync Logs")')
        settings_tab = page.locator('button:has-text("Settings")')
        
        print("Verifying navigation tabs presence...")
        assert console_tab.is_visible(), "Console tab is not visible"
        assert crm_tab.is_visible(), "Leads CRM tab is not visible"
        assert scraper_tab.is_visible(), "Maps Scraper tab is not visible"
        assert logs_tab.is_visible(), "Sync Logs tab is not visible"
        assert settings_tab.is_visible(), "Settings tab is not visible"
        print("SUCCESS: All 5 navigation tabs are visible!")
        
        # Go to Leads CRM
        print("Clicking Leads CRM tab...")
        crm_tab.click()
        page.wait_for_timeout(1000)
        
        # Check if table headers are visible
        table_headers = page.locator('table th').all_inner_texts()
        print(f"CRM Table headers: {table_headers}")
        
        # Click on the first row in the CRM table to view the preview
        first_row = page.locator('table tbody tr').first
        if first_row.is_visible():
            print("Clicking first lead row in CRM table...")
            first_row.click()
            page.wait_for_timeout(1000)
            
            # Check the preview section header
            preview_header = page.locator('section:has-text("Proposal Outreach Preview") h3, section:has-text("Outreach Preview") h3, h3:has-text("Proposal Outreach Preview")').first.inner_text()
            print(f"Preview panel header: '{preview_header}'")
            
            # Find checkbox
            checkbox = page.locator('#useCustomMessage')
            print(f"Checkbox is checked initially: {checkbox.is_checked()}")
            assert not checkbox.is_checked(), "Checkbox should not be checked by default"
            
            # Click checkbox to override
            print("Checking custom message override checkbox...")
            checkbox.check()
            page.wait_for_timeout(500)
            print(f"Checkbox is checked now: {checkbox.is_checked()}")
            assert checkbox.is_checked(), "Checkbox should be checked after check()"
            
            # Verify custom fields are now visible
            textarea = page.locator('textarea[placeholder*="outreach message"]')
            print(f"Custom outreach message textarea is visible: {textarea.is_visible()}")
            assert textarea.is_visible(), "Textarea should be visible when override is checked"
            
            # Fill with custom text
            custom_text = "This is a Playwright automated UI test custom override text."
            print(f"Filling custom text: '{custom_text}'")
            textarea.fill(custom_text)
            page.wait_for_timeout(500)
            
            # Uncheck and verify it hides again
            print("Unchecking custom message override checkbox...")
            checkbox.uncheck()
            page.wait_for_timeout(500)
            print(f"Textarea is visible after uncheck: {textarea.is_visible()}")
            assert not textarea.is_visible(), "Textarea should be hidden when override is unchecked"
        else:
            print("No lead rows found in the CRM table, skipping preview tests.")
        
        # Navigate to Scrapers tab
        print("Clicking Maps Scraper tab...")
        scraper_tab.click()
        page.wait_for_timeout(1000)
        
        # Verify Scraper control features
        scraper_heading = page.locator('h3:has-text("Multi-Source Lead Scrapers"), h3:has-text("Lead Generation Scrapers"), h3:has-text("Select Scraper Platform")').first.inner_text()
        print(f"Scrapers Tab Section heading: '{scraper_heading}'")
        
        # Navigate to Settings tab
        print("Clicking Settings tab...")
        settings_tab.click()
        page.wait_for_timeout(1000)
        
        # Verify settings form header
        settings_heading = page.locator('h3:has-text("System Settings & API Integrations"), h3:has-text("System Settings & Channels"), h3:has-text("Outreach Channel & Credentials")').first.inner_text()
        print(f"Configurations Tab heading: '{settings_heading}'")
        
        # Complete
        print("Browser closing...")
        browser.close()
        print("SUCCESS: WEBAPP UI TEST COMPLETED SUCCESSFULLY!")

if __name__ == '__main__':
    try:
        run_test()
    except Exception as e:
        print(f"ERROR: TEST FAILED: {e}", file=sys.stderr)
        sys.exit(1)
