"use strict";

import { first, second } from "../utilities/array";
import { DEFAULT_RC_BASE_EXTENSION } from "../defaults";
import { STRING, NUMBER, BOOLEAN, ENVIRONMENT } from "../constants";
import { readFile, writeFile, checkFileExists } from "../utilities/fileSystem";

if (!globalThis.rc) {
  globalThis.rc = _rc;
}

const { rc } = globalThis;

export default {
  rc
};

let baseExtension = DEFAULT_RC_BASE_EXTENSION;

function _rc(environmentName) {
  environmentName = environmentName || environmentNameFromArgv() || environmentNameFromEnv(); ///

  let json = readRCFile();

  const environment = findEnvironment(json, environmentName);

  json = environment; ///

  replaceEnvironmentVariables(json);

  Object.assign(rc, environment);
}

function readRCFile() {
  const rcFilePath = rcFilePathFromNothing(),
        rcFileContent = readFile(rcFilePath),
        json = JSON.parse(rcFileContent);

  return json;      
}

function writeRCFile(json) {
  const rcFilePath = rcFilePathFromNothing(),
        rdFileContent = JSON.stringify(json, null, "  ");

  writeFile(rcFilePath, rdFileContent);
}

function updateRCFile(addedProperties, ...deletedPropertyNames) {
  let json = readRCFile();

  if (addedProperties) {
    Object.assign(json, addedProperties);
  }

  deletedPropertyNames.forEach((deletedPropertyName) => {
    delete json[deletedPropertyName];
  });

  writeRCFile(json);      
}

function checkRCFileExists() {
  const rcFilePath = rcFilePathFromNothing(),
        rcFileExists = checkFileExists(rcFilePath);

  return rcFileExists;
}

function createVacuousRCFile() {
  const json = {
    "environments": [
      {}
    ]
  };

  writeRCFile(json);
}

function setRCBaseExtension(rcBaseExtension) { baseExtension = rcBaseExtension; }

Object.assign(_rc, {
  readRCFile,
  writeRCFile,
  updateRCFile,
  checkRCFileExists,
  createVacuousRCFile,
  setRCBaseExtension
});

function findEnvironment(json, environmentName) {
  let environment;
  const { environments } = json;

  if (environmentName === null) {
    const firstEnvironment = first(environments);

    environment = firstEnvironment; ///
  } else {
    environment = environments.find((environment) => {
      const { name } = environment;

      if(name === environmentName) {
        return true;
      }
    });
  }

  delete environment.name

  return environment;
}

function rcFilePathFromNothing() {
  const rcFilePath = `./.${baseExtension}rc`;

  return rcFilePath;
}

function environmentNameFromEnv() {
  const environmentName = process.env[ENVIRONMENT] || null;

  return environmentName;
}

function environmentNameFromArgv() {
  let environmentName = null;

  process.argv.find((argument) => {  ///
    const matches = argument.match(/--environment=(.+)/),
          found = (matches !== null);

    if (found) {
      const secondMatch = second(matches);

      environmentName = secondMatch;
    }

    return found;
  });

  return environmentName;
}

function replaceEnvironmentVariable(string) {
  let value = null;

  const stringUpperCase = isStringUpperCase(string);

  if (stringUpperCase) {
    const name = string;  ///

    value = process.env[name] || null;
  }

  return value;
}

function replaceEnvironmentVariables(environment) {
  let json = environment;

  const jsonArray = isJSONArray(json),
        jsonObject = isJSONObject(json);

  if (false) {
    ///
  } else if (jsonArray) {
    const array = json,
          length = array.length;

    for (let index = 0; index < length; index++) {
      const json = array[index],
            jsonString = isJSONString(json);

      if (jsonString) {
        const string = json,
              value = replaceEnvironmentVariable(string);

        if (value !== null) {
          array[index] = value;
        }
      }
    }
  } else if (jsonObject) {
    const object = json;  ///

    for (let name in object) {
      const json = object[name],
            jsonString = isJSONString(json);

      if (jsonString) {
        const string = json,  ///
              value = replaceEnvironmentVariable(string);  ///

        if (value !== null) {
          object[name] = value;
        }
      } else  {
        replaceEnvironmentVariables(json);
      }
    }
  }
}

function isJSONArray(json) {
  const jsonArray = (json instanceof Array);

  return jsonArray;
}

function isJSONObject(json) {
  const jsonArray = isJSONArray(json),
        jsonPrimitive = isJSONPrimitive(json),
        jsonObject = (!jsonArray && ! jsonPrimitive);

  return jsonObject;
}

function isJSONString(json) {
  const jsonString = (typeof json === STRING);

  return jsonString;
}

function isJSONNumber(json) {
  const jsonNumber = (typeof json === NUMBER);

  return jsonNumber;
}

function isJSONBoolean(json) {
  const jsonBoolean = (typeof json === BOOLEAN);

  return jsonBoolean;
}

function isJSONPrimitive(json) {
  const jsonString = isJSONString(json),
        jsonNumber = isJSONNumber(json),
        jsonBoolean = isJSONBoolean(json),
        jsonPrimitive = (jsonString || jsonNumber || jsonBoolean);

  return jsonPrimitive;
}

function isStringUpperCase(string) {
  const upperCaseString = string.toUpperCase(),
        stringUpperCase = (string === upperCaseString);

  return stringUpperCase;
}
