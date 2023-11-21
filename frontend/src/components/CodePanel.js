import React, { useState } from "react";
import CodeInput from "./CodeInput";
import MessageDisplay from "./MessageDisplay";
import NumberButtons from "./NumberButtons";

const  CodePanel= () => {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [doneText, setDoneText] = useState("");
  const code = "1234";

  const handleButtonClick = (num) => {
    setInputValue((prevValue) => prevValue + num);
  };

  const handleClear = () => {
    setInputValue("");
    setMessage("");
    setDoneText("");
  };

  const handleSubmit = () => {
    if (inputValue === code) {
      setMessage("cabinet is opened");
      setDoneText("complete");
    } else {
      setMessage("please enter correct code");
    }
  };

  const handleComplete = () => {
    setMessage("thank you for using");
    setDoneText("completed");
  };

  return (
    <div className="App">
      <CodeInput value={inputValue} />
      <MessageDisplay
        message={message}
        doneText={doneText}
        handleComplete={handleComplete}
      />
      <NumberButtons
        handleButtonClick={handleButtonClick}
        handleClear={handleClear}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default CodePanel;
