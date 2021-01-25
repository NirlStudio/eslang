(define "(import ...)" (=> ()
  (should "(import) returns null." (= ()
    (assert null (import).
    (assert null (import null).
    (assert null (import type).
    (assert null (import true).

    (assert null (import from).
    (assert null (import is from).
    (assert null (import is from null).
    (assert null (import is from type).
    (assert null (import is from true).
  ).
  (should "(import \"module\") returns an object." (= ()
    (var mod (import "./_module").
    (assert (mod is-an object).
  ).
  (should "(import \"module\") returns a new object for each call." (= ()
    (var mod1 (import "./_module").
    (assert (mod1 is-an object).

    (var mod2 (import "./_module").
    (assert (mod2 is-an object).

    (assert (mod1 is-not mod2).
  ).
  (should "(import \"module\":: -module) is the module path." (= ()
    (var mod (import "./_module").
    (assert (mod -module:: ends-with "_module.es").
  ).
  (should "(import \"module\":: -module-dir) is the module dir." (= ()
    (var mod (import "./_module").
    (assert (mod -module-dir:: ends-with "operators").
  ).
  (should "(import \"module\":: -imported-by) is the original importing module." (=> ()
    (var mod (import "./_module").
    (assert (mod -imported-by:: is -module).
  ).
  (should "(import \"module\":: -imported-at) is a unix timestamp." (=> ()
    (var mod (import "./_module").
    (assert (mod -imported-at:: is-a number).
  ).
  (should "(import \"module\") returns an object with all exports." (=> ()
    (var mod (import "./_module").

    (assert 1 (mod x).
    (assert 2 (mod y).
    (assert 3 (mod z).

    (assert 10 (mod p).
    (assert 10 (mod q).

    (assert ($(mod "l") is-a lambda).
    (assert ($(mod "f") is-a function).

    (assert 101 (mod a).
    (assert 102 (mod b).
    (assert null (mod c).

    (assert 201 (mod -a).
    (assert 202 (mod _b).
  ).
  (should "(import field from \"module\") returns the value of field." (=> ()
    (var y (import y from "./_module").
    (assert 2 y)

    (var p (import p from "./_module").
    (assert 10 p)

    (var b (import b from "./_module").
    (assert 102 b)
  ).
  (should "(import (fields ...) from \"module\") returns the values of fields as an array." (=> ()
    (var (y p b) (import (y p b) from "./_module").
    (assert 2 y)
    (assert 10 p)
    (assert 102 b)
  ).
  (should "import is designed not to support wild symbol * on purpose." (=> ()
    (import * from "./_module").
    (assert null y)
    (assert null p)
    (assert null b)

    (import (*) from "./_module").
    (assert null y)
    (assert null p)
    (assert null b)
  ).
  (define "import es modules", (= ()
    (should "es/io" (= ()
      (var mod (import "es/io").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "io.es").
      (assert (mod -module-dir:: ends-with "modules").
    ).
    (should "es/styles" (= ()
      (var mod (import "es/styles").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "styles.es").
      (assert (mod -module-dir:: ends-with "modules").
    ).
    (should "es/test" (= ()
      (var mod (import "es/test").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "test.es").
      (assert (mod -module-dir:: ends-with "modules").
    ).
    (if (env "runtime-host":: is "browser") (should "es/window" (= ()
      (var mod (import "es/window").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "window.es").
      (assert (mod -module-dir:: ends-with "modules").

      (assert (mod "document":: is-an object).
      (assert (mod "navigator":: is-an object).
      (assert (mod "location":: is-an object).
    ).
  ).
  (define "import native modules", (= ()
    (should "$eslang/io" (= ()
      (var mod (import "$eslang/io").
      (assert (mod is-an object).
      (assert (object is-plain mod).
      (assert false (object is-generic mod).
    ).
    (should "$eslang/path" (= ()
      (var mod (import "$eslang/path").
      (assert (mod is-an object).
      (assert false (object is-plain mod).
      (assert (object is-generic mod).
    ).
    (should "$eslang/symbols" (= ()
      (var mod (import "$eslang/symbols").
      (assert (mod is-an object).
      (assert (object is-plain mod).
      (assert false (object is-generic mod).
    ).
    (should "$eslang/global" (= ()
      (var mod (import "$eslang/global").
      (assert (mod is-an object).
      (assert false (object is-plain mod).
      (assert false (object is-generic mod).

      (assert (mod "setTimeout":: is-a function).
      (assert (mod "clearTimeout":: is-a function).
      (assert (mod "setInterval":: is-a function).
      (assert (mod "clearInterval":: is-a function).
    ).
  ).
).
