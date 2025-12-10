import type { Module } from "i18next";
import { getI18nextContext } from "./context";
import type { LoaderFunctionArgs, RouterContextProvider } from "react-router";
import { createI18n, globalInstance } from "./create-i18n.node";
import { globalOptions, type ConfigurationOptions } from "./config";

export type LoadTranslationsResponse = {
  __i18next: Pick<ConfigurationOptions, "lng" | "resources">;
};

export const loadTranslations = async (
  args: LoaderFunctionArgs<Readonly<RouterContextProvider>>,
  options: Omit<ConfigurationOptions, "plugins"> = {}
) => {
  if (globalInstance?.languages) {
    await globalInstance?.reloadResources();
  }

  const detectLng = () => {
    const isUsingDefaultLanguageDetector =
      globalOptions.plugins?.every(
        (plugin) => (plugin as Module).type !== "languageDetector"
      ) ?? true;

    if (!isUsingDefaultLanguageDetector) {
      return undefined;
    }

    const detectFn =
      options.detection?.detect ?? globalOptions.detection?.detect;

    return detectFn?.(args);
  };

  const { instance, initPromise } = createI18n({
    ...options,
    lng: options.lng ?? detectLng(),
  });

  if (!instance.isInitialized) {
    await initPromise;
  }

  const contextOptions = getI18nextContext(args.context);

  // detect language
  const resolvedLng = instance.language;

  await Promise.all(
    contextOptions.map(async (option) => {
      const loadLng = option.lng ?? resolvedLng;
      if (loadLng !== instance.language) {
        await instance.changeLanguage(option.lng);
      }
      await instance.loadNamespaces(option.ns ?? []);
    })
  );

  return {
    __i18next: {
      lng: resolvedLng,
      resources: instance.store.data,
    },
  } satisfies LoadTranslationsResponse;
};
