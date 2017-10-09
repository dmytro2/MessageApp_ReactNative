'use-strict';

import React, {Component} from 'react';
import {
  Platform,
  Linking,
  ScrollView,
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image, 
} from 'react-native';

import { List} from 'react-native-elements';
import Button from 'apsl-react-native-button';

import {ReceivedMessageItem, SentMessageItem, FavouriteMessageItem} from '../component/MessageItem';


import Lang from '../constants/LangCN';
import Color from '../constants/Color';
import Constants from '../constants/Constants';

import store from 'react-native-simple-store';

export default class MessageScreen extends Component {
  arrayMessages = [];
  arrayMessagesSent = [];

  constructor(props) {
    super(props);  
    this.state = {index : 1};
  }

  
  componentDidMount() {

    // Save Message Screen's Handler to use in other views
    Constants.messageScreen = this;

    /// Start of Code Added for Deep Linking

    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', this.handleOpenURL);
    } 
    else if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        if(url)
          this.navigate(url);
        else
          return;
      });
    }

    /// End of Code Added for Deep Linking


  }


  componentWillUnmount() {
    /// Start of Code Added for Deep Linking

    Linking.removeEventListener('url', this.handleOpenURL);

    /// End of Code Added for Deep Linking

  }

  /// Start of Code Added for Deep Linking

  handleOpenURL = (event) => {
    this.navigate(event.url);
  }


  navigate = (url) => {
    // url: appname://[user_name_to]/[user_id_to]
    // eg: amsgapp://59b1fa663609fe11a0c75e79/test%20er%2022
    const { navigate } = this.props.navigation;

    const route = url.replace(/.*?:\/\//g, '');
    const name = route.match(/\/([^\/]+)\/?$/)[1];
    const id = route.split('/')[0];
    const user_name_to = name.replace(/%20/g,' ');
    // if (routeName === 'people') {
    navigate('SendMessageScreen', { user_id_to: id, user_name_to: user_name_to , user_id_from: Constants.jsonUser._id})
    // };
  }

  /// End of Code Added for Deep Linking




  

  openMessageDetail = (message) => {};

  openSendingMessage = (message) => {
      // this.props.navigation
      this.props.navigation.navigate('SendMessageScreen',message);
  };

  onPressReceived = () => {  
    store.get('UserInfo')
    .then (user=>{
      let url = Constants.serverUrl+'/feed/'+user._id;
      try{
        fetch(url)
        .then((res)=>res.json())
        .then((resJson) => {
          if(resJson.success){
            Constants.jsonMessageReceived = Constants.getSortMessageByDate(resJson.message);
            this.setState({index : 1});
            store.save('MessageReceived', resJson.message);
          }
          // else
          //   alert(Lang.textErrorMessage)
        });

      } catch(e){
        console.log(e);
      } 

    })

    
  };
  onPressSent = () => {    
    store.get('UserInfo')
    .then (user=>{
      let url = Constants.serverUrl+'/getMessageSent/'+user._id;
      try{
        fetch(url)
        .then((res)=>res.json())
        .then((resJson) => {
          if(resJson.success){            
            this.arrayMessagesSent = Constants.getSortMessageByDate(resJson.message);        
            this.setState({index : 2});
            store.save('MessageSent', resJson.message);
          }
          // else
          //   alert(Lang.textErrorMessage)
        });

      } catch(e){
        console.log(e);
      } 
    })

  };
  onPressFavourite = () => {
    this.setState({index : 3});
  };

  renderMessageButton() {
    switch(this.state.index) {
      case 1:
       return <ImageBackground 
        source={require('../../res/image/cn/msgBtns1.png')} 
        style={styles.button_container}>
          <Button style={styles.btn_received} textStyle={styles.titleActive} onPress={this.onPressReceived}>{Lang.titleButtonReceived}</Button>
          <Button style={styles.btn_sent} textStyle={styles.titleInactive} onPress={this.onPressSent}>{Lang.titleButtonSent}</Button>
          <Button style={styles.btn_favourite} textStyle={styles.titleInactive} onPress={this.onPressFavourite}>{Lang.titleButtonFavourite}</Button>
        </ImageBackground>;
      case 2:
       return <ImageBackground 
        source={require('../../res/image/cn/msgBtns2.png')} 
        style={styles.button_container}>
          <Button style={styles.btn_received} textStyle={styles.titleInactive} onPress={this.onPressReceived}>{Lang.titleButtonReceived}</Button>
          <Button style={styles.btn_sent} textStyle={styles.titleActive} onPress={this.onPressSent}>{Lang.titleButtonSent}</Button>
          <Button style={styles.btn_favourite} textStyle={styles.titleInactive} onPress={this.onPressFavourite}>{Lang.titleButtonFavourite}</Button>
        </ImageBackground>;
      case 3:
       return <ImageBackground 
        source={require('../../res/image/cn/msgBtns3.png')} 
        style={styles.button_container}>
          <Button style={styles.btn_received} textStyle={styles.titleInactive} onPress={this.onPressReceived}>{Lang.titleButtonReceived}</Button>
          <Button style={styles.btn_sent} textStyle={styles.titleInactive} onPress={this.onPressSent}>{Lang.titleButtonSent}</Button>
          <Button style={styles.btn_favourite} textStyle={styles.titleActive} onPress={this.onPressFavourite}>{Lang.titleButtonFavourite}</Button>
        </ImageBackground>;
    }
  };

  renderMessageList() {
        let arrayMessages = [];
        switch(this.state.index) {
          case 1: 
            arrayMessages = Constants.jsonMessageReceived;
            if(arrayMessages.length)
              return <List style = {styles.message_list}>{
                  arrayMessages.map((message) => (
                    (!message._id)?(null):<ReceivedMessageItem
                      key={message._id}       
                      id={message._id}          
                      text={message.text}
                      time={message.timestamp}
                      isFavourite={message.isFavourite}
                      onPress={() => this.openMessageDetail(message)}/>
                   ))
                }
              </List>;
            else
              return <View>
                <Image source={require('../../res/image/mail_icon2.png')}
                  style={styles.no_msg_received_img}/>
                <Text style={styles.no_msg_received_txt}>
                  {Lang.no_msg_received_txt}</Text>
              </View>;
          case 2: 
            arrayMessages = this.arrayMessagesSent;
            if(arrayMessages.length)
              return <List style = {styles.message_list}>{
                  arrayMessages.map((message) => (
                    <SentMessageItem
                      key={message._id}  
                      id={message._id}            
                      text={message.text}
                      time={message.timestamp}
                      isFavourite={message.isFavourite}
                      user_name_to={message.user_name_to}
                      user_id_to={message.user_id_to}
                      onPress={() => this.openSendingMessage(message)}/>
                   ))
                }
              </List>;
            else
              return <View>
                <Image source={require('../../res/image/dovedale_1.png')}
                  style={styles.no_msg_sent_img}/>
                <Text style={styles.no_msg_sent_txt}>
                  {Lang.no_msg_sent_txt}</Text>
              </View>
          case 3: 
            arrayMessages = Constants.jsonMessageReceived;
            var arrayMessagesFavorite = [];
            arrayMessages.forEach(function(message){
              if(message.isFavourite)
                arrayMessagesFavorite.push(message);
            });
            
            if(arrayMessagesFavorite.length)
              return <List style = {styles.message_list}>{
                  arrayMessagesFavorite.map((message) => (
                      <FavouriteMessageItem
                        key={message._id}   
                        id={message._id}              
                        text={message.text}
                        time={message.timestamp}
                        onPress={() => this.openMessageDetail(message)}/>
                   ))
                }
              </List>;
            else
              return <View>
                <Image source={require('../../res/image/Broken_Heart.png')}
                  style={styles.no_msg_favourite_img}/>
                <Text style={styles.no_msg_favourite_txt}>
                  {Lang.no_msg_favourite_txt}</Text>
              </View>
        }

  };

  render() {
    return (
      <View style={{backgroundColor:'#FAFAFA'}}>
        <View style={styles.button_wrapper}>
            {this.renderMessageButton()}            
        </View>
        <ScrollView style = {styles.message_list_container}> 
            {this.renderMessageList()}   
        </ScrollView>
      </View>
    );
  }

};



const styles = StyleSheet.create({
  message_list : {
      backgroundColor:'#fff',
  },

  button_wrapper: {
    backgroundColor: Color.titleBarBgColor,
    width:'100%',
    height: 50,
  },
  button_container: {
    height: (Constants.screenWidth - 40)/335 * 34,
    width: Constants.screenWidth - 40,
    marginLeft:'auto',
    marginRight: 'auto',
    flexDirection:'row',
  },
  titleActive:{
    color: Color.titleBarBgColor,
    fontSize: 16,
    fontWeight: 'bold', 
  },
  titleInactive:{
    color: Color.tintColor,
    fontSize: 16,
    fontWeight: 'bold', 
  },
  btn_received: {
    width: Constants.widthMessageButton*1.1,
    height: 34,
    // marginLeft: -17,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  btn_sent : {
    width: Constants.widthMessageButton*0.8,
    height: 34,
    // marginLeft: -32,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  btn_favourite : {
    width: Constants.widthMessageButton*1.1,
    height: 34,
    // marginLeft: -32,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  message_list_container: {
    position: 'absolute',
    top: 50,
    width : '100%',
    backgroundColor:Color.tintColor,
    height: Constants.screenHeight-170,    
  },
  no_msg_received_img: {
    width: 246,
    height: 138,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 100,
  },
  no_msg_received_txt: {
    width: 340,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 50,
    height: 60,
    color: Color.titleBarBgColor,
    fontSize: 22,
  },
  no_msg_sent_img: {
    width: 357,
    height: 213,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 40,
  },
  no_msg_sent_txt: {
    width: 290,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 30,
    height: 90,
    color: Color.titleBarBgColor,
    fontSize: 22,
  },
  no_msg_favourite_img :{
    width: 176,
    height: 144,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 60,
  },
  no_msg_favourite_txt :{
    width: 250,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 30,
    height: 124,
    color: Color.titleBarBgColor,
    fontSize: 22,
  },
});