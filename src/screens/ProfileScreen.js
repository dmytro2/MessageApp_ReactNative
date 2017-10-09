import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Clipboard,
} from 'react-native';


import { 
  Icon, Button
  } from 'react-native-elements';

import PopupDialog from 'react-native-popup-dialog';
// import FastImage from 'react-native-fast-image';
import ImageProgress from 'react-native-image-progress';
// import ProgressPie from 'react-native-progress/Pie';
import ProgressIndicator from 'react-native-progress/Circle';

import AlertPopup from '../component/Alert';


import Color from '../constants/Color';
import Lang from '../constants/LangCN';
import Constants from '../constants/Constants';

import store from 'react-native-simple-store';

export default class ProfileScreen extends Component {

  static navigationOptions = ({ navigation }) => {
     return {
      title: Lang.title_profile_tab,
      headerStyle: {
        backgroundColor: Color.titleBarBgColor,
      },
      headerTintColor: 'white',
      headerRight: (
        <TouchableOpacity 
        style={{width:30, height:30, marginRight:20,}}
        onPress={() => navigation.navigate('Setting')}>
            <Image source={require('../../res/icon/setting.png')}
                    style={{width:30, height:30, top: -3,}} />
        </TouchableOpacity>
      ),
    };
  };

  user={};

  constructor(props) {
    super(props);
    this.state = {index : 1};
  }

  componentDidMount() {
    // store.get('UserInfo')
    //   .then(user=>{
        this.user = Constants.jsonUser;        
        this.setState({index : 1});
        Constants.profileScreen = this;
    //   });
  };

  reRenderPhoto= () => {    
    store.get('UserInfo')
      .then(user=>{
        this.user = user;        
        this.setState({index : 1});
      });
    
    setTimeout(function(){
      Constants.isProfilePhotoChanged = false;
    },500);  
    
  }

  showPopup = () => {
      this.popupDialog.show();
  };

  closePopup = () => {
    this.popupDialog.dismiss();
  };


  handleCopyLink = () => {
    // alert('profile link has been copied!');
    // external link example : http://47.91.236.188:3000/MsgSend/sendMessage.html?user_id=59a16ef0a076d6149c471dbe&user_name=User%202
    var name = Constants.jsonUser.name;
    var nameInUrl = name.replace(/ /g,'%20');
    var url = Constants.serverUrl+'/MsgSend/sendMessage.html?user_id='+Constants.jsonUser._id+'&user_name='+nameInUrl;
    Clipboard.setString(url);
    this.closePopup();

    this.alert.show();

  };

  renderProfileImageComponent(photoImageUri){
    if(!Constants.isProfilePhotoChanged)
      return( 
        <View style={styles.photoWrapper}>
         <ImageProgress style={styles.photo} source={{uri: photoImageUri}}
          indicator={ProgressIndicator}        
          indicatorProps={{
            size: 80,
            borderWidth: 0,
            color: Color.titleBarBgColor,
            // showsText: true,
            // unfilledColor: 'rgba(200, 200, 200, 0.2)'
          }} />
        </View>      
      )
    else
      return( 
        <View style={styles.photoWrapper}>
         <Image style={styles.photo} source={{uri: Constants.photoImageUri}}/>
        </View>      
      )
         
  }

	render() {
      return (
        <ScrollView style={styles.container}>

          <View style={styles.number_message_container}>
            <Text style={styles.number_message}>
              {Constants.jsonMessageReceived.length}
            </Text>  
            <Icon name="comment" size={40}  />
          </View> 
          {this.user.profile_picture?this.renderProfileImageComponent(this.user.profile_picture)          
          :<Icon name="account-circle" size={150} />}
          <Text style={styles.real_name}>{this.user.name}</Text>
          <TouchableOpacity style={styles.unique_link_wrapper}
            onPress={this.showPopup}>
            <Text style={styles.unique_link}>{Lang.unique_link}</Text>
          </TouchableOpacity>   
          <View style={{height: 40}} />    

          <PopupDialog width={200} height={140} style={styles.popupUniqueLink}
             ref={(popupDialog) => { this.popupDialog = popupDialog; }} >
            <TouchableOpacity onPress={this.closePopup}>
              <Image source={require('../../res/icon/popup_close.png')}
                style={{width:30, height:30, marginLeft:-12, marginTop: -12}} />
            </TouchableOpacity>
            <Text style={{textAlign:'center',fontSize:20, margin:2}}>{Lang.textShare}</Text>

            <Button raised
              title = {Lang.textCopy}
              buttonStyle={styles.buttonCopy}
              onPress={this.handleCopyLink}
              fontSize={20}
              color={Color.titleBarBgColor}
            />     
          </PopupDialog> 


          <AlertPopup message={Lang.textSuccessCopyLink} buttonText={Lang.textOk}
          container={this}/>

        </ScrollView>
        )
	}
	
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.tintColor,
    height: Constants.screenHeight,
  },
  photoWrapper:{
    width:150, 
    height:150, 
    borderRadius: 75, 
    marginLeft:'auto', 
    marginRight: 'auto', 
    overflow: 'hidden' ,
  },
  photo:{
    width:150, 
    height:150, 
  },
  number_message_container: {
    flexDirection: 'row',
    width: 70,
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 100,
    // borderColor: '#f00',
    // borderWidth: 2
  },
  number_message: {
    fontSize: 20,
    margin: 5,
    fontWeight: 'bold',
  },
  real_name:{
    fontSize: 20,  
    marginRight:'auto',
    marginLeft: 'auto',
    textAlign:'center',
    width: 200,
  },
  unique_link_wrapper:{    
    marginRight:'auto',
    marginLeft: 'auto',
    marginTop: 80,
    width: 200,
  },
  unique_link: {
    color: Color.titleBarBgColor,
    fontSize: 25,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textAlign:'center',
  },
  popupUniqueLink:{

  },
  buttonCopy: {
    width: 140,
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
    borderColor: Color.titleBarBgColor,
    borderWidth: 1,
    backgroundColor: 'transparent',
  }
});