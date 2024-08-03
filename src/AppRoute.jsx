import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from './App'
import Login from './Login'

const AppRoute = ()=>{
    return(
    <Router>
        <Routes>
            <Route path="/" element={<App/>}></Route>
            <Route path="/Login" element={<Login/>}></Route>
        </Routes>
    </Router>)
}

export default AppRoute