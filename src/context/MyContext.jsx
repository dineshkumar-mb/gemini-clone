import { createContext, useState } from "react";
import runChat from "../gemini.js";
export const MyContext = createContext(null);
export const MyContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [buffer, setBuffer] = useState(""); // Stores partial lines for smoother display

  /**
   * Dynamically delays each line based on its length.
   * Ensures text appears progressively for a better user experience.
   */
  const delayLine = (index, line) => {
    const delayTime = Math.min(50 * line.length, 1000); // Faster for short lines, capped at 1 sec
    setTimeout(() => {
      setResultData((prev) => prev + line + "\n"); // Append line properly
    }, index * delayTime);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setBuffer(""); // Clear buffer for new session
  };

  const onSent = async (prompt) => {
    setResultData(""); // Clear old result before processing
    setLoading(true);
    setInput("");

    const promptToUse = prompt || input;
    setRecentPrompt(promptToUse);
    setPrevPrompts((prev) => [...prev, promptToUse]);

    try {
      let fullResponse = "";
      let partialBuffer = ""; // Holds incomplete lines

      await runChat(promptToUse, (chunk) => {
        fullResponse += chunk;

        // Process text line by line while handling partial lines
        const lines = (partialBuffer + chunk).split("\n");
        partialBuffer = lines.pop(); // Store last unfinished line in buffer

        lines.forEach((line, index) => {
          if (line.trim()) {
            delayLine(fullResponse.split("\n").length + index, line);
          }
        });

        setBuffer(partialBuffer);
        setShowResult(true);
      });

      // If there's any remaining buffer after the stream, display it
      if (buffer.trim()) {
        delayLine(fullResponse.split("\n").length, buffer);
      }
    } catch (error) {
      console.error("Error:", error);
      setResultData("An error occurred.");
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyContext.Provider
      value={{
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        setLoading,
        resultData,
        setResultData,
        setShowResult,
        input,
        setInput,
        newChat,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
