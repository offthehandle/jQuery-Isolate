﻿
/*
 * Isolate Plugin for jQuery JavaScript Library
 * 
 * Copyright (c) 2014-2017 Adam J De Lucia
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 * 
 * Author: Adam J De Lucia
 * Version: 1.3.0
 * Date: June 5, 2017
 * 
 */

(function ($) {
    $.fn.isolate = function (options) {
        this.each(function () {
            var settings = $.extend({
                isolate: true,
                filters: $('#iso-filters'),
                filteredList: $('#isos'),
                filterClass: '.filter',
                iso: 'li',
                isoGrid: false,
                bootstrap: true,
                version: 3,
                breakpoint: 'md',
                columns: 3,
                bootstrap2row: 'bootstrap-2-row',
                setup: null,
                start: null,
                complete: null,
            }, options);

            var availableFilter = '',
                selectedFilter = '',
                filterID = '',
                isoClass = '',
                isolatedEls = [],
                filteredEls = [];

            // Parses version user input to a major release
            var str = settings.version.toString();
            var version = str.substring(0, 1);

            // Instantiates an object to track the state of available filters
            var availableFiltersObj = makeFiltersObject();

            // Isolate method
            var isolate = function () {

                selectedFilter = $(this).attr('id');
                isoClass = '.' + selectedFilter;
                filterID = '#' + selectedFilter;

                var f = availableFiltersObj;

                // Callback function before any filter actions begin
                $.isFunction(settings.start) && settings.start.call(this);

                // TODO : enrich event with data
                $(this).trigger('isolate.filter.start');

                // Resets all iso-els before isolating the selected ones
                settings.filteredList.find(settings.iso).show();

                // Handles faceted isolation
                for (var item in f) {

                    if (item === selectedFilter && f[item] === 'isInactive') {

                        // Adds the selected class to the array of isolated elements
                        isolatedEls.push(isoClass);

                        // Isolates the selected elements
                        settings.filteredList.find($(settings.iso).not(isolatedEls.toString())).hide();
                        rowStart();

                        // Sets the filter state
                        f[item] = 'isActive';

                        // Sets the active filter styles
                        settings.filters.find(filterID).addClass('active');

                        break;

                    } else if (item === selectedFilter && f[item] === 'isActive') {

                        // Finds the selected active class in the array of isolated elements
                        for (var i = 0, l = isolatedEls.length; i < l; i++) {

                            if (isolatedEls[i] === isoClass) {

                                // Removes the class from the array
                                isolatedEls.splice(i, 1);

                                break;
                            }
                        }

                        // Isolates the selected elements if the array is not empty
                        if (isolatedEls.length) {

                            settings.filteredList.find($(settings.iso).not(isolatedEls.toString())).hide();
                        }

                        rowStart();

                        // Sets the filter state
                        f[item] = 'isInactive';

                        // Sets inactive filter styles
                        settings.filters.find(filterID).removeClass('active');

                        break;
                    }
                }

                // Callback function after all filter actions are complete
                $.isFunction(settings.complete) && settings.complete.call(this);

                // TODO : enrich event with data
                $(this).trigger('isolate.filter.complete');
            };

            // Filter method
            var filter = function () {

                selectedFilter = $(this).attr('id');
                isoClass = '.' + selectedFilter;
                filterID = '#' + selectedFilter;

                var f = availableFiltersObj;

                // Callback function before any filter actions begin
                $.isFunction(settings.start) && settings.start.call(this);

                // TODO : enrich event with data
                $(this).trigger('isolate.filter.start');

                // Resets all iso-els before filtering the selected ones
                settings.filteredList.find(settings.iso).show();

                // Handles faceted filtering
                for (var item in f) {

                    if (item === selectedFilter && f[item] === 'isInactive') {

                        // Adds the selected class to the array of filtered elements
                        filteredEls.push(isoClass);

                        // Filters the selected elements
                        settings.filteredList.find(filteredEls.toString()).hide();
                        rowStart();

                        // Sets the filter state
                        f[item] = 'isActive';

                        // Sets the active filter styles
                        settings.filters.find(filterID).addClass('active');

                        break;

                    } else if (item === selectedFilter && f[item] === 'isActive') {

                        // Finds the selected active class in the array of filtered elements
                        for (var i = 0, l = filteredEls.length; i < l; i++) {

                            if (filteredEls[i] === isoClass) {

                                // Removes the class from the array
                                filteredEls.splice(i, 1);

                                break;
                            }
                        }

                        // Filters the selected elements if the array is not empty
                        if (filteredEls.length) {

                            settings.filteredList.find(filteredEls.toString()).hide();
                        }

                        rowStart();

                        // Sets the filter state
                        f[item] = 'isInactive';

                        // Sets inactive filter styles
                        settings.filters.find(filterID).removeClass('active');

                        break;
                    }
                }

                // Callback function after all filter actions are complete
                $.isFunction(settings.complete) && settings.complete.call(this);

                // TODO : enrich event with data
                $(this).trigger('isolate.filter.complete');
            };

            // Evaluates what scaffolding system, if any, was called and takes the appropriate action
            if (settings.bootstrap === true || settings.isoGrid === true) {

                if (settings.bootstrap === true) {

                    if (version === '3') {

                        // Automatic generation of Bootstrap 3 scaffolding
                        settings.filteredList.find(settings.iso).addClass('col-' + settings.breakpoint + '-' + settings.columns);

                    } else if (version === '2') {

                        // Automatic generation of Bootstrap 2 scaffolding
                        settings.filteredList.find(settings.iso).addClass('span' + settings.columns);

                        // Sets the class to remove left margin from elements that start a row
                        rowStart();

                    } else {

                        // Alerts the outputted Bootstrap version number if a conflict is found
                        // Only 2 or 3 is supported. The ouputted version is the major release parsed from user input
                        alert('Isolate supports Bootstrap versions 2 and 3. You entered version ' + version + '.\n\n Please use a supported version.');
                    }
                } else {

                    // Automatic generation of built-in scaffolding classes
                    settings.filteredList.find(settings.iso).addClass('iso-col-' + settings.columns);
                }
            }

            // Callback function after plugin is setup
            $.isFunction(settings.setup) && settings.setup.call(this);

            // TODO : Trigger event from jQuery object to which isolate is assigned
            $(document).trigger('isolate.setup');

            // Namespaced click events for isolate and filter settings
            if (settings.isolate === true) {

                settings.filters.on('click.isolate', settings.filterClass, isolate);

            } else {

                settings.filters.on('click.isolate', settings.filterClass, filter);
            }

            // Global method to create an object of available filters
            function makeFiltersObject() {

                var filtersObject = {};

                settings.filters.find(settings.filterClass).each(function (index) {

                    availableFilter = $(this).attr('id');

                    filtersObject[availableFilter] = 'isInactive';
                });

                return filtersObject;
            }

            // Global function for Bootstrap 2 scaffolding
            // Applies CSS class to remove the left margin from elements that start a row
            function rowStart() {

                if (settings.bootstrap === true && version === '2') {

                    settings.filteredList.find(settings.iso).removeClass(settings.bootstrap2row);

                    settings.filteredList.find(settings.iso).filter(function () {

                        return $(this).css('display') != 'none';

                    }).each(function (index) {

                        if (settings.columns > 6) {

                            $(this).addClass(settings.bootstrap2row);

                        } else if (settings.columns === 5 || settings.columns === 6) {

                            if (index % 2 === 0) {

                                $(this).addClass(settings.bootstrap2row);
                            }

                        } else if ((index + 1) % (12 / settings.columns + 1) === 0) {

                            $(this).addClass(settings.bootstrap2row);
                        }
                    });
                }
            }
        });
    };
}(jQuery));
