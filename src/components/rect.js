define(['./platform'], function (platform) {
    'use strict';
    var patchForIOS = function (isEnd) {
        if (platform.needSpecialScroll && window !== top) {
            var element = document.createElement('div');
            element.style.cssText = isEnd ?
                'position:absolute;width:0;height:0;visibility:hidden;' :
                'position:absolute;top:0;left:0;width:0;height:0;visibility:hidden;';
            document.body.appendChild(element);
            return element;
        }
        return null;
    };

    var Rect = {    
        get: function (left, top, width, height) {
            return {
                left: left,
                top: top,
                width: width,
                height: height,
                right: left + width,
                bottom: top + height
            }
        },
        scrollingElement: document.scrollingElement || (document.body && platform.isWebkit()
            && document.body) || document.documentElement,
        getterElement: patchForIOS(),
        setterElement: patchForIOS(),
        // for compute scrollheight in ios
        endElement: patchForIOS(true),
        getFromDom: function (element) {
            var clientRect = element.getBoundingClientRect();
            return Rect.get(clientRect.left + Rect.getScrollLeft(), clientRect.top + Rect.getScrollTop(),
                 clientRect.width, clientRect.height);
        },
        getScrollLeft: function () {
            return Rect.scrollingElement.scrollLeft || pageXOffset ||
                (Rect.getterElement && -Rect.getterElement.getBoundingClientRect().left) || 0;
        },
        getScrollTop: function () {
            return Rect.scrollingElement.scrollTop || pageYOffset ||
                (Rect.getterElement && -Rect.getterElement.getBoundingClientRect().top) || 0;
        },
        setScrollTop: function (top) {
            var ele;
            if (ele = Rect.setterElement) {
                ele.style.top = top + 'px';
                ele.scrollIntoView(true);
            }
        },
        _getscroll: function (attr) {
            if (Rect.endElement !== document.body.lastElementChild) {
                document.body.appendChild(Rect.endElement);
            }
            return Rect.endElement.getBoundingClientRect()[attr] -
                Rect.getterElement.getBoundingClientRect()[attr]
        },
        getScrollHeight: function () {
            return Rect.endElement ? Rect._getscroll('top') : Rect.scrollingElement.scrollHeight;
        },
        getScrollWidth: function () {
            return Rect.endElement ? Rect._getscroll('left') : Rect.scrollingElement.scrollWidth;
        },
        overlapping: function (rect1, rect2) {
            return rect1.top <= rect2.bottom && rect2.top <= rect1.bottom
                && rect1.left <= rect2.right && rect2.left <= rect1.right;
        }
    };
    return Rect;
});
