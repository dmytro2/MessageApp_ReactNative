import React, {Component} from 'react';
import {
	View, 
	Image,
	Text,
	TouchableOpacity,
	ViewStyle,
	StyleSheet,
} from 'react-native';

import { 
  Icon,
  } from 'react-native-elements';
import { SwipeRow } from 'react-native-swipe-list-view';

import Lang from '../constants/LangCN';
import Constants from '../constants/Constants';

import store from 'react-native-simple-store';


export class ReceivedMessageItem extends React.Component <> {

	callSetFavouriteAPI(messageId,isFavourite,successCallback,failureCallback) {
		var url = Constants.serverUrl+'/setMessageFavourite';
		try{
    	fetch(
        url,{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'message_id':messageId,
            'isFavourite':isFavourite            
          })
        })
			.then((res)=>res.json())
			.then((resJson) => {
        if(resJson.message == 'success'){
      		successCallback();
        }
        // else
        //   alert(Lang.textErrorLogin)
			});

    	} catch(e){
      		console.log(e);
		}
	}


	callDeleteMessageAPI(messageId,successCallback,failureCallback) {
		var url = Constants.serverUrl+'/deleteMessage/'+messageId;
		try{
    	fetch(url,{ method: 'GET' })
        .then((res)=>res.json())
		.then((resJson) => {
        if(resJson.message == 'success'){
      		successCallback();
        }
        // else
        //   alert(Lang.textErrorLogin)
			});

    	} catch(e){
      		console.log(e);
		}
	}

	getStrTimeAgo(time_now, time_msg){
		var seconds_between = (time_now - time_msg)/1000;
		var str_ago = '';
		if (seconds_between > 60*60*24) {
			str_ago = parseInt(seconds_between/(60*60*24))+Lang.days_ago;
		} else if(seconds_between > 60*60){
			str_ago = parseInt(seconds_between/(60*60))+Lang.hours_ago;
		} else if (seconds_between > 60) {
			str_ago = parseInt(seconds_between/60)+Lang.minutes_ago;
		} else {
			str_ago = parseInt(seconds_between)+Lang.seconds_ago;
		}
		return str_ago;
	} 

	deleteMessage(msgId){
		this.callDeleteMessageAPI(msgId, function(){

			for(var i = 0; i < Constants.jsonMessageReceived.length;i++){
				if(Constants.jsonMessageReceived[i]._id==msgId){
					Constants.jsonMessageReceived.splice(i,1);
					break;
				}
			}
			Constants.messageScreen.setState({index:1});
		});
	}

	render() {
		var str_ago = this.getStrTimeAgo(new Date(), new Date(this.props.time));
		let obj_msg = {
			text: this.props.text,
			time_ago: str_ago,
			id: this.props.id,
			isFavourite:this.props.isFavourite,
		};


		return (
				<SwipeRow
					rightOpenValue={-85}
					disableRightSwipe={true}
					swipeToOpenPercent={30}
				>					
					<View style={styleSheet.standaloneRowBack}>
						<View style={styleSheet.standaloneRowBackLeft}/>
						<TouchableOpacity onPress={()=>this.deleteMessage(this.props.id)} style={styleSheet.standaloneRowBackRight}>
						<Text style={styleSheet.backTextWhite}>{Lang.delete}</Text>
						</TouchableOpacity>
					</View>

					<TouchableOpacity 
					onPress={() =>this.props.onPress(this.props.text)}
					style={styleSheet.standaloneRowFront}
					activeOpacity={1}>

						<View style = {styleSheet.message_time_container}>
						<Text style = {styleSheet.message_text}>
							{this.props.text}
						</Text>
						<View style = {styleSheet.time_container}>
							<Image source={require('../../res/icon/clock.png')}
							  style = {styleSheet.clock_img}/>
							<Text style = {styleSheet.time_txt}>
								{str_ago}
							</Text>
						</View>
					</View>
						<TouchableOpacity 
						style={styleSheet.favorite_icon_wrapper}
						onPress={() => {this.callSetFavouriteAPI(
								obj_msg.id,
								!(obj_msg.isFavourite),
								function(){
									// store.get('MessageReceived')
									// .then((messages)=>{
										let arrayMessages = Constants.jsonMessageReceived;				
										arrayMessages.forEach((message)=>{
											if(message._id == obj_msg.id) message.isFavourite=!(obj_msg.isFavourite);})								
															
										Constants.jsonMessageReceived = arrayMessages;
										Constants.messageScreen.setState({index:1});
										store.save('MessageReceived',arrayMessages)								
										// .then(()=>{	
										// })
									// })
							})							
						}}>
							<Image source={
									!this.props.isFavourite?
									require('../../res/icon/like1600.png'):
									require('../../res/icon/isFav_y.png')
								}
							 style={styleSheet.favorite_icon}/>
						</TouchableOpacity>
					</TouchableOpacity>
				</SwipeRow>
  		); 		
	}
}

export class SentMessageItem extends React.Component <> {

	constructor(props) {
	  super(props);
	}

	render() {
		var time_now = new Date();
		var time_msg = new Date(this.props.time);
		var seconds_between = (time_now - time_msg)/1000;
		var str_ago = '';
		if (seconds_between > 60*60*24) {
			str_ago = parseInt(seconds_between/(60*60*24))+Lang.days_ago;
		} else if(seconds_between > 60*60){
			str_ago = parseInt(seconds_between/(60*60))+Lang.hours_ago;
		} else if (seconds_between > 60) {
			str_ago = parseInt(seconds_between/60)+Lang.minutes_ago;
		} else {
			str_ago = parseInt(seconds_between)+Lang.seconds_ago;
		}

		let obj_msg = {
			text: this.props.text,
			time_ago: str_ago,
			name: this.props.user_name_to,
			user_id_to:this.props.user_id_to,
		};

		let uriPhoto=Constants.serverUrl+'/images/profile_pictures/'+obj_msg.user_id_to+'.jpg';

		return (
			<TouchableOpacity 
			activeOpacity={1}
			style={styleSheet.standaloneRowFront}
			onPress={() =>this.props.onPress(obj_msg)}>
				<View style = {styleSheet.name_time_container}>	
				<Image source={{uri:uriPhoto}} style={styleSheet.photo}/>
					<Text style = {styleSheet.name_txt}>{obj_msg.name}</Text>					
					<View style = {styleSheet.time_container}>
						<Image source={require('../../res/icon/clock.png')}
						  style = {styleSheet.clock_img}/>
						<Text style = {styleSheet.time_txt}>
							{obj_msg.time_ago}
						</Text>
					</View>
				</View>
		  		<Text style = {styleSheet.message_sent_text}>
					{obj_msg.text}
				</Text>
	  		</TouchableOpacity>	
  		); 		
	}
}

export class FavouriteMessageItem extends React.Component <> {

	callSetFavouriteAPI(messageId,isFavourite,successCallback,failureCallback) {
		var url = Constants.serverUrl+'/setMessageFavourite';
		try{
      fetch(
        url,{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'message_id':messageId,
            'isFavourite':isFavourite            
          })
        })
      .then((res)=>res.json())
      .then((resJson) => {
        if(resJson.message == 'success'){
      		successCallback();
        }
        // else
        //   alert(Lang.textErrorLogin)
      });

    } catch(e){
      console.log(e);
    }
	}

	getStrTimeAgo(time_now, time_msg){
		var seconds_between = (time_now - time_msg)/1000;
		var str_ago = '';
		if (seconds_between > 60*60*24) {
			str_ago = parseInt(seconds_between/(60*60*24))+Lang.days_ago;
		} else if(seconds_between > 60*60){
			str_ago = parseInt(seconds_between/(60*60))+Lang.hours_ago;
		} else if (seconds_between > 60) {
			str_ago = parseInt(seconds_between/60)+Lang.minutes_ago;
		} else {
			str_ago = parseInt(seconds_between)+Lang.seconds_ago;
		}
		return str_ago;
	} 

	constructor(props) {
	  super(props);
	  this.state={isFavourite:true}
	}

	render() {		

		let obj_msg = {
			text: this.props.text,
			time_ago: this.getStrTimeAgo(new Date(), new Date(this.props.time)) ,
			id: this.props.id,
		};

		return (
			<TouchableOpacity 
			style={styleSheet.standaloneRowFront}
			onPress={() =>this.props.onPress(obj_msg.text)}>
					<View style = {styleSheet.message_time_container}>
						<Text style = {styleSheet.message_text}>
							{obj_msg.text}
						</Text>
						<View style = {styleSheet.time_container}>
							<Image source={require('../../res/icon/clock.png')}
							  style = {styleSheet.clock_img}/>
							<Text style = {styleSheet.time_txt}>
								{obj_msg.time_ago}
							</Text>
						</View>
					</View>
					<TouchableOpacity 
					style={styleSheet.favorite_icon_wrapper}
					onPress={() => {this.callSetFavouriteAPI(
							obj_msg.id,
							false,
							function(){
								let arrayMessages = Constants.jsonMessageReceived;				
								arrayMessages.forEach((message)=>{
									if(message._id == obj_msg.id) message.isFavourite=false;})								
													
								Constants.jsonMessageReceived = arrayMessages;
								Constants.messageScreen.setState({index:3});
								store.save('MessageReceived',arrayMessages)	


								// store.get('MessageReceived')
								// .then((messages)=>{
								// 	let arrayMessages = messages;
								// 	arrayMessages.forEach((message)=>{if(message._id == obj_msg.id) message.isFavourite=false;})								
								// 	store.save('MessageReceived',arrayMessages)								
								// 	.then(()=>{	
								// 		Constants.jsonMessageReceived = arrayMessages;
								// 		Constants.messageScreen.setState({index:3});
								// 	})
								// })
						})							
					}}>
						<Image source={require('../../res/icon/isFav_y.png')}
						 style={styleSheet.favorite_icon}/>
	  			</TouchableOpacity>	
	  		</TouchableOpacity>	
  		); 		
	}
}

let styleSheet = StyleSheet.create({
	container : {
		flex : 1,
		height : '100%',
		borderColor: '#ccc',
		borderWidth: 1, 
	},
  photo:{
    width:26, 
    height:26, 
    borderRadius: 13, 
    marginTop: -5,
  },
	standaloneRowFront: {
		backgroundColor: '#fff',
		height : 70,
		borderColor: '#ccc',
		borderWidth: 1, 
	},
	standaloneRowBack: {
		flexDirection:'row',
	},
	standaloneRowBackRight: {
		backgroundColor: '#f00',
		width: 85,
		height: 70,
		paddingTop: 23,
		paddingRight: 18,
	},
	standaloneRowBackLeft: {
		backgroundColor: '#fff',
		width: Constants.screenWidth - 85,
		height: '100%',
		paddingTop: 23,
		paddingRight: 18,
	},
	backTextWhite: {
		color: '#FFF',
		textAlign:'right',
		fontSize: 23,
		fontWeight:'bold',
	},
	message_time_container : {
		width: '100%',
		overflow: 'hidden',
		backgroundColor:'#fff',
		height:'100%',
		paddingTop:5,
		paddingLeft:5,
	},
	message_text : {
		fontSize : 18,
		color : 'black',
		margin: 10,
		marginBottom: 5,
		marginTop: 7,
		overflow: 'hidden',
		width: '100%',
		height: 24,
	},

	time_container: {
		flexDirection: 'row',
		height: 16,
		padding:1
	},

	clock_img : {
		width : 14,
		height: 14,
		marginLeft: 10,
		resizeMode:'cover',
	},

	time_txt : {
		fontSize : 13,
		color : 'black',
		marginLeft: 10,
	},

	favorite_icon : {
		position: 'absolute', 
		margin: 10,
		marginRight: 20,
		right : 0,
		top : 5,
		width : 40,
		height : 40,
	},

	favorite_icon_wrapper: {
		position: 'absolute', 
		right : 0,
		width : 40,
		height : 40,		
	},

	name_time_container : {
		flexDirection:'row',
		marginTop: 10,
		marginLeft:10,
	},
	name_txt : {
		fontSize : 14,
		color : 'black',
		marginLeft: 10,	
		width: Constants.screenWidth - 160,	
		height: 30,
	},
	message_sent_text : {
		fontSize : 18,
		color : 'black',
		marginLeft: 15,
		marginTop: -2,
		overflow: 'hidden',
		width: '90%',
		height: 23,
	},
});