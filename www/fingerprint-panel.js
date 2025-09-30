class FingerprintPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // Diese Funktion wird von Home Assistant aufgerufen und übergibt das 'hass'-Objekt
  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    if (!this.shadowRoot.innerHTML) { // Nur rendern, wenn es noch leer ist
      this.shadowRoot.innerHTML = `
        <style>
          .content { padding: 24px; color: var(--primary-text-color); }
          .card { background-color: var(--card-background-color); border-radius: 8px; padding: 16px; margin-top: 16px; }
          input { width: 100%; padding: 8px; box-sizing: border-box; margin-bottom: 12px; border: 1px solid var(--primary-text-color); border-radius: 4px; }
          button { background-color: var(--primary-color); color: var(--text-primary-color); border: none; padding: 10px 16px; border-radius: 4px; cursor: pointer; }
          button:hover { opacity: 0.8; }
        </style>
        <div class="content">
          <h1>Fingerprint Manager</h1>
          <div class="card">
            <h2>Neuen Fingerabdruck anlernen</h2>
            <p>Gib den Namen deines ESPHome-Geräts und eine freie Finger-ID ein, um einen neuen Abdruck zu registrieren.</p>
            <input type="text" id="deviceName" placeholder="Name des ESPHome-Geräts (z.B. fingerprint_scanner)">
            <input type="number" id="fingerId" placeholder="Freie Finger-ID (z.B. 5)">
            <button id="enrollButton">Anlernen starten</button>
          </div>
        </div>
      `;

      // Event-Listener für den Button hinzufügen
      this.shadowRoot.getElementById('enrollButton').addEventListener('click', () => this.enrollFingerprint());
    }
  }

  enrollFingerprint() {
    const deviceName = this.shadowRoot.getElementById('deviceName').value;
    const fingerId = parseInt(this.shadowRoot.getElementById('fingerId').value, 10);

    if (!deviceName || !fingerId) {
      alert("Bitte gib einen Gerätenamen und eine Finger-ID an.");
      return;
    }

    // Ruft den ESPHome-Dienst in Home Assistant auf
    this._hass.callService('esphome', `${deviceName}_fingerprint_enroll`, {
      finger_id: fingerId,
      num_scans: 2, // Standardanzahl der Scans für die meisten Sensoren
    })
    .then(() => {
      alert(`Anlernprozess für ID ${fingerId} auf Gerät '${deviceName}' gestartet. Bitte folge den Anweisungen am Sensor (z.B. LED-Blinken).`);
    })
    .catch((error) => {
      alert(`Fehler beim Starten des Anlernprozesses: ${error.message}`);
    });
  }
}

// Definiert das Custom Element, damit Home Assistant es verwenden kann
customElements.define('fingerprint-panel', FingerprintPanel);