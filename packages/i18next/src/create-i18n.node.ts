import {
  createInstance,
  type i18n,
  type InitOptions,
  type Module,
  type TFunction,
} from "i18next";
import { globalOptions } from "./config";
import Backend from "./modules/backend";
import LanguageDetector from "./modules/language-detector";

export let globalInstance: i18n | undefined = undefined;

type Subscriber = (t: TFunction) => void;

const subscribers: Subscriber[] = [];

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

  const isUsingDefaultLanguageDetector =
    plugins?.every(
      (plugin) => (plugin as Module).type !== "languageDetector"
    ) ?? true;

  if (isUsingDefaultLanguageDetector) {
    instance.use(LanguageDetector);
  }

  plugins?.forEach((plugin) => {
    instance.use(plugin);
  });

  const initPromise = new Promise<TFunction>((resolve) => {
    subscribers.push(resolve);

    if (instance.isInitializing) return;

    instance.init((_error, t) => {
      subscribers.forEach((subscriber) => subscriber(t));
    });
  });

  return { instance, initPromise };
};
