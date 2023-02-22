import { z } from "zod";
import { attributes } from "./metadata.js";

export const PunkIndex = z.number().int().gte(0).lt(10_000);

export const Filter = z
  .object({
    attributeCount: z.coerce.number().int().gte(0).lt(8).optional(),
    type: z.coerce.number().int().gte(0).lt(5).optional(),
    skinColor: z.coerce.number().int().gte(0).lt(4).optional(),
    attributes: z.array(z.coerce.number().int().gte(0).lt(87)),
  })
  .refine(
    (f) => {
      const uniqueCategories = f.attributes
        .map((id) => attributes[id].category)
        .filter((value, index, array) => array.indexOf(value) === index);
      return f.attributes.length === uniqueCategories.length;
    },
    {
      message: "mutually exclusive attributes are not allowed",
    }
  );

export const Remove = z.literal(0);
export const Add = z.literal(1);
export const Instruction = z.union([Remove, Add]);

export const FilterStep = z.literal(0);
export const IdStep = z.literal(1);

const _FilterStep = z.object({
  instruction: Instruction,
  type: FilterStep,
  filter: Filter,
});

const _IdStep = z.object({
  instruction: Instruction,
  type: IdStep,
  id: PunkIndex,
});

export const Step = z.union([_FilterStep, _IdStep]);

export type Filter = z.infer<typeof Filter>;
export type Step = z.infer<typeof Step>;
export type FilterStep = z.infer<typeof _FilterStep>;
export type IdStep = z.infer<typeof _IdStep>;
export type Instruction = z.infer<typeof Instruction>;

export interface Serializable<T> {
  serialize(data: T): Uint8Array;
  deserialize(buffer: Uint8Array): T;
}
