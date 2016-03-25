/**
 * @author artfable
 * 25.03.16
 */

/**
 * Need ES6, so not work in IE and old browsers 
 */
;(() => {
    'use strict';

    window.Slider = class {
        constructor(effectDuration = 800, timeOut = 2200) {
            this.effectDuration = effectDuration;
            this.timeOut = timeOut;
        }

        static arrayToList(array) {
            let first = {};
            let list = first;
            $.each(array, (index, item) => {
                list.next = {data: item};
                list = list.next;
            });
            return list.next = first.next;
        }

        slide(prev, next) {
            $(prev).fadeOut(this.effectDuration, function() {$(this).css('position', 'absolute');});
            $(next).fadeIn(this.effectDuration, function() {$(this).css('position', 'relative');});
        }

        start(elements) {
            [].slice.call(elements, 1).forEach(element => {
                $(element).css('display', 'none');
            });
            let list = Slider.arrayToList(elements);
            setInterval(() => {
                this.slide(list.data, list.next.data);
                list = list.next;
            }, this.timeOut);
        }
    };
})();