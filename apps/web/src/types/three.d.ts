// apps/web/src/types/three.d.ts
declare module "three" {
    // Minimal surface area needed by apps/web/src/index.tsx
    export class Euler {
      x: number;
      y: number;
      z: number;
    }
  
    export class Vector3 {
      x: number;
      y: number;
      z: number;
    }
  
    export class Mesh {
      rotation: Euler;
      position: Vector3;
    }
  }
  