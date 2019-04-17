import InteractionEventsModule from '../interaction-events';
import OutlineModule from '../outline';
import FrameInteraction from '../frame-interaction';

import Selection from './Selection';
import SelectionVisuals from './SelectionVisuals';
import SelectionBehavior from './SelectionBehavior';


export default {
  __init__: [ 'selectionVisuals', 'selectionBehavior' ],
  __depends__: [
    InteractionEventsModule,
    OutlineModule,
    FrameInteraction
  ],
  selection: [ 'type', Selection ],
  selectionVisuals: [ 'type', SelectionVisuals ],
  selectionBehavior: [ 'type', SelectionBehavior ]
};
