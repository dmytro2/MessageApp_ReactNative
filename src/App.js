import React, { Component } from 'react';
import { 
  Platform,   
} from 'react-native';

import {RootStackNavigatorLogined, RootStackNavigatorNotLogined} from './navigation/RootNavigator';
import Constants from './constants/Constants';
import store from 'react-native-simple-store';
import NotificationsIOS, {NotificationsAndroid} from 'react-native-notifications'


import Lang from './constants/LangCN';

// var PushNotification = require('react-native-push-notification');


export default class MessageApp extends Component {
  constructor(props) {
    super(props);  
    if(Platform.OS == 'ios'){
      NotificationsIOS.addEventListener('notificationReceivedForeground', this.onNotificationReceivedForeground.bind(this));
      // NotificationsIOS.addEventListener('notificationReceivedBackground', this.onNotificationReceivedBackground.bind(this));
      NotificationsIOS.addEventListener('notificationOpened', this.onNotificationOpened.bind(this));
    } else{
      NotificationsAndroid.setNotificationReceivedListener(this.onNotificationReceivedForeground.bind(this));
      NotificationsAndroid.setNotificationOpenedListener(this.onNotificationOpened.bind(this));
    }
  }

  onNotificationReceivedForeground(notification) {
    // if(Platform.OS == 'ios'){
      console.log("Notification Received - Foreground", notification);

      this.registerLocalNotification(true);
    // }
  }

  onNotificationReceivedBackground(notification) {
    // if(Platform.OS == 'ios'){
      // console.log("Notification Received - Background", notification);

      // this.registerLocalNotification();
    // }
  }

  onNotificationOpened(notification){
    // if(Platform.OS == 'ios'){
      console.log("Notification Received - Opened", notification);

      this.registerLocalNotification(false);
    // }
  }

  registerLocalNotification(isForeground) {   
    var fireTime;
    var now = new Date();
    var fireStandardHour=20;

    if(isForeground){
      fireTime = Date.now()+24*60*60*1000;
    }
    else{
      var hours = now.getHours();
      var minutes = now.getMinutes();
      var seconds = now.getSeconds();
      if(hours<20){
        fireTime=Date.now()+(fireStandardHour-1-hours)*60*60*1000+(59-minutes)*60*1000+(59-seconds)*1000;      
      } else if (hours>=20){
        fireTime = Date.now()+(fireStandardHour+23-hours)*60*60*1000+(59-minutes)*60*1000+(59-seconds)*1000;
      }

    }
    // console.log(hours+':'+minutes+':'+seconds);


    // var fireDate = Date.now()+10000;

    if(Platform.OS == 'ios'){
      let localNotification = NotificationsIOS.localNotification({
        alertBody:Lang.textLocalNotification,
        alertTitle:Lang.titleLocalNotification,
        silent:false, 
        fireDate: fireTime,
        category:'SOME_CATEGORY',
        userInfo:{}       
      })
    } else {
      let localNotification = NotificationsAndroid.localNotification({
        title: Lang.titleLocalNotification,
        body: Lang.textLocalNotification,
        // extra: "data"
        silent:false, 
        fireDate: fireTime,
        category:'SOME_CATEGORY',
        userInfo:{}       
      });

    }
  }

  componentDidMount() {
    // if(Platform.OS == 'ios'){
      this.registerLocalNotification(false);
    // } else {

    // }
    // this._notificationSubscription = this._registerForPushNotifications(); 
  }

  componentWillUnmount() {
    // this._notificationSubscription && this._notificationSubscription.remove();
  }
  render() {
    // return Constants.logined?<RootStackNavigatorLogined/>:<RootStackNavigatorNotLogined/>;
    return <RootStackNavigatorNotLogined/>;
  }

  // _registerForPushNotifications() {
  //   // Send our push token over to our backend so we can receive notifications
  //   // You can comment the following line out if you want to stop receiving
  //   // a notification every time you open the app. Check out the source
  //   // for this function in api/registerForPushNotificationsAsync.js
  //   registerForPushNotificationsAsync();

  //   // Watch for incoming notifications
  //   this._notificationSubscription = Notifications.addListener(
  //     this._handleNotification
  //   );
  // }

  // _handleNotification = ({ origin, data }) => {
  //   console.log(
  //     `Push notification ${origin} with data: ${JSON.stringify(data)}`
  //   );
  // };
};
