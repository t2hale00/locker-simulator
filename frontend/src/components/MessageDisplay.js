import React from "react";

const MessageDisplay = ({ message, doneText, handleComplete }) => {
  return (
    <div>
      <h1>{message}</h1>
      {doneText !== "" && <button className="completebutton" onClick={handleComplete}>{doneText}</button>}
    </div>
  );
};

export default MessageDisplay;
