import path from 'path';

// NOTE: redundant code. It will be removed in the future
// export const getFullPath = (...args) => path.join(...args);
// export const getPath = (dir, f) => path.isAbsolute(f) ? f : path.join(dir, f);

export const normalizePath = (dir, f) => {
  const quotesRegexp = /['"]+/g;
  const normalizedF = f.replace(quotesRegexp, '');
  return path.resolve(dir, normalizedF);
}