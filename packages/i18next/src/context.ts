import type { InitOptions } from "i18next";
import { createContext, type RouterContextProvider } from "react-router";

export type I18nextContextValue = Record<string, InitOptions>;

export const i18nextContext = createContext<I18nextContextValue>({});

const generateKey = ({ lng = "", ns = [] }: InitOptions) => {
  return `${lng}@${Array.isArray(ns) ? ns.sort().join(",") : ns}`;
};

export const setI18nextContext = (
  provider: Readonly<RouterContextProvider>,
  value: InitOptions
) => {
  provider.set(i18nextContext, {
    ...provider.get(i18nextContext),
    [generateKey(value)]: value,
  });
};

export const getI18nextContext = (
  provider: Readonly<RouterContextProvider>
) => {
  return Object.values(provider.get(i18nextContext)) as InitOptions[];
};
