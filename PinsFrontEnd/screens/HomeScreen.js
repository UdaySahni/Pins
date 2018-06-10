import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebBrowser, Constants, Location, Permissions  } from 'expo';
import { MonoText } from '../components/StyledText';
import MapView, { Marker } from 'react-native-maps';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import GooglePlacesSearchBar from '../components/GooglePlacesSearchBar';
import GoogleMapsView from '../components/GoogleMapsView';
import { getCurrentLocation, addLocation } from '../actions/index';

class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.props.getCurrentLocation();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <GoogleMapsView />
        <GooglePlacesSearchBar />
        <Text style={styles.baseText}>
          Legend:{"\n"}
            Gold: Cafe,{"\n"}
            Green: Restaurant,{"\n"}
            Blue: Bar,{"\n"}
            Purple: POI{"\n"}
        </Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
  baseText: {
    position: 'absolute',
    top: 50,
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCurrentLocation: getCurrentLocation,
  }, dispatch);
}


export default connect(null, mapDispatchToProps)(HomeScreen);
