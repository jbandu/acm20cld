"use client";

import { useState } from "react";
import { OnboardingStepProps } from "./types";

export function Step3Research({ data, onUpdate, onNext, onBack }: OnboardingStepProps) {
  const [formData, setFormData] = useState({
    expertiseLevel: data?.expertiseLevel || "",
    yearsInField: data?.yearsInField || "",
    researchAreas: data?.researchAreas || [],
    techniques: data?.techniques || [],
    computationalSkills: data?.computationalSkills || [],
  });

  const [newResearchArea, setNewResearchArea] = useState("");
  const [newTechnique, setNewTechnique] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonResearchAreas = [
    "Cancer Biology",
    "Immunology",
    "Neuroscience",
    "Genetics",
    "Cell Biology",
    "Molecular Biology",
    "Bioinformatics",
    "Systems Biology",
    "Stem Cell Research",
    "Drug Discovery",
  ];

  const commonTechniques = [
    "Western Blot",
    "PCR/qPCR",
    "Flow Cytometry",
    "Immunofluorescence",
    "CRISPR",
    "RNA-seq",
    "Mass Spectrometry",
    "Cell Culture",
    "Mouse Models",
    "Microscopy",
  ];

  const commonSkills = [
    "Python",
    "R",
    "MATLAB",
    "Statistical Analysis",
    "Machine Learning",
    "Data Visualization",
    "Bioinformatics Tools",
    "Image Analysis",
    "NGS Analysis",
    "Database Management",
  ];

  const handleChange = (field: string, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onUpdate(updated);
  };

  const addItem = (field: "researchAreas" | "techniques" | "computationalSkills", value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      const updated = [...formData[field], value.trim()];
      handleChange(field, updated);
    }
  };

  const removeItem = (field: "researchAreas" | "techniques" | "computationalSkills", value: string) => {
    const updated = formData[field].filter((item: string) => item !== value);
    handleChange(field, updated);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.expertiseLevel) {
      newErrors.expertiseLevel = "Please select your expertise level";
    }

    if (formData.researchAreas.length === 0) {
      newErrors.researchAreas = "Please select at least one research area";
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
          Research Areas & Expertise
        </h2>
        <p className="text-lg text-gray-600">
          Help us understand your research focus and skills
        </p>
      </div>

      {/* Expertise Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expertise Level <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.expertiseLevel}
          onChange={(e) => handleChange("expertiseLevel", e.target.value)}
          className={`w-full rounded-md border ${
            errors.expertiseLevel ? "border-red-300" : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2`}
        >
          <option value="">Select your level</option>
          <option value="STUDENT">PhD/PostDoc Student</option>
          <option value="EARLY_CAREER">Early Career (0-2 years post-PhD)</option>
          <option value="MID_CAREER">Mid Career (3-7 years)</option>
          <option value="SENIOR">Senior (8-15 years)</option>
          <option value="DISTINGUISHED">Distinguished (15+ years)</option>
        </select>
        {errors.expertiseLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.expertiseLevel}</p>
        )}
      </div>

      {/* Years in Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Years in Field
        </label>
        <input
          type="number"
          min="0"
          max="50"
          value={formData.yearsInField}
          onChange={(e) => handleChange("yearsInField", e.target.value)}
          placeholder="How many years have you been in research?"
          className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
        />
      </div>

      {/* Research Areas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Research Areas <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-3">
          Select from common areas or add your own
        </p>

        {/* Selected areas */}
        {formData.researchAreas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.researchAreas.map((area: string) => (
              <span
                key={area}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {area}
                <button
                  type="button"
                  onClick={() => removeItem("researchAreas", area)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Common areas */}
        <div className="flex flex-wrap gap-2 mb-3">
          {commonResearchAreas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => addItem("researchAreas", area)}
              disabled={formData.researchAreas.includes(area)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + {area}
            </button>
          ))}
        </div>

        {/* Custom area input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newResearchArea}
            onChange={(e) => setNewResearchArea(e.target.value)}
            placeholder="Add custom research area"
            className="flex-1 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem("researchAreas", newResearchArea);
                setNewResearchArea("");
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              addItem("researchAreas", newResearchArea);
              setNewResearchArea("");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        {errors.researchAreas && (
          <p className="mt-1 text-sm text-red-600">{errors.researchAreas}</p>
        )}
      </div>

      {/* Laboratory Techniques */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Laboratory Techniques
        </label>
        <p className="text-sm text-gray-500 mb-3">Optional but helpful for personalization</p>

        {formData.techniques.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.techniques.map((tech: string) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeItem("techniques", tech)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {commonTechniques.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => addItem("techniques", tech)}
              disabled={formData.techniques.includes(tech)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + {tech}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newTechnique}
            onChange={(e) => setNewTechnique(e.target.value)}
            placeholder="Add custom technique"
            className="flex-1 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem("techniques", newTechnique);
                setNewTechnique("");
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              addItem("techniques", newTechnique);
              setNewTechnique("");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Add
          </button>
        </div>
      </div>

      {/* Computational Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Computational Skills
        </label>
        <p className="text-sm text-gray-500 mb-3">Optional but helpful for personalization</p>

        {formData.computationalSkills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.computationalSkills.map((skill: string) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeItem("computationalSkills", skill)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {commonSkills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addItem("computationalSkills", skill)}
              disabled={formData.computationalSkills.includes(skill)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + {skill}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add custom skill"
            className="flex-1 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem("computationalSkills", newSkill);
                setNewSkill("");
              }
            }}
          />
          <button
            type="button"
            onClick={() => {
              addItem("computationalSkills", newSkill);
              setNewSkill("");
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium"
        >
          Back
        </button>
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
