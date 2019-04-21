
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import SignIn from "./components/SignIn/SignIn";
import Home from "./components/Home/Home";
import CalendarView from "./components/Calendar/Calendar";
import Feed from "./components/Feed/Feed";
import AuthLoadingScreen from "./AuthLoadingScreen";
import HoogSearch from './components/Search/HoogSearch';
import SearchResults from './components/Search/SearchResults';
import SignUpView from "./components/SignUp/SignUpView";
import MyChildrenView from "./components/Children/MyChildrenView";
import EventDetails from "./components/Calendar/EventDetails";

const AppStack = createStackNavigator(
    {
        Home: Home,
        Calendar: CalendarView,
        Feed: Feed,
        HoogSearch: HoogSearch,
        SearchResults: SearchResults,
        MyChildren: MyChildrenView,
        EventDetails: EventDetails
    },
    {
        initialRouteName: 'Home',
    }
);

const AuthStack = createStackNavigator(
    {
        SignIn: SignIn,
        SignUp: SignUpView
    },
    {
        initialRouteName: 'SignIn',
    }
);

const RootStack = createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
);

const AppContainer = createAppContainer(RootStack);

export default AppContainer