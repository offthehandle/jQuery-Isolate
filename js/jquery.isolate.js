
/*
 * Isolate Plugin for jQuery JavaScript Library
 * 
 * Copyright (c) 2014-2017 Adam J De Lucia
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 * 
 * Author: Adam J De Lucia
 * Version: 1.6.0
 * Date: November 14, 2017
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
                bs2row: 'bootstrap-2-row',
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

                    if (majorVersion === 4) {

                        if (['xs', 'sm', 'md', 'lg', 'xl'].indexOf(settings.breakpoint) > -1 || settings.breakpoint === null || $.trim(settings.breakpoint) === '') {

                            // Automatic generation of Bootstrap 4 scaffolding
                            if (['sm', 'md', 'lg', 'xl'].indexOf(settings.breakpoint) > -1) {

                                settings.filteredList.find(settings.iso).addClass('col-' + settings.breakpoint + '-' + settings.bsSpan);

                            } else {

                                settings.filteredList.find(settings.iso).addClass('col-' + settings.bsSpan);
                            }

                        } else {

                            // Alerts the outputted Bootstrap breakpoint if a conflict is found
                            // All breakpoints are supported.
                            alert('Isolate supports all Bootstrap 4 breakpoints, including xl, lg, md, sm and, for extra small, xs, null or an empty string. You entered ' + settings.breakpoint + '.\n\n Please use a supported breakpoint.');
                        }

                    } else if (majorVersion === 3) {

                        if (['xs', 'sm', 'md', 'lg'].indexOf(settings.breakpoint) > -1) {

                            // Automatic generation of Bootstrap 3 scaffolding
                            settings.filteredList.find(settings.iso).addClass('col-' + settings.breakpoint + '-' + settings.bsSpan);

                        } else {

                            // Alerts the outputted Bootstrap breakpoint if a conflict is found
                            // All breakpoints are supported.
                            alert('Isolate supports all Bootstrap 3 breakpoints, including lg, md, sm and xs. You entered ' + settings.breakpoint + '.\n\n Please use a supported breakpoint.');
                        }

                    } else if (majorVersion === 2) {

                        // Automatic generation of Bootstrap 2 scaffolding
                        settings.filteredList.find(settings.iso).addClass('span' + settings.bsSpan);

                        // Sets the class to remove left margin from elements that start a row
                        setClassFixBS2();

                    } else {

                        // Alerts the outputted Bootstrap version number if a conflict is found
                        // 2 through 4 is supported. The ouputted version is the major release parsed from user input
                        alert('Isolate supports Bootstrap versions 2 through 4. You entered version ' + majorVersion + '.\n\n Please use a supported version.');
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

                    settings.filteredList.find(settings.iso).removeClass(settings.bs2row);

                    settings.filteredList.find(settings.iso).filter(function () {

                        return $(this).css('display') !== 'none';

                    }).each(function (index) {

                        if (settings.bsSpan > 6) {

                            $(this).addClass(settings.bs2row);

                        } else if (settings.bsSpan === 5 || settings.bsSpan === 6) {

                            if (index % 2 === 0) {

                                $(this).addClass(settings.bs2row);
                            }

                        } else if ((index + 1) % (12 / settings.bsSpan + 1) === 0) {

                            $(this).addClass(settings.bs2row);
                        }
                    });
                }
            }
        });
    };
}(jQuery));
