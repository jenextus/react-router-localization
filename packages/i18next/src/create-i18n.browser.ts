import {
  createInstance,
  type i18n,
  type InitOptions,
  type TFunction,
} from "i18next";
import { globalOptions } from "./config";

type Subscriber = (t: TFunction) => void;

const subscribers: Subscriber[] = [];

export const createI18n = (
  options: InitOptions = {}
): { instance: i18n; initPromise: Promise<TFunction> } => {
  const { plugins, ...globalInitOptions } = globalOptions;

  let instance = createInstance({
    ...globalInitOptions,
    ...options,
  });

  if (instance.isInitialized) {
    return {
      instance,
      initPromise: Promise.resolve(instance.t),
    };
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
