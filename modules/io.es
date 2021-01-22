# skip encoding argument since it's not supported in web browser;
# when running in NodeJS/host mode, the encoding will be fixed to UTF-8.
const io (import "$eslang/io");

(const forward-to (=> (op, argc) (=> ()
  io: op:: apply io, (arguments slice 0, argc);
).

# synchronously read and write text files.
export read (forward-to "read", 1);
export write (forward-to "write", 2);

# async version of read and write methods.
export to-read (forward-to "to-read", 1);
export to-write (forward-to "to-write", 2);
