export default ({ token }) => {
  if (token.role === '1' || token.role === '2') return true;
  return false;
};
