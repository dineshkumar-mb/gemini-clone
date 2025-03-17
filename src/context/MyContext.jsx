import { createContext, useState } from "react";
import runChat from "../config/gemini.js";

 export const MyContext = createContext(null);

  export const MyContextProvider =({children}) => {

  const [input,setInput] = useState("");
  const[recentPrompt,setRecentPrompt] = useState("");
  const [prevPrompts,setPrevPrompts] =useState([]);
  const [showResult,setShowResult] = useState(false);
  const [loading,setLoading] = useState(false);
  const [resultData,setResultData] = useState("");  

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
        setResultData((prev) => prev + nextWord);
    }, 50 * index); // Faster typing speed for a smoother effect
};

const newChat = ()=>{
    setLoading(false)
    setShowResult(false)
}

const onSent = async (prompt) => {
    setResultData(""); // Clear previous result once
    setLoading(true);
    setInput(""); 

    const promptToUse = prompt || input;
    setRecentPrompt(promptToUse);
    setPrevPrompts((prev) => [...prev, promptToUse]);

    try {
        let fullResponse = ""; // Store entire response for progressive updates

        await runChat(promptToUse, (chunk) => {
            fullResponse += chunk; // Accumulate incoming chunks

            // Typing effect logic
            const words = chunk.split(" ");
            words.forEach((word, index) => {
                delayPara(index + fullResponse.split(" ").length, word + " ");
            });

            setShowResult(true); // Show result area once data starts appearing
        });
    } catch (error) {
        console.error("Error:", error);
        setResultData("An error occurred.");
        setShowResult(true); 
    } finally {
        setLoading(false); 
    }
};


    const contextValue = {
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
        newChat
    }
    return (
        <MyContext.Provider value={{ prevPrompts,
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
            newChat}}>
            {children}
        </MyContext.Provider>
    )
 }

 // const onSent = async (prompt) => {
//     setResultData("");
//     setLoading(true);
//     setShowResult(true);
    
//     let response; // First 'response' declaration

//     if (prompt !== undefined) {
//         response = await runChat(prompt);
//         setRecentPrompt(prompt);
//     } else {
//         setPrevPrompts((prev) => [...prev, input]);
//         setRecentPrompt(input);
//         response = await runChat(input);
//     }

//     setRecentPrompt(input);
//     setPrevPrompts((prev) => [...prev, input]);

//     // Introduce a new scope to redeclare 'response' safely
//     {
//         const response = await runChat(input); // Second 'response' declaration in a new block
//         let responseArray = response.split("**");
//         let newResponse = "";

//         for (let i = 0; i < responseArray.length; i++) {
//             if (i === 0 || i % 2 !== 1) {
//                 newResponse += responseArray[i];
//             } else {
//                 newResponse += "<b>" + responseArray[i] + "</b>";
//             }
//         }

//         let newResponse2 = newResponse.split("*").join("</br>");
//         let newResponseArray = newResponse2.split(" ");

//         for (let i = 0; i < newResponseArray.length; i++) {
//             const nextWord = newResponseArray[i];
//             delayPara(i, nextWord + " ");
//         }

//         setResultData(newResponse2);
//     }

//     setLoading(false);
//     setInput("");
// };

//  export default ContextProvider;