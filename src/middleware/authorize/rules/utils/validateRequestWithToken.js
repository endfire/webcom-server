import checkAndValidateToken from './checkAndValidateToken';
import checkRules from './checkRules';

export default (rules, ctx, authorization) => (
  checkAndValidateToken(authorization)
    .then(token => checkRules(rules, { ctx, token }))
    .catch(err => Promise.reject(err))
);
