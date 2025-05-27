
import './App.css';
import { Route , Routes , BrowserRouter} from 'react-router-dom';
//import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Signup from './components/Signup';
import Order from './pages/Order';
import Menu from './pages/Menu';
import Company from './pages/Company';


function App() {
  return (
    
    <BrowserRouter>
    <div    >
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/home" element={<Home/>} />
        <Route path="/orders" element={<Order/>} />
        <Route path="/Menu" element={<Menu/>} />
        <Route path="/Company" element={<Company/>} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;