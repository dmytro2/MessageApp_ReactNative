import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import {   
  Button,
} from 'react-native-elements';

import PopupDialog from 'react-native-popup-dialog';

import Color from '../constants/Color';
import Lang from '../constants/LangCN';

export default class Alert extends React.Component <> {
  render() {
    return (
        <PopupDialog width={240} height={160} 
         ref={(popupAlert) => { this.props.container.alert = popupAlert; }} >
          
          <Text style={styles.textMessage}>
          {this.props.message}</Text>

          <Button raised
            title = {this.props.buttonText}
            buttonStyle={styles.buttonChange}
            onPress={()=>{this.props.container.alert.dismiss();}}
            fontSize={20}
            color={Color.tintColor}
          />     
        </PopupDialog> 
    )
  }

}   


const styles = StyleSheet.create({ 

  textMessage:{
    textAlign:'center',
    fontSize:20, 
    width: '100%',
    marginTop: 40,
    marginBottom: 30
  },

  buttonChange: {
    width: 160,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
    backgroundColor: Color.titleBarBgColor,
  }

});
