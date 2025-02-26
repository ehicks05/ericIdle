import {Button} from "@/components/ui/button";
import { useEffect, useState } from "react";
import * as gameLogic from "../misc/game.js";

const Settings = ({ game, updateGame, perf }) => {
  const [copyResult, setCopyResult] = useState("unknown");
  const [importText, setImportText] = useState("");
  const [isImportTextValid, setIsImportTextValid] = useState(false);

  useEffect(() => {
    if (["success", "error"].includes(copyResult))
      setTimeout(() => setCopyResult("unknown"), 1500);
  }, [copyResult]);

  useEffect(() => {
    try {
      JSON.parse(atob(importText));
      setIsImportTextValid(true);
    } catch (e) {
      setIsImportTextValid(false);
    }
  }, [importText]);

  function exportState(state) {
    return btoa(JSON.stringify(state));
  }

  function importState(state) {
    updateGame((_draft) => JSON.parse(atob(state)));
  }

  const reset = () => {
    if (window.confirm("Are you sure you? All progress will be lost.")) {
      importState(exportState(gameLogic.getDefaultGameState()));
    }
  };

  const performImport = () => {
    importState(importText);
    setImportText("");
  };

  function copy() {
    updateClipboard(exportState(game));
  }

  function updateClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(
      () => {
        setCopyResult("success");
      },
      () => {
        setCopyResult("error");
      }
    );
  }

  const tickTimes = `${(
    perf.recent.reduce((agg, cur) => agg + cur, 0) / perf.recent.length
  ).toFixed(2)} ms (max: ${perf.max} ms)`;

  return (
    <>
      <h1 className="subtitle mt-4">Import/Export/Reset</h1>
      <textarea
        className="w-full text-black dark:text-white bg-gray-100 dark:bg-gray-800"
        placeholder="Paste save here..."
        value={importText}
        onChange={(e) => setImportText(e.target.value)}
      />
      <div className="mt-4 space-x-2">
        <Button
          variant="secondary"
          title={importText && !isImportTextValid ? "Invalid input" : undefined}
          disabled={!importText || !isImportTextValid}
          error={importText && !isImportTextValid}
          onClick={performImport}
        >
          Import
        </Button>
        <Button variant="secondary" onClick={copy}>
          {`${
            copyResult === "success"
              ? "Copied"
              : copyResult === "error"
              ? "Error"
              : "Export"
          }`}
        </Button>
        <Button variant="destructive" onClick={reset}>Reset</Button>
      </div>
      <h1 className="subtitle mt-4">Debug Info</h1>
      <p>Tick times: {tickTimes}</p>
      State:{" "}
      <div className="flex flex-wrap gap-4">
        {Object.entries(game).map(([k, v]) => (
          <pre key={k} className="p-4 text-xs">
            {k}: {JSON.stringify(v, null, 2)}
          </pre>
        ))}
      </div>
    </>
  );
};

export default Settings;
