import { Step, Filter, Add, FilterStep, IdStep, Remove } from "./types.js";
import { makeFilterMatcher, filterPunks } from "./utils.js";
import * as s from "./serializers.js";

const FILTER_STEP_SIZE = 5;
const ID_STEP_SIZE = 2;

class Cart {
  private _steps: Step[] = [];

  add(data: Filter | number[] | number) {
    if (Array.isArray(data)) data.forEach((id) => this._addIdStep(id));
    else if (typeof data === "object") this._addFilterStep(data);
    else if (typeof data === "number") this._addIdStep(data);
    else throw "Can't add to cart: unknown data format";
  }

  remove(data: Filter | number[] | number) {
    if (Array.isArray(data)) data.forEach((id) => this._removeIdStep(id));
    else if (typeof data === "object") this._removeFilterStep(data);
    else if (typeof data === "number") this._removeIdStep(data);
    else throw "Can't remove from cart: unknown data format";
  }

  clear() {
    this._steps = [];
  }

  computeContent() {
    const content = new Set<number>();

    for (const step of this._steps) {
      const { instruction, type } = step;

      if (instruction === Remove.value) {
        if (type === FilterStep.value) {
          const matchFilter = makeFilterMatcher(step.filter);
          content.forEach((id) => matchFilter(id) && content.delete(id));
        } else {
          content.delete(step.id);
        }
      } else {
        if (type === FilterStep.value) {
          filterPunks(step.filter).forEach((id) => content.add(id));
        } else {
          content.add(step.id);
        }
      }
    }
    return content;
  }

  serialize() {
    const buffer: number[] = [0];

    for (const step of this._steps) {
      if (step.type === IdStep.value) buffer.push(...s.idStep.serialize(step));
      else buffer.push(...s.filterStep.serialize(step));
    }
    return new Uint8Array(buffer);
  }

  static deserialize(buffer: Uint8Array): Cart {
    const cart = new Cart();
    let i = 1;

    while (i < buffer.length) {
      const stepType = buffer[i] >> 7;
      const subBuffer = buffer.subarray(i);
      let step: Step;

      if (stepType === IdStep.value) {
        step = s.idStep.deserialize(subBuffer);
        i += ID_STEP_SIZE;
      } else {
        step = s.filterStep.deserialize(subBuffer);
        i += FILTER_STEP_SIZE;
      }

      step = Step.parse(step);
      cart._steps.push(step);
    }
    return cart;
  }

  private _addFilterStep(filter: Filter) {
    const step = Step.parse({
      type: FilterStep.value,
      instruction: Add.value,
      filter,
    });
    this._steps.push(step);
  }

  private _removeFilterStep(filter: Filter) {
    const step = Step.parse({
      type: FilterStep.value,
      instruction: Remove.value,
      filter,
    });
    this._steps.push(step);
  }

  private _addIdStep(id: number) {
    const step = Step.parse({ type: IdStep.value, instruction: Add.value, id });
    this._steps.push(step);
  }

  private _removeIdStep(id: number) {
    const step = Step.parse({
      type: IdStep.value,
      instruction: Remove.value,
      id,
    });
    this._steps.push(step);
  }
}

export default Cart;
