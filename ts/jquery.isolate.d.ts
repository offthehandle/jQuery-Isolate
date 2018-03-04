
export interface IIsolateOptions {
    isolate: boolean;
    filters: JQuery;
    filteredList: JQuery;
    filterClass: string;
    iso: string;
    isoGrid: boolean;
    flex: boolean;
    bootstrap: boolean;
    version: number | string | any;
    breakpoint: string;
    bsSpan: number | string | any;
    columns: number | string | any;
    setup: Function;
    start: Function;
    complete: Function;
}

export interface IIsolateDefaultSettings {
    settings: IIsolateOptions;
}

export interface IFiltersMap {
    [filterName: string]: string;
}
