/**
 * @interface IModelRepository
 *
 * @method {function(object): Promise<{data: object[], total: number}>} findAll
 * @method {function(string): Promise<object|null>} findById
 * @method {function(object): Promise<object>} create
 * @method {function(string, object): Promise<object|null>} update
 * @method {function(string): Promise<object|null>} delete
 */
