/*
 * Isolate Plugin for jQuery JavaScript Library
 * 
 * Copyright (c) 2014-2017 Adam J De Lucia
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 * 
 * Author: Adam J De Lucia
 * Version: 2.0.0-beta
 * Date: December 25, 2017
 * 
 */
var isolate;
var IsolateDefaultSettings = (function () {
    function IsolateDefaultSettings() {
        this.settings = {
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
            complete: null
        };
    }
    return IsolateDefaultSettings;
}());
var IsolatePlugin = (function () {
    function IsolatePlugin(rootElement, options) {
        var _this = this;
        this.default = new IsolateDefaultSettings();
        isolate = this;
        this.rootElement = rootElement;
        this.settings = $.extend(this.default.settings, options);
        this.instanceID = '#' + this.rootElement.attr('id');
        this.filtersMap = this.getFiltersMap();
        this.isolatedEls = [];
        this.filteredEls = [];
        this.version = this.settings.version.toString();
        this.majorVersion = Number(this.version.substring(0, 1));
        this.createGridSystem();
        if (this.settings.isolate === true) {
            this.settings.filters.on('click.isolate', this.settings.filterClass, this.isolate);
        }
        else {
            this.settings.filters.on('click.isolate', this.settings.filterClass, this.filter);
        }
        setTimeout(function () {
            $.isFunction(_this.settings.setup) && _this.settings.setup.call(_this.rootElement, _this.filtersMap);
            $(_this.instanceID).trigger('isolate.setup', [_this.filtersMap]);
        }, 200);
    }
    IsolatePlugin.prototype.isolate = function () {
        var selectedFilter = $(this).attr('id');
        var isoClass = '.' + selectedFilter;
        var filterID = '#' + selectedFilter;
        $.isFunction(isolate.settings.start) && isolate.settings.start.call(this, isolate.filtersMap, selectedFilter);
        $(isolate.instanceID).trigger('isolate.start', [this, isolate.filtersMap, selectedFilter]);
        isolate.settings.filteredList.find(isolate.settings.iso).show();
        for (var _filter in isolate.filtersMap) {
            if (_filter === selectedFilter && isolate.filtersMap[_filter] === 'isInactive') {
                isolate.isolatedEls.push(isoClass);
                isolate.settings.filteredList.find($(isolate.settings.iso).not(isolate.isolatedEls.toString())).hide();
                isolate.filtersMap[_filter] = 'isActive';
                isolate.settings.filters.find(filterID).addClass('active');
                break;
            }
            else if (_filter === selectedFilter && isolate.filtersMap[_filter] === 'isActive') {
                for (var i = 0, l = isolate.isolatedEls.length; i < l; i++) {
                    if (isolate.isolatedEls[i] === isoClass) {
                        isolate.isolatedEls.splice(i, 1);
                        break;
                    }
                }
                if (isolate.isolatedEls.length) {
                    isolate.settings.filteredList.find($(isolate.settings.iso).not(isolate.isolatedEls.toString())).hide();
                }
                isolate.filtersMap[_filter] = 'isInactive';
                isolate.settings.filters.find(filterID).removeClass('active');
                break;
            }
        }
        $.isFunction(isolate.settings.complete) && isolate.settings.complete.call(this, isolate.filtersMap, selectedFilter, isolate.isolatedEls);
        $(isolate.instanceID).trigger('isolate.complete', [this, isolate.filtersMap, selectedFilter, isolate.isolatedEls]);
    };
    IsolatePlugin.prototype.filter = function () {
        var selectedFilter = $(this).attr('id');
        var isoClass = '.' + selectedFilter;
        var filterID = '#' + selectedFilter;
        $.isFunction(isolate.settings.start) && isolate.settings.start.call(this, isolate.filtersMap, selectedFilter);
        $(isolate.instanceID).trigger('isolate.filter.start', [this, isolate.filtersMap, selectedFilter]);
        isolate.settings.filteredList.find(isolate.settings.iso).show();
        for (var _filter in isolate.filtersMap) {
            if (_filter === selectedFilter && isolate.filtersMap[_filter] === 'isInactive') {
                isolate.filteredEls.push(isoClass);
                isolate.settings.filteredList.find(isolate.filteredEls.toString()).hide();
                isolate.filtersMap[_filter] = 'isActive';
                isolate.settings.filters.find(filterID).addClass('active');
                break;
            }
            else if (_filter === selectedFilter && isolate.filtersMap[_filter] === 'isActive') {
                for (var i = 0, l = isolate.filteredEls.length; i < l; i++) {
                    if (isolate.filteredEls[i] === isoClass) {
                        isolate.filteredEls.splice(i, 1);
                        break;
                    }
                }
                if (isolate.filteredEls.length) {
                    isolate.settings.filteredList.find(isolate.filteredEls.toString()).hide();
                }
                isolate.filtersMap[_filter] = 'isInactive';
                isolate.settings.filters.find(filterID).removeClass('active');
                break;
            }
        }
        $.isFunction(isolate.settings.complete) && isolate.settings.complete.call(this, isolate.filtersMap, selectedFilter, isolate.filteredEls);
        $(isolate.instanceID).trigger('isolate.filter.complete', [this, isolate.filtersMap, selectedFilter, isolate.filteredEls]);
    };
    IsolatePlugin.prototype.createGridSystem = function () {
        if (this.settings.bootstrap === true || this.settings.isoGrid === true) {
            var gridClass = '';
            if (this.settings.bootstrap === true) {
                gridClass = 'col';
            }
            else {
                gridClass = 'iso';
            }
            if (this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '') {
                gridClass += '-' + $.trim(this.settings.breakpoint);
            }
            if (this.settings.bootstrap === true && this.settings.bsSpan !== null && $.trim(this.settings.bsSpan) !== '') {
                gridClass += '-' + $.trim(this.settings.bsSpan);
            }
            if (this.settings.isoGrid === true && this.settings.columns !== null && $.trim(this.settings.columns) !== '') {
                gridClass += '-' + $.trim(this.settings.columns);
            }
            this.settings.filteredList.find(this.settings.iso).addClass(gridClass);
            var classValidation = gridClass.split('-');
            var isValid = true;
            if (this.settings.bootstrap && this.majorVersion === 3) {
                if (isValid && classValidation.length !== 3) {
                    alert('Bootstrap 3 requires both breakpoint and bsSpan options. Please check your configuration.');
                    isValid = false;
                }
                if (isValid && ['xs', 'sm', 'md', 'lg'].indexOf($.trim(this.settings.breakpoint)) === -1) {
                    alert('Bootstrap 3 supports breakpoints xs, sm, md and lg. You entered ' + this.settings.breakpoint + '.\n\n Please use a supported breakpoint.');
                    isValid = false;
                }
                if (isValid && isNaN(this.settings.bsSpan)) {
                    alert('Bootstrap 3 supports numbers for bsSpan. You entered ' + this.settings.bsSpan + '.\n\n Please enter a supported bsSpan as a number or string.');
                    isValid = false;
                }
            }
            if (this.settings.bootstrap && this.majorVersion === 4) {
                if (isValid && this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '' && ['xs', 'sm', 'md', 'lg', 'xl'].indexOf($.trim(this.settings.breakpoint)) === -1) {
                    alert('Bootstrap 4 supports breakpoints xs, sm, md, lg and xl. You entered ' + this.settings.breakpoint + '.\n\n Please use a supported breakpoint.');
                    isValid = false;
                }
                if (isValid && this.settings.bsSpan !== null && $.trim(this.settings.bsSpan) !== '') {
                    if (isValid && typeof this.settings.bsSpan !== 'number' && typeof this.settings.bsSpan !== 'string') {
                        alert('Bootstrap 4 supports only a number or auto for bsSpan. You entered ' + this.settings.bsSpan + '.\n\n Please enter a supported bsSpan as a number or string. Also, null or an empty string is valid.');
                        isValid = false;
                    }
                    if (isValid && typeof this.settings.bsSpan === 'string' && this.settings.bsSpan !== 'auto' && isNaN(Number(this.settings.bsSpan))) {
                        alert('Bootstrap 4 supports only a number or auto for bsSpan. You entered ' + this.settings.bsSpan + '.\n\n Please enter a supported bsSpan as a number or string. Also, null or an empty string is valid.');
                        isValid = false;
                    }
                }
            }
        }
    };
    IsolatePlugin.prototype.getFiltersMap = function () {
        var activeFiltersMap = {};
        this.settings.filters.find(this.settings.filterClass).each(function () {
            var filterName = $(this).attr('id');
            activeFiltersMap[filterName] = 'isInactive';
        });
        return activeFiltersMap;
    };
    return IsolatePlugin;
}());
IsolatePlugin.NAME = 'isolate';
(function ($) {
    $.fn[IsolatePlugin.NAME] = function (options) {
        this.each(new IsolatePlugin(this, options));
    };
})(jQuery);
