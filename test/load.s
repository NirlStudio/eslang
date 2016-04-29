(let features (@
  spec: (@
    "exec"
  )
),

(let run- (= type
  (for name in (features:type)
    ($define name (= (type name) > ()
      ($run (+ type "/" name)),
).

(= (type)
  ($run- (if ($isEmpty type) "spec" type)
).
