import type { InitOptions } from "i18next";
import type { MiddlewareFunction } from "react-router";
import { setI18nextContext } from "./context";


export function createMiddleware(options: InitOptions) {
  return async function (...[args]: Parameters<MiddlewareFunction>) {
    setI18nextContext(args.context, options);
  };
}
