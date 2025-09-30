class FingerprintEditorPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        /* Hier kannst du dein CSS für das Panel einfügen */
        .content {
          padding: 16px;
        }
        button {
          margin-top: 8px;
        }
      </style>
      <div class="content">
        <h1>Fingerprint Editor</h1>
        <div>
          <h2>Neuen Fingerabdruck hinzufügen</h2>
          <input type="text" id="fingerprintName" placeholder="Name des Fingers (z.B. John Doe Zeigefinger)">
          <button id="addFingerprint">Hinzufügen</button>
        </div>
        <div>
          <h2>Bestehende Fingerabdrücke</h2>
          </div>
      </div>
    `;

    this.shadowRoot.getElementById('addFingerprint').addEventListener('click', () => {
      const fingerprintName = this.shadowRoot.getElementById('fingerprintName').value;
      if (fingerprintName) {
        this.addFingerprint(fingerprintName);
      }
    });
  }

  addFingerprint(name) {
    // Hier wird der Home Assistant Service aufgerufen
    this._hass.callService('esphome', 'dein_fingerprint_sensor_enroll', {
      finger_id: 1, // Dies müsstest du dynamisch verwalten
      num_scans: 2,
    }).then(() => {
        alert(`Fingerabdruck für ${name} wird jetzt gescannt.`);
    });
  }
}

customElements.define('fingerprint-editor-panel', FingerprintEditorPanel);
