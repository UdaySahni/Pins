import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebBrowser } from 'expo';
import { MonoText } from '../components/StyledText';
import MapView, { Marker } from 'react-native-maps';
import { SearchBar } from 'react-native-elements'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import _ from 'lodash';
import { connect } from 'react-redux';
import { selectBook } from '../actions/index';
import { bindActionCreators } from 'redux';

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
      },
    };
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    return (
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed={true}    // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}

          getDefaultValue={() => ''}

          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyCVhPSA6i80ltN_9v5CE-o_F_m3VXp35dU',
            language: 'en', // language of the results
            types: 'establishment' // default: 'geocode'
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

          currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
          currentLocationLabel="Current location"
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
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
          region={this.state.region}
          mapPadding={{
            top: 60
          }}
          onRegionChange={(region) => _.debounce((region) => {this.onRegionChange(region)}, 1)}
        >
          <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title={'Title'}
          description={'Description'}
          />
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
    books: state.books
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({selectBook: selectBook}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
