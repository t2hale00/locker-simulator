
function LockerSelect({ selectedLocker, handleLockerSelect }) {

  return (
    <div >
   
   <label htmlFor="dropdown">Select Locker:</label>
      <select id="dropdown" value={selectedLocker} onChange={handleLockerSelect}>
        <option value="">-- Select --</option>
        <option value="Locker1">Locker1</option>
        <option value="Locker2">Locker2</option>
        <option value="Locker3">Locker3</option>
        <option value="Locker4">Locker4</option>
        <option value="Locker5">Locker5</option>
      </select>

      {selectedLocker && (
        <p>You selected: {selectedLocker}</p>
      )}
      
    </div>
  );
}

export default LockerSelect;

