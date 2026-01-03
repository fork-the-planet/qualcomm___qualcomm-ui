export type WeightUnit = "kg" | "lb"

/**
 * Represents a dog with its properties.
 *
 * @public
 */
export interface Dog {
  /**
   * The age of the dog in human years.
   */
  age: number

  /**
   * The breed of the dog.
   */
  breed?: string

  /**
   * The name of the dog.
   */
  name: string

  /**
   * The weight of the dog. Refer to {@link weightUnit} for unit type information.
   */
  weight?: number

  /**
   * The unit type of the {@link weight} field.
   *
   * @option `'kg'`: kilograms.
   * @option `'lb'`: pounds.
   */
  weightUnit?: WeightUnit
}

/**
 * @public
 */
export interface OptionTagExample {
  /**
   * The unit type of the weight field.
   *
   * @option `'kg'`: kilograms.
   * @option `'lb'`: pounds.
   */
  weightUnit: WeightUnit
}

/**
 * @public
 */
export interface Option {
  /**
   * Unique identifier for the option.
   */
  id: string

  /**
   * Nested options.
   *
   * @inheritDoc
   */
  options?: Option[]

  /**
   * Option value.
   */
  value: string
}

/**
 * @public
 */
export interface DefaultTagExample {
  /**
   * Example property.
   *
   * @default 0
   */
  age?: number
}

/**
 * @public
 */
export interface LinkExample {
  /**
   * Visit {@link https://google.com this external link} to learn more.
   */
  externalLink?: string

  /**
   * Refer to the {@link externalLink} property.
   */
  internalLink?: string
}

/**
 * @public
 */
export interface SeeTagExample {
  /**
   * @see {@link someOtherPropExample}
   */
  otherPropExample?: string

  /**
   * Another prop.
   */
  someOtherPropExample?: string
}

/**
 * @public
 */
export interface SinceExample {
  /**
   * Foo.
   *
   * @since 3.10.0
   */
  foo: string
}

export type DocsEnvironment = "test" | "stage" | "prod"

/**
 * @public
 */
export interface ZipFileOptions {
  /**
   * name to use for the local zip file.
   *
   * @default `site-data.zip`
   */
  archiveName?: string

  /**
   * the file directory to zip up.
   */
  directory: string
}

/**
 * @public
 */
export interface UploadFileOptions {
  /**
   * Relative path to the local zip file that will be generated.
   */
  archivePath: string

  /**
   * Deploy environment.
   */
  environment: DocsEnvironment

  /**
   * Name of the service. Must match one of the predefined service names in the
   * deployed handler.
   */
  service: string
}

/**
 * @public
 */
export interface GetFilesOptions {
  /**
   * Deploy environment.
   */
  environment: DocsEnvironment

  /**
   * Name of the service. Must match one of the predefined service names in the
   * deployed handler.
   */
  service: string
}

export interface CloudDocsSdkOptions {
  /**
   * The file handler API url.
   */
  baseUrl: string
}

export class CloudDocsSdk {
  constructor(public readonly opts: CloudDocsSdkOptions) {}

  /**
   * Zip files.
   */
  async zipFiles(_opts: ZipFileOptions): Promise<boolean> {
    return false
  }

  /**
   * Upload files
   *
   * @param archivePath test1
   * @param environment test2
   * @param service test3
   */
  async uploadFiles(_opts: UploadFileOptions): Promise<boolean> {
    return true
  }

  /**
   * Download files
   */
  async getServiceFiles(_opts: GetFilesOptions) {
    return {} as any
  }
}
