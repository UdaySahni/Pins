import { combineReducers } from 'redux';
import CurrentLocation from './reducer_current_location';
import SavedLocations from './reducer_saved_locations';

const rootReducer = combineReducers({
  currentLocation: CurrentLocation,
  savedLocations: SavedLocations
});

export default rootReducer;
