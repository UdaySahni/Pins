import { Location, Permissions  } from 'expo';

export async function getCurrentLocation() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    this.setState({
      errorMessage: 'Permission to access location was denied',
    });
  }

  let location = await Location.getCurrentPositionAsync({});
  return {
    type: 'CURRENT_LOCATION',
    payload: location
  };
}

export function addLocation(locationDetails) {
  return {
    type: 'ADD_LOCATION',
    payload: locationDetails
  };
}
