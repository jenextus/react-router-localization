import { useTranslation } from "react-i18next";
import type { Route } from "./+types/route";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const middleware: Route.MiddlewareFunction[] = [];

export default function Home() {
  const { t } = useTranslation("common");

  return (
    <h1
      style={{
        textAlign: "center",
        paddingTop: 20,
      }}
    >
      {t("welcome")}
    </h1>
  );
}
