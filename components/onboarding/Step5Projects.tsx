"use client";

import { useState } from "react";
import { OnboardingStepProps } from "./types";

interface Project {
  title: string;
  description: string;
  status: string;
}

interface Goal {
  type: string;
  title: string;
  targetDate: string;
}

export function Step5Projects({ data, onUpdate, onNext, onBack }: OnboardingStepProps) {
  const [projects, setProjects] = useState<Project[]>(
    data?.projects || [{ title: "", description: "", status: "IN_PROGRESS" }]
  );
  const [goals, setGoals] = useState<Goal[]>(
    data?.goals || [{ type: "", title: "", targetDate: "" }]
  );

  const goalTypes = [
    { value: "CONFERENCE_ABSTRACT", label: "Conference Abstract" },
    { value: "GRANT_PROPOSAL", label: "Grant Proposal" },
    { value: "PAPER_SUBMISSION", label: "Paper Submission" },
    { value: "PATENT_FILING", label: "Patent Filing" },
    { value: "EXPERIMENT_COMPLETION", label: "Experiment Completion" },
    { value: "COLLABORATION", label: "Collaboration" },
    { value: "LEARNING", label: "Learning Goal" },
    { value: "OTHER", label: "Other" },
  ];

  const projectStatuses = [
    { value: "PLANNING", label: "Planning" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "ANALYZING", label: "Analyzing Data" },
    { value: "WRITING", label: "Writing" },
    { value: "SUBMITTED", label: "Submitted" },
    { value: "PUBLISHED", label: "Published" },
    { value: "ON_HOLD", label: "On Hold" },
  ];

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
    updateParent(updated, goals);
  };

  const handleGoalChange = (index: number, field: keyof Goal, value: string) => {
    const updated = [...goals];
    updated[index] = { ...updated[index], [field]: value };
    setGoals(updated);
    updateParent(projects, updated);
  };

  const addProject = () => {
    setProjects([...projects, { title: "", description: "", status: "IN_PROGRESS" }]);
  };

  const removeProject = (index: number) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    updateParent(updated, goals);
  };

  const addGoal = () => {
    setGoals([...goals, { type: "", title: "", targetDate: "" }]);
  };

  const removeGoal = (index: number) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
    updateParent(projects, updated);
  };

  const updateParent = (projectsData: Project[], goalsData: Goal[]) => {
    onUpdate({
      projects: projectsData,
      goals: goalsData,
    });
  };

  const handleNext = () => {
    updateParent(projects, goals);
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Projects & Goals
        </h2>
        <p className="text-lg text-gray-600">
          Tell us about your current research and future goals
        </p>
      </div>

      {/* Current Projects */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Current Research Projects</h3>
            <p className="text-sm text-gray-500">Optional - helps personalize question suggestions</p>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add Project
          </button>
        </div>

        {projects.map((project, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                placeholder="e.g., CAR-T cell penetration in solid tumors"
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brief Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                placeholder="What are you investigating? What's the main hypothesis?"
                rows={3}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={project.status}
                onChange={(e) => handleProjectChange(index, "status", e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              >
                {projectStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Research Goals */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Upcoming Goals & Deadlines</h3>
            <p className="text-sm text-gray-500">Optional - we'll help you track progress</p>
          </div>
          <button
            type="button"
            onClick={addGoal}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add Goal
          </button>
        </div>

        {goals.map((goal, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Goal {index + 1}</h4>
              {goals.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeGoal(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Type
                </label>
                <select
                  value={goal.type}
                  onChange={(e) => handleGoalChange(index, "type", e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                >
                  <option value="">Select type</option>
                  {goalTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={goal.targetDate}
                  onChange={(e) => handleGoalChange(index, "targetDate", e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Title
              </label>
              <input
                type="text"
                value={goal.title}
                onChange={(e) => handleGoalChange(index, "title", e.target.value)}
                placeholder="e.g., Submit AACR 2025 abstract"
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              />
            </div>
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
