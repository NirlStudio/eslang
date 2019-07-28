(@
  .: '
  # usage:\
  #   .loader method [argument]; # operate on the module cache.\
  #\
  # options:\
  #   method\tis one of list, read, reset and clear.\
  #   argument\tis to be described by (help .loader method).\
  #\
  # examples:
  \n    .loader list;
  \n    .loader read "sort-data";
  \n    .loader reset "examples/qsort1";
  \n    .loader clear;\
  #\
  # see also: (.loader list), (.loader read), (.loader reset), (.loader clear)\
  #',

  list: "
  # usage:\
  #   .loader list [uri]; # query [matched] modules in cache.\
  #\
  # arguments:\
  #   uri\t is an optional string argument which is a whole or partial uri.\
  #\
  # returns:\
  #   an array of uri & etag value pair, like: (@ (@ uri, etag), ...)\
  #\
  # examples:
  \n    .loader list;
  \n    .loader list \"examples/\";
  \n    .loader list:: map (= m (m 0)):: sort:: for-each print;
  \n    .loader list:: for-each (= m (print '$(m 0), etag=$(m 1)');\
  #\
  # see also: (.loader read), (.loader reset), (.loader clear)\
  #",

  read: '
  # usage:\
  #   .loader read uri; # read the first module matched in cache.\
  #\
  # arguments:\
  #   uri\t can be a whole or partial uri.\
  #\
  # returns:\
  #   the module text as string.\
  #\
  # examples:
  \n    .loader read "examples/yc";\
  #\
  # see also: (.loader list), (.loader reset), (.loader clear)\
  #',

  reset: '
  # usage:\
  #   .loader reset [uri]; # clear [matched] modules in cache.\
  #\
  # arguments:\
  #   uri\t is an optional string argument which is a whole or partial uri.\
  #\
  # returns:\
  #   the number of how many module entries have been cleared.\
  #\
  # examples:
  \n    .loader reset "examples/";
  \n    .loader reset "examples/yc";\
  #\
  # see also: (.loader list), (.loader read), (.loader clear)\
  #',

  clear: "
  # usage:\
  #   .loader clear; # clear all modules in cache.\
  #\
  # returns:\
  #   the number of how many module entries have been cleared.\
  #\
  # examples:
  \n    .loader clear;\
  #\
  # see also: (.loader list), (.loader read), (.loader reset)\
  #",
).
