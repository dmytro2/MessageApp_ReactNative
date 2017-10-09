import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// import Lang from '../constants/LangCN';

export default class MessageDetail extends Component {

	render() {
		return (
			<View style={styles.container}>
		        <Text style={styles.title}>
              
		        </Text>	        
		  </View>
	    );
	}

};

const styles = StyleSheet.create({
  container: {
    width:'100%',
    height: '100%',
    backgroundColor:'#fff',
  },

  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  }
});