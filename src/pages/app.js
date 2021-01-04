import React from "react"
import { Router } from "@reach/router"
import Home from "../components/Home"
import Login from "../components/Login"
import PrivateRoute from "../components/PrivateRoute"
import NewGroup from '../components/NewGroup'
import Group from "../components/Group"

const App = () => (
    <Router>
        <PrivateRoute path="/app/home" component={Home} />
        <Login path="/app/login" />
        <NewGroup path="app/newg" />
        <Group path="/app/group/:groupId" />
    </Router>
)

export default App