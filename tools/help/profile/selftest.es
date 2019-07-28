"
# usage:\
#   selftest [spec [spec]]; # run all or a set of specification.\
#\
# arguments:\
#   spec\t is the specification suite to be executed. its value can be\
#   - bootstrap\t# native environment and fundamental suite.\
#   - compiler\t# compiler test suite.\
#   - tokenizer\t# tokenizer test suite.\
#   - generic[/topic]\t# topic is one of\
#     : array, bool, class, date, function, global, instance, iterator,\
#     : lambda, null, number, object, operator, promise, range, string,\
#     : symbol, tuple, type\
#     :\
#   - lib[/topic]\t# topic is one of\
#     : emitter, format, json, math, stdout, timer, uri\
#     :\
#   - operators[/topic]\t# topic is one of\
#     : arithmetic, assignment, bitwise, control, fetch, function, general,\
#     : import, literal, load, logical, operator, pattern, quote\
#     :\
#   - runtime[/topic]\t# topic is one of\
#     : env, eval, evaluate, interpreter, run, signal, space\
#\
# examples:
\n    selftest;
\n    selftest bootstrap;
\n    selftest generic;
\n    selftest generic/number, generic/string;\
"
