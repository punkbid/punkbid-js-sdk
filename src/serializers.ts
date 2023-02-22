import { FilterStep, IdStep, Serializable } from "./types.js";
import { AttributeCategoryName, attributes } from "./metadata.js";

export const idStep: Serializable<IdStep> = {
  serialize({ instruction, id }: IdStep) {
    return new Uint8Array([
      (IdStep.value << 7) | (instruction << 6) | (id >> 8),
      id & 0b11111111,
    ]);
  },

  deserialize(buffer: Uint8Array) {
    if (buffer.byteLength < 2) throw new Error("incorrect buffer size!");
    const [one, two] = buffer;
    return {
      instruction: (one >> 6) & 1,
      type: IdStep.value,
      id: ((one & 0b111111) << 8) | two,
    } as IdStep;
  },
};

function attributesByTrait(ids: number[]) {
  return ids.reduce((attrs, id) => {
    attrs[attributes[id].category] = id;
    return attrs;
  }, {} as Record<AttributeCategoryName, number | undefined>);
}

// attribute ids starts at the following index for each category.
// when an attribute id is serialized, the lowest id value in that cat should be at 1,
// since we're optimizing for size.
// 0 means no attribute has been set in that category
const HAIR_OFFSET = 0;
const FACIAL_HAIR_OFFSET = 41;
const EYES_OFFSET = 53;
const NECK_OFFSET = 69;
const MOUTH_OFFSET = 75;
const MOUTH_ACC_OFFSET = 79;
const CHEEKS_OFFSET = 82;
const CLOWN_OFFSET = 85;
const EARRING_OFFSET = 86;

export const filterStep: Serializable<FilterStep> = {
  serialize({ instruction, filter: f }: FilterStep) {
    const encode = (id: number | undefined, offset = 0) =>
      id === undefined ? 0 : id + 1 - offset;
    const a = attributesByTrait(f.attributes);

    return new Uint8Array([
      (FilterStep.value << 7) |
        (instruction << 6) |
        (encode(f.type) << 3) |
        encode(f.skinColor),
      (encode(f.attributeCount) << 4) |
        encode(a.mouthAccessories, MOUTH_ACC_OFFSET),
      (encode(a.hair, HAIR_OFFSET) << 2) | encode(a.cheeks, CHEEKS_OFFSET),
      (encode(a.eyes, EYES_OFFSET) << 3) | encode(a.mouth, MOUTH_OFFSET),
      (encode(a.facialHair, FACIAL_HAIR_OFFSET) << 4) |
        (encode(a.neck, NECK_OFFSET) << 2) |
        (encode(a.clownNose, CLOWN_OFFSET) << 1) |
        encode(a.earring, EARRING_OFFSET),
    ]);
  },

  deserialize(buffer: Uint8Array) {
    if (buffer.byteLength < 5) throw new Error("incorrect buffer size!");
    const [one, two, three, four, five] = buffer;
    const decode = (id: number, offset = 0) =>
      id === 0 ? undefined : id - 1 + offset;

    const attributes = [
      decode(two & 0b1111, MOUTH_ACC_OFFSET),
      decode(three >> 2, HAIR_OFFSET),
      decode(three & 0b11, CHEEKS_OFFSET),
      decode(four >> 3, EYES_OFFSET),
      decode(four & 0b111, MOUTH_OFFSET),
      decode(five >> 4, FACIAL_HAIR_OFFSET),
      decode((five >> 2) & 0b11, NECK_OFFSET),
      decode((five >> 1) & 1, CLOWN_OFFSET),
      decode(five & 1, EARRING_OFFSET),
    ].filter((id) => id !== undefined);

    return {
      instruction: (one >> 6) & 1,
      type: FilterStep.value,
      filter: {
        type: decode((one >> 3) & 0b111),
        skinColor: decode(one & 0b111),
        attributeCount: decode(two >> 4),
        attributes,
      },
    } as FilterStep;
  },
};
