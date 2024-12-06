///////////////////////////////
// Define the Custom Element //
///////////////////////////////

class IframeProxy extends HTMLElement {
  #shadowRoot;
  #iframe;
  #onDisconnectedListeners = [];

  constructor(id) {
    super();
    console.log(`${id} - constructor`);
    this.id = id;
  }

  /**
   * This lifecycle method is called each time the element is added to the document. 
   * The specification recommends that, as far as possible, developers should implement 
   * custom element setup in this callback rather than the constructor. 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks
   */
  connectedCallback() {
    console.log(`${this.id} - connectedCallback`);
    this.#iframe = getIframe();
    this.#shadowRoot = this.attachShadow({mode: 'closed'});
    this.#shadowRoot.innerHTML = `Iframe Proxy ${this.id}`;
    this.#shadowRoot.appendChild(this.#iframe);
  }

  /**
   * This lifecycle method is  called each time the element is removed from the document. 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks
   */
  disconnectedCallback() {
    console.log(`${this.id} - disconnectedCallback`);
    this.#shadowRoot.removeChild(this.#iframe);
    this.#shadowRoot = undefined;
    this.#iframe = undefined;
    this.#onDisconnectedListeners.forEach(callback => callback());
    this.#onDisconnectedListeners = [];
  }

  addOnDisconnectedListener(listener) {
    this.#onDisconnectedListeners.push(listener);
  }

  get contentWindow() {
    // TODO: when membranes are enabled, we would wrap contentWindow in one (and revoke it in disconnectedCallback).
    return this.#iframe.contentWindow;
  }

}

window.customElements.define('iframe-proxy', IframeProxy);


////////////////////////////
// Hook up Action Buttons //
////////////////////////////

let elementCount = 0

document.getElementById('add-custom-element').onclick = () => {
  const container = document.getElementById('custom-element-container');
  const iframeProxy = new IframeProxy(++elementCount);
  // We can register events that will reliably fire when the iframe is removed from the DOM.
  iframeProxy.addOnDisconnectedListener(() => console.log(`iframeProxy ${iframeProxy.id} was removed from the DOM`));
  container.appendChild(iframeProxy);
}

document.getElementById('remove-all-custom-elements').onclick = () => {
  document.getElementById('custom-element-container').innerHTML = '';
  elementCount = 0;
}

document.getElementById('attempt-to-access-iframe').onclick = () => {
  // It is impossible to access the iframe element directly from the outside:
  const iframeProxy1 = document.getElementById('custom-element-container').firstChild;
  console.log(`iframeProxy.shadowRoot is ${iframeProxy1.shadowRoot}`); // <-- this is null
  console.log(`iframeProxy.firstChild is ${iframeProxy1.firstChild}`); // <-- this is null
  console.log(`iframeProxy.children.length is ${iframeProxy1.children.length}`); // <-- this is 0
  // this will throw a SyntaxError immediately on load (even before this function is run).
  // iframeProxy1.#shadowRoot
}

/////////////
// Helpers //
/////////////

function getIframe() {
  const iframe = document.createElement("iframe");
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
