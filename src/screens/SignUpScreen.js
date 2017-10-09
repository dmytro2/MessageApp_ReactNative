'use strict'

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  WebView,
  Linking,  
  // ImagePickerIOS,
} from 'react-native';

import CheckBox from 'react-native-checkbox';
// import Camera from 'react-native-camera';


import { 
  Icon, Button, 
  } from 'react-native-elements';


import PopupDialog, {SlideAnimation} from 'react-native-popup-dialog';
import Spinner from 'react-native-loading-spinner-overlay';
// import ImageResizer from 'react-native-image-resizer';

import store from 'react-native-simple-store';

import AlertPopup from '../component/Alert';

import Color from '../constants/Color';
import Lang from '../constants/LangCN';
import Constants from '../constants/Constants';

export default class SignUpScreen extends Component {

  constructor(props) {
    super(props);
  
    this.state = {
      name:'', 
      email:'', 
      password:'',
      passwordConfirm:'', 
      bAgreedTerms:false,
      // photo:'',

      waiting: false,
    };
  }

  handleSignUp = () => {
    if(this.state.bAgreedTerms){
      if(this.state.password == this.state.passwordConfirm && this.state.password!==''){
        // if(this.state.photo!==''){
          this.callRegisterUserAPI();                  
        // } else this.alert.show();
      } else this.alert.show();

    } else this.alert.show();
      
  }
  // callPhotoUploadAPI = (user_id,successCallBack,errorCallBack) => {
  //   let url = Constants.serverUrl+'/uploadProfilePicture/';
  //   var photo = {
  //     uri: '../../res/image/user_default.png',
  //     type:'image/jpeg',
  //     name:'1.jpg'
  //   }

  //   var body = new FormData();
  //   body.append('user_id',user_id);
  //   body.append('picture_file',photo);

  //   fetch(
  //     url,{
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'multipart/form-data;',
  //       },
  //       body: body
  //     })
  //   .then((resJson) => {
  //     if(resJson.ok){
  //         successCallBack();
  //     }else{
  //       errorCallBack();
  //     }
  //   })
  //   .catch(e => errorCallBack())
  // }

  callRegisterUserAPI = () =>{

    this.setState({waiting: true});

    let url = Constants.serverUrl+'/handle/register';
    let screenSignUp = this;
    fetch(
        url,{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'user':{
              'name':this.state.name,
              'email':this.state.email,
              'password':this.state.password,             
            }
          })
        })
      .then((res)=>res.json())
      .then((resJson) => {

        this.setState({waiting: false});

        if(resJson.success){
          Constants.jsonUser = resJson.data;
          Constants.jsonMessageReceived = [];
          store.save('UserInfo',resJson.data)
          .then (()=>{
            store.save('MessageReceived', [])
          })
          screenSignUp.props.navigation.navigate('Main');

          // this.callPhotoUploadAPI(resJson.data._id,
          //  function(){
          //   store.save('UserInfo',resJson.data)
          //   .then (()=>{
          //     store.save('MessageReceived', [])
          //   })
          //   .then (()=>{            
          //     store.update('UserInfo',{
          //       'profile_picture':Constants.serverUrl+'/images/profile_pictures/'+resJson.data._id+'.jpg',
          //     })
          //     .then(()=>{
          //       screenSignUp.setState({waiting:false});
          //       screenSignUp.props.navigation.navigate('Main');
          //     })
          //   })
          // }, function(){
          //   // alert(Lang.textErrorSignup)
          // })
        }
        else{
          this.alert2.show();
        }
      })
      .catch(e=>{ 
        this.setState({waiting: false});
        this.alert1.show();
      });
  }

  // takePictureFromGallery = () => {
  //   // alert();
  //   ImagePickerIOS.openSelectDialog({},
  //     imageUri=>{
  //       ImageResizer.createResizedImage(imageUri, 300, 300, 'JPEG', 80)
  //       .then(({uri}) => {
  //         this.setState({photo:uri});    
  //       }).catch((err)=>{
  //         console.log(err);
  //       })
  //     }, 
  //     error=>{}
  //   );
  // }

  render() {
    return (
      <View>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>{this.props.navigation.goBack()}}>
          <Image source={require('../../res/icon/ic_arrow.png')}
           style={styles.arrow}/>
         </TouchableOpacity>
        <Text style={styles.headerTitle}>{Lang.titleHeaderignUp}</Text>
      </View>
      <ScrollView style={styles.container}>
        <Image source={require('../../res/image/dovedale_1.png')}
         style={styles.default_user_img}/>          

        <View style={styles.container_field}>
          <Image source={require('../../res/icon/ic_person_black.png')} style={styles.icon_field}/>
          <TextInput style={styles.field_textInput}  autoCapitalize='none'
            placeholder={Lang.textName}
            placeholderTextColor='#ccc'
            onChangeText={(text) => this.setState({name:text})} >   
          </TextInput>
        </View>

        <View style={styles.container_field}>
          <Image source={require('../../res/icon/ic_email_black.png')} style={styles.icon_field}/>
          <TextInput style={styles.field_textInput}  autoCapitalize='none'
            placeholder={Lang.textEmail}
            placeholderTextColor='#ccc'
            onChangeText={(text) => this.setState({email:text})} >   
          </TextInput>
        </View>

        <View style={styles.container_field}>
          <Image source={require('../../res/icon/ic_lock_black.png')} style={styles.icon_field}/>
          <TextInput style={styles.field_textInput} secureTextEntry={true}  autoCapitalize='none'
            placeholder={Lang.textPassword}
            placeholderTextColor='#ccc'
            onChangeText={(text) => this.setState({password:text})} >            
          </TextInput>
        </View>

        <View style={styles.container_field}>
          <Image source={require('../../res/icon/ic_lock_black.png')} style={styles.icon_field}/>
          <TextInput style={styles.field_textInput} secureTextEntry={true}  autoCapitalize='none'
            placeholder={Lang.textConfirmPassword}
            placeholderTextColor='#ccc'
            onChangeText={(text) => this.setState({passwordConfirm:text})} >            
          </TextInput>
        </View>

        <View style={styles.containerCheckAgreement}>
          <CheckBox label={Lang.textCheckAgree} 
          onChange={(checked)=>{
              this.setState({bAgreedTerms:!checked})
          }} />
          <TouchableOpacity onPress={()=>{
          Linking.canOpenURL(Constants.urlPolicy).then(supported => {
            if (supported) {
              Linking.openURL(Constants.urlPolicy);
            } else {
              console.log("can't open this url");
            }
          })
          }}>
          <Text  style={styles.linkPolicy}>
            {Lang.textLinkPolicy}
          </Text>
          </TouchableOpacity>
        </View>
        <View style={{height:25}} />

        <Button
          title = {Lang.titleButtonSignUp}
          buttonStyle={styles.button_signup}
          onPress={this.handleSignUp}
          fontWeight='bold'
          fontSize={20}
          color={Color.tintColor}
        />
        <View style={{height:40}} />
      </ScrollView>


        <AlertPopup message={Lang.textFillAllInformation} buttonText={Lang.textOk}
        container={this}/>


        <PopupDialog width={240} height={160} 
         ref={(popupAlert) => { this.alert1 = popupAlert; }} >          
          <Text style={styles.textMessage}>
          {Lang.textErrorSignup}</Text>
          <Button raised
            title = {Lang.textOk}
            buttonStyle={styles.buttonOK}
            onPress={()=>{
              this.alert1.dismiss();
            }}
            fontSize={20}
            color={Color.tintColor}     />     
        </PopupDialog> 

        <PopupDialog width={240} height={160} 
         ref={(popupAlert) => { this.alert2 = popupAlert; }} >          
          <Text style={styles.textMessage}>
          {Lang.textEmailAlreadyRegistered}</Text>
          <Button raised
            title = {Lang.textOk}
            buttonStyle={styles.buttonOK}
            onPress={()=>{
              this.alert2.dismiss();
            }}
            fontSize={20}
            color={Color.tintColor}     />     
        </PopupDialog> 


        <View style={{ flex: 1 }}>
          <Spinner visible={this.state.waiting} textContent={Lang.textWaiting} textStyle={{color: '#FFF'}} />
        </View>
      </View>

      );
  }
  
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.tintColor,
    height: Constants.screenHeight-70,
  },
  header: {
    backgroundColor: Color.titleBarBgColor,
    height: 70,
    flexDirection: 'row', 
  },
  arrow: {
    marginTop: 20,
  },
  headerTitle:{
    color:Color.tintColor,
    textAlign: 'center',
    fontSize: 22,
    fontWeight:'bold',
    marginTop: 30,
    width: Constants.screenWidth - 100,
  },
  
  default_user_img: {
    width: (Constants.screenWidth*0.7),
    height: 213*(Constants.screenWidth*0.7)/357,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 20,
  },
  text_add: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom:15,
    color:Color.titleBarBgColor
  },
  container_field: {
    flexDirection: 'row',
    width: Constants.screenWidth * 0.8, 
    height: 50,
    borderRadius: 8,
    backgroundColor:Color.tintColor,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  icon_field: {
    marginTop: 12,
    marginLeft: 10,
  },
  icon_lock: {
    marginTop: 7,
    marginLeft: 7,
  },
  field_textInput: {
    marginTop: 12,
    fontSize: 18,
    marginLeft: 10,
    width: Constants.screenWidth * 0.8 - 80,
    height: 25,
  },
  containerCheckAgreement: {
    flexDirection: 'row',
    width: Constants.screenWidth * 0.8, 
    height: 30,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 30,
    // marginBottom: 20,
  },
  checkPolicy: {
    backgroundColor: 'transparent',
  },
  linkPolicy: {
    marginTop: 5,
    marginLeft: -5,
    color: Color.titleBarBgColor,
    // borderColor: 'red',
    // borderWidth: 2,
  },
  button_signup: { 
    backgroundColor: Color.titleBarBgColor,
    borderRadius: 5,
    height: 50,
    width: Constants.screenWidth-60, 
    marginRight:'auto',
    marginLeft: 'auto',
  },

  textMessage:{
    textAlign:'center',
    fontSize:20, 
    width: '100%',
    marginTop: 40,
    marginBottom: 30
  },

  buttonOK: {
    width: 160,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
    backgroundColor: Color.titleBarBgColor,
  }
});