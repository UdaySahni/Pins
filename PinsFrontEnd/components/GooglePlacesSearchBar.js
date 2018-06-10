import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


import { getCurrentLocation, addLocation } from '../actions/index';

class GooglePlacesSearchBar extends React.Component {

  onSearchPress(data, details) {
    console.log(details.types);
    this.props.addLocation({
      address: details.formatted_address,
      latitude: details.geometry.location.lat,
      longitude: details.geometry.location.lng,
      name: details.name,
      description: data.description,
      types: details.types
    });
  }

  render() {
    return (
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
          container:{
            position: 'absolute',
            top: 0,
            width: '100%'
          },
          textInputContainer: {
            width: '100%'
          },
          description: {
            fontWeight: 'bold'
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          },
          listView: {
            backgroundColor: 'white',
          },
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
    );
  }
}

function mapStateToProps(state) {
  return {
    currentLocation: state.currentLocation
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getCurrentLocation: getCurrentLocation,
    addLocation: addLocation
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GooglePlacesSearchBar);
