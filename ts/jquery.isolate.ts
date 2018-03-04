declare var $: any;

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
    private isolate = (event: any) => {

        let selectedFilter: string = $(event.currentTarget).attr('id');
        let isoClass: string = '.' + selectedFilter;
        let filterID: string = '#' + selectedFilter;

        // Callback function before any filter actions begin
        $.isFunction(this.settings.start) && this.settings.start.call(event.currentTarget, this.filtersMap, selectedFilter);

        $(this.instanceID).trigger('isolate.start', [event.currentTarget, this.filtersMap, selectedFilter]);

        // Resets all iso-els before isolating the selected ones
        this.settings.filteredList.find(this.settings.iso).show();

        // Handles faceted isolation
        for (let _filter in this.filtersMap) {

            if (_filter === selectedFilter && this.filtersMap[_filter] === 'isInactive') {

                // Adds the selected class to the array of isolated elements
                this.isolatedEls.push(isoClass);

                // Isolates the selected elements
                this.settings.filteredList.find($(this.settings.iso).not(this.isolatedEls.toString())).hide();

                // Sets the filter state
                this.filtersMap[_filter] = 'isActive';

                // Sets the active filter styles
                this.settings.filters.find(filterID).addClass('active');

                break;

            } else if (_filter === selectedFilter && this.filtersMap[_filter] === 'isActive') {

                // Finds the selected active class in the array of isolated elements
                for (let i: number = 0, l: number = this.isolatedEls.length; i < l; i++) {

                    if (this.isolatedEls[i] === isoClass) {

                        // Removes the class from the array
                        this.isolatedEls.splice(i, 1);

                        break;
                    }
                }

                // Isolates the selected elements if the array is not empty
                if (this.isolatedEls.length) {

                    this.settings.filteredList.find($(this.settings.iso).not(this.isolatedEls.toString())).hide();
                }

                // Sets the filter state
                this.filtersMap[_filter] = 'isInactive';

                // Sets inactive filter styles
                this.settings.filters.find(filterID).removeClass('active');

                break;
            }
        }

        // Callback function after all filter actions are complete
        $.isFunction(this.settings.complete) && this.settings.complete.call(event.currentTarget, this.filtersMap, selectedFilter, this.isolatedEls);

        $(this.instanceID).trigger('isolate.complete', [event.currentTarget, this.filtersMap, selectedFilter, this.isolatedEls]);
    }

    // Filter method
    private filter = (event: any) => {

        let selectedFilter: string = $(event.currentTarget).attr('id');
        let isoClass: string = '.' + selectedFilter;
        let filterID: string = '#' + selectedFilter;

        // Callback function before any filter actions begin
        $.isFunction(this.settings.start) && this.settings.start.call(event.currentTarget, this.filtersMap, selectedFilter);

        $(this.instanceID).trigger('isolate.filter.start', [event.currentTarget, this.filtersMap, selectedFilter]);

        // Resets all iso-els before filtering the selected ones
        this.settings.filteredList.find(this.settings.iso).show();

        // Handles faceted filtering
        for (let _filter in this.filtersMap) {

            if (_filter === selectedFilter && this.filtersMap[_filter] === 'isInactive') {

                // Adds the selected class to the array of filtered elements
                this.filteredEls.push(isoClass);

                // Filters the selected elements
                this.settings.filteredList.find(this.filteredEls.toString()).hide();

                // Sets the filter state
                this.filtersMap[_filter] = 'isActive';

                // Sets the active filter styles
                this.settings.filters.find(filterID).addClass('active');

                break;

            } else if (_filter === selectedFilter && this.filtersMap[_filter] === 'isActive') {

                // Finds the selected active class in the array of filtered elements
                for (let i: number = 0, l: number = this.filteredEls.length; i < l; i++) {

                    if (this.filteredEls[i] === isoClass) {

                        // Removes the class from the array
                        this.filteredEls.splice(i, 1);

                        break;
                    }
                }

                // Filters the selected elements if the array is not empty
                if (this.filteredEls.length) {

                    this.settings.filteredList.find(this.filteredEls.toString()).hide();
                }

                // Sets the filter state
                this.filtersMap[_filter] = 'isInactive';

                // Sets inactive filter styles
                this.settings.filters.find(filterID).removeClass('active');

                break;
            }
        }

        // Callback function after all filter actions are complete
        $.isFunction(this.settings.complete) && this.settings.complete.call(event.currentTarget, this.filtersMap, selectedFilter, this.filteredEls);

        $(this.instanceID).trigger('isolate.filter.complete', [event.currentTarget, this.filtersMap, selectedFilter, this.filteredEls]);
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

            if (this.settings.bootstrap && this.majorVersion !== 3 && this.majorVersion !== 4) {

                alert('Isolate supports Bootstrap 3 and 4. You entered ' + this.majorVersion + '.\n\nPlease use a supported version or the Isolate grid.');

                isValid = false;
            }

            if (this.settings.bootstrap && this.majorVersion === 3) {

                // Version 3 must have col, breakpoint and span
                if (isValid && classValidation.length !== 3) {

                    alert('Bootstrap 3 requires both breakpoint and bsSpan options. Please check your configuration.');

                    isValid = false;
                }

                // Validates breakpoint
                if (isValid && ['xs', 'sm', 'md', 'lg'].indexOf($.trim(this.settings.breakpoint)) === -1) {

                    alert('Bootstrap 3 supports breakpoints xs, sm, md and lg. You entered ' + this.settings.breakpoint + '.\n\nPlease use a supported breakpoint.');

                    isValid = false;
                }

                // Validates span
                if (isValid && isNaN(this.settings.bsSpan)) {

                    alert('Bootstrap 3 supports numbers for bsSpan. You entered ' + this.settings.bsSpan + '.\n\nPlease enter a supported bsSpan as a number or string.');

                    isValid = false;
                }
            }

            if (this.settings.bootstrap && this.majorVersion === 4) {

                // Validates breakpoint
                if (isValid && this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '' && ['sm', 'md', 'lg', 'xl'].indexOf($.trim(this.settings.breakpoint)) === -1) {

                    alert('Bootstrap 4 supports breakpoints sm, md, lg and xl. You entered ' + this.settings.breakpoint + '.\n\nPlease use a supported breakpoint.');

                    isValid = false;
                }

                // Validates span
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

                // Validates breakpoint
                if (isValid && this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '' && ['sm', 'md', 'lg', 'xl'].indexOf($.trim(this.settings.breakpoint)) === -1) {

                    alert('Isolate flex grid supports breakpoints sm, md, lg and xl. You entered ' + this.settings.breakpoint + '.\n\nPlease use a supported breakpoint.');

                    isValid = false;
                }

                // Validates span
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

                // Validates breakpoint
                if (isValid && this.settings.breakpoint !== null && $.trim(this.settings.breakpoint) !== '' && ['sm', 'md', 'lg', 'xl'].indexOf($.trim(this.settings.breakpoint)) === -1) {

                    alert('Isolate grid supports breakpoints sm, md, lg and xl. You entered ' + this.settings.breakpoint + '.\n\nPlease use a supported breakpoint.');

                    isValid = false;
                }

                // Validates span
                if (isValid && isNaN(this.settings.columns)) {

                    alert('Isolate grid supports numbers for columns. You entered ' + this.settings.columns + '.\n\nPlease enter a supported value as a number or string.');

                    isValid = false;
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
