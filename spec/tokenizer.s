(define "tokenizer" (= ()
  (should "(tokenizer ...) return a function to receive input." (= ()
    (let tokenizing (tokenizer ),
    (assert (:tokenizing is-a function),
).

(define "tokenize" (= ()
  (should "(tokenize ...) return an array of tokens." (= ()
    (let tokens (tokenize "x y z"),
    (assert (tokens is-a array),
    (assert ((tokens length) is 3),
).
