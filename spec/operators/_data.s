
(if (command == "return") (return (@
  x: 101
  y: 102
  z: 103
).

(if (command == "exit") (exit (@
  x: 201
  y: 202
  z: 203
).

(if (command == "export") (export * (@
  a: 301
  b: 302
  c: 303
).

(@
  this: this
  arguments: arguments
  x: (x ?? 1)
  y: (y ?? 2)
  z: (z ?? 3)
).
