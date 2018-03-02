declare var $: any;

var isolate: IsolatePlugin;

import { IIsolateDefaultSettings, IIsolateOptions, IFiltersMap } from './jquery.isolate.d';

class IsolateDefaultSettings implements IIsolateDefaultSettings {

    public settings: IIsolateOptions;


    constructor() {

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
}

class IsolatePlugin {

    public static NAME: string = 'isolate';


    private rootElement: JQuery;

    private default: IIsolateDefaultSettings = new IsolateDefaultSettings();

    private options: IIsolateOptions;

    private settings: IIsolateOptions;

    private instanceID: string;

    private filtersMap: IFiltersMap;

    private isolatedEls: string[];

    private filteredEls: string[];

    private version: string;

    private majorVersion: number;


    constructor(rootElement: JQuery, options: IIsolateOptions) {

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

        // Namespaced click events for isolate and filter settings
        if (this.settings.isolate === true) {

            this.settings.filters.on('click.isolate', this.settings.filterClass, this.isolate);

        } else {

            this.settings.filters.on('click.isolate', this.settings.filterClass, this.filter);
        }

        setTimeout(() => {

            // Callback function after plugin is setup
            $.isFunction(this.settings.setup) && this.settings.setup.call(this.rootElement, this.filtersMap);

            $(this.instanceID).trigger('isolate.setup', [this.filtersMap]);

        }, 200);
    }


    // Isolate method
    private isolate() {

        let selectedFilter: string = $(this).attr('id');
        let isoClass: string = '.' + selectedFilter;
        let filterID: string = '#' + selectedFilter;

        // Callback function before any filter actions begin
        $.isFunction(isolate.settings.start) && isolate.settings.start.call(this, isolate.filtersMap, selectedFilter);

        $(isolate.instanceID).trigger('isolate.start', [this, isolate.filtersMap, selectedFilter]);

        // Resets all iso-els before isolating the selected ones
        isolate.settings.filteredList.find(isolate.settings.iso).show();

        // Handles faceted isolation
        for (let _filter in isolate.filtersMap) {

            if (_filter === selectedFilter && isolate.filtersMap[_filter] === 'isInactive') {

                // Adds the selected class to the array of isolated elements
                isolate.isolatedEls.push(isoClass);

                // Isolates the selected elements
                isolate.settings.filteredList.find($(isolate.settings.iso).not(isolate.isolatedEls.toString())).hide();

                // Sets the filter state
                isolate.filtersMap[_filter] = 'isActive';

                // Sets the active filter styles
                isolate.settings.filters.find(filterID).addClass('active');

                break;

            } else if (_filter === selectedFilter && isolate.filtersMap[_filter] === 'isActive') {

                // Finds the selected active class in the array of isolated elements
                for (let i: number = 0, l: number = isolate.isolatedEls.length; i < l; i++) {

                    if (isolate.isolatedEls[i] === isoClass) {

                        // Removes the class from the array
                        isolate.isolatedEls.splice(i, 1);

                        break;
                    }
                }

                // Isolates the selected elements if the array is not empty
                if (isolate.isolatedEls.length) {

                    isolate.settings.filteredList.find($(isolate.settings.iso).not(isolate.isolatedEls.toString())).hide();
                }

                // Sets the filter state
                isolate.filtersMap[_filter] = 'isInactive';

                // Sets inactive filter styles
                isolate.settings.filters.find(filterID).removeClass('active');

                break;
            }
        }

        // Callback function after all filter actions are complete
        $.isFunction(isolate.settings.complete) && isolate.settings.complete.call(this, isolate.filtersMap, selectedFilter, isolate.isolatedEls);

        $(isolate.instanceID).trigger('isolate.complete', [this, isolate.filtersMap, selectedFilter, isolate.isolatedEls]);
    }

    // Filter method
    private filter() {

        let selectedFilter: string = $(this).attr('id');
        let isoClass: string = '.' + selectedFilter;
        let filterID: string = '#' + selectedFilter;

        // Callback function before any filter actions begin
        $.isFunction(isolate.settings.start) && isolate.settings.start.call(this, isolate.filtersMap, selectedFilter);

        $(isolate.instanceID).trigger('isolate.filter.start', [this, isolate.filtersMap, selectedFilter]);

        // Resets all iso-els before filtering the selected ones
        isolate.settings.filteredList.find(isolate.settings.iso).show();

        // Handles faceted filtering
        for (let _filter in isolate.filtersMap) {

            if (_filter === selectedFilter && isolate.filtersMap[_filter] === 'isInactive') {

                // Adds the selected class to the array of filtered elements
                isolate.filteredEls.push(isoClass);

                // Filters the selected elements
                isolate.settings.filteredList.find(isolate.filteredEls.toString()).hide();

                // Sets the filter state
                isolate.filtersMap[_filter] = 'isActive';

                // Sets the active filter styles
                isolate.settings.filters.find(filterID).addClass('active');

                break;

            } else if (_filter === selectedFilter && isolate.filtersMap[_filter] === 'isActive') {

                // Finds the selected active class in the array of filtered elements
                for (let i: number = 0, l: number = isolate.filteredEls.length; i < l; i++) {

                    if (isolate.filteredEls[i] === isoClass) {

                        // Removes the class from the array
                        isolate.filteredEls.splice(i, 1);

                        break;
                    }
                }

                // Filters the selected elements if the array is not empty
                if (isolate.filteredEls.length) {

                    isolate.settings.filteredList.find(isolate.filteredEls.toString()).hide();
                }

                // Sets the filter state
                isolate.filtersMap[_filter] = 'isInactive';

                // Sets inactive filter styles
                isolate.settings.filters.find(filterID).removeClass('active');

                break;
            }
        }

        // Callback function after all filter actions are complete
        $.isFunction(isolate.settings.complete) && isolate.settings.complete.call(this, isolate.filtersMap, selectedFilter, isolate.filteredEls);

        $(isolate.instanceID).trigger('isolate.filter.complete', [this, isolate.filtersMap, selectedFilter, isolate.filteredEls]);
    }

    // Evaluates what scaffolding system, if any, was called and takes the appropriate action
    private createGridSystem() {

        if (this.settings.bootstrap === true || this.settings.isoGrid === true) {

            // Constructs the grid class based on user input
            let gridClass: string = '';

            if (this.settings.bootstrap === true) {

                gridClass = 'col';

            } else {

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

            // Sets the grid class
            this.settings.filteredList.find(this.settings.iso).addClass(gridClass);


            // Validates the grid class based on Bootstrap version
            let classValidation: string[] = gridClass.split('-');

            let isValid: boolean = true;

            if (this.settings.bootstrap && this.majorVersion === 3) {

                // Version 3 must have col, breakpoint and span
                if (isValid && classValidation.length !== 3) {

                    alert('Bootstrap 3 requires both breakpoint and bsSpan options. Please check your configuration.');

                    isValid = false;
                }

                // Validates breakpoint
                if (isValid && ['xs', 'sm', 'md', 'lg'].indexOf($.trim(this.settings.breakpoint)) === -1) {

                    alert('Bootstrap 3 supports breakpoints xs, sm, md and lg. You entered ' + this.settings.breakpoint + '.\n\n Please use a supported breakpoint.');

                    isValid = false;
                }

                // Validates span
                if (isValid && isNaN(this.settings.bsSpan)) {

                    alert('Bootstrap 3 supports numbers for bsSpan. You entered ' + this.settings.bsSpan + '.\n\n Please enter a supported bsSpan as a number or string.');

                    isValid = false;
                }
            }

            if (this.settings.bootstrap && this.majorVersion === 4) {

                // Validates breakpoint
                if (isValid && this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '' && ['xs', 'sm', 'md', 'lg', 'xl'].indexOf($.trim(this.settings.breakpoint)) === -1) {

                    alert('Bootstrap 4 supports breakpoints xs, sm, md, lg and xl. You entered ' + this.settings.breakpoint + '.\n\n Please use a supported breakpoint.');

                    isValid = false;
                }

                // Validates span
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
    }

    // Global method to create an object of available filters
    private getFiltersMap(): IFiltersMap {

        let activeFiltersMap: IFiltersMap = {};

        this.settings.filters.find(this.settings.filterClass).each(function () {

            let filterName: string = $(this).attr('id');

            activeFiltersMap[filterName] = 'isInactive';
        });

        return activeFiltersMap;
    }
}

(function ($: JQueryStatic) {

    $.fn[IsolatePlugin.NAME] = function (options: IIsolateOptions) {

        this.each(() => {

            new IsolatePlugin(this, options);
        });
    };

})(jQuery);
