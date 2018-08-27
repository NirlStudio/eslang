###############################################################################
# comment.line.number-sign.sugly

# keyword.other.punctuation.sugly
: @ ` $
@ ` $ :
` $ : @
$ : @ `
@(@ a@ @ @b @)@
:(: a: : :b :):
`(` a` ` `b `)`
$($ a$ $ $b $)$

# keyword.operator.quote.sugly
quote
quote(quote -quote quote quote- quote)quote

# keyword.operator.assignment.sugly
let(let -let let let- let)let
var(var -var var var- var)var
export(export -export export export- export)export

# keyword.control.flow.sugly
if
if(if -if if if- if)if
for
for(for -for for for- for)for
while
while(while -while while while- while)while
break
break(break -break break break- break)break
continue
continue(continue -continue continue continue- continue)continue

# keyword.control.preposition.sugly
else
else(else -else else else- else)else
in
in(in -in in in- in)in

# keyword.control.procedure.sugly
redo
redo(redo -redo redo redo- redo)redo
return
return(return -return return return- return)return
exit
exit(exit -exit exit exit- exit)exit

# suport.function.self.sugly
do
do(do -do do do- do)do

# variable.language.sugly
this
this(this -this this this- this)this
arguments
arguments(arguments -arguments arguments arguments- arguments)arguments
operant
operant(operant -operant operant operant- operant)operant
operands
operands(operands -operands operands operands- operands)operands

# storage.type.generic.sugly
(type type "bool")
(bool bool "bool")
(string string "string")
(number number "number")
(date date "date")
(range range "range")
(symbol symbol "symbol")
(tuple tuple "tuple")
(lambda lambda "lambda")
(function function "function")
(operator operator "operator")
(array array "array")
(class class "class")
(object object "object")

# constant.language.sugly
null
null(null null null: null :null null@ null @null null)null
true
true(true true true: true :true true@ true @true true)true
false
false(false false false: false :false false@ false @false false)false

# meta.operator.operator-decl.sugly
=?(=?(=? x )=? )

# meta.operator.lambda-decl.sugly
=(=(= x )= )
=(=(=: x )=: )
=>(=>(=> x )=> )
=>(=>(=> x : x )=> y : y)

# keyword.operator.global.sugly
+
(+)
(+(+ + +)
?
(?)
(?(? ? ?)
!
(!)
(!(! ! !))
~
(~)
(~(~ ~ ~))

# keyword.operator.double.sugly
++
(++)
(++(++ ++ ++))
--
(--)
(--(-- -- --))

# keyword.operator.general.sugly
(x ? t f)
((1 + 1)? t f)
(x ?? t f)
((1 + 1)?? t f)
(x && t f)
((1 + 1)&& t f)
(x || t f)
((1 + 1)|| t f)

# meta.operator.arithmetic.sugly
+((1 + 2)+ 3)
++((1 ++ 2)++ 3)
+=((1 += 2)+= 3)

-((1 - 2)- 3)
--((1 -- 2)-- 3)
-=((1 -= 2)-= 3)

*((1 * 2)* 3)
*=((1 *= 2)*= 3)

/((1 / 2)/ 3)
/=((1 /= 2)/= 3)

# meta.operator.bitwise.sugly
&(& (a & b)& c)
&=(&= (a &= b)&= c)

|(| (a | b)| c)
|=(|= (a |= b)|= c)

^(^ (a ^ b)^ c)
^=(^= (a ^= b)^= c)

<<(<< (a << b)<< c)
<<=(<<= (a <<= b)<<= c)

>>(>> (a >> b)>> c)
>>=(>>= (a >>= b)>>= c)

>>>(>>> (a >>> b)>>> c)
>>>=(>>>= (a >>>= b)>>>= c)

# meta.operator.comparison.sugly
==(== (a == b)== c)
!=(!= (a != b)!= c)

>(> (a > b)> c)
>=(>= (a >= b)>= c)

<(< (a < b)< c)
<=(<= (a <= b)<= c)

# meta.function.entity.sugly (null)
(((empty is) is) is x)
(((is-not is-not) is-not) is-not x)
(((equals equals) equals) equals x)
(((not-equals not-equals) not-equals) not-equals x)
(((compare compare) compare) compare x)
(((is-empty is-empty) is-empty) is-empty x)
(((not-empty not-empty) not-empty) not-empty x)
(((is-a is-a) is-a) is-a x)
(((is-not-a is-not-a) is-not-a) is-not-a x)
(((to-code to-code) to-code) to-code x)
(((to-string to-string) to-string) to-string x)

# meta.function.type.sugly (type)
(((of of) of) of x)
(((objectify objectify) objectify) objectify x)
(((typify typify) typify) typify x)

# meta.constant.empty.sugly
(type empty)
(bool empty)
(string empty)
(number empty)
(date empty)
(range empty)
(symbol empty)
(tuple empty)

# meta.function.empty.sugly
(operator empty)
(lambda empty)
(function empty)
(array empty)
(object empty)
(class empty)

# meta.function.other.empty.sugly
(((empty empty) empty) empty y)

# meta.operator.noop.sugly
(operator noop)

# meta.operator.noop.sugly
(lambda noop)
(function noop)

# meta.function-collection-sugly: string, tuple, array
length((length length) length)length
first((first first) first)first
first-of((first-of first-of) first-of)first-of
last((last last) last)last
last-of((last-of last-of) last-of)last-of
copy((copy copy) copy)copy
slice((slice slice) slice)slice
concat((concat concat) concat)concat

# meta.function-string-sugly
of-chars((of-chars of-chars) of-chars)of-chars
starts-with((starts-with starts-with) starts-with)starts-with
ends-with((ends-with ends-with) ends-with)ends-with
trim((trim trim) trim)trim
trim-left((trim-left trim-left) trim-left)trim-left
trim-right((trim-right trim-right) trim-right)trim-right
replace((replace replace) replace)replace
to-upper((to-upper to-upper) to-upper)to-upper
to-lower((to-lower to-lower) to-lower)to-lower
split((split split) split)split
char-at((char-at char-at) char-at)char-at

# meta.constant-number-sugly
max((number max) max)
min((number min) min)
smallest((number smallest) smallest)
infinite((number infinite) infinite)
-infinite((number -infinite) -infinite)
max-int((number max-int) max-int)
min-int((number min-int) min-int)
bits((number bits) bits)
max-bits((number max-bits) max-bits)
min-bits((number min-bits) min-bits)
invalid((number invalid) invalid)
# meta.function-number-type-sugly
parse((number parse) parse)
parse-int((number parse-int) parse-int)
of-int((number of-int) of-int)
of-bits((number of-bits) of-bits)
# meta.function-number-sugly
is-valid((n is-valid) is-valid)
is-invalid((n is-invalid) is-invalid)
is-int((n is-int) is-int)
is-not-int((n is-not-int) is-not-int)
is-bits((n is-bits) is-bits)
is-not-bits((n is-not-bits) is-not-bits)
is-finite((n is-finite) is-finite)
is-infinite((n is-infinite) is-infinite)
as-int((n as-int) as-int)
as-bits((n as-bits) as-bits)
and((n and) and)
minus((n minus) minus)
times((n times) times)
divided-by((n divided-by) divided-by)
ceil((n ceil) ceil)
floor((n floor) floor)
round((n round) round)
trunc((n trunc) trunc)

# meta.constant-date-sugly
invalid((date invalid) invalid)
# meta.function-date-type-sugly
parse((date parse) parse)
of-utc((date of-utc) of-utc)
now((date now) now)
timestamp((date timestamp) timestamp)
timezone((date timezone) timezone)
# meta.function-date-sugly
is-valid((d is-valid) is-valid)
is-invalid((d is-invalid) is-invalid)
date-fields((d date-fields) date-fields)
time-fields((d time-fields) time-fields)
all-fields((d all-fields) all-fields)
week-day((d week-day) week-day)
timestamp((d timestamp) timestamp)

# meta.constant-symbol-sugly
((symbol etc) etc)
((symbol all) all)
((symbol quote) quote)
((symbol lambda) lambda)
((symbol function) function)
((symbol operator) operator)
((symbol let) let)
((symbol var) var)
((symbol export) export)
((symbol object) object)
((symbol pairing) pairing)
((symbol comment) comment)
# meta.function-symbol-type-sugly
((symbol of-shared) of-shared)

# meta.constant-tuple-sugly
((tuple plain) plain)
((tuple unknown) unknown)
((tuple lambda) lambda)
((tuple function) function)
((tuple operator) operator)
((tuple array) array)
((tuple object) object)
# meta.function-tuple-type-sugly
((tuple accepts) accepts)
((tuple atom-of) atom-of)
((tuple of-plain) of-plain)
((tuple from) from)
((tuple from-plain) from-plain)
# meta.function-tuple-sugly
is-plain((t is-plain) is-plain)
source-map((t source-map) source-map)
iterate((t iterate) iterate)
merge((t merge) merge)
to-array((t to-array) to-array)
to-list((t to-list) to-list)

# meta.function-operation-sugly
parameters((f parameters) parameters)
body((f body) body)
is-generic((f is-generic) is-generic)
not-generic((f not-generic) not-generic)
apply((f apply) apply)

# meta.function-array-type-sugly
((array from) from)
# meta.function-array-sugly
count((a count) count)
get((a get) get)
set((a set) set)
reset((a reset) reset)
clear((a clear) clear)
has((a has) has)
swap((a swap) swap)
splice((a splice) splice)
pop((a pop) pop)
push((a push) push)
reverse((a reverse) reverse)
sort((a sort) sort)
join((a join) join)

# meta.function-object-type-sugly
((object assign) assign)
((object get) get)
((object set) set)
((object reset) reset)
((object clear) clear)
((object has) has)
((object owns) owns)
((object fields-of) fields-of)

# meta.function-class-type-sugly
((class attach) attach)
# meta.function-class-sugly
default((c default) default)
as((c as) as)
from((c from) from)
to-object((c to-object) to-object)
constructor((i constructor) constructor)
activator((i activator) activator)

# meta.function.iteration.sugly
(iterate)
(iterator)
(select)
(selector)
(collect)
(collector)
(reduce)
(reducer)

# meta.function.runtime.sugly
(compile)
(compiler)
(tokenize)
(tokenizer)
(interpreter)
(eval)
(import)
(load)
(include)
(run)

# meta.function.lib.sugly
(encode)
(print)
(warn)

# meta.function-uri-lib-sugly
((uri encode) encode)
((uri decode) decode)
((uri escape) escape)
((uri unescape) unescape)

# meta.function-json-lib-sugly
((json of) of)
((json parse) parse)

# meta.constant-math-lib-sugly
((math e) e)
((math pi) pi)
# meta.function-math-lib-sugly
((math sin) sin)
((math cos) cos)
((math tan) tan)
((math asin) asin)
((math acos) acos)
((math atan) atan)
((math atan2) atan2)
((math log) log)
((math exp) exp)
((math pow) pow)
((math sqrt) sqrt)
((math abs) abs)
((math max) max)
((math min) min)
((math random) random)

# support.variable.object.lib.sugly
uri
uri(uri uri uri)uri
json
json(json json json)json
math
math(math math math)math

# support.class.lib.sugly
emmiter
emmiter(emmiter emmiter emmiter)emmiter
timer
timer(timer timer timer)timer

# meta.function-emitter-sugly
on((e on) on)
off((e off) off)
emit((e emit) emit)

# meta.function-timer-class-sugly
((timer timeout) timeout)

# meta.function-timer-sugly
((t start) start)
((t stop) stop)

# meta.function.test.sugly
(define define)(define define)
(should should) (should should)
(test test) (test test)

# meta.operator.test.sugly
(assert assert) (assert assert)

# numbers
00 01 07 08 09 0a
0x1234567890abcdef 0xg
0x1234567890ABCDEF 0xG
0b0011 0b0022
-0 0
-1 1
-1.03 1.03
-1.03e+12
-1.03E-12

# string
"123$bcd\"''$\t xyz"
