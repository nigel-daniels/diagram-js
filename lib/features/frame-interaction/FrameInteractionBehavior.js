import {
  isFrameElement
} from '../../util/Elements';

import {
  toPoint
} from '../../util/Event';

var DEFAULT_OFFSET = 10;

export default function FrameInteractionBehavior(
    canvas, elementRegistry, selection, eventBus) {

  this._canvas = canvas;
  this._elementRegistry = elementRegistry;
  this._selection = selection;

  var self = this;

  function getGfx(element) {
    return self._elementRegistry.getGraphics(element);
  }

  /**
  * Converts event to a point in canvas container plane in global scale.
  *
  * @param  {Event} event
  * @return {Point}
  */
  function toContainerPoint(event) {
    var clientRect = self._canvas._container.getBoundingClientRect();

    var globalPosition = toPoint(event);

    return {
      x: globalPosition.x - clientRect.left,
      y: globalPosition.y - clientRect.top
    };
  }


  function minimizeInteractionArea(event) {

    var element = event.element;

    if (!isFrameElement(element)) {
      return;
    }

    // var point = toContainerPoint(event.originalEvent);
    var point = toPoint(event.originalEvent);

    var gfx = getGfx(element);

    // decorate event with additional information whether event
    // is happened on the border of an container element
    event.onBorder = isOnBorder(point, gfx);

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
  'canvas',
  'elementRegistry',
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

function isOnBorder(point, gfx, offset) {

  var bbox = gfx.getBoundingClientRect();

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