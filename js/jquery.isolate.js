
/*
 * Isolate Plugin for jQuery JavaScript Library
 * 
 * Copyright (c) 2014 Adam J De Lucia
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 * 
 * Author: Adam J De Lucia
 * Version: 1.1.1
 * Date: October 5, 2014
 * 
 */

$.fn.isolate = function (options) {
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
        complete: null,
        columns: false
    }, options);

    var str = settings.version.toString();
    var version = str.substring(0, 1);

    var isolate = function () {
        currentIso = $(this).attr("id");
        iso = "." + currentIso;
        active = "#" + currentIso;
        els = settings.isosBox.find($(settings.isoWrapper).not(iso));

        if (currentIso != oldIso && oldIso != "") {
            settings.isosBox.find($(settings.isoWrapper).not("." + oldIso)).show();
        }

        activeFilter(active);
        els.toggle(0, rowStart);

        oldIso = currentIso;

        $.isFunction(settings.complete) && settings.complete.call(this);
    };

    var filter = function () {
        currentIso = $(this).attr("id");
        iso = "." + currentIso;
        active = "#" + currentIso;
        el = settings.isosBox.find(iso);

        if (currentIso != oldIso && oldIso != "") {
            settings.isosBox.find("." + oldIso).show();
        }

        activeFilter(active);
        el.toggle(0, rowStart);

        oldIso = currentIso;

        $.isFunction(settings.complete) && settings.complete.call(this);
    };

    if (settings.bootstrap == true || settings.columns == true) {
        if (settings.bootstrap == true) {
            if (version == "3") {
                settings.isosBox.find(settings.isoWrapper).addClass("col-" + settings.breakpoint + "-" + settings.colSpan);
            } else if (version == "2") {
                settings.isosBox.find(settings.isoWrapper).addClass("span" + settings.colSpan);
                rowStart();
            } else { alert("Isolate supports Bootstrap versions 2 and 3. You entered version " + version + ".\n\n Please use a supported version."); }
        } else {
            settings.isosBox.find(settings.isoWrapper).addClass("iso-col-" + settings.colSpan);
        }
    }

    $.isFunction(settings.setup) && settings.setup.call(this);

    if (settings.filter == true) {
        settings.filtersBox.on("click.isolate", ".filter", filter);
    } else {
        settings.filtersBox.on("click.isolate", ".filter", isolate);
    }

    function activeFilter(selectedFilter) {
        if (!settings.filtersBox.find(".filter").hasClass("active")) {
            settings.filtersBox.find(selectedFilter).addClass("active");
        } else if (!settings.filtersBox.find(selectedFilter).hasClass("active")) {
            settings.filtersBox.find(".filter").removeClass("active");
            settings.filtersBox.find(selectedFilter).addClass("active");
        } else {
            settings.filtersBox.find(".filter").removeClass("active");
        }
    }

    function rowStart() {
        if (settings.bootstrap == true && version == "2") {
            settings.isosBox.find(settings.isoWrapper).removeClass("bs-2-row-start");
            settings.isosBox.find(settings.isoWrapper).filter(function () {
                return $(this).css("display") != "none";
            }).each(function (index) {
                if (settings.colSpan > 6) {
                    $(this).addClass("bs-2-row-start");
                } else if (settings.colSpan == 5 || settings.colSpan == 6) {
                    if (index % 2 == 0) {
                        $(this).addClass("bs-2-row-start");
                    }
                } else if ((index + 1) % (12 / settings.colSpan + 1) == 0) {
                    $(this).addClass("bs-2-row-start");
                }
            });
        }
    }

    var iso = "",
        el = "",
        els = "",
        active = "",
        currentIso = "",
        oldIso = "";
};
