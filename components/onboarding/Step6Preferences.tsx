"use client";

import { useState } from "react";
import { OnboardingStepProps } from "./types";

export function Step6Preferences({ data, onUpdate, onNext, onBack }: OnboardingStepProps) {
  const [formData, setFormData] = useState({
    // Search preferences
    preferredSources: data?.preferredSources || ["openalex", "pubmed"],
    preferredLLMs: data?.preferredLLMs || ["claude"],
    defaultSearchDepth: data?.defaultSearchDepth || "standard",
    openAccessOnly: data?.openAccessOnly || false,
    maxYearsOld: data?.maxYearsOld || "",
    minCitations: data?.minCitations || "",
    preferReviews: data?.preferReviews || false,
    preferOriginalResearch: data?.preferOriginalResearch ?? true,

    // Notifications
    emailDigest: data?.emailDigest ?? true,
    digestFrequency: data?.digestFrequency || "weekly",
    notifyNewPapers: data?.notifyNewPapers ?? true,
    notifyTeamActivity: data?.notifyTeamActivity ?? true,

    // Display
    resultsPerPage: data?.resultsPerPage || 20,
    showAbstracts: data?.showAbstracts ?? true,
    compactView: data?.compactView || false,

    // AI Suggestions
    questionSuggestions: data?.questionSuggestions ?? true,
    proactiveSuggestions: data?.proactiveSuggestions ?? true,
    suggestionFrequency: data?.suggestionFrequency || "moderate",

    // Privacy
    profileVisibility: data?.profileVisibility || "team",
    shareActivityFeed: data?.shareActivityFeed ?? true,
  });

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const toggleSource = (source: string) => {
    const updated = formData.preferredSources.includes(source)
      ? formData.preferredSources.filter((s: string) => s !== source)
      : [...formData.preferredSources, source];
    handleChange("preferredSources", updated);
  };

  const toggleLLM = (llm: string) => {
    const updated = formData.preferredLLMs.includes(llm)
      ? formData.preferredLLMs.filter((l: string) => l !== llm)
      : [...formData.preferredLLMs, llm];
    handleChange("preferredLLMs", updated);
  };

  const handleFinish = () => {
    onUpdate(formData);
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Preferences & Settings
        </h2>
        <p className="text-lg text-gray-600">
          Customize your research experience
        </p>
      </div>

      {/* Search Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Search Preferences</h3>

        {/* Data Sources */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Data Sources
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.preferredSources.includes("openalex")}
                onChange={() => toggleSource("openalex")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">OpenAlex</div>
                <div className="text-xs text-gray-500">Open scholarly works database</div>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.preferredSources.includes("pubmed")}
                onChange={() => toggleSource("pubmed")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">PubMed</div>
                <div className="text-xs text-gray-500">Biomedical literature</div>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.preferredSources.includes("patents")}
                onChange={() => toggleSource("patents")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Patents</div>
                <div className="text-xs text-gray-500">Patent database</div>
              </div>
            </label>
          </div>
        </div>

        {/* AI Models */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred AI Models
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.preferredLLMs.includes("claude")}
                onChange={() => toggleLLM("claude")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">Claude (Anthropic)</div>
                <div className="text-xs text-gray-500">Best for detailed analysis</div>
              </div>
            </label>
            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={formData.preferredLLMs.includes("gpt4")}
                onChange={() => toggleLLM("gpt4")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">GPT-4 (OpenAI)</div>
                <div className="text-xs text-gray-500">Alternative perspective</div>
              </div>
            </label>
          </div>
        </div>

        {/* Search Depth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Search Depth
          </label>
          <select
            value={formData.defaultSearchDepth}
            onChange={(e) => handleChange("defaultSearchDepth", e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          >
            <option value="quick">Quick (Fast, top results)</option>
            <option value="standard">Standard (Balanced)</option>
            <option value="deep">Deep (Comprehensive)</option>
          </select>
        </div>

        {/* Content Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Years Old
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={formData.maxYearsOld}
              onChange={(e) => handleChange("maxYearsOld", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="All years"
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Citations
            </label>
            <input
              type="number"
              min="0"
              value={formData.minCitations}
              onChange={(e) => handleChange("minCitations", e.target.value ? parseInt(e.target.value) : null)}
              placeholder="No minimum"
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.openAccessOnly}
              onChange={(e) => handleChange("openAccessOnly", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Open Access Only</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.preferReviews}
              onChange={(e) => handleChange("preferReviews", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Prefer Review Articles</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.preferOriginalResearch}
              onChange={(e) => handleChange("preferOriginalResearch", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Prefer Original Research</span>
          </label>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Notifications</h3>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.emailDigest}
            onChange={(e) => handleChange("emailDigest", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Email Digest</span>
        </label>

        {formData.emailDigest && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              value={formData.digestFrequency}
              onChange={(e) => handleChange("digestFrequency", e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.notifyNewPapers}
            onChange={(e) => handleChange("notifyNewPapers", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Notify About New Papers in My Areas</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.notifyTeamActivity}
            onChange={(e) => handleChange("notifyTeamActivity", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Notify About Team Activity</span>
        </label>
      </div>

      {/* AI Suggestions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">AI Suggestions</h3>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.questionSuggestions}
            onChange={(e) => handleChange("questionSuggestions", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Show Suggested Questions</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.proactiveSuggestions}
            onChange={(e) => handleChange("proactiveSuggestions", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Proactive Suggestions</span>
        </label>

        {(formData.questionSuggestions || formData.proactiveSuggestions) && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suggestion Frequency
            </label>
            <select
              value={formData.suggestionFrequency}
              onChange={(e) => handleChange("suggestionFrequency", e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            >
              <option value="minimal">Minimal</option>
              <option value="moderate">Moderate</option>
              <option value="frequent">Frequent</option>
            </select>
          </div>
        )}
      </div>

      {/* Display Preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Display</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Results Per Page
          </label>
          <select
            value={formData.resultsPerPage}
            onChange={(e) => handleChange("resultsPerPage", parseInt(e.target.value))}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.showAbstracts}
            onChange={(e) => handleChange("showAbstracts", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Show Abstracts by Default</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.compactView}
            onChange={(e) => handleChange("compactView", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Compact View</span>
        </label>
      </div>

      {/* Privacy */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Privacy</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profile Visibility
          </label>
          <select
            value={formData.profileVisibility}
            onChange={(e) => handleChange("profileVisibility", e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          >
            <option value="private">Private (Only me)</option>
            <option value="team">Team (My institution/department)</option>
            <option value="public">Public (Everyone)</option>
          </select>
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.shareActivityFeed}
            onChange={(e) => handleChange("shareActivityFeed", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Share Activity in Team Feed</span>
        </label>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
        >
          Back
        </button>
        <button
          onClick={handleFinish}
          className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium"
        >
          Complete Onboarding
        </button>
      </div>
    </div>
  );
}
