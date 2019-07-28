(define "runtime environment variables" (= ()
  (should "(env \"runtime-core\") returns the type of runtime's implementation." (= ()
    (assert ((env "runtime-core") is-a string).
  ).
  (should "(env \"runtime-host\") returns the type of hosting environment." (= ()
    (assert ((env "runtime-host") is-a string).
  ).
  (should "(env \"runtime-version\") returns the version of runtime." (= ()
    (assert ((env "runtime-version") is-a string).
  ).
  (should "(env \"runtime-home\") returns the location of current runtime." (= ()
    (assert ((env "runtime-home") is-a string).
  ).
).

(define "other environment variables" (= ()
  (should "(env \"is-debugging\") returns the flag value of indicating debugging mode." (= ()
    (assert ((env "is-debugging") is-a bool).
  ).
  (should "(env \"home\") returns the location of top-level application." (= ()
    (assert ((env "home") is-a string).
  ).
  (should "(env \"user-home\") returns the home directory of current user." (= ()
    (assert ((env "user-home") is-a string).
  ).
  (should "(env \"os\") returns the OS information or the User-Agent of the hosting web browser." (= ()
    (assert ((env "os") is-a string).
  ).
  (should "(env key default-value) returns the default-value if the environment variable does not exist." (= ()
    (assert (env "runtime-version") ((env "does-not-exist-env-variable" (env "runtime-version").
  ).
).
