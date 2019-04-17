import {
  getBBox as getBoundingBox,
  isFrameElement
} from '../../util/Elements';

var DEFAULT_OFFSET = 10;

export default function FrameInteractionBehavior(mouseTracking, selection, eventBus) {

  this._mouseTracking = mouseTracking;
  this._selection = selection;

  var self = this;

  function minimizeInteractionArea(event) {

    var element = event.element;

    if (!isFrameElement(element)) {
      return;
    }

    var hoverContext = self._mouseTracking.getHoverContext(),
        hoveredPoint = hoverContext.point;

    // decorate event with additional information whether event
    // is happened on the border of an container element
    event.onBorder = isOnBorder(hoveredPoint, element);

  }

  function preventNonBorderDrag(event) {
    var element = event.element;

    if (isFrameElement(element) && !self._selection.isSelected(element)) {
      event.element = element.parent;
    }
  }

  function preventFrameHover(event) {
    var element = event.element;

    if (isFrameElement(element)) {
      event.element = element.parent;
    }
  }

  eventBus.on('element.click', function(event) {
    minimizeInteractionArea(event);
  });

  eventBus.on('element.mousedown', function(event) {
    preventNonBorderDrag(event);
  });

  eventBus.on('element.hover', function(event) {
    preventFrameHover(event);
  });

}

FrameInteractionBehavior.$inject = [
  'mouseTracking',
  'selection',
  'eventBus'
];

// helper ///////////////

function inRange(num, min, max) {
  return num >= min && num <= max;
}

function isOnVerticalBorder(point, bbox) {
  return inRange(point.y, bbox.y, bbox.y + bbox.height);
}

function isOnHorizontalBorder(point, bbox) {
  return inRange(point.x, bbox.x, bbox.x + bbox.width);
}

function isOnBorder(point, element, offset) {
  var bbox = getBoundingBox(element);

  // allow a few pixels around
  offset = offset || DEFAULT_OFFSET;

  return isOnHorizontalBorder(point, bbox) && (
    inRange(point.y, bbox.y - offset, bbox.y + offset) || // upper
    inRange(point.y, bbox.y + bbox.height - offset, bbox.y + bbox.height + offset) // lower
  ) || isOnVerticalBorder(point, bbox) && (
    inRange(point.x, bbox.x - offset, bbox.x + offset) || // left
    inRange(point.x, bbox.x + bbox.width - offset,bbox.x + bbox.width + offset) // right
  );
}