# Necessary

A collection of utility functions.

This package was partly inspired by [lodash](https://lodash.com/), [async](https://caolan.github.io/async/) and the like. The idea was to create utility functions that addressed some modest requirements and would result in a relatively small footprint. That said, the bare bones implementations, especially the asynchronous functions, should provide some confidence whilst debugging.

These can only be used in the browser:

* [Ajax utilities](#ajax-utilities)

These cna only be used on Node:

* [Shell utilities](#shell-utilities)
* [Logging utilities](#logging-utilities)
* [Request utilities](#request-utilities)
* [File system utilities](#file-system-utilities)
* [Configuration utilities](#configuration-utilities)

These can be used both on Node and in the browser:

* [Path utilities](#path-utilities)
* [Array utilities](#array-utilities)
* [HTTP utilities](#http-utilities)
* [Template utilities](#template-utilities)
* [Asynchronous utilities](#asynchronous-utilities)

## Installation

You can install Necessary with [npm](https://www.npmjs.com/):

    npm install necessary

You can also clone the repository with [Git](https://git-scm.com/)...

    git clone https://github.com/djalbat/necessary.git

...and then install the dependencies with npm from within the project's root directory:

    npm install

## Usage

Each of the collections of utility functions described below is exported as a plain old JavaScript object. To get hold of them, import the requisite object and then destructure it:

```
import { arrayUtilities, asynchronousUtilities, fileSystemUtilities } from "necessary";

const { first, last } = arrayUtilities,
      { isDirectory } = fileSystemUtilities;

...
```
The miscellaneous functions are a special case. They can be treated as above but may well have other functions assigned to them. See below.

## Ajax utilities

- `get()`
- `post()`
- `request()`

The first two `get()` and `post()` functions make use of the third `request()` function, which is more generic and can be used for arbitrary HTTP requests.

* The `get()` function sends a `GET` request, taking `host`, `uri`, `query` and `operation` arguments, together with an optional `headers` argument after the `query` argument.

The `query` argument should be a plain old JavaScript object, the names and values of which are encoded and concatenated to form the query string.

The `headers` argument should also be a plain old JavaScript object. If it does not have an `accept` property then one wil be provided with the value `application/json`.

The `callback` argument is expected to be a function taking `content` and `statusCode` arguments. If the `accept` property of the main `headers` argument is set to `application/json` then the operation's `content` argument can be assumed to be JSON, or `null` if the request body cannot be parsed as such. The `statusCode` argument will be the response status code, for example `200` for a successful `OK` response.

```
const host = "...",
      uri = "...",
      query = {
        ...
      };

get(host, uri, query, (json, statusCode) => {
  if (statusCode === 200) {
    ...
  }
});
```

Note that the `uri` argument must include a leading forward slash `/` since the `host` argument should not have a trailing one.

* The `post()` function behaves almost identically to the `get()` function, with the following differences.

It sends a `POST` rather than a `GET` request. There is an additional `content` argument that comes before the `callabck` argument and after the `headers` argument, which is again optional. If the `headers` argument does not have a `content-type` property then one will be provided with the value of `application/json`. If the `content-type` property of the `headers` argument is set to `application/json` then the `content` argument is assumed to be a plain old JavaScript object and is stringified as JSON.

```
const host = "...",
      uri = "...",
      query = {
        ...
      },
      json = {
        ...
      };

post(host, uri, query, json, (json, statusCode) => {
  if (json !== null) {
    ...
  }
});
```

* The `request()` function behaves similarly to the `post()` function but the `headers` argument is no longer optional and there is a `method` argument that comes before the `content` argument:

```
const host = "...",
      uri = "...",
      query = {
        ...
      },
      method = "PUT"
      headers = {
        "accept": "application/json",
        "content-type": "application/json"
      },
      json = {
        ...
      };

request(host, uri, query, method, headers, json, (json, statusCode) => {
  if (json !== null) {
    ...
  }
});
```
Note that the `headers` argument is not optional this time.

## Shell utilities

- `onETX()`
- `prompt()`

Functions that can be used for Node applications running in a shell window.

* The `onETX()` function takes a handler which is invoked whenever the `ETX` character code is encountered in the `stdin` stream, which typically happens when the user presses `Ctrl-C`. This method is therefore useful for exiting a console application immediately upon the user's behest, if it is passed `process.exit`. It also returns a function that can be called to remove the listener at some later point in time:

```
const offEXT = onEXT(process.exit);

...

offEXT();
```

* The `prompt()` function is meant for use in shell applications. It takes a plain old JavaScript `options` object and a `callback` function as its first and second arguments, respectively:

```
const hidden = true,
      answer = ...,
      description = ...,
      errorMessage = ...,
      validationFunction = ...,
      options = {
        hidden,
        answer,
        description,
        errorMessage,
        validationFunction
      };

prompt(options, (answer) => {
  ...
});
```

There are a range of properties available for the `options` object. The `description` and `errorMessage` properties are mandatory. The remaining properties are optional.

The default values of the `attempts` and `encoding` properties are `3` and `utf8`, respectively. The default value of the `hidden` property is `false`. Setting it to `true` results in password-style input, that is, the characters remain hidden.

If no `validateFunction` property is given then you must set a `validatePattern` property instead, which must be a regular expression.

The `initialAnswer` property sets the initial answer at the prompt. You might want to set it to `yes`, for example. Lastly, setting the `answer` property to anything other than `null` or `undefined` causes the `callback` function to be invoked immediately without any prompt being shown. This can be useful for debugging.

## Logging utilities

- `log()`

A single `log()` function for basic logging purposes.

* The `log()` function provides rudimentary logging functionality, printing its argument to the console, prepended with a date and time stamp together with the path of the file containing the callee function and the line number:

```
log("...") // Results in '28-01-2018 15:44:47.363 bin/main.js(35) ...' being logged.
```

You can pass an error instead of a string to `log()`, in which case it will print the file path and line number of the place where the error was thrown along with the error message.

Additionally, it is possible to print to a log file if a log directory and, optionally, a base name for the log file are specified. The base name here means the file name minus the extension and separator. The default is `default`:

```
const { setLogFileBaseName, setLogDirectoryPath } = log;

setLogFileBaseName("example");
setLogDirectoryPath("./log");

log("...") // Results in '28-01-2018 15:44:47.363 bin/main.js(35) ...\n' line being appended to
           // the './log/example.log' file as well as the message being logged.
```

A standard set of functions, namely `fatal()`, `error()`, `warning()`, `info()`, `debug()` and `trace()`, are available and these are filtered in the usual way, assuming the log level has been set:

```
const { setLogLevel, DEBUG } = log;

setLogLevel(DEBUG);

log.error("...") // Printed to the console and optionally, to the log file.
log.trace("...") // Ignored, because the trace level is lower than the debug level.
```

There is also a `setLogOptions()` function which allows you to pass the log level, base file name and directory path as a plain old JavaScript object. See below for a usage example.

Finally, log files are rolled over every night. So `./log/example.log` would become `./log/example.28-01-2018.log` and a new `./log/example.log` file would be started at midnight.

## Request utilities

- `createRequest()`
- `createGetRequest()`
- `createPostRequest()`

Functions that leverage Node's [HTTP](https://nodejs.org/api/http.html) nad [HTTPS](https://nodejs.org/api/https.html) inbuilt modules in order to provide HTTP request functionality. These functions are deliberately low level. They will take away some of the pain of using the aforementioned modules but will not automatically set headers, parse responses, etc. Specifically, methods have to be called on the instance of the [ClientRequest](https://nodejs.org/api/http.html#http_class_http_clientrequest) class that they each return in order to make the request and on the instance of the [IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage) passed to the callback function in order to parse the response.

* The `createRequest()` function provides a means to make arbitrary requests. It takes `host`, `uri`, `query`, `method`, `headers` and `callback` arguments. It returns an instance of Node's ClientRequest class. The callback function must have an `error` argument, which will be `null` if the request is successful, and a `response` argument, which will be an instance of Node's IncomingMessage class. The `query` and `headers` arguments should be plain old JavaScript objects, with the former being converted into a query string. The other arguments bar the last callback argument should be strings.

In the following example a GET request is made. Note that because the request body is empty, it is enough to call the request object's `end()` method in order to make the request. Note also that the response is piped directly to a file.

```
const { createWriteStream } = require("fs");

const host = ...,
      uri = ...,
      query = {
        ...
      },
      method = "GET",
      headers = {
        ...
      },
      request = createRequest(host, uri, query, method, headers, (error, response) => {
        ...

        const writeStream = createWriteStream(...);

        response.pipe(writeStream);
      });

request.end();
```

In the following example the `queryStringFromQuery()` function from the HTTP utilities is used to encode the body of the request. Note that the `content-type` header is set explicitly. Note that the request body is piped directly from a file:

```
const { createReadStream } = require("fs");

const host = ...,
      uri = ...,
      query = {},
      method = "POST",
      headers = {
        "content-type": "image/png"
      },
      request = createRequest(host, uri, query, method, headers, (error, response) => {
        ...
      }),
      readStream = createReadStream(...);

readStream.pipe(request);
```

Finally, in the following example a `contentFromResponse()` function has been written in order to parse the response to a string in preference to piping it to a file, say:

```
const host = ...,
      uri = ...,
      query = {
        ...
      },
      method = "GET",
      headers = {
        ...
      },
      request = createRequest(host, uri, query, method, headers, (error, response) => {
        contentFromResponse(response, (content) => {
          console.log(content)
        });
      });

request.end();

function contentFromResponse(response, callback) {
  let content = "";

  response.on("data", (data) => {
    content += data;
  });

  response.on("end", () => {
    callback(content);
  });
}
```

* The `createGetRequest()` function is identical to the `createRequest()` function except that the `method` argument is omitted and the `headers` argument is optional.

* The `createPostRequest()` function is identical to the `createRequest()` function except that the `method` argument is omitted and the `headers` argument is optional.

## File system utilities

- `checkEntryExists()`
- `checkFileExists()`
- `checkDirectoryExists()`
- `isEntryFile()`
- `isEntryDirectory()`
- `isDirectoryEmpty()`
- `readDirectory()`
- `readFile()`
- `writeFile()`
- `appendToFile()`
- `createDirectory()`
- `renameFile()`
- `removeEntry()`
- `getStats()`

An inglorious collection of functions which do no more than paper over some of Node's synchronous [native file system API](https://nodejs.org/api/fs.html) functions. All of the functions will throw native errors upon failure.

* The `checkEntryExists()`, `checkFileExists()`, `checkDirectoryExists()`, `isEntryFile()`, `isEntryDirectory()` and `isDirectoryEmpty()` functions work as their names suggest, returning a boolean value.

```
checkEntryExists("root/etc"); // returns true if the file or directory exists

checkFileExists("root/etc/init.conf"); // returns true if the file exists

checkDirectoryExists("root/etcconf"); // returns true if the directory exists

isEntryFile("root/etc/init.conf"); // returns true if the entry is a file

isEntryDirectory("root"); // returns true if the entry is a directory

isDirectoryEmpty("root/etc"); // returns true if the directory is empty
```

* The `readDirectory()` function returns an array of entry names if the directory exists:

```
readDirectory("root/etc"); // returns the contents of the 'root/etc' directory
```

* The `readFile()` function takes the file encoding as an optional second string argument. The default is `utf8`. It returns the content of the file upon success:

```
readFile("root/etc/init.conf"); // returns the content of the 'root/etc/init.conf' file
```

* The `writeFile()` function takes the content of the file as a second string argument. It does not return anything upon success:

```
writeFile("root/etc/init.conf", ""); // writes '' to the 'root/etc/init.conf' file
```

* The `appendToFile()` function takes the content to append file as a second string argument. It will create teh file if necessary and does not return anything upon success:

```
appendToFile("root/etc/init.conf", ""); // appends '' to the 'root/etc/init.conf' file
```

* The `createDirectory()` function creates a directory, also creating the parent directories if necessary:

```
createDirectory("root/etc/init"); // Creates the 'root/etc/init' directory
```

* The `renameFile()` function renames a file:

```
renameFile("hosts", "host"); // Renames the 'hosts' file to 'host'
```

* The `removeEntry()` function removes a file or directory:

```
removeEntry("/root/etc/init"); // Removes the '/root/etc/init' directory and all of its sub-entries
```

Note that in the case of a directory, all of its sub-entries will be removed as well.

* The `getStats()` function returns an instance of the [fs.Stats](https://nodejs.org/api/fs.html#fs_class_fs_stats) class for a file or a directory:

```
const stats = getStats("root/etc"); // returns stats for the 'root/etc' directory
```

## Configuration utilities

- `rc()`

A single `rc()` function for runtime configuration.

* The `rc()` function parses a JSON runtime configuration file of a certain format and provides the information therein by assigning it to itself. For example:

```
rc();

const { logOptions } = rc;

setLogOptions(logOptions);
```

The default name for the file is `.rc` and it must be present in the current working directory. It must have the following format:

```
{
  "environments": [
    {
      "name": "development",
      ...
    },
    {
      "name": "production",
      ...
    }
  ]
}
```

If an environment name is not passed as the `rc()` function's argument then it will try to find the environment name by the following means:

1. Checking the `process.argv` array for an `--environment` argument. 
2. Checking the `proxess.env` object for an `ENVIRONMENT` environment variable.

If neither of these checks are successful then it will return the first element of the `enviromnents` array. 

Note that it will not try to assign the `name` property of the chosen environment to itself, because functions already have a `name` property.

Before returning the JSON, it will search for uppercase strings. If such a string is the name of an environment variable, it will be replaced by the environment variable's value. This means that you can choose to keep sensitive information out of the runtime configuration and therefore, for instance, safely commit it to the repository. 

You can change the base extension of the file that is parsed, that is the part of the extension between the leading dot and `rc`, by making use of the `setRCBaseExtension()` function:

```
const { setRCBaseExtension } = rc;

setRCBaseExtension("default");

rc(); // Provides the first environment in the '.defaultrc' file
```

Note that the `rc()` function can be included in any file but only needs to be called once. But be careful that it is called before it is ever destructured.

Aside from the aforementioned `setRCBaseExtension()` functions, the `checkRCFileExists()`, `createVacuousRCFile()`, `readRCFile()` and `writeRCFile()` functions do as their names suggest. The `updateRCFile()` function, if passed a plain old JavaScript object as the first parameter, will add the properties therein, overwriting any existing properties. Properties to be removed can be given as further arguments. If you do not want to add as well as remove properties, set the first argument to a falsey value.

```
const { readRCFile, writeRCFile, updateRCFile, checkRCFileExists, createVacuousRCFile } = rc;

const rcFileExists = checkRCFileExists();  // Returns true if the rc file exists.

createVacuousRCFile(); // creates an rc file with an empty environment.

const json = readRCFile();  // Reads the entire contents of the rc file into a JSON object

writeRCFile(json);  // Stringifies the given JSON object and writes it to the rc file

updateRCFile({example: "example"});  // Updates the rc file, adding the 'example' property

updateRCFile(null, "example");  // Updates the rc file, removing the 'example' property
```

## Path utilities

- `isPathName()`
- `isPathTopmostName()`
- `isPathRelativePath()`
- `isPathAbsolutePath()`
- `isTopmostNameInAbsolutePath()`
- `combinePaths()`
- `concatenatePaths()`
- `bottommostNameFromPath()`
- `topmostDirectoryPathFromPath()`
- `topmostDirectoryNameFromPath()`
- `pathWithoutBottommostNameFromPath()`
- `pathWithoutTopmostDirectoryNameFromPath()`

These functions manipulate or query strings that represent file and directory paths. Note that only forward slash `/` delimiters are supported. Trailing delimiters are not needed, but tolerated.

* The `isPathName()` function returns `true` if the string argument contains no `/` delimiters apart from the first and last characters:

```
isPathName("root/"); // returns true

isPathName("/root"); // returns true

isPathName("./root"); // returns false

isPathName("../etc"); // returns false

isPathName("/root/etc"); // returns false
```

* The `isPathTopmostName()` function returns `true` if the string argument is both a name and an absolute path:

```
isPathTopmostName("/root/"); // returns true

isPathTopmostName("/root"); // returns true

isPathTopmostName("etc/"); // returns false
```

* The `isPathRelativePath()` function returns `true` if the string argument does not start with a delimiter`/`:

```
isPathRelativePath("etc"); // returns true

isPathRelativePath("./etc"); // returns true

isPathRelativePath("../etc"); // returns true
```

* The `isPathAbsolutePath()` returns `true` if the string argument starts with a delimiter`/`:

```
isPathAbsolutePath("/root/etc"); // returns true
```

* The `isTopmostNameInAbsolutePath()` function returns `true` if the second string argument begins with the first string argument optionally followed by a delimiter`/` and further characters:

```
isTopmostNameInAbsolutePath("/root", "/root/etc");  // returns true

isTopmostNameInAbsolutePath("root", "/root/etc");  // returns false

isTopmostNameInAbsolutePath("etc", "/root/etc"); // returns false
```

Note that the function assumes that the first argument is a topmost name and that the second argument is an abolute path. It does not check, it simply compares the two arguments with a single regex.

* The `combinePaths()` function will combine the first string argument with the second string argument by successively removing the bottommost directory name of the former for each topmost parent directory `..` signifier it finds in the latter. Current directory `.` signifiers are also removed:

```
combinePaths("etc/", "./init"); // returns 'etc/init'

combinePaths("/root/etc/", "../init"); // returns '/root/init'
```

Note that the function assumes that the second argument is a relative name or path.

* The `concatenatePaths()` function will concatenate the first and second string arguments, adding the trailing forward slash `/` to the first string if necessary:

```
concatenatePaths("root", "etc/"); // returns 'root/etc/'

concatenatePaths("root/", "etc/"); // returns 'root/etc/'
```

Note that the function assumes that the second argument is a relative name or path although without a leading current directory `.` or parent directory `..` signifier.

* The `bottommostNameFromPath()`, `topmostDirectoryPathFromPath()`, `topmostDirectoryNameFromPath()`, `pathWithoutBottommostNameFromPath()` and `pathWithoutTopmostDirectoryNameFromPath()` functions work as their names suggest. Each expects there to be at least one delimiter, returning `null` otherwise:

```
bottommostNameFromPath("../etc"); // returns 'etc'

topmostDirectoryPathFromPath("/root/etc/init.conf"); // returns '/root/etc'

topmostDirectoryNameFromPath("etc/init.conf"); // returns 'etc'

pathWithoutBottommostNameFromPath("root/etc/init.conf"); // returns 'root/etc'

pathWithoutTopmostDirectoryNameFromPath("root/etc/init.conf"); // returns 'etc/init.conf'
```

## Array utilities

- `first()`
- `second()`
- `third()`
- `fourth()`
- `fifth()`
- `fifthLast()`
- `fourthLast()`
- `thirdLast()`
- `secondLast()`
- `firstLast()`
- `last()`
- `head()`
- `tail()`
- `back()`
- `front()`
- `push()`
- `unshift()`
- `concat()`
- `clear()`
- `copy()`
- `merge()`
- `splice()`
- `replace()`
- `filter()`
- `find()`
- `prune()`
- `patch()`
- `augment()`
- `separate()`
- `forwardsFind()`
- `backwardsFind()`
- `forwardsSome()`
- `backwardsSome()`
- `forwardsEvery()`
- `backwardsEvery()`
- `forwardsReduce()`
- `backwardsReduce()`
- `forwardsForEach()`
- `backwardsForEach()`

Note that none of these functions take or pass on a `thisArg` argument when they might otherwise have done. Use `bind()`.

* The functions `first()` through to `last()` return the requisite element of the array argument, if passed an array of at least the required length. If the array is not long enough they return `undefined`. 
  
* The `head()` function returns an array containing the first element of its array argument whilst the `tail()` function returns an array containing all but the first element of its array argument. The `back()` function returns an array containing hte last element of its array argument whilst the `front()` function returns an array returning all but the last element of its array argument.

* The `push()` function is similar to its native counterpart but will push an array rather than a single element.

* The `unshift()` function is similar to its native counterpart but will unshift an array rather than a single element.

* The `concat()` function is similar to its native counterpart, however it alters the first array argument *in place*. Like its native counterpart it will also take a single element as the second argument and convert it to an array.

```
concat([1, 2, 3], 4); // the array argument becomes [1, 2, 3, 4]
```

* The `clear()` function removes all the elements in the array argument and returns them as a fresh array:

```
clear([1, 2, 3]); // the array argument becomes []
                  // returnsll be [1, 2, 3]
```

* The `copy()` function copies the second array argument over the top of the first array argument, in other words it replaces each element of the first array argument with the corresponding element in the second array argument. If there are more elements in the second array argument that the first, the first is lengthened:

```
copy([1, 2, 3], [4, 5, 6, 7]); // the first array argument becomes [4, 5, 6, 7]
```

* The `merge()` function copies the second array argument onto to the end of the first array argument, behaving in identical fashion to the `push()` function:

```
merge([1, 2, 3], [4, 5, 6, 7]); // the first array argument becomes [1, 2, 3, 4, 5, 6, 7]
```

* The `splice()` function works in a similar vein to its native counterpart, however it takes an array as the optional fourth argument rather than a series of elements from the fourth argument onwards. It mutates the first array argument and returns an array of the elements that have been removed from it:

```
splice([1, 2, 3], 1, 2, [4, 5]); // returnsll be [2, 3]
                                 // the first array argument becomes [1, 4, 5]
```

* The `replace()` function will replace an element in the array with the given element the first time that the callback function returns a truthy value:

```
replace([1, 2, 0, -1, -2], 3, (element, index) => {
  return element === 0;
}); // the first array argument becomes [1, 2, 3, -1, -2]
```

* The `filter()` function is like its native counterpart, however it filters the first array argument *in place*. The second argument should be a callback function that will be invoked for each element of the array. If it does not return a truthy value, the corresponding element will be removed.

```
filter([1, 2, -1, -2], (element, index) => {
  return element > 0;
}); // the first array argument becomes [1, 2]
    // returns [-1, -2]
```

* The `find()` function is like its native counterpart, however it returns an array of all the elements for which the callback function returns a truthy value, rather than just the first:

```
find([1, 2, -1, -2], (element, index) => {
  return element > 0;
}); // returnsll be [1, 2]
```

* The `prune()` function is much like the `filter()` function, however it will terminate the first time that the callback function does not return a truthy value:

```
prune([1, 2, -1, -2], (element, index) => {
  return element > 0;
}); // the first array argument becomes [1, 2, -2]
    // returns -1
```

* The `patch()` function will append the given element to the first array argument the first time that the callback function returns a truthy value:

```
patch([1, 2, 0, -1, -2], 4, (element, index) => {
  return element === 0;
}); // the first array argument becomes [1, 2, 0, -1, -2, 4]
```

* The `augment()` function appends each of the elements of the second array argument to the first array argument whenever the callback returns a truthy value:

```
augment([1, 2, 3], [-1, 4, -2, 5], (element, index) => {
  return element > 0;
}); // the first array argument becomes [1, 2, 3, 4, 5]
```

* The `separate()` function separates the first array argument, pushing each of its elements onto either the second or the third array argument depending on whether or not the callback returns a truthy value:

```
separate([1, -1, -2, 2, 3, -3], [], [], (element, index) => {
  return element > 0;
}); // the second and third array arguments become [1, 2, 3] and [-1, -2, 3], respectively.
```

The `forwardsXXX()` and `backwardsXXX()`functions do as their names suggest. The `fowardsXXX()` function take an array for their first argument but otherwise behave identically to their native counterparts. The `backwardsXXX()` functions behave similarly, only backwards.

## HTTP utilities

- `overwrite()`
- `underwrite()`
- `portFromHost()`
- `secureFromHost()`
- `hostnameFromHost()`
- `queryStringFromQuery()`
- `urlFromHostURIAndQuery()`

Helper functions to manipulate HTTP headers and URLs, build query strings and so on.

* The `overwrite()` function takes a plain old JavaScript object `headers` argument together with `name` and `value` string arguments. If the corresponding property of the `headers` object exists then it is replaced with the `value` value. This function's utility lies in the fact that the name comparisons are case insensitive.

```
const headers = {
  "Content-Type": "application/json"
};

overwrite(headers, "content-type", "text/html"); // headers["Content-Type"] = "text/html"
```

* The `underwrite()` function takes a plain old JavaScript object `headers` argument together with `name` and `value` string arguments. If the corresponding property of the `headers` object does not exist then it is created with the `value` value. This function's utility lies in the fact that the name comparisons are case insensitive.

```
const headers = {
  "Content-Type": "application/json"
};

underwrite(headers, "content-type", "text/html"); // headers["Content-Type"] = "application/jon"

const headers = {};

underwrite(headers, "content-type", "text/html"); // headers["content-type"] = "text/html"
```

* The `portFromHost()` extracts the port from the `host` argument if it is specified explicitly otherwise it returns 443 for secure hosts, 80 otherwise.

```
portFromHost("http://site.com"); // returns 80

portFromHost("https://site.com"); // returns 443

portFromHost("http://localhost:8080"); // returns 8080
```

* The `secureFromHost()` returns `true` if the protocol of the given `host` argument is `https://`, `false` otherwise.

```
secureFromHost("http://localhost"); // returns false

secureFromHost("https://site.com"); // returns true
```

* The `hostnameFromHost()` returns the hostname part of the `host` argument, removing the protocol but leaving the port if present.

```
hostnameFromHost("http://site.com"); // returns "site.com"
```

* The `queryStringFromQuery()` function takes a plain old JavaScript object `query` argument and returns the corresponding URL encoded query string. It uses the [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) to encode the names and values

```
const query = {
  "name": "John Doe"
};

queryStringFromQuery(query); // returns John%20Doe
```

* The `urlFromHostURIAndQuery()` function takes `host` and `uri` string arguments together with a `query` plain old JavaScript object argument. It creates a query string from the `query` object and concatenates this with the two other arguments in oder to create a fully qualified HTTP URL.

```
const host = "https://site.com",
      uri = "/user",
      query = {
        "name": "John Doe"
      };

urlFromHostURIAndQuery(host, uri, query); // returns "https://site.com/user?name=John%20Doe"
```

Ideally the `host` argument should not include a trailing forward slash whereas `uri` arguments should always start with a leading forward slash.

## Template utilities

- `parseFile()`
- `parseContent()`
- `parseLine()`

These functions parse files, content or single lines, replacing each token of the form `${<name>}` with the value of the corresponding property of a plain old JavaScript object passed as the second argument, or replacing the token with an empty string if no such property exists.

* The `parseFile()` function takes a file path as the first argument:

```
const filePath = "/etc/var/public/name.html",
      name = "Joe Bloggs",
      age = 99,
      args = {
        name,
        age
      }
      parsedContent = parseFile(filePath, args);
```

* The `parseContent()` function takes content as the first argument, honouring newline `\n` characters:

```
const content = `

  name: <strong>${name}</strong><br/>
  age: <strong>${age}</strong><br/>

      `,
      name = "Joe Bloggs",
      age = 99,
      args = {
        name,
        age
      }
      parsedContent = parseContent(content, args);
```

* The `parseLine()` function takes a single line of content as the first argument:

```
const line = "${name}, aged ${age}.",
      name = "Joe Bloggs",
      age = 99,
      args = {
        name,
        age
      }
      parsedLine = parseLine(line, args); // returns 'Joe Bloggs, aged 99.'
```

## Asynchronous utilities

- `whilst()`
- `forEach()`
- `sequence()`
- `eventually()`
- `repeatedly()`

These functions generally take either an operation or an array of operations, an operation being a function that mutates a context rather than returning a value. They also take a `done()` function and an optional `context` argument. They all pass a `next()` function to the operations followed by the `done()` function, the `context` and then an `index` argument. Operations can call the `done()` function instead of the `next()` function in order to terminate early.

* The `whilst()` function takes a single operation, which it calls each time the operation invokes the given `next()` function or until the operation invokes the given `done()` function. The operation can also force termination by returning a truthy value, in which case it must *not* call the given `next()` or `done()` functions. In the example below the operation will be executed ten times:

```
const context = {}; ///

const operation = (next, done, context, index) => {
  const terminate = (index === 9);

  if (terminate) {
    done();
  } else {
    ...

    next();
  }
}

whilst(operation, () => {
  /// done
}, context);
```

* The `forEach()` function takes an array as the first argument followed by a single operation, which it calls for each element of the array unless the operation invokes the given `done()` function. If the `done()` function is never invoked by the operation, it is called once each of the array elements has been passed to the operation, provided the operationinvokes the given `next ()` function each time. In the example below the operation will be executed four times:

```
const context = {};

const operation = (element, next, done, context, index) => {
  const terminate = (element === 3);

  if (terminate) {
    done();
  } else {
    ...

    next();
  }
}

const array = [0, 1, 2, 3, 4, 5];

forEach(array, operation, () => {
  /// done
}, context);
```

* The `sequence()` function takes an array of operations, which it calls in turn unless the operation invokes the given `done()` function. If the `done()` function is never invoked by a operation, it is called once each of the operations have been called, provided each operation invokes the given `next ()` function. In the example below each of the operations bar the last is executed:

```
const context = {};

const firstOperation = (next, done, context, index) => { next(); },
      secondOperation = (next, done, context, index) => { next(); },
      thirdOperation = (next, done, context, index) => { done(); },
      lastOperation = (next, done, context, index) => { next(); },
      operation = [
        firstOperation,
        secondOperation,
        thirdOperation,
        lastOperation
      ];

sequence(operations, () => {
  /// done
}, context);
```

* The `eventually()` function takes an array of operations, each of which it calls immediately without waiting for the operations to invoke the given `next()` functions. When each of the operations has invoked the given `next()` function, it will call the `done()` function. Note that in this case invoking the `done()` function from within a operation will not halt the execution of other operations, it is passed as an argument only for the sake of convention. In the example below each of the operations is executed:

```
const context = {};

const firstOperation = (next, done, context, index) => { next(); },
      secondOperation = (next, done, context, index) => { next(); },
      thirdOperation = (next, done, context, index) => { done(); },
      operations = [
        firstOperation,
        secondOperation,
        thirdOperation
      ];

eventually(operations, () => {
  /// done
}, context);
```
* The `repeatedly()` function takes a single operation and a `length` parameter, immediately calling the operation a `length` number of times without waiting for it to invoke the given `next()` function each time. When the operation has invoked the given `next()` function a `length` number of times, it will call the `done()` function. Note that in this case invoking the `done()` function from within the operation will not halt its execution the requisite number of times, it is passed as an argument only for the sake of convention. In the example below the operation is executed ten times:

```
const context = {};

const operation = (next, done, context, index) => {
  ...

  next();
};

const length = 10;

repeatedly(operation, length, () => {
  // done
}, context);
```

## Building

Automation is done with [npm scripts](https://docs.npmjs.com/misc/scripts), have a look at the `package.json` file. The pertinent commands are:

    npm run build-debug
    npm run watch-debug

## Contact

- james.smith@djalbat.com
