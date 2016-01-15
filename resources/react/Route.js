import Main from "./components/Main" 
import Profile from "./components/Profile" 
import ChatroomList from "./components/ChatroomList"
import Chatroom from "./components/Chatroom"
import Favourite from "./components/Favourite" 
import Appointment from "./components/Appointment" 
import Info from "./components/Info"
import Login from "./components/Login"
import RequireAuth from "./middleware/RequireAuth"
import MainHalfPage from "./components/MainHalfPage"

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
var BrowserHistory = ReactRouter.browserHistory;

var routesMap = (
    <Router history={BrowserHistory}>
        <Route path="/" component={Main}>
            <IndexRoute               onEnter={RequireAuth} component={MainHalfPage} />
            <Route path="login"       component={Login} />
            <Route path="profile"     onEnter={RequireAuth} component={Profile}  />
            <Route path="favourite"   onEnter={RequireAuth} component={Favourite} />
            <Route path="chatroom"    onEnter={RequireAuth} >
                <IndexRoute  component={ChatroomList} />
                <Route path=":id" component={Chatroom} />
            </Route>
            <Route path="appointment" onEnter={RequireAuth} component={Appointment} />
            <Route path="info"        onEnter={RequireAuth} component={Info} />
        </Route>
    </Router>
);

if(typeof __SERVER === 'object') {
    __SERVER.routesMap = routesMap;
}

export default routesMap;