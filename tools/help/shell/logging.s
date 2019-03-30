'
# usage:\
#   .logging [level]; # display or set logging level.\
#\
# arguments:\
#   level\t is an integer value between 0 and 127.\
#   - 0: disabled\
#   - 1: error\
#   - 2: error, warn\
#   - 3: error, warn, info\
#   - 4: error, warn, info, verbose\
#   - 5 ~ 127: application usage.\
#\
# returns:\
#   an integer value of current logging level.\
#\
# examples:
\n    .logging;
\n    .logging 2;\
#\
# see also:\
#   (env "logging-level")\
#   (log d), (log debug)\
#   (log i), (log info)\
#   (log v), (log verbose)\
#   (log w), (log warn), (log warning)\
#   (log e), (log err), (log error)\
#
'
