const restful (import "$restful");

(const crud-only (@
  "get",   # READ one or multiple entities.
  "post",  # CREATE a new entity.
  "put",   # CREATE an idempotent; UPDATE an existing entity.
  "patch", # UPDATE an existing entity with specified fields.
  "delete" # DELETE an existing entity.
).

(const proxy-of (=> (service, method) (=> ()
  (service: method:: apply * arguments:: then (= waiting
    const (result, excuse) waiting;
    (excuse is-not null:: ? (@ null, excuse) # forward error only
      (@ (@ response: result, data: (eval (result data). # parse response data
).

(const wrap (=> service
  var agent (@ config: (service config); # expose its original config.
  for method in crud-only, (agent: method, (proxy-of service, method);
  #(return)# agent
).

# export CRUD operations on default service instance.
export (get, post, put, patch, delete) (wrap restful);

# create an agent with a particular configuration set.
(export of (=> config (wrap (service of config);
