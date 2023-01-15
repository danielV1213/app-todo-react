"use strict";

import { EMPTY_STRING } from "../constants";
import { first, second, last } from "../utilities/array";

export function isPathName(path) {
  path = path.replace(/^\//, EMPTY_STRING).replace(/\/$/, EMPTY_STRING); ///

  const pathName = (/\//.test(path) === false);

  return pathName;
}

export function isPathTopmostName(path) {
  const pathName = isPathName(path),
        pathAbsolutePath = isPathAbsolutePath(path),
        pathTopmostName = (pathName && pathAbsolutePath);

  return pathTopmostName;
}

export function isPathRelativePath(path) {
  const pathRelativePath = !/^\//.test(path);

  return pathRelativePath;
}

export function isPathAbsolutePath(path) {
  const pathAbsolutePath = /^\//.test(path);

  return pathAbsolutePath;
}

export function isTopmostNameInAbsolutePath(topmostName, absolutePath) {
  const regExp = new RegExp(`^${topmostName}(?:\\/.+)?$`),
        topmostNameInAbsolutePath = regExp.test(absolutePath);

  return topmostNameInAbsolutePath
}

export function combinePaths(path, relativePath) {
  let combinedPath = null;

  const pathNames = path.split(/\//),
        relativePathNames = relativePath.split(/\//);

  let lastPathName,
      firstRelativePathName = first(relativePathNames);

  if (firstRelativePathName === ".") {
    relativePathNames.shift();
  }

  firstRelativePathName = first(relativePathNames);
  lastPathName = last(pathNames);

  while ((firstRelativePathName === "..") && (lastPathName !== undefined)) {
    relativePathNames.shift();
    pathNames.pop();

    firstRelativePathName = first(relativePathNames);
    lastPathName = last(pathNames);
  }

  if (lastPathName !== undefined) {
    const combinedPathNames = [].concat(pathNames).concat(relativePathNames);

    combinedPath = combinedPathNames.join("/");
  }

  return combinedPath;
}

export function concatenatePaths(path, relativePath) {
  path = path.replace(/\/$/, EMPTY_STRING);  ///

  const concatenatedPath = `${path}/${relativePath}`;

  return concatenatedPath;
}

export function bottommostNameFromPath(path) {
  let bottommostName = null;

  const matches = path.match(/^.*\/([^\/]+\/?)$/);

  if (matches !== null) {
    const secondMatch = second(matches);

    bottommostName = secondMatch;  ///
  }

  return bottommostName;
}

export function topmostDirectoryPathFromPath(path) {
  const matches = path.match(/^(.+)\/[^\/]+\/?$/),
        secondMatch = second(matches),
        topmostDirectoryPath = secondMatch; ///

  return topmostDirectoryPath;
}

export function topmostDirectoryNameFromPath(path) {
  let topmostDirectoryName = null;

  const matches = path.match(/^([^\/]+)\/.+$/);

  if (matches !== null) {
    const secondMatch = second(matches);

    topmostDirectoryName = secondMatch;  ///
  }

  return topmostDirectoryName;
}

export function pathWithoutBottommostNameFromPath(path) {
  let pathWithoutBottommostName = null;

  const matches = path.match(/^(.*)\/[^\/]+\/?$/);

  if (matches !== null) {
    const secondMatch = second(matches);

    pathWithoutBottommostName = secondMatch; ///
  }

  return pathWithoutBottommostName;
}

export function pathWithoutTopmostDirectoryNameFromPath(path) {
  let pathWithoutTopmostDirectoryName = null;

  const matches = path.match(/^[^\/]+\/(.+)$/);

  if (matches !== null) {
    const secondMatch = second(matches);

    pathWithoutTopmostDirectoryName = secondMatch;
  }

  return pathWithoutTopmostDirectoryName;
}

export default {
  isPathName,
  isPathTopmostName,
  isPathRelativePath,
  isPathAbsolutePath,
  isTopmostNameInAbsolutePath,
  combinePaths,
  concatenatePaths,
  bottommostNameFromPath,
  topmostDirectoryPathFromPath,
  topmostDirectoryNameFromPath,
  pathWithoutBottommostNameFromPath,
  pathWithoutTopmostDirectoryNameFromPath
};
