"use client";

import { useState } from "react";
import { OnboardingStepProps } from "./types";

interface EducationEntry {
  degree: string;
  field: string;
  institution: string;
  location?: string;
  startYear?: string;
  endYear?: string;
  current: boolean;
  thesisTopic?: string;
  advisor?: string;
  keyFindings?: string[];
}

export function Step2Education({ data, onUpdate, onNext, onBack }: OnboardingStepProps) {
  const [highestDegree, setHighestDegree] = useState(data?.highestDegree || "");
  const [phdFocus, setPhdFocus] = useState(data?.phdFocus || "");
  const [education, setEducation] = useState<EducationEntry[]>(
    data?.education || [
      {
        degree: "",
        field: "",
        institution: "",
        location: "",
        startYear: "",
        endYear: "",
        current: false,
        thesisTopic: "",
        advisor: "",
        keyFindings: [],
      },
    ]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (index: number, field: keyof EducationEntry, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
    updateParent(updated);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        degree: "",
        field: "",
        institution: "",
        location: "",
        startYear: "",
        endYear: "",
        current: false,
        thesisTopic: "",
        advisor: "",
        keyFindings: [],
      },
    ]);
  };

  const removeEducation = (index: number) => {
    const updated = education.filter((_, i) => i !== index);
    setEducation(updated);
    updateParent(updated);
  };

  const updateParent = (educationData: EducationEntry[]) => {
    onUpdate({
      highestDegree,
      phdFocus,
      education: educationData,
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!highestDegree) {
      newErrors.highestDegree = "Please select your highest degree";
    }

    // Check if at least one education entry has degree and field
    const hasValidEntry = education.some((edu) => edu.degree && edu.field);
    if (!hasValidEntry) {
      newErrors.education = "Please add at least one education entry with degree and field";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateParent(education);
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Educational Background
        </h2>
        <p className="text-lg text-gray-600">
          Tell us about your academic journey
        </p>
      </div>

      {/* Highest Degree */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Highest Degree <span className="text-red-500">*</span>
        </label>
        <select
          value={highestDegree}
          onChange={(e) => {
            setHighestDegree(e.target.value);
            onUpdate({ highestDegree: e.target.value, phdFocus, education });
          }}
          className={`w-full rounded-md border ${
            errors.highestDegree ? "border-red-300" : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2`}
        >
          <option value="">Select your highest degree</option>
          <option value="Bachelor's">Bachelor's</option>
          <option value="Master's">Master's</option>
          <option value="PhD">PhD</option>
          <option value="Postdoc">Postdoctoral</option>
          <option value="MD">MD</option>
          <option value="MD/PhD">MD/PhD</option>
        </select>
        {errors.highestDegree && (
          <p className="mt-1 text-sm text-red-600">{errors.highestDegree}</p>
        )}
      </div>

      {/* PhD Focus (if applicable) */}
      {(highestDegree === "PhD" || highestDegree === "Postdoc" || highestDegree === "MD/PhD") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PhD Research Focus
          </label>
          <textarea
            value={phdFocus}
            onChange={(e) => {
              setPhdFocus(e.target.value);
              onUpdate({ highestDegree, phdFocus: e.target.value, education });
            }}
            placeholder="Describe your PhD research area and focus..."
            rows={3}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
          />
        </div>
      )}

      {/* Education Entries */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Education History</h3>
          <button
            type="button"
            onClick={addEducation}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add Another Degree
          </button>
        </div>

        {errors.education && (
          <p className="text-sm text-red-600">{errors.education}</p>
        )}

        {education.map((edu, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Degree {index + 1}</h4>
              {education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleChange(index, "degree", e.target.value)}
                  placeholder="e.g., PhD, Master's, Bachelor's"
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleChange(index, "field", e.target.value)}
                  placeholder="e.g., Molecular Biology"
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleChange(index, "institution", e.target.value)}
                placeholder="e.g., Harvard University"
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Year
                </label>
                <input
                  type="number"
                  value={edu.startYear}
                  onChange={(e) => handleChange(index, "startYear", e.target.value)}
                  placeholder="2015"
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Year
                </label>
                <input
                  type="number"
                  value={edu.endYear}
                  onChange={(e) => handleChange(index, "endYear", e.target.value)}
                  placeholder="2020"
                  disabled={edu.current}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 disabled:bg-gray-100"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={edu.current}
                    onChange={(e) => handleChange(index, "current", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Current</span>
                </label>
              </div>
            </div>

            {edu.degree.toLowerCase().includes("phd") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thesis Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.thesisTopic}
                    onChange={(e) => handleChange(index, "thesisTopic", e.target.value)}
                    placeholder="Brief description of your thesis"
                    className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Advisor (Optional)
                  </label>
                  <input
                    type="text"
                    value={edu.advisor}
                    onChange={(e) => handleChange(index, "advisor", e.target.value)}
                    placeholder="Your PhD advisor's name"
                    className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                  />
                </div>
              </>
            )}
          </div>
        ))}
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
