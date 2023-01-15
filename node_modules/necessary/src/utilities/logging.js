"use strict";

import path from "path";

import { second } from "../utilities/array";
import { concatenatePaths } from "../utilities/path";
import { ZERO, EMPTY_STRING } from "../constants";
import { checkFileExists, readFile, appendToFile, renameFile, getStats } from "../utilities/fileSystem";
import { DEFAULT_LOG_LEVEL, DEFAULT_LOG_FILE_BASE_NAME, DEFAULT_LOG_DIRECTORY_PATH } from "../defaults";
import { TRACE_LEVEL, DEBUG_LEVEL, INFO_LEVEL, WARNING_LEVEL, ERROR_LEVEL, FATAL_LEVEL } from "../levels";

const levels = [
  TRACE_LEVEL,
  DEBUG_LEVEL,
  INFO_LEVEL,
  WARNING_LEVEL,
  ERROR_LEVEL,
  FATAL_LEVEL,
];

let logLevel = DEFAULT_LOG_LEVEL,
    logFileBaseName = DEFAULT_LOG_FILE_BASE_NAME,
    logDirectoryPath = DEFAULT_LOG_DIRECTORY_PATH;

export function log(messageOrError, level = EMPTY_STRING) {
  let salientStackMessageIndex = 1;

  if (level !== EMPTY_STRING) {
    const levelIndex = levels.indexOf(level),
          logLevelIndex = levels.indexOf(logLevel);

    if (levelIndex < logLevelIndex) {
      return;
    }

    salientStackMessageIndex += 2;

    level = `${level}`;  ///
  }

  let error,
      message;

  if (messageOrError instanceof Error) {
    error = messageOrError; ///

    ({ message } = error);
  } else {
    message = messageOrError; ///

    error = new Error(message);
  }

  const { stack } = error,
        stackMessages = stackMessagesFromStack(stack),
        salientStackMessage = stackMessages[salientStackMessageIndex],
        stackMessage = salientStackMessage, ///
        upperCaseLevel = level.toUpperCase(),
        currentDateAndTimeString = getCurrentDateAndTimeString(),
        filePath = filePathFromStackMessage(stackMessage),
        lineNumber = lineNumberFromStackMessage(stackMessage),
        logMessage = `${upperCaseLevel} ${currentDateAndTimeString} ${filePath}(${lineNumber}) ${message}`;

  console.log(logMessage);

  if (logDirectoryPath !== null) {
    rollOverLogFile();

    const logFilePath = getLogFilePath(),
          logFileContent = `${logMessage}\n`;

    appendToFile(logFilePath, logFileContent);
  }

  return logMessage;
}

export default {
  log
}

function trace(message) { return log(message, TRACE_LEVEL); }

function debug(message) { return log(message, DEBUG_LEVEL); }

function info(message) { return log(message, INFO_LEVEL); }

function warning(message) { return log(message, WARNING_LEVEL); }

function error(message) { return log(message, ERROR_LEVEL); }

function fatal(message) { return log(message, FATAL_LEVEL); }

function setLogLevel(level) { logLevel = level; }

function setLogOptions(logOptions) {
  const { level, fileBaseName, directoryPath } = logOptions;

  setLogLevel(level);

  setLogFileBaseName(fileBaseName);

  setLogDirectoryPath(directoryPath);
}

function getLogFileContent() {
  const logFilePath = getLogFilePath(),
        logFileContent = readFile(logFilePath);

  return logFileContent;
}

function setLogFileBaseName(fileBaseName) { logFileBaseName = fileBaseName; }

function setLogDirectoryPath(directoryPath) { logDirectoryPath = directoryPath; }

Object.assign(log, {
  trace,
  debug,
  info,
  warning,
  error,
  fatal,
  setLogLevel,
  setLogOptions,
  getLogFileContent,
  setLogFileBaseName,
  setLogDirectoryPath
});

function getLogFilePath() {
  const logFileName = `${logFileBaseName}.log`,
        logFilePath = concatenatePaths(logDirectoryPath, logFileName);

  return logFilePath;
}

function getRolledOverLogFilePath() {
  const currentDateString = getCurrentDateString(),
        rolledOverLogFileName = `${logFileBaseName}.${currentDateString}.log`,
        rolledOverLogFilePath = concatenatePaths(logDirectoryPath, rolledOverLogFileName);

  return rolledOverLogFilePath;
}

function getLogFileLastModifiedDate() {
  const logFilePath = getLogFilePath(),
        logFileStats = getStats(logFilePath),
        { mtime } = logFileStats,
        logFileLastModifiedDate = new Date(mtime);  ///

  return logFileLastModifiedDate;
}

function rollOverLogFile() {
  const logFilePath = getLogFilePath(),
        logFileExists = checkFileExists(logFilePath);

  if (!logFileExists) {
    return;
  }

  const logFileLastModifiedDate = getLogFileLastModifiedDate(),
        logFileLastModifiedDateCurrentDate = isDateCurrentDate(logFileLastModifiedDate);

  if (!logFileLastModifiedDateCurrentDate) {
    const rolledOverLogFilePath = getRolledOverLogFilePath();

    renameFile(logFilePath, rolledOverLogFilePath);
  }
}

function isDateCurrentDate(date) {
  const currentDate = new Date(),
        dateString = date.toDateString(),
        currentDateString = currentDate.toDateString(),
        dateCurrentDate = (dateString === currentDateString);

  return dateCurrentDate;
}

function getCurrentDateString() {
  const date = new Date(),
        day = padStartWithZeroes(date.getDate(), 2),  ///
        month = padStartWithZeroes(date.getMonth() + 1, 2), ///
        year = date.getFullYear(),
        currentDateAndTimeString = `${day}-${month}-${year}`;

  return currentDateAndTimeString;
}

function getCurrentDateAndTimeString() {
  const date = new Date(),
        day = padStartWithZeroes(date.getDate(), 2),  ///
        month = padStartWithZeroes(date.getMonth() + 1, 2), ///
        year = date.getFullYear(),
        hours = padStartWithZeroes(date.getHours(), 2),
        minutes = padStartWithZeroes(date.getMinutes(), 2),
        seconds = padStartWithZeroes(date.getSeconds(), 2),
        milliseconds = padStartWithZeroes(date.getMilliseconds(), 3),
        currentDateAndTimeString = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;

  return currentDateAndTimeString;
}

function stackMessagesFromStack(stack) {
  const stackMessages = [],
        stackLines = stack.split(/\r\n|\n/);

  let stackMessage = EMPTY_STRING;

  stackLines.forEach((stackLine) => {
    const matches = /^\s*at.*/.test(stackLine);

    stackMessage = (stackMessage === EMPTY_STRING) ?
                      stackLine :
                        `${stackMessage}\n${stackLine}`;

    if (matches) {
      stackMessages.push(stackMessage);

      stackMessage = EMPTY_STRING;
    }
  });

  return stackMessages;
}

function filePathFromStackMessage(stackMessage) {
  const matches = stackMessage.match(/(\/.+):\d+:\d+/m),
        secondMatch = second(matches),
        absoluteFilePath = secondMatch,  ///
        currentWorkingDirectoryPath = path.resolve("."),  ///
        currentWorkingDirectoryPathLength = currentWorkingDirectoryPath.length,
        start = currentWorkingDirectoryPathLength + 1,  ///
        filePath = absoluteFilePath.substr(start);

  return filePath;
}

function lineNumberFromStackMessage(stackMessage) {
  const matches = stackMessage.match(/:(\d+)/m),
        secondMatch = second(matches),
        lineNumber = secondMatch; ///

  return lineNumber;
}

function padStartWithZeroes(string, targetLength) {
  const padString = ZERO, ///
        paddedString = padStart(string, targetLength, padString);

  return paddedString;
}

function padStart(string, targetLength, padString) {
  let padding = EMPTY_STRING;

  for (let index = 0; index < targetLength; index++) {
    padding += padString;
  }

  const paddedString = `${padding}${string}`.substr(-targetLength);

  return paddedString;
}
