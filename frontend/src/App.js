
import './App.css';
import  CodePanel from './components/CodePanel';
import LockerSelect from './components/LockerSelect';

function App() {
  return (
    <div className="App">
      <h1>Parcel touchscreen simulator</h1>
      <LockerSelect/>
     <CodePanel/>
     
    </div>
  );
}

export default App;
