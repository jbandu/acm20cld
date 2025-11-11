export interface ProfileData {
  name?: string;
  title?: string;
  department?: string;
  institution?: string;
  location?: string;
  bio?: string;
  researchProfile?: {
    highestDegree?: string | null;
    yearsInField?: number | null;
    orcidId?: string | null;
    googleScholarId?: string | null;
    phdFocus?: string | null;
    primaryInterests?: string[];
    secondaryInterests?: string[];
    techniques?: string[];
    computationalSkills?: string[];
  } | null;
}

export function calculateProfileCompleteness(data: ProfileData): number {
  let filled = 0;
  let total = 0;

  // Basic info (6 fields)
  const basicFields = [data.name, data.title, data.department, data.institution, data.location, data.bio];
  basicFields.forEach(field => {
    total++;
    if (field && field.trim()) filled++;
  });

  // Research profile fields (9 fields)
  if (data.researchProfile) {
    const rp = data.researchProfile;
    const researchFields = [
      rp.highestDegree,
      rp.yearsInField?.toString(),
      rp.orcidId,
      rp.googleScholarId,
      rp.phdFocus,
    ];
    researchFields.forEach(field => {
      total++;
      if (field && String(field).trim()) filled++;
    });

    // Array fields
    total += 4;
    if (rp.primaryInterests && rp.primaryInterests.length > 0) filled++;
    if (rp.secondaryInterests && rp.secondaryInterests.length > 0) filled++;
    if (rp.techniques && rp.techniques.length > 0) filled++;
    if (rp.computationalSkills && rp.computationalSkills.length > 0) filled++;
  } else {
    total += 9;
  }

  return Math.round((filled / total) * 100);
}
