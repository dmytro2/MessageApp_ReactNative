import React, {Component} from 'react';
import { StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import Constants from '../constants/Constants';

// import registerForPushNotificationsAsync from '../api/registerForPushNotificationsAsync';


export const RootStackNavigatorLogined = StackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
    },
    Login: {
      screen: LoginScreen
    },
    SignUp: {
      screen: SignUpScreen
    },
  },{
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }),
    headerMode:'none',
  }
);

export const RootStackNavigatorNotLogined = StackNavigator(
  {
    Login: {
      screen: LoginScreen
    },
    Main: {
      screen: MainTabNavigator,
    },
    SignUp: {
      screen: SignUpScreen
    },
  },{
    navigationOptions: () => ({
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }),
    headerMode:'none',
  }
);


