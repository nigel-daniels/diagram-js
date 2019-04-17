/* global sinon */

import {
  bootstrapDiagram,
  inject
} from 'test/TestHelper';

import frameInteractionModule from 'lib/features/frame-interaction';

import selectionModule from 'lib/features/selection';

var LOW_PRIORITY = 500;

describe('features/frame-interaction', function() {

  beforeEach(bootstrapDiagram({
    modules: [
      frameInteractionModule,
      selectionModule
    ]
  }));

  var rootShape,
      frameShape;

  beforeEach(inject(function(elementFactory, canvas) {

    rootShape = elementFactory.createRoot({
      id: 'root'
    });

    canvas.setRootElement(rootShape);

    frameShape = elementFactory.createShape({
      id: 'frame',
      x: 100, y: 100, width: 300, height: 300,
      frameOnly: true
    });

    canvas.addShape(frameShape);

  }));

  describe('border click detection', function() {

    function verifyBorderClick(border, point) {

      it('should detect on ' + border + ' border', inject(function(eventBus, elementRegistry) {

        // given
        var frameGfx = elementRegistry.getGraphics(frameShape);

        var listenerSpy = sinon.spy(function(e) {

          expect(e.onBorder).to.be.true;
        });

        eventBus.on('element.click', LOW_PRIORITY, listenerSpy);

        // when
        triggerMouseEvent(frameGfx, 'mousemove', point);
        triggerMouseEvent(frameGfx, 'click', point);

        // then
        expect(listenerSpy).to.have.been.called;

      }));
    }

    verifyBorderClick('left vertical', { x: 100, y: 150 });
    verifyBorderClick('right vertical', { x: 400, y: 150 });
    verifyBorderClick('upper horizontal', { x: 250, y: 130 });
    verifyBorderClick('lower horizontal', { x: 250, y: 430 });

    it('should NOT detect on non-border', inject(function(eventBus, elementRegistry) {

      // given
      var frameGfx = elementRegistry.getGraphics(frameShape);

      var listenerSpy = sinon.spy(function(e) {

        expect(e.onBorder).to.be.false;
      });

      eventBus.on('element.click', LOW_PRIORITY, listenerSpy);

      // when
      triggerMouseEvent(frameGfx, 'mousemove');
      triggerMouseEvent(frameGfx, 'click');

      // then
      expect(listenerSpy).to.have.been.called;

    }));


  });

});

// helpers //////////////////////

function triggerMouseEvent(gfx, type, position) {
  var event = mouseEvent(type, position);

  gfx.dispatchEvent(event);

  return event;
}

function mouseEvent(type, position) {

  if (!position) {
    position = {
      x: 0,
      y: 0
    };
  }

  var event = document.createEvent('MouseEvent');

  event.initMouseEvent(
    type, true, true, window,
    0, 0, 0, position.x, position.y,
    false, false, false, false,
    0, null
  );

  return event;
}