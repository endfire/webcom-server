export default ({ token }) => {
  if (token.role) return true;
  return false;
};
