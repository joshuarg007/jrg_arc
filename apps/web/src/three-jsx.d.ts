// Type declarations for React Three Fiber elements
import type { Object3DNode, MaterialNode, BufferGeometryNode } from '@react-three/fiber';
import type {
  TorusKnotGeometry,
  TorusGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  PointsMaterial,
  LineBasicMaterial,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Mesh,
  Points,
  Line,
  Group,
  BufferGeometry,
  BufferAttribute,
  Fog,
  SphereGeometry,
  BoxGeometry,
  CylinderGeometry,
  PlaneGeometry,
  CircleGeometry,
  OctahedronGeometry,
  LatheGeometry,
} from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    // Geometries
    torusKnotGeometry: Object3DNode<TorusKnotGeometry, typeof TorusKnotGeometry>;
    torusGeometry: Object3DNode<TorusGeometry, typeof TorusGeometry>;
    sphereGeometry: Object3DNode<SphereGeometry, typeof SphereGeometry>;
    boxGeometry: Object3DNode<BoxGeometry, typeof BoxGeometry>;
    cylinderGeometry: Object3DNode<CylinderGeometry, typeof CylinderGeometry>;
    planeGeometry: Object3DNode<PlaneGeometry, typeof PlaneGeometry>;
    circleGeometry: Object3DNode<CircleGeometry, typeof CircleGeometry>;
    octahedronGeometry: Object3DNode<OctahedronGeometry, typeof OctahedronGeometry>;
    latheGeometry: Object3DNode<LatheGeometry, typeof LatheGeometry>;
    bufferGeometry: BufferGeometryNode<BufferGeometry, typeof BufferGeometry>;

    // Materials
    meshStandardMaterial: MaterialNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
    meshBasicMaterial: MaterialNode<MeshBasicMaterial, typeof MeshBasicMaterial>;
    pointsMaterial: MaterialNode<PointsMaterial, typeof PointsMaterial>;
    lineBasicMaterial: MaterialNode<LineBasicMaterial, typeof LineBasicMaterial>;

    // Lights
    ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
    directionalLight: Object3DNode<DirectionalLight, typeof DirectionalLight>;
    pointLight: Object3DNode<PointLight, typeof PointLight>;

    // Objects
    mesh: Object3DNode<Mesh, typeof Mesh>;
    points: Object3DNode<Points, typeof Points>;
    line: Object3DNode<Line, typeof Line>;
    group: Object3DNode<Group, typeof Group>;

    // Effects
    fog: Object3DNode<Fog, typeof Fog>;

    // Attributes
    bufferAttribute: Object3DNode<BufferAttribute, typeof BufferAttribute>;
  }
}
