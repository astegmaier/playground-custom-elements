///////////////////////////////
// Define the Custom Element //
///////////////////////////////

class IframeProxy extends HTMLElement {
  #shadowRoot;
  #iframe;

  constructor(id) {
    super();
    console.log(`${id} - constructor`);
    this.id = id;
  }

  connectedCallback() {
    console.log(`${this.id} - connectedCallback`);
    this.#iframe = getIframe();
    this.#shadowRoot = this.attachShadow({mode: 'closed'});
    this.#shadowRoot.innerHTML = `Iframe Proxy ${this.id}`;
    this.#shadowRoot.appendChild(this.#iframe);
  }

  disconnectedCallback() {
    console.log(`${this.id} - disconnectedCallback`);
    this.#shadowRoot.removeChild(this.#iframe);
    this.#shadowRoot = undefined;
    this.#iframe = undefined;
    // TODO: invoke registered "onDisconnected" callbacks.
  }

  // TODO: add a way for hosts of this component to register "onDisconnected" 
  //       callbacks that fire when IframeProxy is removed from the DOM.
  // TODO: provide access to the iframe.contentWindow, but only through
  //       a membrane that gets revoked when IframeProxy is removed from the DOM.
}

window.customElements.define('iframe-proxy', IframeProxy);


////////////////////////////
// Hook up Action Buttons //
////////////////////////////

let elementCount = 0

document.getElementById('add-custom-element').onclick = () => {
  const container = document.getElementById('custom-element-container');
  container.appendChild(new IframeProxy(++elementCount));
}

document.getElementById('remove-all-custom-elements').onclick = () => {
  document.getElementById('custom-element-container').innerHTML = '';
  elementCount = 0;
}

document.getElementById('attempt-to-access-iframe').onclick = () => {
  console.log('TODO: attempt to access the iframe inside the custom element');
}

/////////////
// Helpers //
/////////////

function getIframe() {
  const iframe = document.createElement("iframe");
  iframe.asdfasdf = "iframe";
  iframe.style.height = "60px";
  iframe.style.backgroundColor = "darkgrey";
  iframe.srcdoc = `
    <!DOCTYPE html>
    <html>
    <body>
      <h3>Hi, I am the iframe.</h3>
    </body>
    </html>
  `;
  return iframe;
}
