
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import SignIn from "./components/SignIn/SignIn";
import Home from "./components/Home/Home";
import CalendarView from "./components/Calendar/Calendar";
import Feed from "./components/Feed/Feed";
import AuthLoadingScreen from "./AuthLoadingScreen";

const AppStack = createStackNavigator(
    {
        Home: Home,
        Calander: CalendarView,
        Feed: Feed
    },
    {
        initialRouteName: 'Home',
    }
);

const AuthStack = createStackNavigator(
    {
        SignIn: SignIn
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