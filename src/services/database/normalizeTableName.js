/**
 * Normalizes a schema type in order to make table names consistent.
 *
 * For example, `User` is normalized to `user`. This is based on the `options.plural` setting in the
 * `schemas` object. If there is no plural mapping, then the lower cased `type` is used.
 *
 * @param  {Object} schemas
 * @param  {String} type
 * @return {String}
 */
export default (schemas, type) => {
  if (!schemas[type]) return type.trim().toLowerCase();
  if (!schemas[type].options) return type.trim().toLowerCase();
  if (!schemas[type].options.plural) return type.trim().toLowerCase();

  return schemas[type].options.plural.trim().toLowerCase();
};
