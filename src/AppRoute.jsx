import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from './App'
import Login from './Login'
import Taskboard from './Taskboard'
import TheBoard from './TheBoard'

const AppRoute = ()=>{
    return(
    <Router>
        <Routes>
            <Route path="/" element={<App/>}></Route>
            <Route path="/Login" element={<Login/>}></Route>
            <Route path="/taskboard" element={<Taskboard/>}></Route>
            <Route path="/taskboard/theboard" element={<TheBoard/>}></Route>
        </Routes>
    </Router>)
}

export default AppRoute