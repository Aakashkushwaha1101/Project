
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx';
import './index.css'
// import POC_App from './POC/Routing_App.jsx';
// import Routing_App from './POC/Routing_App.jsx';
// import User from './POC/useEffect/User.jsx';
import PropDrilling from './Example/ContextApi/PropDrilling.js';


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        
        <App></App>
        {/* <Routing_App/> */}
        {/* <User></User> */}
        {/* <PropDrilling/> */}

    </BrowserRouter>
);

