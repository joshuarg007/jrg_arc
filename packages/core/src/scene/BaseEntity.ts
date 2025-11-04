import type { SceneContext, SceneEntity } from "./SceneManager";

/** Minimal abstract base for scene entities. */
export abstract class BaseEntity implements SceneEntity {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  init?(ctx: SceneContext): void;
  tick?(ctx: SceneContext): void;
  dispose?(ctx: SceneContext): void;
}

export default BaseEntity;
