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
  (define "import modules", (= ()
    (should "io" (= ()
      (var mod (import "io").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "io.es").
      (assert (mod -module-dir:: ends-with "modules").
    ).
    (should "restful" (= ()
      (var mod (import "restful").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "restful.es").
      (assert (mod -module-dir:: ends-with "modules").
    ).
    (should "styledout" (= ()
      (var mod (import "styledout").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "styledout.es").
      (assert (mod -module-dir:: ends-with "modules").
    ).
    (should "test" (= ()
      (var mod (import "test").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "test.es").
      (assert (mod -module-dir:: ends-with "modules").
    ).
    (should "window" (= ()
      (var mod (import "window").
      (assert (mod is-an object).
      (assert (mod -module:: ends-with "window.es").
      (assert (mod -module-dir:: ends-with "modules").
    ).
  ).
  (define "import native modules", (= ()
    (should "$io" (= ()
      (var mod (import "$io").
      (assert (mod is-an object).
      (assert "$io" (mod -module).
      (assert null (mod -module-dir).
    ).
    (should "$restful" (= ()
      (var mod (import "$restful").
      (assert (mod is-an object).
      (assert "$restful" (mod -module).
      (assert null (mod -module-dir).
    ).
    (should "$shell" (= ()
      (var mod (import "$shell").
      (assert (mod is-an object).
      (assert "$shell" (mod -module).
      (assert null (mod -module-dir).
    ).
    (should "$symbols" (= ()
      (var mod (import "$symbols").
      (assert (mod is-an object).
      (assert "$symbols" (mod -module).
      (assert null (mod -module-dir).
    ).
    (should "$window" (= ()
      (var mod (import "$window").
      (assert (mod is-an object).
      (assert "$window" (mod -module).
      (assert null (mod -module-dir).
    ).
  ).
).
