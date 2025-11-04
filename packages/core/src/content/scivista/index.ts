import type { ExhibitItem } from "../personal";

export interface SciVista {
  id: "scivista";
  headline: string;
  items: ExhibitItem[];
}

export const sciVista: SciVista = {
  id: "scivista",
  headline: "SciVista VR",
  items: [
    { title: "VR Workflow", subtitle: "Role", period: "YYYY–YYYY", bullets: ["Experience design", "Performance win"] }
  ]
};

export default sciVista;
