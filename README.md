sugly-lang
==========
A simple &amp; ugly programming language

```sugly
"Hello, world!" # value ouput

```
or
```sugly
(print code "Hello, world!")
() #reset module output
```

Run from npm
------------
- Install the package
```
npm install -g sugly
```
- Run self-test suite
```
sugly self-test
```
- Run sugly code.
```
sugly some-sugly-file[.s]
```
- Use in Javascript code
```javascript
var $ = require('sugly')
$.run('your-app')
```

Run from source code
--------------------
- Clone the project & Enter the directory.  
- Update/recover dependencies.
```
npm install
```
- Execute self-test suite.
```
npm test
```
- Run a piece of sugly program.  
```
bin/sugly some-sugly-file[.s]
```
or
```
node . some-sugly-file[.s]
```

Create code by Atom
--------------------
Install package [*language-sugly*](https://github.com/NirlStudio/language-sugly) from Atom or execute from command line:
```
apm install language-sugly
```

**Enjoy the sugliness.**
