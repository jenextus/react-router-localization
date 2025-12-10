import type { InitOptions, Module, Newable, NewableModule } from "i18next";
import type { BackendOptions } from "./modules/backend";
import type { LoaderFunctionArgs, RouterContextProvider } from "react-router";

type DetectArgs = LoaderFunctionArgs<Readonly<RouterContextProvider>>;

type LanguageDetectorOptions = {
  detect?: (args: DetectArgs) => string | undefined;
};

export type ConfigurationOptions<
  B = BackendOptions,
  D = LanguageDetectorOptions
> = InitOptions<B> & {
  detection?: D;
  plugins?: Array<Module | NewableModule<Module> | Newable<Module>>;
};

export let globalOptions: ConfigurationOptions = {
  ns: [],
  fallbackLng: false,
  load: "currentOnly",
  detection: {
    detect: (args) => args.params.lng,
  },
};

export const createConfig = (options: ConfigurationOptions) => {
  globalOptions = {
    ...globalOptions,
    ...options,
    detection: {
      ...globalOptions.detection,
      ...options.detection,
    },
  };
};
