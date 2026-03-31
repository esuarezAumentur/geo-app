/**
 * @interface IAuthUserRepository
 *
 * Outbound port for auth use cases. Any persistence adapter must implement these methods.
 *
 * @method {function(string): Promise<object|null>} findByEmail
 *   Find a user by email (passwordHash excluded).
 *
 * @method {function(string): Promise<object|null>} findByEmailWithPassword
 *   Find an active user by email including the passwordHash field.
 *
 * @method {function(string): Promise<object|null>} findById
 *   Find a user by id.
 *
 * @method {function({email:string, passwordHash:string, role:string}): Promise<object>} create
 *   Persist a new user and return the created document.
 */
