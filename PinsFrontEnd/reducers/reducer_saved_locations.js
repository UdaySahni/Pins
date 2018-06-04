export default function(state = [], action) {
  switch (action.type) {
    case 'ADD_LOCATION':
      return [action.payload, ...state];
  }
  return state;
}
