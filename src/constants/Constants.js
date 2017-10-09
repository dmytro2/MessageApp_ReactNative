import {
  Dimensions,
} from 'react-native';

export default {
	screenHeight: Dimensions.get('window').height,
	screenWidth : Dimensions.get('window').width,
	widthMessageButton: (Dimensions.get('window').width - 40)/3,	
	rootNavigator:{},
	urlPolicy:'http://47.91.236.188:3000/policy.pdf',
	serverUrl:'http://47.91.236.188:3000',
	messageList:{},
	isProfilePhotoChanged:false,
	photoImageUri:'',
	profileScreen: {},
	jsonUser:{},
	jsonMessageReceived:[],

	getSortMessageByDate: function(messages){
	    var array = messages.sort(function(a,b){
	      	return new Date(b.timestamp) - new Date(a.timestamp)
	    })

	    return array;
	}

};