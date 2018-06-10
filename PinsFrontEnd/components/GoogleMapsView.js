import React from 'react';
import { bindActionCreators } from 'redux';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import _ from 'lodash';

class GoogleMapsView extends React.Component {

  pinColorPicker(types) {
    if (types.includes("cafe")) {
      return 'gold';
    }
    else if (types.includes("food")) {
      return 'green';
    }
    else if (types.includes("bar")) {
      return 'navy';
    }
    else {
      return 'indigo';
    }
  }

  renderPins(locationData) {
    var pinColor = this.pinColorPicker(locationData.types);
    return (
      <Marker
        key={`${locationData.name} at (${locationData.latitude},${locationData.longitude})`}
        coordinate={{ latitude: locationData.latitude, longitude: locationData.longitude }}
        title={locationData.name}
        description={locationData.description}
        pinColor={pinColor}
      />
    );
  }

  render() {
    return (
      <MapView
        style={{ flex: 1, paddingTop: 60 }}
        showsUserLocation
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
        {this.props.savedLocations.map((locationData) => this.renderPins(locationData))}
      </MapView>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentLocation: state.currentLocation,
    savedLocations: state.savedLocations
  };
}

export default connect(mapStateToProps)(GoogleMapsView);
