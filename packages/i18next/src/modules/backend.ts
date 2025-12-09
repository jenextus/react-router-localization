import type {
  BackendModule as I18NextBackendModule,
  InitOptions,
  Services,
  ResourceKey,
} from "i18next";

type TranslationResource = ResourceKey | (() => Promise<ResourceKey>);

export type BackendOptions = {
  pattern?: string | ((options: { lng: string; ns: string }) => string);
  files?: Record<string, TranslationResource>;
};

type BackendModule = I18NextBackendModule<BackendOptions>;

class Backend implements BackendModule {
  static type: BackendModule["type"] = "backend";

  type: BackendModule["type"] = "backend";

  private _backendOptions: Required<BackendOptions> = {
    pattern: "locales/{{lng}}/{{ns}}.json",
    files: {},
  };

  private get backendOptions(): Required<BackendOptions> {
    return this._backendOptions;
  }

  private set backendOptions(next: Partial<BackendOptions>) {
    this._backendOptions = {
      pattern: next.pattern ?? this._backendOptions.pattern,
      files: next.files ?? this._backendOptions.files,
    };
  }

  private services = {} as Services;

  private i18nextOptions: InitOptions = {};

  private async readResource(
    resource: TranslationResource
  ): Promise<ResourceKey> {
    if (typeof resource === "function") {
      return resource();
    }
    return resource;
  }

  init: BackendModule["init"] = (
    services,
    backendOptions = {},
    i18nextOptions
  ) => {
    this.services = services;
    this.i18nextOptions = i18nextOptions;
    this.backendOptions = backendOptions;
  };

  read: BackendModule["read"] = (language, namespace, callback) => {
    const { files, pattern } = this.backendOptions;
    const patternString =
      typeof pattern === "function"
        ? pattern({ lng: language, ns: namespace })
        : pattern;

    const filePattern = this.services.interpolator.interpolate(
      patternString,
      {
        lng: language,
        ns: namespace,
      },
      language,
      this.i18nextOptions.interpolation ?? {}
    );

    const fileKey = Object.keys(files).find((key) => key.includes(filePattern));

    this.readResource(fileKey ? this.backendOptions.files[fileKey] : {})
      .then((resource) => {
        callback(null, resource);
      })
      .catch((err) => {
        callback(err, null);
      });
  };
}

export default Backend;
