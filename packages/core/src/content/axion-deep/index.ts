import type { ExhibitItem } from "../personal";

export interface AxionDeep {
  id: "axion-deep";
  headline: string;
  items: ExhibitItem[];
}

export const axionDeep: AxionDeep = {
  id: "axion-deep",
  headline: "Axion Deep Labs",
  items: [
    { title: "Project / Platform", subtitle: "Role", period: "YYYY–YYYY", bullets: ["Key result", "Tech stack"] }
  ]
};

export default axionDeep;
