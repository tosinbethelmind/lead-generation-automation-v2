# Deploying Lead Gen Sequencer to Hugging Face Spaces

This guide walks you through deploying your lead generator pipeline to Hugging Face Spaces so it can run 24/7 in the cloud.

## Step-by-Step Guide

### 1. Get your Hugging Face Write Token
1. Go to [huggingface.co](https://huggingface.co) and sign in/register.
2. Click your profile picture in the top-right corner and select **Settings**.
3. Select **Access Tokens** in the left sidebar.
4. Click **New Token**, set the token name (e.g., `lead-gen-automation`), select **Write** role, and click **Generate**.
5. Copy the generated token (`hf_...`).

### 2. Trigger Cloud Deploy
1. Start your local dashboard: `npm run start-all`.
2. Go to the **System Configurations** wizard page (e.g., [http://localhost:3006/setup](http://localhost:3006/setup)).
3. Click the new **Cloud Deployment** tab.
4. Paste your **Hugging Face Write Token**.
5. Give your Space a unique name (e.g. `bethelmind-lead-engine`).
6. Click **Trigger Cloud Space Build**.

The app will compile and build your Docker container immediately. Your space will build and launch in about 5-10 minutes.

### 3. Monitoring building logs
Once triggered, you can visit `https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME/logs` to monitor development progress. When completed, the Space runs Next.js and your background queue checkouts 24/7 automatically.
