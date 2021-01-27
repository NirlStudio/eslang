# Espresso Script Language - eslang
## A simple &amp; expressive script language, which is inspired by Lisp, Python, JavaScript and many other great languages.
```lisp
print "Hello, world!";

# or, without sweetener
(print "Hello, world!")

# or, with some decoration
printf "Hello, world!\n", "green bold underline";
```

# Try it online
## [Espresso Web Shell](https://eslang.dev)
```lisp
help; # for help.

# verify your browser's compatibility.
selftest;

# run a quick-sort example
run "examples/qsort1";

# print its code
print (.loader read "examples/qsort1");

# list all examples
.loader list "examples/";

# use print to show a full list.
print (.loader list "examples/");

# break items into lines
.loader list "examples/":: for-each print;

# display file url only
.loader list "examples/":: for-each (= item (print (item 0);

# or use the for loop
for (.loader list "examples/") (print (_ 0);

# add some decoration
for (.loader list "examples/") (printf (_ 0), "blue underline") (printf '# $(_ 1)\n', "gray");

# or better formatted as
(for (.loader list "examples/")
  printf (_ 0), "blue underline";
  printf '# $(_ 1)\n', "gray";
).

# or use explicit variable name
(for (item, no.) in (.loader list "examples/")
  printf '$no. ', "bold";
  printf (item 0), "blue underline";
  printf '# $(item 1)\n', "gray";
).

# with some stylish helpers
var * (import "es/styles");
for (.loader list "examples/") (blue underline (_ 0))(gray '# $(_ 1)\n');

# Finally, the Y-combinator in Espresso
print (.loader read "yc");
```

# Install it
```shell
npm i -g eslang

es selftest # optional
```

## run an example, or your own code:
```shell
es examples/qsort1

# or run the example test suite
es test examples/test

# or just
es test examples

```

## REPL in terminal:
```shell
es
```
## You can do [almost the same things](#try-it-online) after calling
```lisp
fetch "https://eslang.dev/@";

# or try
fetch "https://eslang.dev/@":: finally (=>() (for (.loader list) (print (_ 0);
```

# Use it in your JS project
### add it
```shell
> npm i --save eslang
```

### use it
```javascript
var $void = require('eslang')()
$void.$run('path-to-your-app.es')
```

### due to the re-design, the new ES package management tool, esp, will come soon
The new ES package/module system is fully de-centralized. It only depends on any public or your own git server. Of course, you can still use any npm package as easy as, e.g.
```lisp
var axios (import "$axios");

# and of course, any node core package, e.g.
var fs (import "$fs");
```

# Check the source code
```shell
# download the code
> git clone https://github.com/NirlStudio/eslang.git
> cd eslang

# setup development environment.
> npm install
> npm test

# run local version.
> bin/es

# or, start the local web shell
npm npm start
```

# IDE Support
### VS Code Extension
In Extensions sidebar, search for **eslang**
note: new language server is under development and will be implemented by ES itself.


### Atom Plugin
[*language-espresso*](https://github.com/NirlStudio/language-espresso)
```shell
apm install language-espresso
```


# Why it's created? A very long story ...
Profoundly, it's motivated by the thinking of simplicity vs. complexity. After that, it came up with something more solid to be suitable for some kind of self-evolution general AI. So it tries some totally different programming language design philosophies.


## Some principles
### Simpler is better.
- Don't reinvent the wheel.
- Don't try to solve the unsolvable part of a problem.


### No error, raise warnings to the worst situation.
- No syntax error. It's purposed to compare its design with the structures of natural languages. In some future, with a AI-backed sematic processor, more annoying punctuations may be skipped.
Above all the sweetener and/or mess, there's only two type of statement:
```lisp
(subject predicate object[s])

# or its imperative form
(command object[s])

```
_note: As an extreme example, it's in serious consideration to render symbols by their parts of speech instead of type._

- All statements (all pieces of free texts) will be evaluated and give a result. Of course, a piece of code written by a lovely monkey will very likely be evaluated to nothing/null. But who knows.

_note: Not all our DNA fragments are useful. But again, who knows._
_note: Actually, in the real world, a program breaks because we make it so, but it ultimately become to break unnecessarily.

### Keep backward compatibility, as possible as you, the honorable creator, can.
- If it changed, it's different. Probably it should bear a new name instead of a different version number.
- If some software patrons choose to use old applications for decades, they should be allowed to do it. Probably hundreds of years make sense too.


## Some tips for ES lang patrons
### - Look for what you need, ignore what you do not understand.
### - Do what you can do anywhere and anytime.
### - Use convention over restriction. So it can be broken in a clean way, not an ugly way, when someone have to.
### - Consider types as a kind information to help to optimise, not to restrict.


## You can use it to
### create both you backend and frontend applications.
### build your own programming lang or just create a different dialect, e.g: make it fully localized to your own language.


## You can help to
### - Test it in various OSes and browsers.
### - Use it in your projects.
### - Recommend it to your friends.
### - Create documentation & tools.
### - Report bugs and help to fix.
### - Request for features.
### - Create interpreters in other native languages
  - Java, Go, Rust, Python, C#, C, etc
### - ...


**Enjoy the Espresso.**
