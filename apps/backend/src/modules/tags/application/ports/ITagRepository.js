/**
 * @interface ITagRepository
 *
 * @method {function(): Promise<object[]>} findAll
 * @method {function(string): Promise<object|null>} findById
 * @method {function(object): Promise<object>} create
 * @method {function(string, object): Promise<object|null>} update
 * @method {function(string): Promise<object|null>} delete
 */
