import {
  createInstance,
  type i18n,
  type InitOptions,
  type Module,
} from "i18next";
import { globalOptions } from "./config";
import Backend from "./modules/backend";

export let globalInstance: i18n | undefined = undefined;

export const createI18n = (options: InitOptions = {}) => {
  let instance: i18n;

  const { plugins, ...globalInitOptions } = globalOptions;

  if (globalInstance) {
    instance = globalInstance.cloneInstance({
      ...options,
      initAsync: false,
    });
  } else {
    globalInstance = instance = createInstance({
      ...globalInitOptions,
      ...options,
    });
  }

  if (instance.isInitialized) {
    return {
      instance,
      initPromise: Promise.resolve(instance.t),
    };
  }

  const isUsingDefaultBackend =
    plugins?.every((plugin) => (plugin as Module).type !== "backend") ?? true;

  if (isUsingDefaultBackend) {
    instance.use(Backend);
  }

  plugins?.forEach((plugin) => {
    instance.use(plugin);
  });

  return { instance, initPromise: instance.init() };
};
