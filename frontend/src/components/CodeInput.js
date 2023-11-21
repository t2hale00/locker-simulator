import React from "react";

const CodeInput = ({ value }) => {
  return (
    <div>
      <h2>enter code</h2>
      <input type="text" value={value} readOnly />
    </div>
  );
};

export default CodeInput;
