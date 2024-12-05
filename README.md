# TypeError Memory Leak Playground

This project shows how it would be possible to use [custom elements](https://web.dev/articles/custom-elements-v1) to wrap an iframe to achieve these goals:

- Prevent code on the host page from accessing the iframe directly - and prevent memory leaks that could occur if retainers still connected the iframe to the GC root after it is removed.
- Get a reliable, performant signal about when the host has removed iframe wrapper from the DOM (or any of it's parents).</li>

For more details [see it running live](https://astegmaier.github.io/playground-custom-elements/).

## Running Locally

1. Clone this repo by running `git clone https://github.com/astegmaier/playground-custom-elements.git`
2. Change into the directory by running `cd playground-type-error-leaks`
3. Ensure [nodejs](https://nodejs.org/en/) is installed.
4. Run `npx http-server` to start a local server. You can also install `http-server` globally by running `npm install -g http-server` and then running `http-server` directly.
5. Open `http://localhost:8080/` in your browser.
