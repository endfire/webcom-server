export default (rules, options) => {
  if (!rules) return true;

  const isTrue = rule => (rule === true);
  const checkPass = response => response.every(isTrue);

  return Promise
    .all(rules.map(rule => {
      if (typeof rule !== 'function') {
        return Promise.reject({
          message: `Tried invoking an authorization rule, but the rule was not a function.
                    Instead, got ${typeof rule}`,
        });
      }

      return rule(options);
    }))
    .then(checkPass);
};
