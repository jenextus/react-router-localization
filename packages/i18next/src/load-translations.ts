import type { InitOptions } from "i18next";
import { getI18nextContext } from "./context";
import type { LoaderFunctionArgs, RouterContextProvider } from "react-router";
import { createI18n, globalInstance } from "./create-i18n.node";
import { languageDetectorAls } from "./modules/language-detector";

export type LoadTranslationsResponse = {
  __i18next: Pick<InitOptions, "lng" | "resources">;
};

export const loadTranslations = async (
  args: LoaderFunctionArgs<Readonly<RouterContextProvider>>,
  options: InitOptions = {}
) => {
  return languageDetectorAls.run({ args }, async () => {
    if (globalInstance?.languages) {
      await globalInstance?.reloadResources();
    }

    const { instance, initPromise } = createI18n(options);

    if (!instance.isInitialized) {
      await initPromise;
    }

    const contextOptions = getI18nextContext(args.context);

    // detect language
    const language = instance.language;

    await Promise.all(
      contextOptions.map(async (option) => {
        if (option.lng !== instance.language) {
          await instance.changeLanguage(option.lng);
        }
        instance.loadNamespaces(option.ns ?? []);
      })
    );

    return {
      __i18next: {
        lng: language,
        resources: instance.store.data,
      },
    } satisfies LoadTranslationsResponse;
  });
};
