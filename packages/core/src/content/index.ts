import personalEducation from "./personal";
import axionDeep from "./axion-deep";
import site2CRM from "./site2crm";
import sciVista from "./scivista";

export interface ExhibitModule {
  id: string;
  headline: string;
  items?: { title: string; subtitle?: string; period?: string; bullets?: string[] }[];
}

export const exhibits: Record<string, ExhibitModule> = {
  "personal-education": personalEducation,
  "axion-deep": axionDeep,
  "site2crm": site2CRM,
  "scivista": sciVista
};

export default exhibits;
