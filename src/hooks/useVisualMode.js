import React, {useState, useEffect} from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

useEffect(() => {
}, [history]);

  function transition(mode, replace = false) {
    if (!replace) {
      setMode(mode);
      setHistory([...history, mode]);
    } else {
      setMode(mode);
      setHistory(history.slice(0,history.length - 1))
    }
    
  };

  function back() {
    // let [first, ...rest] = history;
    if (history.length > 1) {
      setHistory(history.slice(0,history.length - 1));
      setMode(history[history.length - 2]);
    } else {
      setMode(history[0])
    }

   }

  return { mode, transition, back };
};
