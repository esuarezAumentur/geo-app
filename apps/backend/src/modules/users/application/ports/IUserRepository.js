/**
 * @interface IUserRepository
 *
 * Outbound port for user management use cases.
 *
 * @method {function(): Promise<object[]>} findAll
 *   Return all users (passwordHash excluded).
 *
 * @method {function(string): Promise<object|null>} findById
 *   Find a user by id (passwordHash excluded).
 *
 * @method {function(string): Promise<object|null>} findByEmail
 *   Find a user by email.
 *
 * @method {function({email:string, passwordHash:string, role:string}): Promise<object>} create
 *   Persist a new user and return the created document.
 *
 * @method {function(string, object): Promise<object|null>} update
 *   Update a user by id and return the updated document.
 *
 * @method {function(string): Promise<object|null>} delete
 *   Delete a user by id and return the deleted document.
 */
