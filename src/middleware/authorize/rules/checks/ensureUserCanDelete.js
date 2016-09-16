export default ({ token }) => {
  if (token.role === '1') return true;
  return false;
};
