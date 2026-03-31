/**
 * @interface IPoiRepository
 *
 * Outbound port for POI use cases.
 *
 * @method {function(string): Promise<object[]>} findByMapId
 *   Return all POIs for a given map, sorted by order.
 *
 * @method {function(string, string): Promise<object|null>} findByIdAndMapId
 *   Find a single POI by its id and mapId.
 *
 * @method {function(object): Promise<object>} create
 *   Persist a new POI and return the created document.
 *
 * @method {function(string, string, object): Promise<object|null>} update
 *   Update a POI by id and mapId, return the updated document.
 *
 * @method {function(string, string): Promise<object|null>} delete
 *   Delete a POI by id and mapId, return the deleted document.
 *
 * @method {function(string, string[]): Promise<object[]>} reorder
 *   Reassign order values based on the orderedIds array and return updated list.
 */

/**
 * Note: use cases that verify map existence (ListPois, CreatePoi, ReorderPois)
 * also receive an IMapRepository (maps/application/ports/IMapRepository) via constructor injection.
 */
