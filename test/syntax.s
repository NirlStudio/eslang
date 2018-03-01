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
(number number "number")
(date date "date")
(string string "string")
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
(((indexer-of indexer-of) indexer-of) indexer-of x)
(((objectify objectify) objectify) objectify x)
(((typify typify) typify) typify x)

# meta.constant.empty.sugly
(bool empty)
(string empty)
(number empty)
(date empty)
(range empty)
(symbol empty)
(tuple empty)

# meta.operator.empty.sugly
(operator empty)

# meta.function.empty.sugly
(lambda empty)
(function empty)
(array empty)
(object empty)
(class empty)

# meta.function.other.empty.sugly
(((empty empty) empty) empty y)

# common

# string
# number
# date
# range

# symbol
# tuple

# operator ?
# lambda & function

# array
# object
# class

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

# support.variable.object.lib.sugly
uri
uri(uri uri uri)uri

math
math(math math math)math

json
json(json json json)json

# support.class.lib.sugly
emmiter
emmiter(emmiter emmiter emmiter)emmiter
timer
timer(timer timer timer)timer

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
