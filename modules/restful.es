const restful (import "$restful");

# export recommended MIME types for Content-Type.
(export mime-types (@
  "application/x-espresso",
  "application/espresso"
).

# use the first mime type as the default content type.
export mime-espresso (mime-types first);

# default config for an Espresso RESTful client.
(export default-config (@
  baseURL: "//localhost",
  timeout: 60000,
  headers: (@ Accept:
    "application/x-espresso;q=0.9,
     application/espresso;q=0.8,
     application/json;q=0.5,
     */*;q=0.4"
  ).
).


# check if an http message has the content-type of Espresso code/data.
(export is-espresso (=> message
  var content-type (message headers:: content-type);
  (content-type is-a string :: and
    mime-types has (=> t (content-type starts-with t);
  ).
).

#( inner helper functions. )#
# an interceptor function to parse Espresso response data.
(const proxy-of (=> (service, method) (=> ()
  (service: method:: apply * arguments:: then (=> waiting
    const (result, excuse) waiting;
    (excuse is-not null:: ? (@ null, excuse) # forward error only
      (@ (@ response: result, data:
        # use eval to safely parse response data
        (is-espresso result:: ? (eval (result data)), (result data).
      ).
).

(const sender-of (=> (service, method)
  var proxy (proxy-of service, method);
  var header (@ content-type: mime-espresso);
  (=:(proxy, header) (=> (url, data, config)
    (if (config headers:: content-type:: is-empty)
      let data ($data to-code:: to-string);
      let config (object of config);
      config "headers" (object of (config headers), header);
    ).
    proxy url, data, config;
  ).
).

(const crud-ops (@
  get: proxy-of,   # READ one or multiple entities.
  post: sender-of, # CREATE a new entity.
  put: sender-of,  # UPDATE an existing entity; or CREATE an idempotent.
  patch: sender-of,# UPDATE an existing entity with specified fields.
  delete: proxy-of # DELETE an existing entity.
).

(const wrap (=> service
  local retval (@ config: (service config); # expose its original config.
  (for method in crud-ops
    retval: method, ((crud-ops: method) service, method);
  ).
).

# export CRUD operations on default service instance.
(export (get, post, put, patch, delete)
  wrap (restful of default-config);
).

(const copy (=> config
  local retval (object of default-config, config);
  retval "headers" (object of (default-config headers), (config headers);
).

# create a restful client with a particular configuration set.
(export of (=> config
  wrap (restful of (copy config);
).

# create a JSON-based restful client.
(export of-json (=> config
  var service (restful of (copy config);
  local retval (@ config: (service config); # expose its original config.
  (for method in crud-ops
    retval: method, (proxy-of service, method);
  ).
).
