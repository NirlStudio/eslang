(define "(load ...)" (=> ()
  (should "(load) returns null." (= ()
    (assert null (load).
  ).
  (should "(load \"module\") returns the evaluation result." (=> ()
    (var data (load "_data").
    (assert 1 (data x).
    (assert 2 (data y).
    (assert 3 (data z).

    (assert null (data this).
    (assert null (data arguments).

    (let data (load "_data" (@).
    (assert 1 (data x).
    (assert 2 (data y).
    (assert 3 (data z).

    (assert null (data this).
    (assert ((data arguments) is-a array).
    (assert ((data arguments) is-empty).
  ).
  (should "(load \"module\" args) returns the evaluation result with arguments." (=> ()
    (var data (load "_data" (@
      this: 100
      arguments: (@ 200 300)
      z: 103
    ).
    (assert 1 (data x).
    (assert 2 (data y).
    (assert 103 (data z).

    (assert 100 (data this).
    (assert ((data arguments) is-a array).
    (assert ((data arguments) not-empty).
    (assert 2 ((data arguments) length).
    (assert 200 ((data arguments) 0).
    (assert 300 ((data arguments) 1).
  ).
  (should "(load \"module\") may return the value(s) raised by (return ...) in the module." (=> ()
    (var data (load "_data" (@
      command: "return"
    ).
    (assert 101 (data x).
    (assert 102 (data y).
    (assert 103 (data z).

    (assert null (data this).
    (assert null (data arguments).
  ).
  (should "(load \"module\") may return the value(s) raised by (exit ...) in the module." (=> ()
    (var data (load "_data" (@
      command: "exit"
    ).
    (assert 201 (data x).
    (assert 202 (data y).
    (assert 203 (data z).

    (assert null (data this).
    (assert null (data arguments).
  ).
  (should "(load \"module\") returns the values exported by (export ...) if it's called and exports any value." (=> ()
    (var data (load "_data" (@
      command: "export"
    ).
    (assert 301 (data a).
    (assert 302 (data b).
    (assert 303 (data c).

    (assert null (data x).
    (assert null (data y).
    (assert null (data z).

    (assert null (data this).
    (assert null (data arguments).
  ).
).
