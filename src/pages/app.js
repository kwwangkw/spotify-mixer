import React from "react"
import { Router } from "@reach/router"
import Home from "../components/Home"
import Login from "../components/Login"
import PrivateRoute from "../components/PrivateRoute"
import NewGroup from "../components/NewGroup"
import Group from "../components/Group"

const App = () => (
    <Router>
        <PrivateRoute path="/app/home" component={Home} />
        <PrivateRoute path="/app/newg" component={NewGroup} />
        <PrivateRoute path="/app/group/:groupId" component={Group} />
        <Login path="/app/login" />
    </Router>
)

export default App