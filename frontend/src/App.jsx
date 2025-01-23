import {BrowserRouter,Routes,Route} from 'react-router-dom';
import {LoginPage,SignupPage,Home} from './Routes.jsx'

import './App.css';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage/>}/>
    </Routes>
    </BrowserRouter>
 
  );
}

export default App;