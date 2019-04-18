import inherits from 'inherits';

import CommandInterceptor from '../../../command/CommandInterceptor';

import {
  assign,
  isString
} from 'min-dash';


/**
 * Integrates resizing with grid snapping.
 */
export default function ResizeBehavior(eventBus, gridSnapping) {
  CommandInterceptor.call(this, eventBus);

  this._gridSnapping = gridSnapping;

  var self = this;

  this.preExecute('shape.resize', function(event) {
    var context = event.context,
        hints = context.hints || {},
        autoResize = hints.autoResize;

    if (!autoResize) {
      return;
    }

    var shape = context.shape,
        newBounds = context.newBounds;

    if (isString(autoResize)) {
      return self.snapComplex(shape, newBounds, autoResize);
    }

    self.snapSimple(shape, newBounds);
  });
}

ResizeBehavior.$inject = [
  'eventBus',
  'gridSnapping',
  'modeling'
];

inherits(ResizeBehavior, CommandInterceptor);

/**
 * Snap width and height in relation to center.
 *
 * @param {djs.model.shape} shape - Shape.
 * @param {Object} newBounds - New bounds of shape.
 * @param {number} newBounds.x - New x of shape.
 * @param {number} newBounds.y - New y of shape.
 * @param {number} newBounds.width - New width of shape.
 * @param {number} newBounds.height - New height of shape.
 */
ResizeBehavior.prototype.snapSimple = function(shape, newBounds) {
  var gridSnapping = this._gridSnapping;

  newBounds.width = gridSnapping.snapValue(newBounds.width, {
    min: newBounds.width
  });

  newBounds.height = gridSnapping.snapValue(newBounds.height, {
    min: newBounds.height
  });

  newBounds.x = shape.x + (shape.width / 2) - (newBounds.width / 2);
  newBounds.y = shape.y + (shape.height / 2) - (newBounds.height / 2);
};

/**
 * Snap x, y, width and height according to given directions.
 *
 * @param {djs.model.shape} shape - Shape.
 * @param {Object} newBounds - New bounds of shape.
 * @param {number} newBounds.x - New x of shape.
 * @param {number} newBounds.y - New y of shape.
 * @param {number} newBounds.width - New width of shape.
 * @param {number} newBounds.height - New height of shape.
 * @param {string} directions - Directions as {n|w|s|e}.
 */
ResizeBehavior.prototype.snapComplex = function(shape, newBounds, directions) {
  if (/w|e/.test(directions)) {
    this.snapHorizontally(shape, newBounds, directions);
  }

  if (/n|s/.test(directions)) {
    this.snapVertically(shape, newBounds, directions);
  }
};

/**
 * Snap in one or both directions horizontally.
 *
 * @param {djs.model.shape} shape - Shape.
 * @param {Object} newBounds - New bounds of shape.
 * @param {number} newBounds.x - New x of shape.
 * @param {number} newBounds.y - New y of shape.
 * @param {number} newBounds.width - New width of shape.
 * @param {number} newBounds.height - New height of shape.
 * @param {string} directions - Directions as {n|w|s|e}.
 */
ResizeBehavior.prototype.snapHorizontally = function(shape, newBounds, directions) {
  var gridSnapping = this._gridSnapping,
      west = /w/.test(directions),
      east = /e/.test(directions);

  var snappedNewBounds = {};

  snappedNewBounds.width = gridSnapping.snapValue(newBounds.width, {
    min: newBounds.width
  });

  if (east) {

    // handle <we>
    if (west) {
      snappedNewBounds.x = gridSnapping.snapValue(newBounds.x, {
        max: newBounds.x
      });

      snappedNewBounds.width += gridSnapping.snapValue(newBounds.x - snappedNewBounds.x, {
        min: newBounds.x - snappedNewBounds.x
      });
    }

    // handle <e>
    else {
      newBounds.x = newBounds.x + newBounds.width - snappedNewBounds.width;
    }
  }

  // assign snapped x and width
  assign(newBounds, snappedNewBounds);
};

/**
 * Snap in one or both directions vertically.
 *
 * @param {djs.model.shape} shape - Shape.
 * @param {Object} newBounds - New bounds of shape.
 * @param {number} newBounds.x - New x of shape.
 * @param {number} newBounds.y - New y of shape.
 * @param {number} newBounds.width - New width of shape.
 * @param {number} newBounds.height - New height of shape.
 * @param {string} directions - Directions as {n|w|s|e}.
 */
ResizeBehavior.prototype.snapVertically = function(shape, newBounds, directions) {
  var gridSnapping = this._gridSnapping,
      north = /n/.test(directions),
      south = /s/.test(directions);

  var snappedNewBounds = {};

  snappedNewBounds.height = gridSnapping.snapValue(newBounds.height, {
    min: newBounds.height
  });

  if (north) {

    // handle <ns>
    if (south) {
      snappedNewBounds.y = gridSnapping.snapValue(newBounds.y, {
        max: newBounds.y
      });

      snappedNewBounds.height += gridSnapping.snapValue(newBounds.y - snappedNewBounds.y, {
        min: newBounds.y - snappedNewBounds.y
      });
    }

    // handle <n>
    else {
      newBounds.y = newBounds.y + newBounds.height - snappedNewBounds.height;
    }
  }

  // assign snapped y and height
  assign(newBounds, snappedNewBounds);
};