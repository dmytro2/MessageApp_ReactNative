'use strict';

import React from 'react';
import { 
  Platform,
  Easing,
  Image,
  Animated, 
  TouchableOpacity, 
  } from 'react-native';
import { 
  Icon,
  Button
  } from 'react-native-elements';

import { TabNavigator, StackNavigator} from 'react-navigation';

import Color from '../constants/Color';
import Lang from '../constants/LangCN';
import Constants from '../constants/Constants';


import MessageScreen from '../screens/MessageScreen';
import MessageDetail from '../screens/MessageDetail';
import SendMessageScreen from '../screens/SendMessageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';




const MessageStackNavigator = StackNavigator({
  MessageList:{
    screen: MessageScreen,
    navigationOptions: {
      title: Lang.title_msg_tab,
      headerStyle: {
        backgroundColor: Color.titleBarBgColor,
        borderBottomColor: 'transparent',
      },
      headerTintColor: 'white',
    },
  },
  MessageDetail:{
    screen: MessageDetail,
    navigationOptions:{
      title: 'Message Detail',
      headerStyle: {
        backgroundColor: '#00cd96',
      },
      headerTintColor: 'white',
    }
  },
  SendMessageScreen:{
    screen: SendMessageScreen,
    navigationOptions:{
      title: Lang.app_name,
      headerStyle: {
        backgroundColor: '#00cd96',
      },
      headerTintColor: 'white',
    }
  },
},{
  headerMode: 'screen',
});


const ProfileSettingStackNavigator = StackNavigator({
  Profile:{
    screen: ProfileScreen,
  },
  Setting:{
    screen: SettingScreen,
    navigationOptions:{
      title: Lang.title_setting_tab,
      headerStyle: {
        backgroundColor: Color.titleBarBgColor,
        borderColor:'transparent',
      },
      headerTintColor: Color.tintColor,
    }
  },
},{
  headerMode: 'screen',
});



const MainTabView = TabNavigator(
  {
    Message: {
	    screen: MessageStackNavigator,
	    navigationOptions: {
      	tabBarIcon: ({ tintColor }) => 
          <Icon name="message" size={45} color={tintColor} />, 
	    },
    },
    Profile: {
      screen: ProfileSettingStackNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => 
          <Icon name="account-circle" size={45} color={tintColor} />,
      },
    }
  },
  {
    animationEnabled: true,
    swipeEnabled: false,
    tabBarOptions:{
      showLabel: false,      
      activeTintColor:'#000',
      style:{
        height: 60,        
      }
    },
  }
);

export default class MainTabNavigator extends React.Component {
  componentDidMount() {    
    // this._notificationSubscription = this._registerForPushNotifications();
    Constants.rootNavigator = this.props.navigation;
  }

  // componentWillUnmount() {
  //   this._notificationSubscription && this._notificationSubscription.remove();
  // }
  render() {
    return <MainTabView />;
  }
}