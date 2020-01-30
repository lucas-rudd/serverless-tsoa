export const deepRemoveKey = <T extends object | object[]>(
  obj: T,
  keyToDelete: string
): T => {
  if (obj instanceof Array) {
    return obj.reduce((acc, key, index) => {
      if (obj.values()[index] instanceof Object && key !== keyToDelete) {
        return [
          ...acc,
          ...[{ [key]: deepRemoveKey(obj.values[key], keyToDelete) }]
        ];
      } else {
        return [...acc, key];
      }
    }, []);
  } else {
    return Object.keys(obj).reduce<T>((acc, key) => {
      if (obj[key] instanceof Object && key !== keyToDelete) {
        return { ...acc, ...{ [key]: deepRemoveKey(obj[key], keyToDelete) } };
      } else if (key !== keyToDelete) {
        return { ...acc, [key]: obj[key] };
      } else {
        return { ...acc };
      }
    }, {} as T);
  }
};
