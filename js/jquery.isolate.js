
/*
 * Isolate Plugin for jQuery JavaScript Library
 * 
 * Copyright (c) 2014-2017 Adam J De Lucia
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 * 
 * Author: Adam J De Lucia
 * Version: 1.7.0
 * Date: November 19, 2017
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
                bsSpan: 3,
                columns: 4,
                setup: null,
                start: null,
                complete: null,
            }, options);

            var instanceID = '#' + $(this).attr('id'),
                filtersMap = getFiltersMap(),
                filterMember = null,
                selectedFilter = null,
                filterID = null,
                isoClass = null,
                isolatedEls = [],
                filteredEls = [],
                version = settings.version.toString(),
                majorVersion = Number(version.substring(0, 1));

            // Isolate method
            var isolate = function () {

                selectedFilter = $(this).attr('id');
                isoClass = '.' + selectedFilter;
                filterID = '#' + selectedFilter;

                var map = filtersMap;

                // Callback function before any filter actions begin
                $.isFunction(settings.start) && settings.start.call(this, map, selectedFilter);

                $(instanceID).trigger('isolate.filter.start', [this, map, selectedFilter]);

                // Resets all iso-els before isolating the selected ones
                settings.filteredList.find(settings.iso).show();

                // Handles faceted isolation
                for (var _filter in map) {

                    if (_filter === selectedFilter && map[_filter] === 'isInactive') {

                        // Adds the selected class to the array of isolated elements
                        isolatedEls.push(isoClass);

                        // Isolates the selected elements
                        settings.filteredList.find($(settings.iso).not(isolatedEls.toString())).hide();

                        // Sets the filter state
                        map[_filter] = 'isActive';

                        // Sets the active filter styles
                        settings.filters.find(filterID).addClass('active');

                        break;

                    } else if (_filter === selectedFilter && map[_filter] === 'isActive') {

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

                        // Sets the filter state
                        map[_filter] = 'isInactive';

                        // Sets inactive filter styles
                        settings.filters.find(filterID).removeClass('active');

                        break;
                    }
                }

                // Callback function after all filter actions are complete
                $.isFunction(settings.complete) && settings.complete.call(this, map, selectedFilter, isolatedEls);

                $(instanceID).trigger('isolate.filter.complete', [this, map, selectedFilter, isolatedEls]);
            };

            // Filter method
            var filter = function () {

                selectedFilter = $(this).attr('id');
                isoClass = '.' + selectedFilter;
                filterID = '#' + selectedFilter;

                var map = filtersMap;

                // Callback function before any filter actions begin
                $.isFunction(settings.start) && settings.start.call(this, map, selectedFilter);

                $(instanceID).trigger('isolate.filter.start', [this, map, selectedFilter]);

                // Resets all iso-els before filtering the selected ones
                settings.filteredList.find(settings.iso).show();

                // Handles faceted filtering
                for (var _filter in map) {

                    if (_filter === selectedFilter && map[_filter] === 'isInactive') {

                        // Adds the selected class to the array of filtered elements
                        filteredEls.push(isoClass);

                        // Filters the selected elements
                        settings.filteredList.find(filteredEls.toString()).hide();

                        // Sets the filter state
                        map[_filter] = 'isActive';

                        // Sets the active filter styles
                        settings.filters.find(filterID).addClass('active');

                        break;

                    } else if (_filter === selectedFilter && map[_filter] === 'isActive') {

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

                        // Sets the filter state
                        map[_filter] = 'isInactive';

                        // Sets inactive filter styles
                        settings.filters.find(filterID).removeClass('active');

                        break;
                    }
                }

                // Callback function after all filter actions are complete
                $.isFunction(settings.complete) && settings.complete.call(this, map, selectedFilter, filteredEls);

                $(instanceID).trigger('isolate.filter.complete', [this, map, selectedFilter, filteredEls]);
            };

            // Evaluates what scaffolding system, if any, was called and takes the appropriate action
            if (settings.bootstrap === true || settings.isoGrid === true) {

                // Constructs the grid class based on user input
                var gridClass = '';

                if (settings.bootstrap === true) {

                    gridClass = 'col';

                } else {

                    gridClass = 'iso';
                }

                if (settings.breakpoint !== null && $.trim(settings.breakpoint) !== '') {

                    gridClass += '-' + settings.breakpoint;
                }

                if (settings.bootstrap === true && settings.bsSpan !== null && $.trim(settings.bsSpan) !== '') {

                    gridClass += '-' + settings.bsSpan;
                }

                if (settings.isoGrid === true && settings.columns !== null && $.trim(settings.columns) !== '') {

                    gridClass += '-' + settings.columns;
                }

                // Sets the grid class
                settings.filteredList.find(settings.iso).addClass(gridClass);


                // Validates the grid class based on Bootstrap version
                var classValidation = gridClass.split('-');

                if (majorVersion === 3) {

                    // Version 3 must have col, breakpoint and span
                    if (classValidation.length !== 3) {

                        alert('Bootstrap 3 requires both breakpoint and bsSpan options. Please check your configuration.');
                    }

                    // Validates breakpoint
                    if (['xs', 'sm', 'md', 'lg'].indexOf(settings.breakpoint) === -1) {

                        alert('Bootstrap 3 supports breakpoints xs, sm, md and lg. You entered ' + settings.breakpoint + '.\n\n Please use a supported breakpoint.');
                    }

                    // Validates span
                    if (isNaN(settings.bsSpan)) {

                        alert('Bootstrap 3 supports numbers for bsSpan. You entered ' + settings.bsSpan + '.\n\n Please enter a supported bsSpan as a number or string.');
                    }
                }

                if (majorVersion === 4) {

                    // Validates breakpoint
                    if (settings.breakpoint !== null && $.trim(settings.breakpoint) !== '' && ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(settings.breakpoint) === -1) {

                        alert('Bootstrap 4 supports breakpoints xs, sm, md, lg and xl. You entered ' + settings.breakpoint + '.\n\n Please use a supported breakpoint.');
                    }

                    // Validates span
                    if (settings.bsSpan !== null && $.trim(settings.bsSpan) !== '') {

                        if (typeof settings.bsSpan !== 'number' && typeof settings.bsSpan !== 'string') {

                            alert('Bootstrap 4 supports only a number or auto for bsSpan. You entered ' + settings.bsSpan + '.\n\n Please enter a supported bsSpan as a number or string. Also, null or an empty string is valid.');
                        }

                        if (typeof settings.bsSpan === 'string' && settings.bsSpan !== 'auto' && isNaN(settings.bsSpan)) {

                            alert('Bootstrap 4 supports only a number or auto for bsSpan. You entered ' + settings.bsSpan + '.\n\n Please enter a supported bsSpan as a number or string. Also, null or an empty string is valid.');
                        }
                    }
                }
            }

            // Callback function after plugin is setup
            $.isFunction(settings.setup) && settings.setup.call(this, filtersMap);

            setTimeout(function () {

                $(instanceID).trigger('isolate.setup', [filtersMap]);

            }, 200);

            // Namespaced click events for isolate and filter settings
            if (settings.isolate === true) {

                settings.filters.on('click.isolate', settings.filterClass, isolate);

            } else {

                settings.filters.on('click.isolate', settings.filterClass, filter);
            }

            // Global method to create an object of available filters
            function getFiltersMap() {

                var activeFiltersMap = {};

                settings.filters.find(settings.filterClass).each(function (index) {

                    filterMember = $(this).attr('id');

                    activeFiltersMap[filterMember] = 'isInactive';
                });

                return activeFiltersMap;
            }
        });
    };
}(jQuery));
