# Espresso Script Language - eslang
### A simple &amp; expressive script language, which is inspired by Lisp, Python, JavaScript and many other great languages.
```lisp
print "Hello, world!";

# or, without sweetener
(print "Hello, world!")

# or, with some decoration
printf "Hello, world!\n", "green bold underline";
```

# Try it online
### [Espresso Web Shell](https://eslang.dev)
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

# display item no. for counting
.loader list "examples/":: for-each (= (item, no.) (print '#$(no.), $(item 0)');

 # display path only
.loader list "examples/":: for-each (= (item, no.) (print '#$(no.),', (var url (item 0):: slice (url first-of "examples/");

# Q: What's happening?
var print-examples (=>:() (var examples (.loader list "examples/")) (=> pattern (examples for-each (=> (item, no.) (print (string format (pattern ?* "{0}, {1}, {2}"), no., (item 0), (item 1);

# As a hint, here's a (more) friendly version.
(var print-examples (=>:()
  var examples (.loader list "examples/");
  (=> pattern
    (examples for-each (=> (item, no.)
      print (string format (pattern ?* "{0}, {1}, {2}"), no., (item 0), (item 1);
).

# You may also want to check
print print-examples;

# Finally, the Y-combinator in Espresso
print (.loader read "yc");
```

# Install it
```shell
npm i -g eslang

es selftest # optional
```

### run an example, or your own code:
```shell
es examples/qsort1
```

### REPL in terminal:
```shell
es
```
### You can do [almost the same things](#try-it-online) after calling
```lisp
fetch "https://eslang.dev/@";

# or try
fetch "https://eslang.dev/@":: finally (=>() (.loader list:: for-each print);
```

# Use it in your JS project
### add it
```shell
npm i --save eslang
```

### use it
```javascript
var $void = require('eslang')()
$void.$run('path-to-your-app.es')
```

### use [es-npm](https://www.npmjs.com/package/@eslang/es-npm) to create projects
```shell
npm i -g @eslang/es-npm
es-npm
```

# Check the source code
```shell
git clone https://github.com/NirlStudio/eslang.git
cd eslang

npm install
npm test

bin/es

# or, start the local web shell
npm run build & npm start
```

# IDE Support
### VS Code Extension
In Extensions sidebar, search for **eslang**

### Atom Plugin
[*language-espresso*](https://github.com/NirlStudio/language-espresso)
```shell
apm install language-espresso
```

# You can help to
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
