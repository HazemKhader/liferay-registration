import { createRoot } from "react-dom/client";
import App from "./App";

class PublicRegistration extends HTMLElement {
  connectedCallback() {
    createRoot(this).render(<App />);
  }

  disconnectedCallback() {
    this._root?.unmount();
  }
}

const ELEMENT_ID = "public-registration-element";

if (!customElements.get(ELEMENT_ID)) {
  customElements.define(ELEMENT_ID, PublicRegistration);
}

export default PublicRegistration;
