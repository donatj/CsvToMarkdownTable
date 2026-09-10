(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.csvToMarkdown = factory());
})(this, (function () { 'use strict';

    /*!
     * csv-walker
     * Copyright (c) 2026 Jesse G. Donat
     * Released under the MIT License.
     *
     * This notice may not be removed or altered from any source distribution.
     */
    function option(name, value, empty = false) {
        if ((empty && value === "") || [...value].length === 1) {
            return (settings) => {
                settings[name] = value;
            };
        }
        throw new TypeError(`${name} must be one character${empty ? " or empty" : ""}`);
    }
    /** Sets the field separator. */
    function separator(value) {
        return option("separator", value);
    }
    /** Sets the quoted-field enclosure. */
    function enclosure(value) {
        return option("enclosure", value);
    }
    /**
     * Sets the character that keeps a following enclosure literal in a quoted
     * field. Pass an empty string to disable escaping.
     */
    function escape(value) {
        return option("escape", value, true);
    }
    function csv(settings) {
        let column = "";
        let record = false;
        let state = readColumn;
        function push(character) {
            let cell;
            state = state(character);
            cell = output;
            output = undefined;
            return cell;
        }
        function finish() {
            if (!record) {
                return undefined;
            }
            const cell = { last: true, value: column };
            column = "";
            record = false;
            return cell;
        }
        let output;
        function readColumn(character) {
            if (character === settings.separator) {
                record = true;
                columnDone(false);
                return readColumn;
            }
            if (character === "\n") {
                columnDone(true);
                return readColumn;
            }
            if (character === "\r") {
                columnDone(true);
                return readLineFeed;
            }
            if (character === settings.enclosure && column === "") {
                record = true;
                return readQuotedColumn;
            }
            record = true;
            column += character;
            return readColumn;
        }
        function readQuotedColumn(character) {
            if (character === settings.enclosure) {
                return readQuote;
            }
            if (settings.escape !== "" && character === settings.escape) {
                column += character;
                return readEscapedEnclosure;
            }
            column += character;
            return readQuotedColumn;
        }
        function readQuote(character) {
            if (character === settings.enclosure) {
                column += character;
                return readQuotedColumn;
            }
            return readColumn(character);
        }
        function readEscapedEnclosure(character) {
            column += character;
            return readQuotedColumn;
        }
        function readLineFeed(character) {
            if (character === "\n") {
                return readColumn;
            }
            return readColumn(character);
        }
        function columnDone(last) {
            output = { last, value: column };
            column = "";
            if (last) {
                record = false;
            }
        }
        return { finish, push };
    }
    function nextCell(reader, input) {
        while (true) {
            const character = input.next();
            if (character.done) {
                return reader.finish();
            }
            const cell = reader.push(character.value);
            if (cell) {
                return cell;
            }
        }
    }
    async function nextAsyncCell(reader, input) {
        while (true) {
            const character = await input.next();
            if (character.done) {
                return reader.finish();
            }
            const cell = reader.push(character.value);
            if (cell) {
                return cell;
            }
        }
    }
    function skipRow(reader, input) {
        while (true) {
            const cell = nextCell(reader, input);
            if (!cell || cell.last) {
                return;
            }
        }
    }
    async function skipAsyncRow(reader, input) {
        while (true) {
            const cell = await nextAsyncCell(reader, input);
            if (!cell || cell.last) {
                return;
            }
        }
    }
    function* columns(first, reader, input, complete) {
        let cell = first;
        while (true) {
            if (cell.last) {
                complete.value = true;
            }
            yield cell.value;
            if (cell.last) {
                return;
            }
            const next = nextCell(reader, input);
            if (!next) {
                throw new Error("CSV ended before the record did");
            }
            cell = next;
        }
    }
    async function* asyncColumns(first, reader, input, complete) {
        let cell = first;
        while (true) {
            if (cell.last) {
                complete.value = true;
            }
            yield cell.value;
            if (cell.last) {
                return;
            }
            const next = await nextAsyncCell(reader, input);
            if (!next) {
                throw new Error("CSV ended before the record did");
            }
            cell = next;
        }
    }
    function configure(options) {
        const value = {
            encoding: "utf-8",
            enclosure: '"',
            escape: "\\",
            separator: ",",
        };
        for (const apply of options) {
            apply(value);
        }
        return value;
    }
    function* parseString(text, options) {
        const reader = csv(options);
        const input = text[Symbol.iterator]();
        while (true) {
            const first = nextCell(reader, input);
            if (!first) {
                return;
            }
            const complete = { value: first.last };
            yield columns(first, reader, input, complete);
            if (!complete.value) {
                skipRow(reader, input);
            }
        }
    }
    function isBlob(source) {
        return typeof Blob !== "undefined" && source instanceof Blob;
    }
    async function* chunks(source) {
        if (isBlob(source)) {
            yield* chunks(source.stream());
            return;
        }
        if (Symbol.asyncIterator in source) {
            yield* source;
            return;
        }
        if (Symbol.iterator in source) {
            yield* source;
            return;
        }
        const reader = source.getReader();
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    return;
                }
                yield value;
            }
        }
        finally {
            reader.releaseLock();
        }
    }
    async function* characters(source, label) {
        var _a;
        let decoder;
        for await (const chunk of chunks(source)) {
            const text = typeof chunk === "string"
                ? `${(_a = decoder === null || decoder === void 0 ? void 0 : decoder.decode()) !== null && _a !== void 0 ? _a : ""}${chunk}`
                : (decoder !== null && decoder !== void 0 ? decoder : (decoder = new TextDecoder(label))).decode(chunk, {
                    stream: true,
                });
            if (typeof chunk === "string") {
                decoder = undefined;
            }
            for (const character of text) {
                yield character;
            }
        }
        if (decoder) {
            for (const character of decoder.decode()) {
                yield character;
            }
        }
    }
    async function* parseSource(source, options) {
        const reader = csv(options);
        const input = characters(source, options.encoding)[Symbol.asyncIterator]();
        try {
            while (true) {
                const first = await nextAsyncCell(reader, input);
                if (!first) {
                    return;
                }
                const complete = { value: first.last };
                yield asyncColumns(first, reader, input, complete);
                if (!complete.value) {
                    await skipAsyncRow(reader, input);
                }
            }
        }
        finally {
            if (input.return) {
                await input.return(undefined);
            }
        }
    }
    function parse(source, ...options) {
        const value = configure(options);
        return typeof source === "string"
            ? parseString(source, value)
            : parseSource(source, value);
    }
    function allValues(values) {
        const result = [];
        if (Symbol.asyncIterator in values) {
            return (async () => {
                for await (const value of values) {
                    result.push(typeof value === "string" ? value : await allValues(value));
                }
                return result;
            })();
        }
        for (const value of values) {
            result.push(typeof value === "string" ? value : [...value]);
        }
        return result;
    }

    /*!
     * Copyright (c) Jesse G. Donat and contributors.
     * Licensed under the MIT License.
     *
     * This notice may not be removed or altered from any source distribution.
     */
    const CsvToMarkdownOptionsDefaults = {
        newlineReplacement: "<br>",
        cellFilter: (value) => value,
        prettyPrint: true,
    };
    /**
     * Converts CSV to Markdown Table
     *
     * @param {string} csvContent - The string content of the CSV
     * @param {string} delimiter - The character to use as the CSV column delimiter
     * @param {boolean} hasHeader - Whether to use the first row of Data as headers
     * @param {Partial<CsvToMarkdownOptions>} options - Optional conversion settings
     * @returns {string}
     */
    function csvToMarkdown(csvContent, delimiter = "\t", hasHeader = false, options = {}) {
        const opt = {
            ...CsvToMarkdownOptionsDefaults,
            ...options,
        };
        const parserOptions = [separator(delimiter)];
        if (opt.enclosure !== undefined) {
            parserOptions.push(enclosure(opt.enclosure));
        }
        if (opt.escape !== undefined) {
            parserOptions.push(escape(opt.escape));
        }
        const tabularData = allValues(parse(csvContent, ...parserOptions));
        const maxRowLen = [];
        for (const [rowIndex, values] of tabularData.entries()) {
            values.forEach((column, index) => {
                var _a;
                let value = opt.cellFilter(column, rowIndex, index);
                if (delimiter != "\t") {
                    value = value.replace(/\t/g, "    ");
                }
                if (opt.newlineReplacement !== null) {
                    const replacement = opt.newlineReplacement;
                    value = value.replace(/\r\n?|\n/g, () => replacement);
                }
                value = value.replace(/(\||\\)/g, "\\$1");
                maxRowLen[index] = opt.prettyPrint
                    ? Math.max((_a = maxRowLen[index]) !== null && _a !== void 0 ? _a : 0, value.length)
                    : 0;
                values[index] = value;
            });
        }
        if (tabularData.length === 0) {
            tabularData.push([""]);
            maxRowLen.push(0);
        }
        let headerOutput = "";
        let seperatorOutput = "";
        const rowEnding = opt.prettyPrint ? "| \n" : "|\n";
        maxRowLen.forEach((len) => {
            const sizer = Array(len + 1 + 2);
            seperatorOutput += "|" + (opt.prettyPrint ? sizer.join("-") : "---");
            headerOutput += "|" + (opt.prettyPrint ? sizer.join(" ") : "");
        });
        headerOutput += rowEnding;
        seperatorOutput += rowEnding;
        if (hasHeader) {
            headerOutput = "";
        }
        let rowOutput = "";
        tabularData.forEach((col, i) => {
            maxRowLen.forEach((len, y) => {
                const row = typeof col[y] == "undefined" ? "" : col[y];
                const spacing = opt.prettyPrint
                    ? Array(len - row.length + 1).join(" ")
                    : "";
                const out = opt.prettyPrint ? `| ${row}${spacing} ` : `|${row}`;
                if (hasHeader && i === 0) {
                    headerOutput += out;
                }
                else {
                    rowOutput += out;
                }
            });
            if (hasHeader && i === 0) {
                headerOutput += rowEnding;
            }
            else {
                rowOutput += rowEnding;
            }
        });
        return `${headerOutput}${seperatorOutput}${rowOutput}`;
    }

    return csvToMarkdown;

}));
//# sourceMappingURL=CsvToMarkdown.js.map
