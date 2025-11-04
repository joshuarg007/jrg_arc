export interface ExhibitItem {
  title: string;
  subtitle?: string;
  period?: string;
  bullets?: string[];
}

export interface PersonalEducation {
  id: "personal-education";
  headline: string;
  items: ExhibitItem[];
}

/** Edit these placeholders with your real details later */
export const personalEducation: PersonalEducation = {
  id: "personal-education",
  headline: "Education & Learning",
  items: [
    {
      title: "Institution / Program",
      subtitle: "Degree or Certification",
      period: "YYYY–YYYY",
      bullets: [
        "Focus: topic/track",
        "Highlight: award/research/project"
      ]
    }
  ]
};

export default personalEducation;
