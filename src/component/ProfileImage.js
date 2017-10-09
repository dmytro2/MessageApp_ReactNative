import React, {Component} from 'react';
import {
  StyleSheet,
} from 'react-native';

import FastImage from 'react-native-fast-image';

export default class ProfileImage extends React.Component <> {
  render() { 
  	return (
	  <FastImage
	    style={styles.photo}
	    source={{
	      uri: this.props.uri,
	      // headers:{ Authorization: 'someAuthToken' },
	      priority: FastImage.priority.high,
	    }}
	    resizeMode={FastImage.resizeMode.contain}
	  />
  )};
  }

const styles = StyleSheet.create({  
  photo:{
    width:150, 
    height:150, 
    borderRadius: 75, 
    marginLeft:'auto', 
    marginRight: 'auto', 
  },
});