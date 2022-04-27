import { useEffect } from "react";
import { isNilOrEmpty } from "../";

/**
 * Custom hook for persisting and populating react-hook-form form using storage of your choice
 * Usage:
 * useFormPersist('namespace',{watch,setValue},{include: ['email']},{exclude: ['password']})
 *
 * @param {String} storageKey - unique key for the webStorage namespace
 * @param {{watch:Function,setValue:Function}} callbackFuncs - watch & setValue funcs from react-hook-form
 * @param {{storage:Storage,exclude:String[],include:String[],onDataRestored:Function,validate:Boolean,dirty:Boolean}} [config] - configurations of persist behaviours
 * @returns {Function} clear() - remove data from webStorage namespace
 */
const useFormPersist = (
  storageKey,
  { watch, setValue },
  {
    storage = window.localStorage,
    exclude = [],
    include,
    onDataRestored,
    validate = false,
    dirty = false
  } = {}
) => {
  const watchedValues = watch(include);
  const combineKVArrayToObj = (first, second) => {
    if (first) {
      return first.reduce((acc, val, ind) => {
        acc[val] = second[ind];
        return acc;
      }, {});
    }
    return second;
  };
  const watchedValuePairs = combineKVArrayToObj(include, watchedValues)
  const values = exclude.length
    ? Object.entries(watchedValuePairs)
        .filter(([key]) => !exclude.includes(key))
        .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
    : Object.assign({}, watchedValuePairs);

  useEffect(() => {
    const storageItem = storage.getItem(storageKey);

    if (isNilOrEmpty(storageItem)) {
      return;
    }

    const values = JSON.parse(storageItem);

    const dataRestored = {};
    Object.keys(values).forEach(key => {
      if (key === "constructor" && typeof values[key] === "function") {
        return;
      }
      if (key === "__proto__") {
        return;
      }
      dataRestored[key] = values[key];
      setValue(key, values[key], {
        shouldValidate: validate,
        shouldDirty: dirty
      });
    });

    if (onDataRestored) {
      onDataRestored(dataRestored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage, storageKey, onDataRestored, setValue]);

  useEffect(() => {
    if (Object.entries(values).length) {
      storage.setItem(storageKey, JSON.stringify(values));
    }
  });

  return {
    clear: () => storage.removeItem(storageKey)
  };
};

export default useFormPersist;
