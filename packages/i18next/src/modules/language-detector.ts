import { AsyncLocalStorage } from "node:async_hooks";
import type { LanguageDetectorModule } from "i18next";
import type { LoaderFunctionArgs, RouterContextProvider } from "react-router";

type DetectArgs = LoaderFunctionArgs<Readonly<RouterContextProvider>>;

export const languageDetectorAls = new AsyncLocalStorage<{
  args?: DetectArgs;
}>();

export type LanguageDetectorOptions = {
  detect: (args: DetectArgs) => ReturnType<LanguageDetectorModule["detect"]>;
};

class LanguageDetector implements LanguageDetectorModule {
  static type: LanguageDetectorModule["type"] = "languageDetector";

  type: LanguageDetectorModule["type"] = "languageDetector";

  private detectorOptions: LanguageDetectorOptions = {
    detect: (args) => args.params.lng,
  };

  init: LanguageDetectorModule["init"] = (
    _services,
    detectorOptions = {},
    _i18nextOptions
  ) => {
    this.detectorOptions = {
      ...this.detectorOptions,
      ...detectorOptions,
    };
  };

  detect: LanguageDetectorModule["detect"] = () => {
    const detectArgs = languageDetectorAls.getStore()?.args;
    return detectArgs ? this.detectorOptions.detect(detectArgs) : undefined;
  };
}

export default LanguageDetector;
