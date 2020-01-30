export const Union = <UnionType extends string | number>(
  ...values: UnionType[]
) => {
  Object.freeze(values);
  const valueSet: Set<string | number> = new Set(values);

  const guard = (value: string | number): value is UnionType => {
    return valueSet.has(value);
  };

  const check = (value: string | number): UnionType => {
    if (!guard(value)) {
      const actual = JSON.stringify(value);
      const expected = values.map(s => JSON.stringify(s)).join(" | ");
      throw new TypeError(
        `Value '${actual}' is not assignable to type '${expected}'.`
      );
    }
    return value;
  };

  const unionNamespace = { guard, check, values };
  return Object.freeze(
    unionNamespace as typeof unionNamespace & { type: UnionType }
  );
};
