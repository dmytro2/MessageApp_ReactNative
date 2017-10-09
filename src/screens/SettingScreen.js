import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ImagePickerIOS,
} from 'react-native';

import { 
  Icon,
  Button,
} from 'react-native-elements';

import PopupDialog from 'react-native-popup-dialog';
import Spinner from 'react-native-loading-spinner-overlay';
// import FastImage from 'react-native-fast-image';
import ImageProgress from 'react-native-image-progress';
// import ProgressPie from 'react-native-progress/Pie';
import ProgressIndicator from 'react-native-progress/Circle';
// import ProgressBar from 'react-native-progress/Bar';

import ImageResizer from 'react-native-image-resizer';

import store from 'react-native-simple-store';

import Color from '../constants/Color';
import Lang from '../constants/LangCN';
import Constants from '../constants/Constants';

import AlertPopup from '../component/Alert';
// import ProfileImage from '../component/ProfileImage';


export default class SettingScreen extends Component {
  user = {};
  bWillChangePw = false;
  constructor(props) {
    super(props);
    this.state = { name: '', email: '', pwOld:'',pwNew:'',pwConNew:'', index: 1, waiting: false};
  };
  componentDidMount() {
    store.get('UserInfo')
      .then(user=>{
        this.user = user;        
        this.setState({name: user.name, email: user.email ,index : 1});
      });
  };
  componentWillUnmount() {
    Constants.profileScreen.reRenderPhoto();
    // alert();
  }

  showPopup = () => {
    this.bWillChangePw = true;
    this.popupDialog.show();
  };

  closePopup = () => {
    this.bWillChangePw = false;
    this.popupDialog.dismiss();
  };

  handleLogoutPress = () => {
    Constants.rootNavigator.navigate('Login');
    store.delete('UserInfo');
  };

  takePictureFromGallery = (view) => {
    ImagePickerIOS.openSelectDialog({},
    imageUri=>{ 

      ImageResizer.createResizedImage(imageUri, 300, 300, 'JPEG', 80)
      .then(({uri}) => {

        let url = Constants.serverUrl+'/uploadProfilePicture/';
        var photo = {
          uri: uri,
          type:'image/jpeg',
          name:'1.jpg'
        }

        var body = new FormData();
        body.append('user_id',view.user._id);
        body.append('picture_file',photo);

        this.setState({waiting:true});

        try{
          fetch(
            url,{
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;',
              },
              body: body
            })
          .then((resJson) => {
            if(resJson.ok){
                // view.user.profile_picture = uri;
                Constants.isProfilePhotoChanged = true;
                Constants.photoImageUri  = imageUri;
                this.setState({waiting:false});

                store.update('UserInfo',{
                  'profile_picture':Constants.serverUrl+'/images/profile_pictures/'+view.user._id+'.jpg',
                });
            }
            // else
            //   alert(Lang.textErrorUpload)
          })
          .catch(e => {
            // alert(Lang.textErrorUpload); 
            this.setState({waiting:false});
           })
        } catch(e) { 
          // alert(Lang.textErrorUpload);
          this.setState({waiting:false});
        }

      }).catch((err)=>{
        console.log(err);
      })



    }, 
    error=>{}
    );
  };
  callUpdateProfileAPI = (userInfo, changePassword) =>{     

    this.setState({waiting:true});

    var url = Constants.serverUrl+'/updateUserProfile';
    fetch(url,{
      method:'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfo)          
    })
    .then((res)=>res.json())
    .then((resJson) => {

      if(resJson.message == 'success'){

        if(changePassword)
          this.alert.show();

        Constants.jsonUser._id = userInfo.user_id;
        Constants.jsonUser.name = userInfo.name;
        Constants.jsonUser.email = userInfo.email;
        Constants.jsonUser.password = userInfo.password;

        store.update('UserInfo',{
          '_id':userInfo.user_id,
          'name':userInfo.name,
          'email':userInfo.email,
          'password':userInfo.password,        
        });
      }
      // else
      //   alert(Lang.textErrorUpdate);

      this.setState({waiting:false});

    })
    .catch(e => {
      // alert(Lang.textErrorUpload); 
      this.setState({waiting:false});
    })
  }

  handleChangeUserInfo = () =>{
    var userInfo = {
      user_id:this.user._id,
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    };

    if(this.bWillChangePw){
      if(this.state.pwOld!=this.user.password){
        // alert(Lang.textCurrentPasswordNotCorrect);
        this.popupDialog.dismiss();
        this.alert1.show();
        return;
      }else if(this.state.pwNew!=this.state.pwConNew){
        this.popupDialog.dismiss();
        this.alert2.show();
        return;
      }else {
        this.closePopup();
        userInfo.password = this.state.pwNew;
        this.callUpdateProfileAPI(userInfo, true);        
      }
    }
    else{
      userInfo.name = this.state.name;
      userInfo.email = this.state.email;
      this.callUpdateProfileAPI(userInfo);
    }
  }

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
        <View style={{height:20}} />        
        <TouchableOpacity 
        style={{width: 150, marginTop: 5, marginBottom:10, marginLeft: 'auto', marginRight: 'auto'}} 
        onPress={()=>{this.takePictureFromGallery(this)}}>
          {this.user.profile_picture?this.renderProfileImageComponent(this.user.profile_picture)          
          :<Icon name="account-circle" size={150} />}               
          <Text style={styles.text_change}> 
  	         {Lang.textChange}
          </Text>	
        </TouchableOpacity>     
        <View style={styles.container_info}>
          <Icon name="account-circle" size={40} />
          <TextInput style={styles.name_mail} value={this.state.name} autoCapitalize='none'
            onChangeText={(text) => this.setState({name:text})} />            
          <TouchableOpacity onPress={this.handleChangeUserInfo}>
            <Text style={styles.text_change_info}>  
             {Lang.textChange}
            </Text> 
          </TouchableOpacity>
        </View>
        <View style={styles.container_info}>
          <Icon name="mail" size={40} />
          <TextInput style={styles.name_mail} value={this.state.email}  autoCapitalize='none'
            onChangeText={(text) => this.setState({email:text})} />            
          <TouchableOpacity onPress={this.handleChangeUserInfo}>
            <Text style={styles.text_change_info}>  
             {Lang.textChange}
            </Text> 
          </TouchableOpacity>
        </View>
        <View style={styles.container_info_password}>
          <Icon name="lock" size={40} />
          <TouchableOpacity onPress={this.showPopup}>
            <Text style={styles.text_change_password}>  
             {Lang.textChangePassword}
            </Text>
          </TouchableOpacity> 
        </View>
        <Button
          title = {Lang.titleButtonLogOut}
          buttonStyle={styles.button_logout}
          onPress={this.handleLogoutPress}
          fontWeight='bold'
          fontSize={20}
        />  
        <View style={{height:40}} />

        <PopupDialog width={240} height={300} 
         ref={(popupDialog) => { this.popupDialog = popupDialog; }} >
          <TouchableOpacity onPress={this.closePopup}>
            <Image source={require('../../res/icon/popup_close.png')}
              style={{width:30, height:30, marginLeft:-12, marginTop: -12}} />
          </TouchableOpacity>
          <Text style={{textAlign:'center',fontSize:20, marginBottom:20,}}>
          {Lang.textChangePassword}</Text>

          <TextInput secureTextEntry={true} autoCapitalize='none'
            style={styles.textPassword}
            placeholder={Lang.textCurrentPassword}
            placeholderTextColor={Color.titleBarBgColor}
            onChangeText={(text) => this.setState({pwOld:text})}  
          />   
          <TextInput secureTextEntry={true} autoCapitalize='none'
            style={styles.textPassword}
            placeholder={Lang.textNewPassword}
            placeholderTextColor={Color.titleBarBgColor}
            onChangeText={(text) => this.setState({pwNew:text})} 
          /> 
          <TextInput secureTextEntry={true} autoCapitalize='none'
            style={styles.textPassword}
            placeholder={Lang.textConfirmNewPassword}
            placeholderTextColor={Color.titleBarBgColor}
            onChangeText={(text) => this.setState({pwConNew:text})} 
          /> 
          <Button raised
            title = {Lang.textChange}
            buttonStyle={styles.buttonChange}
            onPress={this.handleChangeUserInfo}
            fontSize={20}
            color={Color.tintColor}
          />     
        </PopupDialog>    

        <AlertPopup message={Lang.textPasswordChangeSuccess} buttonText={Lang.textOk}
        container={this}/>

        <PopupDialog width={240} height={160} 
         ref={(popupAlert) => { this.alert1 = popupAlert; }} >          
          <Text style={styles.textMessage}>
          {Lang.textCurrentPasswordNotCorrect}</Text>
          <Button raised
            title = {Lang.textOk}
            buttonStyle={styles.buttonChange}
            onPress={()=>{
              this.alert1.dismiss();
              this.popupDialog.show();
            }}
            fontSize={20}
            color={Color.tintColor}     />     
        </PopupDialog> 

        <PopupDialog width={240} height={160} 
         ref={(popupAlert) => { this.alert2 = popupAlert; }} >          
          <Text style={styles.textMessage}>
          {Lang.textNewPasswordConfirmNotSame}</Text>
          <Button raised
            title = {Lang.textOk}
            buttonStyle={styles.buttonChange}
            onPress={()=>{
              this.alert2.dismiss();
              this.popupDialog.show();
            }}
            fontSize={20}
            color={Color.tintColor}     />     
        </PopupDialog> 



        <View style={{ flex: 1 }}>
          <Spinner visible={this.state.waiting} textContent={Lang.textWaiting} textStyle={{color: '#FFF'}} />
        </View>   
	    </ScrollView>
	    );
	}
	
};

const styles = StyleSheet.create({  
  textPassword:{
    width: 200,
    marginLeft: 20,
    marginBottom: 15,
    borderColor:'#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    paddingTop: 10,
    fontSize: 18,
  },
  container: {
    backgroundColor: Color.tintColor,
    height:'100%',
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

  text_change: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom:15,
    color:Color.titleBarBgColor
  },
  container_info: {
    flexDirection: 'row',
    width:'100%',
    height: 70,
    borderColor: '#999',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingLeft: 20,
    marginTop: -1,    
  },
  container_info_password:{
    flexDirection: 'row',
    width:'100%',
    height: 70,
    borderColor: '#999',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingLeft: 20,
    marginTop: -1, 
    marginBottom: 60,   
  },
  name_mail: {
    marginTop: 20,
    fontSize: 20,
    marginLeft: 20,
    width: Constants.screenWidth - 160,
    height: 25,
  },
  text_change_info:{
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginTop: 25,
    color:Color.titleBarBgColor,
    height: 25,
  },
  text_change_password: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 23,
    marginLeft: 20,
    color:Color.titleBarBgColor,
    height: 25,
  },
  container_push_option: {
    flexDirection: 'row',
    width:'100%',
    height: 70,
    borderColor: '#999',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingLeft: 20,
    marginTop: 25,    
  },
  text_push_notification: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 23,
    height: 35,
    color: '#000',
  },

  button_logout: { 
    backgroundColor: 'red',
    borderRadius: 5,
    height: 50,
    width: Constants.screenWidth-60, 
    marginRight:'auto',
    marginLeft: 'auto',
  },
  buttonChange: {
    width: 160,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
    backgroundColor: Color.titleBarBgColor,
  },


  textMessage:{
    textAlign:'center',
    fontSize:20, 
    width: '100%',
    marginTop: 40,
    marginBottom: 30
  },

});