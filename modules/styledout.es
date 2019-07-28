(const colors (@
  "red", "green", "blue", "yellow", "gray", "grey"
).
(const printf-of (= color (=> ()
  printf (arguments join "") color;
).
(const exporting (= (color)
  tuple of (` export) (symbol of color) (tuple of (` printf-of) color);
).
for color in colors ((exporting color));

(export underline (= ()
  printf (arguments join "") "underline";
).

(export underlined (= (color)
  printf (arguments copy 1:: join "") ("underline " + color);
).
