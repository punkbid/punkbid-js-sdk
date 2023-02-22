import { Filter } from "./types.js";
import { TraitName, traitsByName, punks } from "./metadata.js";

export function makeFilterMatcher(f: Filter, ids?: Set<number>) {
  return (id: number) => {
    const [type, attributes, skinColor] = punks[id];
    return (
      (f.type === undefined || type === f.type) &&
      (f.skinColor === undefined || skinColor === f.skinColor) &&
      (f.attributeCount === undefined ||
        attributes.length === f.attributeCount) &&
      (f.attributes === undefined ||
        f.attributes.length === 0 ||
        f.attributes.every((id) => attributes.includes(id))) &&
      (ids === undefined || ids.has(id))
    );
  };
}

export function filterPunks(f: Filter) {
  const matchFilter = makeFilterMatcher(f);
  const content: number[] = [];
  for (let id = 0; id < 10_000; id++) if (matchFilter(id)) content.push(id);
  return content;
}

export function filter(data: TraitName | TraitName[]): Filter {
  const traitNames = Array.isArray(data) ? data : [data];
  const f: Filter = { attributes: [] };

  for (const name of traitNames) {
    const { type, id } = traitsByName[name];

    if (type === "attribute") {
      f.attributes.push(id);
    } else {
      // check that there aren't multiple traits of the same type
      // we're not validating attributes as they're checked later by the Zod Filter parser
      if (f[type] !== undefined)
        throw new Error("mutually exclusive traits are not allowed");
      f[type] = id;
    }
  }
  return Filter.parse(f);
}
