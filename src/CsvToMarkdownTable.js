"use strict";

window.addEvent('domready', function() {
	var insertAtCursor = function( myField, myValue ) {
		//IE support
		if( document.selection ) {
			myField.focus();
			sel = document.selection.createRange();
			sel.text = myValue;
		}
		//MOZILLA/NETSCAPE support
		else if( myField.selectionStart || myField.selectionStart == '0' ) {
			var startPos = myField.selectionStart;
			var endPos = myField.selectionEnd;
			myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
			myField.selectionStart = startPos + myValue.length;
			myField.selectionEnd = myField.selectionStart;
		} else {
			myField.value += myValue;
		}
	};

	var input = $('tsv-input');
	var output = $('table-output');

	var headerCheckbox = $('has-headers');
	var delimiterMarker = $('delimiter-marker');

	input.addEvent('keydown', function( e ) {
		if( e.key == 'tab' ) {
			e.stop();
			insertAtCursor(e.target, "\t");
		}
	});

	var renderTable = function() {
		var value = input.get('value').trim();
		var columns = value.split("\n");

		var table = [];
		var maxRowLen = [];

		var delim = delimiterMarker.get('value');
		if( delim == 'tab' ) {
			delim = "\t";
		}

		columns.forEach(function( e, i ) {
			if( typeof table[i] == "undefined" ) {
				table[i] = [];
			}

			var row = e.split(delim);

			row.forEach(function( ee, ii ) {
				if( typeof maxRowLen[ii] == "undefined" ) {
					maxRowLen[ii] = 0;
				}

				maxRowLen[ii] = Math.max(maxRowLen[ii], ee.length);

				table[i][ii] = ee;

			});

		});

		var hasHeader = headerCheckbox.get('checked');
		var headerOutput = "";
		var seperatorOutput = "";

		maxRowLen.forEach(function( len ) {
			var spacer;
			spacer = Array(len + 1 + 2).join("-");
			seperatorOutput += "|" + spacer;

			spacer = Array(len + 1 + 2).join(" ");
			headerOutput += "|" + spacer;
		});

		headerOutput += "| \n";
		seperatorOutput += "| \n";

		if( hasHeader ) {
			headerOutput = "";
		}

		var rowOutput = "";
		var initHeader = true;
		table.forEach(function( col, x ) {
			maxRowLen.forEach(function( len, y ) {
				var row = typeof col[y] == "undefined" ? "" : col[y];
				var spacing = Array((len - row.length) + 1).join(" ");

				if( hasHeader && initHeader ) {
					headerOutput += "| " + row + spacing + " ";
				} else {
					rowOutput += "| " + row + spacing + " ";
				}
			});

			if( hasHeader && initHeader ) {
				headerOutput += "| \n";
			} else {
				rowOutput += "| \n";
			}

			initHeader = false;
		});

		var finalOutput = headerOutput + seperatorOutput + rowOutput;

		output.set('value', finalOutput);
	};

	input.addEvent('keyup', renderTable);
	headerCheckbox.addEvent('change', renderTable);
	delimiterMarker.addEvent('change', renderTable);

	output.addEvent('click', function( e ) {
		e.target.select();
	});
});