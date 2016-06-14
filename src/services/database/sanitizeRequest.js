/**
 * Parses `data` and purges data fields that are not present in `schema`.
 *
 * ```
 * // example user schema
 * {
 *   name: true,
 *   email: true,
 *   cats: {
 *   	 hasMany: 'animal',
 *   },
 * }
 *
 * // example request
 * {
 *   name: 'Dylan',
 *   email: 'dylanslack@gmail.com',
 *   title: 'Janitor',
 *   dogs: [1, 2, 3],
 * }
 *
 * // output
 * {
 * 	 name: 'Dylan',
 * 	 email: 'dylanslack@gmail.com',
 * }
 * ```
 *
 * @param  {Object} schema - Schema representing an entity's attributes and relationships.
 * @param  {Object} data - The request body object.
 * @return {Object}
 */
export default (schema, data) => {
  const { keys } = Object;
  const attributes = keys(schema.attributes);
  const relationships = keys(schema.relationships);
  const fields = attributes.concat(relationships);

  let sanitized = {};

  for (const field of fields) {
    if (data.hasOwnProperty(field)) {
      sanitized = { ...sanitized, [field]: data[field] };
    }
  }

  return sanitized;
};
