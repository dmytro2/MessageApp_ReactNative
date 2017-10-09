import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,  
} from 'react-native';
import { 
  Icon,
  Button
  } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image';
import ImageProgress from 'react-native-image-progress';
// import ProgressPie from 'react-native-progress/Pie';
import ProgressIndicator from 'react-native-progress/Circle';

import Lang from '../constants/LangCN';
import Color from '../constants/Color';
import Constants from '../constants/Constants';
import store from 'react-native-simple-store';

export default class SendMessageScreen extends Component {

  constructor(props) {
    super(props);
  
    this.state = {message:'', waiting:false};
  }

  componentWillUnmount(){
    Constants.messageScreen.onPressSent();
  }

  obj_msg={};

  handleSendMessage = () => {
    this.setState({waiting: true});
      let url = Constants.serverUrl+'/message';

      fetch(
        url,{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'user_id_from':this.obj_msg.user_id_from,
            'user_id_to':this.obj_msg.user_id_to,
            'message': this.state.message,
          })
        })
      .then((res)=>res.json())
      .then((resJson) => {
        this.setState({waiting: false});

        if(resJson.Status){
          this.props.navigation.goBack();
        }
        // else
        //   alert(Lang.textErrorSentMessage)
      })
      .catch(e=>{
        this.setState({waiting: false});
        // alert(Lang.textErrorSentMessage);
      })
      
    
  }

  renderProfileImageComponent(photoImageUri){
    if(photoImageUri)
    return( 
      <View style={styles.photoWrapper}>
       <ImageProgress style={styles.photo} source={{uri: photoImageUri}}
        indicator={ProgressIndicator}        
        indicatorProps={{
          size: 50,
          borderWidth: 0,
          color: Color.titleBarBgColor,
          // showsText: true,
          // unfilledColor: 'rgba(200, 200, 200, 0.2)'
        }} />
      </View>      
    )
    else{      
      if(!Constants.isProfilePhotoChanged)
        return(
          <FastImage style={styles.photo}
          source={{uri: this.user.profile_picture, priority: FastImage.priority.normal,}}/>
        )
      else
        return( 
           <Image style={styles.photo} source={{uri: Constants.photoImageUri}}/>
        )
    }     
  }

	render() {
    this.obj_msg = this.props.navigation.state.params;
    let uriPhoto=Constants.serverUrl+'/images/profile_pictures/'+this.obj_msg.user_id_to+'.jpg';

		return (
			<ScrollView style={styles.container}>
        {this.renderProfileImageComponent(uriPhoto)}
        <Text style={styles.real_name}>{this.obj_msg.user_name_to}</Text>  
        <TextInput
          multiline={true}
          numberOfLines={4}
          editable = {true}
          maxLength = {255}
          style={styles.textArea}
          placeholder={Lang.textSendMessage}
          onChangeText={(text) => this.setState({message:text})} />            
        <Button
          title = {Lang.titleButtonSend}
          buttonStyle={styles.buttonSend}
          onPress={this.handleSendMessage}
          fontWeight='bold'
          fontSize={20}
        /> 
        <View style={{height: 40}} /> 

        <View style={{ flex: 1 }}>
          <Spinner visible={this.state.waiting} textContent={Lang.textWaiting} textStyle={{color: '#FFF'}} />
        </View>     
		  </ScrollView>
	    );
	}

};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,    
    backgroundColor:'#FAFAFA',
    height: '100%'
  },
  photoWrapper:{
    width:60, 
    height:60, 
    borderRadius: 30, 
    marginLeft:'auto', 
    marginRight: 'auto', 
    overflow: 'hidden' ,
    marginTop: 12
  },
  // photoWrapper:{
  //   width:150, 
  //   height:150, 
  //   borderRadius: 75, 
  //   marginLeft:'auto', 
  //   marginRight: 'auto', 
  // },
  photo:{
    width:60, 
    height:60, 
  },
  real_name:{
    fontSize: 18,  
    marginTop: 12,
    marginRight:'auto',
    marginLeft: 'auto',
    textAlign:'center',
    width: 200,
  },
  textArea:{
    backgroundColor:'#FAFAFA',
    width: Constants.screenWidth - 80,
    height: 300,
    marginLeft: 40,
    marginTop: 15,
    borderColor:Color.titleBarBgColor,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    paddingTop: 10,
    fontSize: 18,
  },
  buttonSend: {
    backgroundColor: Color.titleBarBgColor,
    marginTop:25,
    width: '50%',
    marginLeft:'25%',
    borderRadius: 10,
  }
});




