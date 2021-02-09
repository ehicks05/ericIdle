import { useEffect, useState } from "react";
import * as gameLogic from "../game.js";
import Button from "./Button";

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
      function () {
        setCopyResult("success");
      },
      function () {
        setCopyResult("error");
      }
    );
  }

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
          title={importText && !isImportTextValid ? "Invalid input" : undefined}
          disabled={!importText || !isImportTextValid}
          error={importText && !isImportTextValid}
          onClick={performImport}
        >
          Import
        </Button>
        <Button onClick={copy}>
          {`${
            copyResult === "success"
              ? "Copied"
              : copyResult === "error"
              ? "Error"
              : "Export"
          }`}
        </Button>
        <Button onClick={reset}>Reset</Button>
      </div>
      <h1 className="subtitle mt-4">Debug Info</h1>
      <p>
        Ticks/s:{" "}
        {(
          perf.recent.reduce((agg, cur) => agg + cur, 0) / perf.recent.length
        ).toFixed(2)}{" "}
        ms (max: {perf.max} ms)
      </p>
      State:{" "}
      <pre className="bg-gray-100 dark:bg-gray-800">
        {JSON.stringify(game, null, 2)}
      </pre>
    </>
  );
};

export default Settings;
