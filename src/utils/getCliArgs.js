export const getCliArgs = (str) => {
  const regexp = /(?:[^\s"']+|["'][^"']*["'])+/g; // for path like 'program files' or "program files"
  return str.match(regexp); // naive implementation - line.split(' ');
};