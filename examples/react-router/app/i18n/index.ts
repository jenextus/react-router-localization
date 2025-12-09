import { createConfig } from "~/packages/i18next/src";
import type { ConfigurationOptions } from "~/packages/i18next/src";

const options: ConfigurationOptions = {
  fallbackLng: "en",
};

if (import.meta.env.SSR) {
  options.backend = {
    files: import.meta.glob("./locales/*/*.json", {
      import: "default",
    }),
  };
}

createConfig(options);
