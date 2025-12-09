import type { InitOptions, Module, Newable, NewableModule } from "i18next";
import type { BackendOptions } from "./modules/backend";
import type { LanguageDetectorOptions } from "./modules/language-detector";

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
};

export const createConfig = (options: ConfigurationOptions) => {
  globalOptions = {
    ...globalOptions,
    ...options,
  };
};
