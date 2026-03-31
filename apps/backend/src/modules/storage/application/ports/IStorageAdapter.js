/**
 * @interface IStorageAdapter
 *
 * Outbound port for storage use cases.
 *
 * @method {function(string): string} getFilePath
 *   Return the absolute filesystem path for the given filename.
 *
 * @method {function(string): boolean} fileExists
 *   Return true if the file at the given path exists.
 *
 * @method {function(string): void} deleteFile
 *   Delete the file at the given path.
 *
 * @method {function(string): string} buildPublicUrl
 *   Build and return the public HTTP URL for the given filename.
 */
