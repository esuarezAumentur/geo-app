/**
 * @interface IMapRepository
 *
 * Outbound port for map use cases.
 *
 * @method {function(object): Promise<object[]>} findAll
 *   Return all maps matching the filter, with createdBy populated.
 *
 * @method {function(string): Promise<object|null>} findById
 *   Find a map by id, with createdBy populated.
 *
 * @method {function(object): Promise<object>} create
 *   Persist a new map and return the created document.
 *
 * @method {function(string, object): Promise<object|null>} update
 *   Update a map by id and return the updated document.
 *
 * @method {function(string): Promise<object|null>} delete
 *   Delete a map by id and return the deleted document.
 */
