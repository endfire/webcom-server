export default ({ token, ctx }) => {
  const { request: { body } } = ctx;

  if (token.role) return true;
  if (body.company && token.id === body.company) return true;

  return false;
};
