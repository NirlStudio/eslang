(let mod (import "module_").
(if mod
  (print "(mod x) is " (mod x),
  (print "(mod l 10 20) is" (mod l 10 20),
  (print "(mod f 10 20) is" (mod f 10 20),
  else
  (print "failed to load the module"),
).
