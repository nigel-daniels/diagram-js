import FrameInteractionBehavior from './FrameInteractionBehavior';
import MouseTrackingModule from '../mouse-tracking';

export default {
  __depends__: [
    MouseTrackingModule
  ],
  __init__: [ 'frameInteractionBehavior' ],
  frameInteractionBehavior: [ 'type', FrameInteractionBehavior ]
};
