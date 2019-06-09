
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';
import SignIn from "./components/SignIn/SignIn";
import Home from "./components/Home/Home";
import CalendarView from "./components/Calendar/Calendar";
import FeedContainer from "./components/Feed/FeedContainer";
import AuthLoadingScreen from "./AuthLoadingScreen";
import HoogSearch from './components/Search/HoogSearch';
import SearchResults from './components/Search/SearchResults';
import SignUpView from "./components/SignUp/SignUpView";
import MyChildrenView from "./components/Children/MyChildrenView";
import EventDetails from "./components/Event/EventDetails";
import Event from './components/Event/Event';
import ChildDetailsComponent from "./components/Children/ChildDetailsComponent";
import ContactsList from './components/Lists/ContactsList';
import GroupList from './components/Lists/GroupsList';
import HoogsList from './components/Lists/HoogsList';
import Settings from './components/Settings/Settings';

const AppStack = createStackNavigator(
    {
        Home: Home,
        Calendar: CalendarView,
        Feed: FeedContainer,
        HoogSearch: HoogSearch,
        SearchResults: SearchResults,
        MyChildren: MyChildrenView,
        EventDetails: EventDetails,
        Event: Event,
        ContactsList: ContactsList,
        GroupList: GroupList,
        HoogsList: HoogsList,
        Settings: Settings,
        ChildDetails:ChildDetailsComponent
    },
    {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            headerStyle: {
              backgroundColor: '#284bc7',
            }
        }
    }
);

const AuthStack = createStackNavigator(
    {
        SignIn: SignIn,
        SignUp: SignUpView
    },
    {
        initialRouteName: 'SignIn',
        defaultNavigationOptions: {
            headerStyle: {
              backgroundColor: '#284bc7',
            }
        }
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
        defaultNavigationOptions: {
            headerStyle: {
              backgroundColor: '#284bc7',
            }
        }
    }
);

const AppContainer = createAppContainer(RootStack);

export default AppContainer