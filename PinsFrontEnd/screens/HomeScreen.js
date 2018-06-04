import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebBrowser, Constants, Location, Permissions  } from 'expo';
import { MonoText } from '../components/StyledText';
import MapView, { Marker } from 'react-native-maps';
import { SearchBar } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentLocation, addLocation } from '../actions/index';

class HomeScreen extends React.Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.78825,
        latitudeDelta: 0.0922,
        longitude: -122.4324,
        longitudeDelta: 0.0421,
      }
    };
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this.props.getCurrentLocation();
    }
  }

  onSearchPress(data, details) {
    this.props.addLocation({
      address: details.formatted_address,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      name: details.name,
      description: data.description
    });
  }

  renderPins(locationData) {
    return (
      <Marker
        key={`${locationData.name} at (${locationData.latitude},${locationData.longitude})`}
        coordinate={{ latitude: locationData.latitude, longitude: locationData.longitude }}
        title={locationData.name}
        description={locationData.description}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          ref = {(instance) => { this.GooglePlacesRef = instance }}
          placeholder='Search'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed={true}    // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            this.GooglePlacesRef.setAddressText("");
            this.onSearchPress(data, details);
          }}
          getDefaultValue={() => ''}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyCVhPSA6i80ltN_9v5CE-o_F_m3VXp35dU',
            language: 'en', // language of the results
            location: `${this.props.currentLocation.latitude},${this.props.currentLocation.longitude}`,
            radius: 5000,
            components: 'country:ca'
          }}
          styles={{
            container: {
                zIndex: 10,
                overflow: 'visible',
                height: 50,
                flexGrow: 1,
                flexShrink: 0
            },
            textInputContainer: {
                width: '100%',
            },
            description: {
                fontWeight: 'bold',
            },
            listView: {
              position: 'absolute',
              top: 60,
              left: 10,
              right: 10,
              backgroundColor: 'white',
              borderRadius: 5,
              flex: 1,
              elevation: 3,
              zIndex: 10
            },
            separator: {
                opacity: 0
            }
          }}
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            rankby: 'distance',
            types: 'food'
          }}
          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
        />

        <MapView
          style={{ flex: 1, paddingTop: 60 }}
          region={{
            latitude: this.props.currentLocation.latitude,
            latitudeDelta: 0.0922,
            longitude: this.props.currentLocation.longitude,
            longitudeDelta: 0.0421
          }}
          mapPadding={{
            top: 60
          }}
          onRegionChange={(region) => _.debounce((region) => {this.onRegionChange(region)}, 1)}
        >
          {this.props.savedLocations.map(this.renderPins)}
        </MapView>
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
});

function mapStateToProps(state) {
  return {
    currentLocation: state.currentLocation,
    savedLocations: state.savedLocations
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCurrentLocation: getCurrentLocation,
    addLocation: addLocation
  }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
