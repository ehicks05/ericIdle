import {Button} from "@/components/ui/button";
import { useEffect, useState } from "react";
import * as gameLogic from "../misc/game.js";

export function exportState(state) {
  return btoa(JSON.stringify(state));
}

export function importState(state, updateGame) {
  updateGame((_draft) => JSON.parse(atob(state)));
}

const Settings = ({ game, updateGame, perf }) => {
  const [copyButtonLabel, setCopyButtonLabel] = useState("Export");
  const [importText, setImportText] = useState("");
  const [isImportTextValid, setIsImportTextValid] = useState(false);

  useEffect(() => {
    if (copyButtonLabel === 'Copied')
      setTimeout(() => setCopyButtonLabel("Export"), 1500);
  }, [copyButtonLabel]);

  const handleReset = () => {
    if (window.confirm("Are you sure you? All progress will be lost.")) {
      importState(exportState(gameLogic.getDefaultGameState()), updateGame);
    }
  };

  const handleImport = () => {
    importState(importText, updateGame);
    setImportText("");
  };

  async function handleCopy () {
    await navigator.clipboard.writeText(exportState(game));
    setCopyButtonLabel("Copied")
  }

  const handleTextInputChange = (text) => {
    try {
      setImportText(text);
      JSON.parse(atob(text));
      setIsImportTextValid(true);
    } catch (e) {
      setIsImportTextValid(false);
    }
  }

  const tickTimes = `${(
    perf.recent.reduce((agg, cur) => agg + cur, 0) / perf.recent.length
  ).toFixed(2)} ms (max: ${perf.max} ms)`;

  return (
    <>
      <h1 className="subtitle mt-4">Import/Export/Reset</h1>
      <textarea
        className="w-full bg-muted"
        placeholder="Paste save here..."
        value={importText}
        onChange={(e) => handleTextInputChange(e.target.value)}
      />
      <div className="mt-4 space-x-2">
        <Button
          variant="secondary"
          disabled={!importText || !isImportTextValid}
          onClick={handleImport}
        >
          {isImportTextValid ? 'Import' : 'Invalid Save'}
        </Button>
        <Button variant="secondary" onClick={handleCopy}>
          {copyButtonLabel}
        </Button>
        <Button variant="destructive" onClick={handleReset}>Reset</Button>
      </div>
      <h1 className="subtitle mt-4">Debug Info</h1>
      <p>Tick times: {tickTimes}</p>
      State:{" "}
      <div className="flex flex-wrap gap-4">
        {Object.entries(game).map(([k, v]) => (
          <pre key={k} className="p-4 text-xs bg-muted">
            {k}: {JSON.stringify(v, null, 2)}
          </pre>
        ))}
      </div>
    </>
  );
};

export default Settings;
