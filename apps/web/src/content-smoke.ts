import exhibits from "@core/content";

console.log("Loaded exhibit modules:", Object.keys(exhibits));
for (const [id, mod] of Object.entries(exhibits)) {
  console.log(id, "=>", mod.headline);
}
