import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import HoogSearch from './HoogSearch';
import SearchResults from './SearchResults';

const searchNavigator = createStackNavigator({
    HoogSearch:{screen: HoogSearch},
    SearchResults:{screen: SearchResults}
})

const searchContainer = createAppContainer(searchNavigator)

export default class ClassSearch extends Component{
    render(){
        console.log("bla bla")
        return <searchContainer/>
    }
}