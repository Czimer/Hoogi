
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

import SignIn from "./components/SignIn/SignIn";
import Home from "./components/Home/Home";
import CalendarView from "./components/Calendar/Calendar";
import Feed from "./components/Feed/Feed";
import AuthLoadingScreen from "./AuthLoadingScreen";
import SignUpView from "./components/SignUp/SignUpView";

const AppStack = createStackNavigator(
    {
        Home: Home,
        Calender: CalendarView,
        Feed: Feed
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