"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  title: string | null;
  department: string | null;
  institution: string | null;
  location: string | null;
  bio: string | null;
  emailNotifications: boolean;
  notifyOnQueryComplete: boolean;
  notifyWeeklyDigest: boolean;
  researchProfile: {
    highestDegree: string | null;
    yearsInField: number | null;
    orcidId: string | null;
    googleScholarId: string | null;
    phdFocus: string | null;
    primaryInterests: string[];
    secondaryInterests: string[];
    techniques: string[];
    computationalSkills: string[];
  } | null;
}

export default function ProfileEditForm({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Basic info
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title || "");
  const [department, setDepartment] = useState(user.department || "");
  const [institution, setInstitution] = useState(user.institution || "");
  const [location, setLocation] = useState(user.location || "");
  const [bio, setBio] = useState(user.bio || "");

  // Research profile
  const [highestDegree, setHighestDegree] = useState(
    user.researchProfile?.highestDegree || ""
  );
  const [yearsInField, setYearsInField] = useState(
    user.researchProfile?.yearsInField?.toString() || ""
  );
  const [orcidId, setOrcidId] = useState(user.researchProfile?.orcidId || "");
  const [googleScholarId, setGoogleScholarId] = useState(
    user.researchProfile?.googleScholarId || ""
  );
  const [phdFocus, setPhdFocus] = useState(user.researchProfile?.phdFocus || "");

  // Array fields (as comma-separated)
  const [primaryInterests, setPrimaryInterests] = useState(
    user.researchProfile?.primaryInterests?.join(", ") || ""
  );
  const [secondaryInterests, setSecondaryInterests] = useState(
    user.researchProfile?.secondaryInterests?.join(", ") || ""
  );
  const [techniques, setTechniques] = useState(
    user.researchProfile?.techniques?.join(", ") || ""
  );
  const [computationalSkills, setComputationalSkills] = useState(
    user.researchProfile?.computationalSkills?.join(", ") || ""
  );

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(
    user.emailNotifications
  );
  const [notifyOnQueryComplete, setNotifyOnQueryComplete] = useState(
    user.notifyOnQueryComplete
  );
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(
    user.notifyWeeklyDigest
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Basic info
          name,
          title: title || null,
          department: department || null,
          institution: institution || null,
          location: location || null,
          bio: bio || null,
          // Notifications
          emailNotifications,
          notifyOnQueryComplete,
          notifyWeeklyDigest,
          // Research profile
          researchProfile: {
            highestDegree: highestDegree || null,
            yearsInField: yearsInField ? parseInt(yearsInField) : null,
            orcidId: orcidId || null,
            googleScholarId: googleScholarId || null,
            phdFocus: phdFocus || null,
            primaryInterests: primaryInterests
              ? primaryInterests.split(",").map((s) => s.trim()).filter(Boolean)
              : [],
            secondaryInterests: secondaryInterests
              ? secondaryInterests.split(",").map((s) => s.trim()).filter(Boolean)
              : [],
            techniques: techniques
              ? techniques.split(",").map((s) => s.trim()).filter(Boolean)
              : [],
            computationalSkills: computationalSkills
              ? computationalSkills.split(",").map((s) => s.trim()).filter(Boolean)
              : [],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/researcher/profile");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            Profile updated successfully! Redirecting...
          </p>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-gray-100 text-neutral-500"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Email cannot be changed
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., PhD Candidate, Principal Investigator"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g., Cancer Biology"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Institution
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g., Harvard Medical School"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Boston, MA"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Research Profile */}
      <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Research Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Highest Degree
            </label>
            <select
              value={highestDegree}
              onChange={(e) => setHighestDegree(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select degree</option>
              <option value="BS">BS</option>
              <option value="MS">MS</option>
              <option value="MD">MD</option>
              <option value="PhD">PhD</option>
              <option value="MD/PhD">MD/PhD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Years in Field
            </label>
            <input
              type="number"
              value={yearsInField}
              onChange={(e) => setYearsInField(e.target.value)}
              min="0"
              placeholder="0"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              ORCID ID
            </label>
            <input
              type="text"
              value={orcidId}
              onChange={(e) => setOrcidId(e.target.value)}
              placeholder="0000-0000-0000-0000"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Google Scholar ID
            </label>
            <input
              type="text"
              value={googleScholarId}
              onChange={(e) => setGoogleScholarId(e.target.value)}
              placeholder="Scholar ID"
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            PhD Research Focus
          </label>
          <textarea
            value={phdFocus}
            onChange={(e) => setPhdFocus(e.target.value)}
            rows={3}
            placeholder="Describe your PhD research focus..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Primary Research Interests
          </label>
          <input
            type="text"
            value={primaryInterests}
            onChange={(e) => setPrimaryInterests(e.target.value)}
            placeholder="Comma-separated (e.g., CAR-T, Immunotherapy, Cancer Biology)"
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-neutral-500 mt-1">Separate with commas</p>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Secondary Research Interests
          </label>
          <input
            type="text"
            value={secondaryInterests}
            onChange={(e) => setSecondaryInterests(e.target.value)}
            placeholder="Comma-separated"
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-neutral-500 mt-1">Separate with commas</p>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Laboratory Techniques
          </label>
          <input
            type="text"
            value={techniques}
            onChange={(e) => setTechniques(e.target.value)}
            placeholder="Comma-separated (e.g., Flow Cytometry, PCR, Western Blot)"
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-neutral-500 mt-1">Separate with commas</p>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Computational Skills
          </label>
          <input
            type="text"
            value={computationalSkills}
            onChange={(e) => setComputationalSkills(e.target.value)}
            placeholder="Comma-separated (e.g., Python, R, Bioinformatics)"
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-neutral-500 mt-1">Separate with commas</p>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-card border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Notification Preferences
        </h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="emailNotifications"
              className="ml-2 text-sm text-neutral-700"
            >
              Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyOnQueryComplete"
              checked={notifyOnQueryComplete}
              onChange={(e) => setNotifyOnQueryComplete(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="notifyOnQueryComplete"
              className="ml-2 text-sm text-neutral-700"
            >
              Query Completion Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifyWeeklyDigest"
              checked={notifyWeeklyDigest}
              onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="notifyWeeklyDigest"
              className="ml-2 text-sm text-neutral-700"
            >
              Weekly Digest
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/researcher/profile")}
          className="px-6 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-primary transition disabled:bg-neutral-400 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
