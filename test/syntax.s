###############################################################################
# syntax-highlighting test.
###############################################################################

# keywords & opertors
(quote)
(quote(a))
(quote (a))
(quote a)
(quote `)
(quote =>)
(quote quote -quote quote-"quote")
(let let "let")

(object object "object")
(array array "array")

(function function "function")
(closure closure "closure")
(lambda lambda "lambda")
(return return "return")
(exit exit "exit")
(halt halt "halt")

(is is "is")
(typeof typeof "typeof")

(bool bool "bool")
(number number "number")
(string string "string")
(symbol symbol "symbol")
(date date "date")

(if if  "if")
(else else -else else- "else" else)

(while while "while")
(for for "for")
(in in "in")
(break break "break")
(continue continue "continue"

(flow flow "flow")
(pipe pipe "pipe")
(premise premise "premise")
(then then "then")
(next next "next")

(operator operator "operator" operator)
(operator export operator "operator" operator)
(operator   export operator "operator" operator)

(concat concat "concate")
(combine combine "combine")
(mixin mixin "mixin")

(assert assert "assert")

(`)
( `
( `())
( ` ())
(` ` "`")
(@ @ "@")
(= = "=")
(=> => "=>")
(= > = > "= >")
(-> -> --> ->> "->")
(| | || ||| "|")
(? ? ?? ??? "?")
(: : :: :1 1: :"" "": :x x:  ":")

(+)
( +)
( +())
( + ())
(+ + "+")
(+= += ++= +== "+=")
(- - "-")
(-= -= --= -== "-=")
(* * ** *)
(*= *= **= *== "*=")
(/ / "/")
(/= /= //= /== "/=")

(++ ++ +++ "++")
(-- -- --- "--")

(== == === "==")
(!= != !!= !== "!=")

(> > >> >>> ">")
(>= >= >>= >== ">=")

(< < << <<< "<")
(<= <= <<= <== "<=")

(argc  argc  -argc argc- "argc" argc)
(argv argv -argv argv- "argv" argv)

(self self -self self- "argv" self)
(self  self  -self self- "argv" self)

(%C %C  %C)
(%V  %V  %V)
(%X  %X  %X) # invalid
(%0 %1 %2 %3 %4 %5 %6 %7 %8 %9 %10 %-1)

(& && &&& "&") # not defined yet.
(&& && "&&")
(|| || ||| "||")
(! ! !! !!! "!")

# constant values
(null null null()null -null null- "false" null)
(true  true true()true -true true- "true" true)
(false false false()false -false false- "true" false)
(+ "asdasdas d1231231 12 12")
(+ 1 2 3.5 0.7)

# global functions
($bool bool -bool bool- bool)(bool bool)
($string string)(string string)
($symbol symbol)(symbol symbol)
($object object)(object object)
($date date)(date date)
($array array)(array array)

($range range)(range range)
($iterate iterate)(iterate iterate)

($is-empty is-empty)(is-empty is-empty)
($not-empty not-empty)(not-empty not-empty)

($compile compile)(compile compile)
($encoder encoder)(encoder encoder)
($encode encode)(encode encode)
($print print)(print print)

($call call)(call call)
($export export)(export export)

($function function)(function function)
($lambda lambda)(lambda lambda)

($eval eval)(eval eval)
($load load)(load load)
($beval beval)(beval beval) # get removed

($exec exec)(exec exec)
($run run)(run run)
($import import)(import import)
($require require)(require require)

# from sugly test
($define define)(define define)
($should should) (should should)

# global objects
$
($)
($ func var1 var2)
($func var1 var2)
(obj $ var1 var2)
(obj func $ var1 var2)
"123$bcd $\t xyz"

(Bool Bool -Bool Bool- "Bool" Bool)
(String Symbol Object Function Date Array Bit Uri Math Json Sugly)

# encode function group
($encode)
($encode )
($encode program)
(encode bool)
(encode bool- )
(encode -bool )
(encode bool var)
(encode number var)
(encode string var)
(encode symbol var)
(encode object var)
(encode function var)
(encode date var)
(encode array var)
(encode value var)
(encode clause var)

(encode "value")
(encode non-sugly-method)

# print function group
($print)
($print )
($print program)
(print code)
(print code-)
(print -code)
(print code var)
(print value var)
(print clause var)
(print info var)
(print warn var)

(print "value" var)
(print non-sugly-method var)

# more examples
(let var (== x 1).
(let func (=> x (+ x 1).
(let func (=> (x y) (+ x 1).
(let func (= x (+ x 1).
(let func (= (x y) (+ x 1).
($ func 1 1)

(let func (function x (+ x 1).
(let func (function (x y) (+ x 1).

(let func (closure x (+ x 1).
(let func (closure (x y) (+ x 1).

(let func (lambda x (+ x 1).
(let func (lambda (x y) (+ x 1).

(let func (= a > x (+ x 1).
(let func (= b > (x y) (+ x 1).

(let obj1 (@ p: 1 m: (= x (+ x 10).
(obj1 m 1)

(let obj2 (@ p: 1 m: (= (x y) (+ x y 10).
(obj2 m 1)

(@x < p:1 v:2)
(@x< p:1 v:2)
(@ x< p:1 v:2)
(@ x < p:1 v:2)

(@>p:1)
(@ x > p:1 v:2)

# code snippets.
(if condition  true else  false),
(for condition stepping body),
(for v in iterable body),
(for i in ($range max) body),
(while condition body ),
