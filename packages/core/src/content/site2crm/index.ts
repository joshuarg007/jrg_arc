import type { ExhibitItem } from "../personal";

export interface Site2CRM {
  id: "site2crm";
  headline: string;
  items: ExhibitItem[];
}

export const site2CRM: Site2CRM = {
  id: "site2crm",
  headline: "Site2CRM",
  items: [
    { title: "Pipeline / Integration", subtitle: "Role", period: "YYYY–YYYY", bullets: ["Impact metric", "Architecture note"] }
  ]
};

export default site2CRM;
