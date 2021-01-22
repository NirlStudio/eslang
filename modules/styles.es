# all available styles defined in ../lib/style.js
(const styles (@
  "black", "white", "gray", "grey",
  "red", "green", "yellow", "blue",
  "bold", "italic",
  "overline", "underline", "line-through"
).

(const printf-of (= style (=> ()
  let offset 0;
  # find out leading functions and take them as other styles.
  (while (offset < (arguments length):: and (arguments: offset:: is-a function))
    style += " ", (arguments: offset:: name); # extract function name as style key.
    offset ++;
  ).
  printf (arguments slice offset:: join "") style;
).

# define a macro to dynamically exporting a render-and-print function
(const exporting (= style
  # e.g: if (style is "red"), the result will be: (export red (printf-of "red"))
  tuple of (` export) (symbol of style) (tuple of (` printf-of) style);
).

for style in styles ((exporting style)); # the result tuple works like a macro.
