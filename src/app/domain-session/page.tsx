"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Server, 
  Link2, 
  CheckCircle2, 
  ShieldAlert, 
  Loader2, 
  ArrowRight, 
  ArrowLeft,
  UploadCloud, 
  FileCode, 
  Terminal, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Coins, 
  ExternalLink 
} from 'lucide-react';
import Link from "next/link";

interface DeployDetails {
  hostingStatus?: string;
  domainStatus?: string;
  dnsStatus?: string;
  sslStatus?: string;
}

export default function DomainSession() {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState("https://my-campaign-site.com");
  const [gitUrl, setGitUrl] = useState("https://github.com/bethelmind/lead-gen-landing");
  const [file, setFile] = useState<File | null>(null);
  
  // Selection States
  const [hosting, setHosting] = useState("vercel");
  const [domainOption, setDomainOption] = useState<"custom" | "new">("custom");
  const [registrar, setRegistrar] = useState("namecheap");
  const [selectedTld, setSelectedTld] = useState(".site");

  // API status states
  const [loading, setLoading] = useState(false);
  const [deployResult, setDeployResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Stepper steps configuration
  const steps = [
    { num: 1, label: "Build Source" },
    { num: 2, label: "Hosting Tier" },
    { num: 3, label: "Domain TLD" },
    { num: 4, label: "Deploy Launch" }
  ];

  // Cheapest TLD options for the "new" registration wizard
  const tldPrices = [
    { tld: ".site", price: "$1.20 / yr", badge: "Cheapest" },
    { tld: ".xyz", price: "$1.50 / yr", badge: "Popular" },
    { tld: ".online", price: "$1.99 / yr", badge: "Promo" },
    { tld: ".tech", price: "$2.99 / yr", badge: "Value" },
    { tld: ".com", price: "$9.98 / yr", badge: "Standard" }
  ];

  // Hosting Providers
  const hostingProviders = [
    {
      id: "vercel",
      name: "Vercel Free Tier",
      price: "$0 / month",
      desc: "Perfect for React/Next.js dynamic assets and serverless. Fully automated CI/CD.",
      features: ["Auto SSL", "Global CDN", "Edge Middleware", "100 GB Bandwidth"],
      badge: "Recommended"
    },
    {
      id: "cloudflare",
      name: "Cloudflare Pages",
      price: "$0 / month",
      desc: "Lightning fast static hosting deployed directly to the Edge. Unlimited bandwidth.",
      features: ["Free SSL", "DDoS Protection", "Edge Functions", "Unlimited Bandwidth"],
      badge: "Fastest"
    },
    {
      id: "render",
      name: "Render Free",
      price: "$0 / month",
      desc: "Great for custom backend web services and static sites under a unified dashboard.",
      features: ["Auto SSL", "Custom Headers", "Pull Request Previews", "100 GB bandwidth"],
      badge: "Flexible"
    }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Deployment action handler
  const handleDeploy = async () => {
    setLoading(true);
    setError("");
    setDeployResult(null);
    setStep(4);

    const targetUrl = domainOption === "new" 
      ? `https://${url.replace(/https?:\/\//, "").split(".")[0]}${selectedTld}`
      : url;

    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          hosting,
          registrar: domainOption === "new" ? registrar : "custom",
          gitUrl,
          domainOption
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDeployResult(data);
      } else {
        setError(data.error || "Deployment execution failed. Please verify your variables.");
      }
    } catch (err) {
      setError("Network error: failed to establish connection to deploy server.");
    } finally {
      setLoading(false);
    }
  };

  const cleanDisplayUrl = () => {
    const raw = domainOption === "new" 
      ? `${url.replace(/https?:\/\//, "").split(".")[0]}${selectedTld}`
      : url.replace(/https?:\/\//, "");
    return raw || "site-alias.com";
  };

  return (
    <section className="flex flex-col items-center justify-start min-h-screen bg-slate-950 p-4 sm:p-8">
      {/* Background Decorative Mesh Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[65%] h-[65%] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      <div className="w-full max-w-4xl z-10">
        {/* Navigation / Header */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" /> Back to Console
          </Link>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-medium">
            <Coins className="w-3.5 h-3.5" /> High-Efficiency Mode Enabled
          </div>
        </div>

        {/* Branding Hero */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 font-title bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Domain &amp; Hosting Automation
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Deploy your campaigns with one-click setup. No servers to configure, no manual DNS records to add.
          </p>
        </div>

        {/* Stepper Graphic */}
        <div className="mb-10 max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
            
            {steps.map((s, idx) => {
              const isActive = step === s.num;
              const isPassed = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isActive 
                      ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-950" 
                      : isPassed
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-900 text-slate-500 border border-slate-800"
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-[10px] sm:text-xs mt-2 font-semibold transition-colors duration-300 ${
                    isActive ? "text-cyan-400" : isPassed ? "text-emerald-400" : "text-slate-500"
                  }`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Wizard Form Container */}
        <div className="glass-panel p-6 sm:p-10 border border-slate-800 bg-slate-900/60 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Step 1: Build Source Selector */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <FileCode className="text-cyan-400 w-6 h-6" /> Choose Website Build Source
              </h2>
              <p className="text-sm text-slate-400">
                Provide the codebase or files that make up your landing pages.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="url" className="text-sm text-slate-300 font-semibold flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-cyan-400" /> Target Website Domain
                  </label>
                  <input
                    id="url"
                    type="text"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm"
                  />
                  <span className="text-[11px] text-slate-500">
                    If buying a new domain, we will replace the TLD dynamically.
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="gitUrl" className="text-sm text-slate-300 font-semibold flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                    </svg> Git Repository URL
                  </label>
                  <input
                    id="gitUrl"
                    type="url"
                    placeholder="https://github.com/user/repo"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  />
                </div>

                <div className="border border-dashed border-slate-800 bg-slate-950/40 rounded-lg p-6 text-center hover:border-slate-700 transition">
                  <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <span className="text-xs text-slate-400 block font-medium">
                    {file ? file.name : "Drag & drop static build archive (ZIP, TAR.GZ)"}
                  </span>
                  <input
                    type="file"
                    accept=".zip,.tar.gz"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="mt-3 inline-block px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-md text-xs text-slate-300 hover:text-white cursor-pointer hover:bg-slate-850 transition">
                    Browse Files
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-800/80">
                <button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Configure Hosting <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Hosting Tier Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Cpu className="text-cyan-400 w-6 h-6" /> Select Cost-Effective Hosting
              </h2>
              <p className="text-sm text-slate-400">
                Choose from these selected <strong>$0/month free-tier web hosting services</strong> optimized for high delivery speed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hostingProviders.map((prov) => (
                  <div
                    key={prov.id}
                    onClick={() => setHosting(prov.id)}
                    className={`p-5 rounded-xl cursor-pointer border transition-all relative flex flex-col justify-between ${
                      hosting === prov.id
                        ? "bg-slate-950 border-cyan-500 shadow-lg shadow-cyan-950/30"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/30">
                          {prov.badge}
                        </span>
                        <span className="text-xs text-emerald-400 font-bold">{prov.price}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mb-2">{prov.name}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{prov.desc}</p>
                    </div>

                    <ul className="space-y-1.5 border-t border-slate-900 pt-3">
                      {prov.features.map((feat, i) => (
                        <li key={i} className="text-[10px] text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-cyan-500" /> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800/80">
                <button onClick={handleBack} className="btn-secondary">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleNext} className="btn-primary">
                  Configure Domain <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Domain TLD Configuration */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Globe className="text-cyan-400 w-6 h-6" /> Custom Domain Settings
              </h2>
              <p className="text-sm text-slate-400">
                Map an existing domain you already own, or select an ultra-low-cost campaign TLD starting at just $1.20.
              </p>

              {/* Toggle Selector */}
              <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-lg max-w-sm">
                <button
                  type="button"
                  onClick={() => setDomainOption("custom")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${
                    domainOption === "custom" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Own Custom Domain ($0)
                </button>
                <button
                  type="button"
                  onClick={() => setDomainOption("new")}
                  className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${
                    domainOption === "new" ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Buy Campaign TLD (from $1.20)
                </button>
              </div>

              {domainOption === "custom" ? (
                <div className="space-y-4 p-5 bg-slate-950 border border-slate-850 rounded-xl">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="custom-domain" className="text-xs text-slate-300 font-bold">
                      Enter Domain Name
                    </label>
                    <input
                      id="custom-domain"
                      type="text"
                      placeholder="e.g. landing.bethelmind.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm"
                    />
                  </div>
                  <div className="p-4 bg-slate-900/40 rounded border border-slate-850 text-xs text-slate-400 space-y-2">
                    <p className="font-semibold text-slate-300">💡 DNS Configuration Requirements:</p>
                    <p>Once deployed, configure the following record in your Domain Registrar dashboard:</p>
                    <div className="bg-slate-950 p-2 rounded font-mono text-[11px] flex justify-between text-slate-300 border border-slate-900">
                      <span>CNAME &nbsp; @ / subdomain</span>
                      <span className="text-cyan-400">cname.vercel-dns.com</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <label className="text-xs text-slate-300 font-bold">Domain Name</label>
                      <input
                        type="text"
                        placeholder="my-campaign-brand"
                        value={url.split(".")[0].replace(/https?:\/\//, "")}
                        onChange={(e) => setUrl(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm"
                      />
                    </div>
                    <div className="w-36 flex flex-col gap-2">
                      <label className="text-xs text-slate-300 font-bold">Select TLD</label>
                      <select
                        value={selectedTld}
                        onChange={(e) => setSelectedTld(e.target.value)}
                        className="px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm outline-none"
                      >
                        {tldPrices.map((t) => (
                          <option key={t.tld} value={t.tld}>
                            {t.tld}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {tldPrices.map((tp) => (
                      <div
                        key={tp.tld}
                        onClick={() => setSelectedTld(tp.tld)}
                        className={`p-3 rounded-lg border text-center cursor-pointer transition ${
                          selectedTld === tp.tld 
                            ? "bg-slate-900 border-cyan-500" 
                            : "bg-slate-950/40 border-slate-850 hover:border-slate-800"
                        }`}
                      >
                        <span className="text-xs font-bold text-white block">{tp.tld}</span>
                        <span className="text-[10px] text-cyan-400 block mt-1">{tp.price}</span>
                        <span className="text-[8px] uppercase tracking-wider text-slate-500 font-semibold block mt-0.5">{tp.badge}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-300 font-bold">Registrar Service</label>
                    <select
                      value={registrar}
                      onChange={(e) => setRegistrar(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-sm outline-none"
                    >
                      <option value="namecheap">Namecheap (Fully Automated API)</option>
                      <option value="cloudflare">Cloudflare Registrar</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-800/80">
                <button onClick={handleBack} className="btn-secondary">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleDeploy}
                  className="btn-primary"
                >
                  Launch Live Deployment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Launching Status & Success Display */}
          {step === 4 && (
            <div className="space-y-6">
              {loading ? (
                <div className="py-10 text-center space-y-6">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 spin-anim" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Launching Campaign Site...</h3>
                    <p className="text-xs text-slate-400">
                      Provisioning serverless resources and injecting domain configuration records.
                    </p>
                  </div>

                  {/* Provisioning steps checklist animation style */}
                  <div className="max-w-xs mx-auto text-left space-y-2 border border-slate-850 bg-slate-950/60 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                      <Loader2 className="w-3.5 h-3.5 spin-anim" /> Provisioning cloud target
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5" /> Compiling static templates
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5" /> Injecting DNS CNAME routing
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5" /> Requesting SSL certificate
                    </div>
                  </div>
                </div>
              ) : error ? (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-red-950/40 border border-red-900 rounded-full flex items-center justify-center mx-auto text-red-500">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white">Deployment Halted</h3>
                    <p className="text-xs text-red-400 max-w-md mx-auto">{error}</p>
                  </div>
                  <button onClick={() => setStep(3)} className="btn-secondary mx-auto">
                    Configure &amp; Retry
                  </button>
                </div>
              ) : deployResult ? (
                <div className="space-y-6">
                  {/* Celebration / Success header */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-950/30 border border-emerald-900/60 rounded-full flex items-center justify-center mx-auto text-emerald-400 mb-4">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Deploy Session Active</h3>
                    <p className="text-sm text-slate-400">
                      Your website build has successfully launched to live production.
                    </p>
                  </div>

                  {/* Provisioned Domain Showcase Card */}
                  <div className="p-6 rounded-xl bg-slate-950 border border-slate-850 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Live URL</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900/30">
                        Active &bull; SSL Secured
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-y border-slate-900">
                      <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <span className="text-base font-bold text-white font-mono">{cleanDisplayUrl()}</span>
                      </div>
                      <a
                        href={`https://${cleanDisplayUrl()}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Step details from backend */}
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Hosting: {deployResult.details?.hostingStatus || "Provisioned"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>Domain Setup: {deployResult.details?.domainStatus || "Mapped"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>DNS Configuration: {deployResult.details?.dnsStatus || "CNAME injected"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>SSL Issuance: {deployResult.details?.sslStatus || "Standard SSL verified"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setStep(1);
                        setDeployResult(null);
                      }}
                      className="btn-secondary"
                    >
                      New Deployment
                    </button>
                    <Link href="/admin" className="btn-primary">
                      Open Admin Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          )}

        </div>

        {/* Footer Technical Notice */}
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-xs text-slate-500">
          <Terminal className="w-3.5 h-3.5 text-slate-600" />
          <span>All connections are routed via encrypted HTTPS endpoints.</span>
        </div>
      </div>
    </section>
  );
}
