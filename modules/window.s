const window (import "$window");

# only expose necessary member of native window.
export (document, navigator, location) window;
