import Grid from './Grid';
import GridSnapping from './GridSnapping';

import BehaviorModule from './behavior';

export default {
  __depends__: [ BehaviorModule ],
  __init__: [ 'grid', 'gridSnapping' ],
  grid: [ 'type', Grid ],
  gridSnapping: [ 'type', GridSnapping ]
};