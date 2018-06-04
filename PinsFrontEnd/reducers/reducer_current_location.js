export default function(state = {latitude: 43, longitude: -79}, action) {
  switch (action.type) {
    case 'CURRENT_LOCATION':
      return {
        latitude: action.payload.coords.latitude,
        longitude: action.payload.coords.longitude
      }
  }
  return state;
}
