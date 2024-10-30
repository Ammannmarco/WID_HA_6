// Imports
import { useState } from "react"; // React-Hook zum Verwalten von State in einer Funktion
import {
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material"; // Material-UI-Komponenten für UI-Design und Layout

// API-URLs für die Swisstopo-API zum Transformieren zwischen WGS84 und LV95 Koordinatensystemen
const URL_WGS84_NACH_LV95 = "https://geodesy.geo.admin.ch/reframe/wgs84tolv95";
const URL_LV95_NACH_WGS84 = "https://geodesy.geo.admin.ch/reframe/lv95towgs84";

// Hauptfunktion
function KoordinatenTransformation() {
  // State-Variablen zum Speichern von Benutzer-Eingaben, Ergebnissen und Fehlern
  const [dienst, setDienst] = useState("LV95_NACH_WGS84"); // Auswahl des Transformationsdienstes
  const [ostwert, setOstwert] = useState(""); // Benutzer-Eingabe für Ostwert
  const [nordwert, setNordwert] = useState(""); // Benutzer-Eingabe für Nordwert
  const [transformierteX, setTransformierteX] = useState(""); // Transformierter X-Wert
  const [transformierteY, setTransformierteY] = useState(""); // Transformierter Y-Wert
  const [fehler, setFehler] = useState(null); // Fehlermeldung, falls ein Fehler auftritt

  // Funktion, die aufgerufen wird, wenn der Benutzer den Transformationsdienst wechselt
  const handleDienstWechsel = (event) => {
    setDienst(event.target.value); // Aktualisiert den `dienst` State mit dem ausgewählten Wert
  };

  // Funktion, die beim Klicken auf den "Transformieren"-Button ausgeführt wird
  const handleTransformation = async () => {
    // Überprüfung, ob sowohl Ostwert als auch Nordwert eingegeben wurden
    if (!ostwert || !nordwert) {
      setFehler("Bitte geben Sie sowohl Ost- als auch Nordwert ein."); // Setzt eine Fehlermeldung, wenn Felder leer sind
      return; // Beendet die Funktion, falls Eingaben fehlen
    }

    setFehler(null); // Löscht vorherige Fehlermeldungen, falls vorhanden

    // Auswahl der URL basierend auf dem aktuell ausgewählten Transformationsdienst
    const url =
      dienst === "LV95_NACH_WGS84" ? URL_LV95_NACH_WGS84 : URL_WGS84_NACH_LV95;

    try {
      // Anfrage an die Swisstopo-API, wobei die Koordinaten als Parameter übergeben werden
      const antwort = await fetch(
        `${url}?easting=${ostwert}&northing=${nordwert}&format=json`
      );

      // Überprüfung, ob die API-Antwort erfolgreich war
      if (!antwort.ok) {
        setFehler(
          "Fehler bei der Transformation. Bitte versuchen Sie es erneut."
        ); // Setzt Fehlermeldung, falls die Anfrage fehlschlägt
        return; // Beendet die Funktion bei fehlerhafter Antwort
      }

      // Verarbeitet die JSON-Antwort der API
      const daten = await antwort.json();
      setTransformierteX(daten.easting); // Aktualisiert den `transformierteX` State mit dem neuen X-Wert
      setTransformierteY(daten.northing); // Aktualisiert den `transformierteY` State mit dem neuen Y-Wert
    } catch (error) {
      // Fehlerbehandlung für allgemeine Netzwerk- oder API-Fehler
      setFehler(
        "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."
      );
    }
  };

  // Rückgabewert (UI-Rendering)
  return (
    // Material-UI Container-Komponente für zentriertes Layout und Begrenzung der Breite
    <Container maxWidth="sm">
      {/* Stack-Komponente für vertikale Anordnung und Abstand zwischen den Elementen */}
      <Stack spacing={4} sx={{ mt: 5 }}>
        {/* Titel der Anwendung */}
        <Typography variant="h4" align="center">
          Koordinatentransformation
        </Typography>

        {/* Dropdown für Dienstwahl */}
        {/* Auswahlfeld für den Transformationsdienst */}
        <FormControl fullWidth variant="outlined">
          <InputLabel>REFRAME Dienst</InputLabel>
          <Select
            value={dienst} // Aktueller Wert des ausgewählten Dienstes
            onChange={handleDienstWechsel} // Event-Handler zum Wechseln des Dienstes
            label="REFRAME Dienst" // Label, das in der Select-Komponente angezeigt wird
          >
            {/* Auswahlmöglichkeiten für den Transformationsdienst */}
            <MenuItem value="LV95_NACH_WGS84">LV95 nach WGS84</MenuItem>
            <MenuItem value="WGS84_NACH_LV95">WGS84 nach LV95</MenuItem>
          </Select>
        </FormControl>

        {/* Eingabefeld für Koordinaten */}
        {/* Eingabefelder für Ostwert und Nordwert in einer horizontalen Anordnung */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Ostwert" // Beschriftung des Textfelds
            variant="outlined" // Stil des Textfelds (mit Rahmen)
            value={ostwert} // Der aktuelle Wert des Ostwertes
            onChange={(e) => setOstwert(e.target.value)} // Aktualisiert den `ostwert` State bei Änderung
            fullWidth // Füllt die gesamte Breite des Containers aus
          />
          <TextField
            label="Nordwert" // Beschriftung des Textfelds
            variant="outlined" // Stil des Textfelds (mit Rahmen)
            value={nordwert} // Der aktuelle Wert des Nordwertes
            onChange={(e) => setNordwert(e.target.value)} // Aktualisiert den `nordwert` State bei Änderung
            fullWidth // Füllt die gesamte Breite des Containers aus
          />
        </Stack>

        {/* Transformieren Button */}
        {/* Button, der die Transformation durchführt */}
        <Button
          variant="contained" // Stil des Buttons (ausgefüllt)
          color="primary" // Farbe des Buttons (primär)
          onClick={handleTransformation} // Event-Handler für den Button-Klick
          fullWidth // Der Button füllt die gesamte Breite des Containers aus
        >
          Transformieren {/* Text, der auf dem Button angezeigt wird */}
        </Button>

        {/* Fehlermeldung */}
        {/* Anzeige einer Fehlermeldung, falls im State `fehler` ein Text enthalten ist */}
        {fehler && <Typography color="error">{fehler}</Typography>}

        {/* Ausgabe transformierte Koordinaten */}
        {/* Anzeige der transformierten X- und Y-Werte in schreibgeschützten Textfeldern */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Transformiertes X" // Beschriftung des Textfelds
            variant="outlined" // Stil des Textfelds
            value={transformierteX} // Transformierter X-Wert aus dem State
            InputProps={{ readOnly: true }} // Textfeld ist schreibgeschützt
            fullWidth // Füllt die gesamte Breite des Containers aus
          />
          <TextField
            label="Transformiertes Y" // Beschriftung des Textfelds
            variant="outlined" // Stil des Textfelds
            value={transformierteY} // Transformierter Y-Wert aus dem State
            InputProps={{ readOnly: true }} // Textfeld ist schreibgeschützt
            fullWidth // Füllt die gesamte Breite des Containers aus
          />
        </Stack>
      </Stack>
    </Container>
  );
}

// Export der Komponente
// Exportiert die Komponente zur Verwendung in anderen Teilen der Anwendung
export default KoordinatenTransformation;
