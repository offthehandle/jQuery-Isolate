
/*
 * Isolate Plugin for jQuery JavaScript Library
 * 
 * Copyright (c) 2014-2017 Adam J De Lucia
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 * 
 * Author: Adam J De Lucia
 * Version: 1.5.0
 * Date: June 7, 2017
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
                bootstrap2row: 'bootstrap-2-row',
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
                        setClassFixBS2();

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

                        setClassFixBS2();

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
                        setClassFixBS2();

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

                        setClassFixBS2();

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

                if (settings.bootstrap === true) {

                    if (majorVersion === 3) {

                        // Automatic generation of Bootstrap 3 scaffolding
                        settings.filteredList.find(settings.iso).addClass('col-' + settings.breakpoint + '-' + settings.bsSpan);

                    } else if (majorVersion === 2) {

                        // Automatic generation of Bootstrap 2 scaffolding
                        settings.filteredList.find(settings.iso).addClass('span' + settings.bsSpan);

                        // Sets the class to remove left margin from elements that start a row
                        setClassFixBS2();

                    } else {

                        // Alerts the outputted Bootstrap version number if a conflict is found
                        // Only 2 or 3 is supported. The ouputted version is the major release parsed from user input
                        alert('Isolate supports Bootstrap versions 2 and 3. You entered version ' + majorVersion + '.\n\n Please use a supported version.');
                    }

                } else {

                    // Automatic generation of built-in scaffolding classes
                    settings.filteredList.find(settings.iso).addClass('iso-' + settings.breakpoint + '-' + settings.columns);
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

            // Global function for Bootstrap 2 scaffolding
            // Applies CSS class to remove the left margin from elements that start a row
            function setClassFixBS2() {

                if (settings.bootstrap === true && majorVersion === 2) {

                    settings.filteredList.find(settings.iso).removeClass(settings.bootstrap2row);

                    settings.filteredList.find(settings.iso).filter(function () {

                        return $(this).css('display') !== 'none';

                    }).each(function (index) {

                        if (settings.bsSpan > 6) {

                            $(this).addClass(settings.bootstrap2row);

                        } else if (settings.bsSpan === 5 || settings.bsSpan === 6) {

                            if (index % 2 === 0) {

                                $(this).addClass(settings.bootstrap2row);
                            }

                        } else if ((index + 1) % (12 / settings.bsSpan + 1) === 0) {

                            $(this).addClass(settings.bootstrap2row);
                        }
                    });
                }
            }
        });
    };
}(jQuery));
