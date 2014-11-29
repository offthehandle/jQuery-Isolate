
/*
 * Isolate Plugin for jQuery JavaScript Library
 * 
 * Copyright (c) 2014 Adam J De Lucia
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 * 
 * Author: Adam J De Lucia
 * Version: 1.2.0
 * Date: November 28, 2014
 * 
 */

$.fn.isolate = function (options) {
    this.each(function () {
        var settings = $.extend({
            filtersBox: $("#iso-filters"),
            isosBox: $("#iso-els"),
            isoWrapper: "li",
            filter: false,
            bootstrap: true,
            version: 3,
            breakpoint: "md",
            colSpan: 3,
            setup: null,
            start: null,
            complete: null,
            columns: false
        }, options);

        // Parses user inputted version down to the major release
        var str = settings.version.toString();
        var version = str.substring(0, 1);

        // Instantiates an object to track the state of available filters
        var availableFiltersObj = makeFiltersObject();

        // Isolate method
        var isolate = function () {
            selectedFilter = $(this).attr("id");
            isoClass = "." + selectedFilter;
            filterID = "#" + selectedFilter;

            var f = availableFiltersObj;

            // Callback function before any filter actions begin
            $.isFunction(settings.start) && settings.start.call(this);

            // Resets all iso-els before isolating the selected ones
            settings.isosBox.find(settings.isoWrapper).show();

            // Handles faceted isolation
            for (var item in f) {
                if (item === selectedFilter && f[item] === "isInactive") {
                    // Adds the selected class to the array isolated elements
                    isolatedEls.push(isoClass);

                    // Isolates the selected elements
                    settings.isosBox.find($(settings.isoWrapper).not(isolatedEls.toString())).hide();
                    rowStart();

                    // Sets the filter state
                    f[item] = "isActive";

                    // Sets the active filter styles
                    settings.filtersBox.find(filterID).addClass("active");
                    break;
                } else if (item === selectedFilter && f[item] === "isActive") {
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
                        settings.isosBox.find($(settings.isoWrapper).not(isolatedEls.toString())).hide();
                    }
                    rowStart();

                    // Sets the filter state
                    f[item] = "isInactive";

                    // Sets inactive filter styles
                    settings.filtersBox.find(filterID).removeClass("active");
                    break;
                }
            }

            // Callback function after all filter actions are complete
            $.isFunction(settings.complete) && settings.complete.call(this);
        };

        // Filter method
        var filter = function () {
            selectedFilter = $(this).attr("id");
            isoClass = "." + selectedFilter;
            filterID = "#" + selectedFilter;

            var f = availableFiltersObj;

            // Callback function before any filter actions begin
            $.isFunction(settings.start) && settings.start.call(this);

            // Resets all iso-els before filtering the selected ones
            settings.isosBox.find(settings.isoWrapper).show();

            // Handles faceted filtering
            for (var item in f) {
                if (item === selectedFilter && f[item] === "isInactive") {
                    // Adds the selected class to the array of filtered elements
                    filteredEls.push(isoClass);

                    // Filters the selected elements
                    settings.isosBox.find(filteredEls.toString()).hide();
                    rowStart();

                    // Sets the filter state
                    f[item] = "isActive";

                    // Sets the active filter styles
                    settings.filtersBox.find(filterID).addClass("active");
                    break;
                } else if (item === selectedFilter && f[item] === "isActive") {
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
                        settings.isosBox.find(filteredEls.toString()).hide();
                    }
                    rowStart();

                    // Sets the filter state
                    f[item] = "isInactive";

                    // Sets inactive filter styles
                    settings.filtersBox.find(filterID).removeClass("active");
                    break;
                }
            }

            // Callback function after all filter actions are complete
            $.isFunction(settings.complete) && settings.complete.call(this);
        };

        // Evaluates what scaffolding system, if any, was called and takes the appropriate action
        if (settings.bootstrap === true || settings.columns === true) {
            if (settings.bootstrap === true) {
                if (version === "3") {
                    // Automatic generation of Bootstrap 3 scaffolding
                    settings.isosBox.find(settings.isoWrapper).addClass("col-" + settings.breakpoint + "-" + settings.colSpan);
                } else if (version === "2") {
                    // Automatic generation of Bootstrap 2 scaffolding
                    settings.isosBox.find(settings.isoWrapper).addClass("span" + settings.colSpan);
                    // Sets the class to remove left margin from elements that start a row
                    rowStart();
                } else {
                    // Alerts the outputted Bootstrap version number if a conflict is found
                    // Only 2 or 3 is supported. The ouputted version is the major release parsed from user input
                    alert("Isolate supports Bootstrap versions 2 and 3. You entered version " + version + ".\n\n Please use a supported version.");
                }
            } else {
                // Automatic generation of built-in scaffolding classes
                settings.isosBox.find(settings.isoWrapper).addClass("iso-col-" + settings.colSpan);
            }
        }

        // Callback function after plugin is setup
        $.isFunction(settings.setup) && settings.setup.call(this);

        // Namespaced click events for isolate and filter settings
        if (settings.filter === true) {
            settings.filtersBox.on("click.isolate", ".filter", filter);
        } else {
            settings.filtersBox.on("click.isolate", ".filter", isolate);
        }

        // Global method to create an object of available filters
        function makeFiltersObject() {
            var filtersObject = {};

            settings.filtersBox.find(".filter").each(function (index) {
                availableFilter = $(this).attr("id");

                filtersObject[availableFilter] = "isInactive";
            });

            return filtersObject;
        }

        // Global function for Bootstrap 2 scaffolding
        // Applies CSS class to remove the left margin from elements that start a row
        function rowStart() {
            if (settings.bootstrap === true && version === "2") {
                settings.isosBox.find(settings.isoWrapper).removeClass("bs-2-row-start");
                settings.isosBox.find(settings.isoWrapper).filter(function () {
                    return $(this).css("display") != "none";
                }).each(function (index) {
                    if (settings.colSpan > 6) {
                        $(this).addClass("bs-2-row-start");
                    } else if (settings.colSpan === 5 || settings.colSpan === 6) {
                        if (index % 2 === 0) {
                            $(this).addClass("bs-2-row-start");
                        }
                    } else if ((index + 1) % (12 / settings.colSpan + 1) === 0) {
                        $(this).addClass("bs-2-row-start");
                    }
                });
            }
        }

        var availableFilter = "",
            selectedFilter = "",
            filterID = "",
            isoClass = "",
            isolatedEls = [],
            filteredEls = [];
    });
};
