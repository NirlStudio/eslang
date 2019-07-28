(export app -app)
(export app-dir -app-dir)
(export app-home -app-home)
(export mod -module)
(export mod-dir -module-dir)

(@ (env "home"), this, (arguments copy),
  -app, -app-dir, -app-home, -module, -module-dir
).
