import React, { useState } from "react";
import CodeInput from "./CodeInput";
import MessageDisplay from "./MessageDisplay";
import NumberButtons from "./NumberButtons";
import LockerSelect from "./LockerSelect";
import Axios from "axios";

const MainPanel = () => {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");
  const [doneText, setDoneText] = useState("");
  const [selectedLocker, setSelectedLocker] = useState(null);

  const handleLockerSelect = (event) => {
    setSelectedLocker(event.target.value);
  };

  const handleButtonClick = (num) => {
    setInputValue((prevValue) => prevValue + num);
  };

  const handleClear = () => {
    setInputValue("");
    setMessage("");
    setDoneText("");
  };

  const handleSubmit = () => {
    if (!selectedLocker) {
      setMessage("Please select Locker first");
    } else {
      Axios.post("http://localhost:3002/cabinets", { code: inputValue })
        .then((response) => {
          if (response.data.length > 0) {
            const cabinet = response.data[0];
            const selectedLockerAsNumber = parseInt(selectedLocker, 10);
            if (selectedLockerAsNumber !== cabinet.Locationid) {
              setMessage("You are at the incorrect locker");
            } else {
              if (cabinet.cabinetstatus === "Delivered") {
                const cabinetNumber = cabinet.CabinetNumber;
                setMessage(`Door ${cabinetNumber} open for pickup`);
                setDoneText("Close cabinet door");
              } else if (cabinet.cabinetstatus === "Reserved") {
                const cabinetNumber = cabinet.CabinetNumber;
                setMessage(`Door ${cabinetNumber} open for delivery`);
                setDoneText("Close cabinet door");
              } else {
                setMessage("Please enter correct code");
              }
            }
          } else {
            setMessage("Please enter correct code");
          }
        })
        .catch((error) => {
          console.error("Error during POST request:", error);
          setMessage("An error occurred. Please try again.");
        });
    }
  };

  const handlepickanddelivery = () => {
    Axios.post("http://localhost:3002/cabinets", { code: inputValue })
 .then((response)=>{
     const cabinet = response.data[0];
  if (cabinet.cabinetstatus === "Reserved") {
  Axios.put("http://localhost:3002/updateForDelivery", { code: inputValue })
      .then((response) => {
        // Check if the response status is 200 (OK)
        if (response.status === 200) {
          // If the update was successful, set a message
          setMessage("Thank you for using Parcel. Please enter other code for parcel delivery/pickup.");
          setDoneText("Completed");
          setInputValue("");
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          // If the response status is not 200, throw an error
          throw new Error("Failed to update status");
        }
      })
      .catch((error) => {
        // If there's an error during the request, log the error
        console.error("Error updating status:", error);
        // Handle the error appropriately (e.g., show a message to the user)
      });
  }else if(cabinet.cabinetstatus === "Delivered") {
    Axios.put("http://localhost:3002/updateForPickup", { code: inputValue })
      .then((response) => {
     
        // Check if the response status is 200 (OK)
        if (response.status === 200) {
          // If the update was successful, set a message
          setMessage("Thank you for using,enter other code to delivery/pickup");
          setDoneText("Completed");
          setInputValue("");
          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          // If the response status is not 200, throw an error
          throw new Error("Failed to update status");
        }
      })
      .catch((error) => {
        // If there's an error during the request, log the error
        console.error("Error updating status:", error);
        // Handle the error appropriately (e.g., show a message to the user)
      });
  }


 })

  };

  return (
    <div className="App">
      <LockerSelect
        selectedLocker={selectedLocker}
        handleLockerSelect={handleLockerSelect}
      />
      <CodeInput value={inputValue} />
      <MessageDisplay
        message={message}
        doneText={doneText}
        handleComplete={handlepickanddelivery}
      />
      <NumberButtons
        handleButtonClick={handleButtonClick}
        handleClear={handleClear}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default MainPanel;
