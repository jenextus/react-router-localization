import { I18nextProvider } from "react-i18next";
import { useMemo } from "react";
import { useLoaderData } from "react-router";
import type { LoadTranslationsResponse } from "./load-translations";
import { createI18n } from "./create-i18n.browser";

export const appWithTranslation = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { __i18next } = useLoaderData<LoadTranslationsResponse>();

    const i18n = useMemo(() => {
      const { initPromise, instance } = createI18n(__i18next);

      initPromise;

      return instance;
    }, [__i18next]);

    return (
      <I18nextProvider i18n={i18n}>
        <WrappedComponent {...props} />
      </I18nextProvider>
    );
  };
};
