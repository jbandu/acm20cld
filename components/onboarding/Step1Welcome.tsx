"use client";

import { useState } from "react";
import { OnboardingStepProps } from "./types";

export function Step1Welcome({ data, onUpdate, onNext }: OnboardingStepProps) {
  const [formData, setFormData] = useState({
    title: data?.title || "",
    institution: data?.institution || "",
    department: data?.department || "",
    location: data?.location || "",
    bio: data?.bio || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    onUpdate({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title/position is required";
    }
    if (!formData.institution.trim()) {
      newErrors.institution = "Institution is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to ACM Research Platform!
        </h2>
        <p className="text-lg text-gray-600">
          Let's start by getting to know you better
        </p>
      </div>

      <div className="space-y-4">
        {/* Title/Position */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Your Title/Position <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g., PhD Candidate, Postdoctoral Researcher, Assistant Professor"
            className={`w-full rounded-md border ${
              errors.title ? "border-red-300" : "border-gray-300"
            } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Institution */}
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
            Institution <span className="text-red-500">*</span>
          </label>
          <input
            id="institution"
            type="text"
            value={formData.institution}
            onChange={(e) => handleChange("institution", e.target.value)}
            placeholder="e.g., Stanford University, MIT"
            className={`w-full rounded-md border ${
              errors.institution ? "border-red-300" : "border-gray-300"
            } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2`}
          />
          {errors.institution && (
            <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Department (Optional)
          </label>
          <input
            id="department"
            type="text"
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            placeholder="e.g., Biomedical Engineering, Computer Science"
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location (Optional)
          </label>
          <input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="e.g., Boston, MA, USA"
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Short Bio (Optional)
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell us a bit about your research interests and background..."
            rows={4}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.bio.length}/500 characters
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-6">
        <button
          onClick={handleNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
