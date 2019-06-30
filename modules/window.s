const window (import "$window");

# only expose necessary member of native window.
export (document, navigator, location) window;

# bind elements to their ids.
(export bind (=? ()
  (for &el in (operation slice operand) (if (&el is-a symbol)
    (var &el (? document:: getElementById (&el key);
).
