const restful (import "$restful");

# export recommended MIME types for Content-Type.
(export mime-types (@
  "application/x-espresso",
  "application/espresso",
  "text/x-espresso",
  "text/espresso",
).

# default config for an Espresso RESTful client.
(export default-config (@
  baseURL: "//localhost",
  timeout: 60000,
  headers: (@ Accept:
    "application/x-espresso;q=0.9,
     application/espresso;q=0.8,
     text/x-espresso;q=0.7,
     text/espresso;q=0.6,
     application/json;q=0.5,
     */*;q=0.4"
  ).
).

# check if an http message has the content-type of Espresso code/data.
(export is-espresso (=> message
  var content-type (message headers:: content-type);
  mime-types has (=> t (content-type starts-with t);
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

(const crud-only (@
  "get",   # READ one or multiple entities.
  "post",  # CREATE a new entity.
  "put",   # UPDATE an existing entity; or CREATE an idempotent.
  "patch", # UPDATE an existing entity with specified fields.
  "delete" # DELETE an existing entity.
).

(const wrap (=> service
  var agent (@ config: (service config); # expose its original config.
  for method in crud-only, (agent: method, (proxy-of service, method);
  #(return)# agent
).

# export CRUD operations on default service instance.
(export (get, post, put, patch, delete)
  wrap (restful of default-config);
).

# create an agent with a particular configuration set.
(export of (=> config
  wrap (restful of (object of default-config, config);
).
