
import React, {Component} from 'react';
import {
  Platform,   
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';


import { 
  Icon, Button
  } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import store from 'react-native-simple-store';

import AlertPopup from '../component/Alert';


import Color from '../constants/Color';
import Lang from '../constants/LangCN';
import Constants from '../constants/Constants';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);    
    this.state = { email: '' , password: '', waiting: false};

    store.get('MessageReceived')
    .then(message=>{
      Constants.jsonMessageReceived = message; 
    });
    
  };
  componentDidMount(){
    store.get('UserInfo')
    .then(userInfo=>{
      if(userInfo._id){
        Constants.jsonUser = userInfo;
        this.setState({email: Constants.jsonUser.email, password:Constants.jsonUser.password});
        this.handleLogin();
      }
    })
    .catch(e=>{
      this.setState({waiting: false});
    })

  }



  handleLogin = () => {
    this.setState({waiting: true});
    let url = Constants.serverUrl+'/handle/login';
    try{
      fetch( url,{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'user':{
              'email': this.state.email,
              'password': this.state.password
            }
          })
        })
      .then((res)=>res.json())
      .then((resJson) => {
        if(resJson.success){
          Constants.jsonUser = resJson.user;
          Constants.jsonMessageReceived = Constants.getSortMessageByDate(resJson.message);
          store.save('UserInfo',resJson.user)
          .then (()=>{
            store.save('MessageReceived', resJson.message)
          })
          .then (()=>{ 
            this.setState({waiting: false});
            this.props.navigation.navigate('Main')
          })
        }
        else{
          this.setState({waiting: false});
          this.alert.show();
        }
      })
      .catch(e=>{
        this.setState({waiting: false});
        this.alert.show();
      });

    } catch(e){
      this.setState({waiting: false});
      this.alert.show();
    }
  };
  handleSignUp = () => {
      this.props.navigation.navigate('SignUp');
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Image source={require('../../res/image/dovedale_1.png')}
        style={styles.no_msg_sent_img}/>
        <Text style={styles.textAppName}>{Lang.app_name}</Text>                              
        <View style={styles.container_email}>
          <Image source={require('../../res/icon/ic_person.png')} style={styles.icon_person}/>
          <TextInput style={styles.mail_pw} 
            autoCapitalize='none'
            placeholder={Lang.textEmail}
            placeholderTextColor={Color.tintColor}
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.setState({email:text})} >   
          </TextInput>
        </View>
        <View style={styles.container_password}>
          <Image source={require('../../res/icon/ic_lock.png')} style={styles.icon_lock}/>
          <TextInput style={styles.mail_pw} secureTextEntry={true} 
            autoCapitalize='none'
            placeholder={Lang.textPassword}
            placeholderTextColor={Color.tintColor}
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.setState({password:text})} >            
          </TextInput>
        </View>
        <Button
          title = {Lang.titleButtonLogIn}
          buttonStyle={styles.button_login}
          onPress={this.handleLogin}
          fontWeight='bold'
          fontSize={20}
          color={Color.titleBarBgColor}
        />
        <View style={styles.containerInstructionSignup}>
          <Text style={styles.textInstructionSignup}>{Lang.textInstructionSignUp}</Text>
          <TouchableOpacity onPress={this.handleSignUp} > 
            <Text style={styles.textSignUp}>{Lang.titleButtonSignUp}</Text>
          </TouchableOpacity>
        </View>


        <AlertPopup message={Lang.textWrongPasswordMail} buttonText={Lang.textOk}
        container={this}/>

        <View style={{ flex: 1 }}>
          <Spinner visible={this.state.waiting} textContent={Lang.textWaiting} textStyle={{color: '#FFF'}} />
        </View>
      </ScrollView>

      );
  }
  
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.titleBarBgColor,
    height: '100%',
  },
  no_msg_sent_img: {
    width: (Constants.screenWidth>357)?357:(Constants.screenWidth-20),
    height: (Constants.screenWidth>357)?213:213*(Constants.screenWidth-20)/357,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 40,
  },
  textAppName: {
    color:'#fff', 
    fontSize:30, 
    textAlign:'center',
    marginTop:30,
    marginBottom: 50,
    fontWeight:'bold'
  },
  container_email: {
    flexDirection: 'row',
    width: Constants.screenWidth * 0.8, 
    height: 50,
    borderRadius: 8,
    backgroundColor:'#19b38a',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  container_password: {
    flexDirection: 'row',
    width: Constants.screenWidth * 0.8, 
    height: 50,
    borderRadius: 8,
    backgroundColor:'#19b38a',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 20,
    marginBottom:40,    
  },
  icon_person: {
    marginTop: 5,
    marginLeft: 10,
  },
  icon_lock: {
    marginTop: 7,
    marginLeft: 10,
  },
  button_login: { 
    backgroundColor: Color.tintColor,
    borderRadius: 5,
    height: 50,
    width: Constants.screenWidth * 0.8, 
    marginRight:'auto',
    marginLeft: 'auto',
  },
  mail_pw: (Platform.OS=='ios')?{
    marginTop: 15,
    fontSize: 20,
    marginLeft: 10,
    width: Constants.screenWidth * 0.8 - 80,
    height: 25,
  }:{
    // marginTop: 10,
    fontSize: 20,
    marginLeft: 10,
    width: Constants.screenWidth * 0.8 - 80,
    height: 50,
    // borderColor: '#f00',
    // borderWidth: 2,
  },
  containerInstructionSignup: {
    flexDirection: 'row',
    width: 250, 
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 40,
    marginBottom: 40,
  },
  textInstructionSignup:{
    color: Color.tintColor,
  },
  textSignUp:{
    fontSize: 16,
    color: Color.tintColor,
  }
});