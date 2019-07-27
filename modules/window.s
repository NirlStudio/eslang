const window (import "$window");

# only expose some members of native window.
export (document, navigator, location) window;

# bind elements to their ids.
(export bind (=? ()
  (for &el in (operation slice operand) (if (&el is-a symbol)
    (var &el (? document:: getElementById (&el key);
).

#(
 Add some simplified wrappers for vanilla functions.
)#

# if the target is a string, it's indeed the event name.
(const prepare-by (=> target
  (target is-a string) ? (@ window, 0), (@ target, 1);
).

# add an event listener and return it.
(export on (? (document "addEventListener":: is-a function)
  (=> (target, event, listener, options)
    let (target, offset) (prepare-by target);
    target "addEventListener":: apply target, (arguments slice offset);
    arguments: (offset + 1);
  ).
  (=> (target, event, listener)
    let (target, offset) (prepare-by target);
    target attachEvent 'on$(arguments: offset)', listener;
    arguments: (offset + 1);
  ).
).

# remove an event listener and return the target.
(export off (? (document "removeEventListener":: is-a function)
  (=> (target, event, listener, options)
    let (target, offset) (prepare-by target);
    target "removeEventListener":: apply target, (arguments slice offset); target
  ).
  (=> (target, event, listener)
    let (target, offset) (prepare-by target);
    target detachEvent 'on$(arguments: offset)', listener; target
  ).
).

# select the first child element from document or an element by a css selector.
(export select (=> (from, by)
  (if ($from is-a string)
    document querySelector from;
  else
    if ($by is-a string) ($from querySelector by);
).

# select all child elements from document or an element by a css selector.
(export select-all (=> (from, by)
  (if ($from is-a string)
    document querySelectorAll from;
  else
    if ($by is-a string) ($from querySelectorAll by);
).
