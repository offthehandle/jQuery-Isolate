/*
 * Isolate Plugin for jQuery JavaScript Library
 * 
 * Copyright (c) 2014-2018 Adam J De Lucia
 * Licensed under the MIT License.
 * http://opensource.org/licenses/MIT
 * 
 * Author: Adam J De Lucia
 * Version: 2.0.2
 * Date: March 3, 2018
 * 
 */
var IsolateDefaultSettings = (function () {
    function IsolateDefaultSettings() {
        this.settings = {
            isolate: true,
            filters: $('#iso-filters'),
            filteredList: $('#isos'),
            filterClass: '.filter',
            iso: 'li',
            isoGrid: false,
            flex: true,
            bootstrap: true,
            version: 4,
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
        this.isolate = function (event) {
            var selectedFilter = $(event.currentTarget).attr('id');
            var isoClass = '.' + selectedFilter;
            var filterID = '#' + selectedFilter;
            $.isFunction(_this.settings.start) && _this.settings.start.call(event.currentTarget, _this.filtersMap, selectedFilter);
            $(_this.instanceID).trigger('isolate.start', [event.currentTarget, _this.filtersMap, selectedFilter]);
            _this.settings.filteredList.find(_this.settings.iso).show();
            for (var _filter in _this.filtersMap) {
                if (_filter === selectedFilter && _this.filtersMap[_filter] === 'isInactive') {
                    _this.isolatedEls.push(isoClass);
                    _this.settings.filteredList.find($(_this.settings.iso).not(_this.isolatedEls.toString())).hide();
                    _this.filtersMap[_filter] = 'isActive';
                    _this.settings.filters.find(filterID).addClass('active');
                    break;
                }
                else if (_filter === selectedFilter && _this.filtersMap[_filter] === 'isActive') {
                    for (var i = 0, l = _this.isolatedEls.length; i < l; i++) {
                        if (_this.isolatedEls[i] === isoClass) {
                            _this.isolatedEls.splice(i, 1);
                            break;
                        }
                    }
                    if (_this.isolatedEls.length) {
                        _this.settings.filteredList.find($(_this.settings.iso).not(_this.isolatedEls.toString())).hide();
                    }
                    _this.filtersMap[_filter] = 'isInactive';
                    _this.settings.filters.find(filterID).removeClass('active');
                    break;
                }
            }
            $.isFunction(_this.settings.complete) && _this.settings.complete.call(event.currentTarget, _this.filtersMap, selectedFilter, _this.isolatedEls);
            $(_this.instanceID).trigger('isolate.complete', [event.currentTarget, _this.filtersMap, selectedFilter, _this.isolatedEls]);
        };
        this.filter = function (event) {
            var selectedFilter = $(event.currentTarget).attr('id');
            var isoClass = '.' + selectedFilter;
            var filterID = '#' + selectedFilter;
            $.isFunction(_this.settings.start) && _this.settings.start.call(event.currentTarget, _this.filtersMap, selectedFilter);
            $(_this.instanceID).trigger('isolate.filter.start', [event.currentTarget, _this.filtersMap, selectedFilter]);
            _this.settings.filteredList.find(_this.settings.iso).show();
            for (var _filter in _this.filtersMap) {
                if (_filter === selectedFilter && _this.filtersMap[_filter] === 'isInactive') {
                    _this.filteredEls.push(isoClass);
                    _this.settings.filteredList.find(_this.filteredEls.toString()).hide();
                    _this.filtersMap[_filter] = 'isActive';
                    _this.settings.filters.find(filterID).addClass('active');
                    break;
                }
                else if (_filter === selectedFilter && _this.filtersMap[_filter] === 'isActive') {
                    for (var i = 0, l = _this.filteredEls.length; i < l; i++) {
                        if (_this.filteredEls[i] === isoClass) {
                            _this.filteredEls.splice(i, 1);
                            break;
                        }
                    }
                    if (_this.filteredEls.length) {
                        _this.settings.filteredList.find(_this.filteredEls.toString()).hide();
                    }
                    _this.filtersMap[_filter] = 'isInactive';
                    _this.settings.filters.find(filterID).removeClass('active');
                    break;
                }
            }
            $.isFunction(_this.settings.complete) && _this.settings.complete.call(event.currentTarget, _this.filtersMap, selectedFilter, _this.filteredEls);
            $(_this.instanceID).trigger('isolate.filter.complete', [event.currentTarget, _this.filtersMap, selectedFilter, _this.filteredEls]);
        };
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
            if (this.settings.bootstrap && this.majorVersion !== 3 && this.majorVersion !== 4) {
                alert('Isolate supports Bootstrap 3 and 4. You entered ' + this.majorVersion + '.\n\nPlease use a supported version or the Isolate grid.');
                isValid = false;
            }
            if (this.settings.bootstrap && this.majorVersion === 3) {
                if (isValid && classValidation.length !== 3) {
                    alert('Bootstrap 3 requires both breakpoint and bsSpan options. Please check your configuration.');
                    isValid = false;
                }
                if (isValid && ['xs', 'sm', 'md', 'lg'].indexOf($.trim(this.settings.breakpoint)) === -1) {
                    alert('Bootstrap 3 supports breakpoints xs, sm, md and lg. You entered ' + this.settings.breakpoint + '.\n\nPlease use a supported breakpoint.');
                    isValid = false;
                }
                if (isValid && isNaN(this.settings.bsSpan)) {
                    alert('Bootstrap 3 supports numbers for bsSpan. You entered ' + this.settings.bsSpan + '.\n\nPlease enter a supported bsSpan as a number or string.');
                    isValid = false;
                }
            }
            if (this.settings.bootstrap && this.majorVersion === 4) {
                if (isValid && this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '' && ['sm', 'md', 'lg', 'xl'].indexOf($.trim(this.settings.breakpoint)) === -1) {
                    alert('Bootstrap 4 supports breakpoints sm, md, lg and xl. You entered ' + this.settings.breakpoint + '.\n\nPlease use a supported breakpoint.');
                    isValid = false;
                }
                if (isValid && this.settings.bsSpan !== null && $.trim(this.settings.bsSpan) !== '') {
                    if (isValid && typeof this.settings.bsSpan !== 'number' && typeof this.settings.bsSpan !== 'string') {
                        alert('Bootstrap 4 supports only a number or auto for bsSpan. The type you entered is ' + typeof this.settings.bsSpan + '.\n\nPlease enter a supported bsSpan as a number or string. Also, null or an empty string is valid.');
                        isValid = false;
                    }
                    if (isValid && typeof this.settings.bsSpan === 'string' && this.settings.bsSpan !== 'auto' && isNaN(Number(this.settings.bsSpan))) {
                        alert('Bootstrap 4 supports only a number or auto for bsSpan. You entered ' + this.settings.bsSpan + '.\n\nPlease enter a supported bsSpan as a number or string. Also, null or an empty string is valid.');
                        isValid = false;
                    }
                }
            }
            if (this.settings.isoGrid && this.settings.flex) {
                if (isValid && this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '' && ['sm', 'md', 'lg', 'xl'].indexOf($.trim(this.settings.breakpoint)) === -1) {
                    alert('Isolate flex grid supports breakpoints sm, md, lg and xl. You entered ' + this.settings.breakpoint + '.\n\nPlease use a supported breakpoint.');
                    isValid = false;
                }
                if (isValid && this.settings.columns !== null && $.trim(this.settings.columns) !== '') {
                    if (isValid && typeof this.settings.columns !== 'number' && typeof this.settings.columns !== 'string') {
                        alert('Isolate flex grid supports only a number or string for columns. The type you entered is ' + typeof this.settings.columns + '.\n\nPlease enter a supported value as a number or string. Also, null or an empty string is valid.');
                        isValid = false;
                    }
                    if (isValid && typeof this.settings.columns === 'string' && this.settings.columns !== 'auto' && isNaN(Number(this.settings.columns))) {
                        alert('Isolate flex grid supports only a number or auto for columns. You entered ' + this.settings.columns + '.\n\nPlease enter a supported value as a number or string. Also, null or an empty string is valid.');
                        isValid = false;
                    }
                }
            }
            if (this.settings.isoGrid && !this.settings.flex) {
                if (isValid && this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '' && ['sm', 'md', 'lg', 'xl'].indexOf($.trim(this.settings.breakpoint)) === -1) {
                    alert('Isolate grid supports breakpoints sm, md, lg and xl. You entered ' + this.settings.breakpoint + '.\n\nPlease use a supported breakpoint.');
                    isValid = false;
                }
                if (isValid && isNaN(this.settings.columns)) {
                    alert('Isolate grid supports numbers for columns. You entered ' + this.settings.columns + '.\n\nPlease enter a supported value as a number or string.');
                    isValid = false;
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
        var _this = this;
        this.each(function () {
            new IsolatePlugin(_this, options);
        });
    };
})(jQuery);
