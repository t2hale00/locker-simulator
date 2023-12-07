
function LockerSelect({ selectedLocker, handleLockerSelect }) {

  return (
    <div >
   
   <label htmlFor="dropdown">Select Locker:</label>
      <select id="dropdown" value={selectedLocker} onChange={handleLockerSelect}>
        <option value="">-- Select --</option>
        <option value="1">Prisma Linnanmaa Oulu</option>
        <option value="2">Prisma Limingantulli Oulu</option>
        <option value="3">Prisma Raksila Oulu</option>
        <option value="4">K-Citymarket Oulu Rusko</option>
        <option value="5">K-Citymarket Oulu Raksila</option>
      </select>

      {/* {selectedLocker && (
        <p>You selected: {selectedLocker}</p>
      )} */}
      
    </div>
  );
}

export default LockerSelect;

