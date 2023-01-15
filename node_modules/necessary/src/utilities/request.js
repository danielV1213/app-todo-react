"use strict";

const http = require("http"),
      https = require("https");

import { ERROR, EMPTY_STRING } from "../constants";
import { GET_METHOD, POST_METHOD } from "../methods";
import { portFromHost, secureFromHost, hostnameFromHost, queryStringFromQuery } from "../utilities/http";

function createRequest(host, uri, query, method, headers, callback) {
  const port = portFromHost(host),
        secure = secureFromHost(host),
        hostname = hostnameFromHost(host),
        queryString = queryStringFromQuery(query),
        path = (queryString === EMPTY_STRING) ?
                 uri :
                  `${uri}?${queryString}`,
        options = {
          hostname,
          headers,
          method,
          port,
          path
        },
        createRequest = secure ?
                          https.request : ///
                            http.request; ///

  const request = createRequest(options, (response) => {
    const error = null;

    callback(error, response);
  });

  request.on(ERROR, (error) => {
    const response = null;

    callback(error, response);
  });

  return request;
}

function createGetRequest(host, uri, query, headers, callback) {
  if (callback === undefined) {
    callback = headers; ///
    headers = {};
  }

  const method = GET_METHOD,
        getRequest = createRequest(host, uri, query, method, headers, callback);

  return getRequest;
}

function createPostRequest(host, uri, query, headers, callback) {
  if (callback === undefined) {
    callback = headers; ///
    headers = {};
  }

  const method = POST_METHOD,
        postRequest = createRequest(host, uri, query, method, headers, callback);

  return postRequest;
}

export default {
  createRequest,
  createGetRequest,
  createPostRequest
};
