/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/* This file was autogenerated from Assembly x86.tmLanguage (uuid: ) */
/****************************************************************************************
 * IT MIGHT NOT BE PERFECT ...But it's a good start from an existing *.tmlanguage file. *
 * fileTypes                                                                            *
 ****************************************************************************************/


ace.define("ace/mode/sicxe_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function (require, exports, module) {
	"use strict";

	var oop = require("../lib/oop");
	var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

	var SicXEHighlightRules = function () {
		this.$rules = {
			start:
				[{
					token: 'support.function.directive.assembly',
					regex: '\\b(?:base|byte|csect|end|equ|ltorg|nobase|resb|resw|start|use|word)\\b',
					caseInsensitive: true
				},
				{
					token: 'keyword.control.assembly',
					regex: '\\b(?:add|addf|addr|and|clear|comp|compf|compr|div|divf|divr|fix|float|hio|j|jeq|jgt|jlt|jsub|lda|ldb|ldch|ldf|ldl|lds|ldt|ldx|lps|mul|mulf|mulr|norm|or|rd|rmo|rsub|shiftl|shiftr|sio|ssk|sta|stb|stch|stf|sti|stl|sts|stsw|stt|stx|sub|subf|subr|svc|td|tio|tix|tixr|wd)\\b',
					caseInsensitive: true
				},
				{
					token: 'variable.parameter.register.assembly',
					regex: '\\b(?:A|B|L|PC|SW|B|S|T|F)\\b',
					caseInsensitive: true
				},
				{
					token: 'constant.character.hexadecimal.assembly',
					regex: '\\sX\'[A-F0-9]{1,6}\'',
					caseInsensitive: true
				},
				{
					token: 'constant.character.decimal.assembly',
					regex: '\\b[0-9]+\\b'
				},
				{ token: 'string.assembly', regex: /C'([^\\']|\\.)*'/ },
				{ token: 'comment.assembly', regex: '\\..*$' }]
		};

		this.normalizeRules();
	};

	SicXEHighlightRules.metaData = {
		fileTypes: ['asm'],
		name: 'SIC/XE',
		scopeName: 'source.assembly'
	};


	oop.inherits(SicXEHighlightRules, TextHighlightRules);

	exports.SicXEHighlightRules = SicXEHighlightRules;
});

ace.define("ace/mode/folding/coffee", ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/fold_mode", "ace/range"], function (require, exports, module) {
	"use strict";

	var oop = require("../../lib/oop");
	var BaseFoldMode = require("./fold_mode").FoldMode;
	var Range = require("../../range").Range;

	var FoldMode = exports.FoldMode = function () { };
	oop.inherits(FoldMode, BaseFoldMode);

	(function () {

		this.getFoldWidgetRange = function (session, foldStyle, row) {
			var range = this.indentationBlock(session, row);
			if (range)
				return range;

			var re = /\S/;
			var line = session.getLine(row);
			var startLevel = line.search(re);
			if (startLevel == -1 || line[startLevel] != "#")
				return;

			var startColumn = line.length;
			var maxRow = session.getLength();
			var startRow = row;
			var endRow = row;

			while (++row < maxRow) {
				line = session.getLine(row);
				var level = line.search(re);

				if (level == -1)
					continue;

				if (line[level] != "#")
					break;

				endRow = row;
			}

			if (endRow > startRow) {
				var endColumn = session.getLine(endRow).length;
				return new Range(startRow, startColumn, endRow, endColumn);
			}
		};
		this.getFoldWidget = function (session, foldStyle, row) {
			var line = session.getLine(row);
			var indent = line.search(/\S/);
			var next = session.getLine(row + 1);
			var prev = session.getLine(row - 1);
			var prevIndent = prev.search(/\S/);
			var nextIndent = next.search(/\S/);

			if (indent == -1) {
				session.foldWidgets[row - 1] = prevIndent != -1 && prevIndent < nextIndent ? "start" : "";
				return "";
			}
			if (prevIndent == -1) {
				if (indent == nextIndent && line[indent] == "#" && next[indent] == "#") {
					session.foldWidgets[row - 1] = "";
					session.foldWidgets[row + 1] = "";
					return "start";
				}
			} else if (prevIndent == indent && line[indent] == "#" && prev[indent] == "#") {
				if (session.getLine(row - 2).search(/\S/) == -1) {
					session.foldWidgets[row - 1] = "start";
					session.foldWidgets[row + 1] = "";
					return "";
				}
			}

			if (prevIndent != -1 && prevIndent < indent)
				session.foldWidgets[row - 1] = "start";
			else
				session.foldWidgets[row - 1] = "";

			if (indent < nextIndent)
				return "start";
			else
				return "";
		};

	}).call(FoldMode.prototype);

});

ace.define("ace/mode/sicxe", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/sicxe_highlight_rules", "ace/mode/folding/coffee"], function (require, exports, module) {
	"use strict";

	var oop = require("../lib/oop");
	var TextMode = require("./text").Mode;
	var SicXEHighlightRules = require("./sicxe_highlight_rules").SicXEHighlightRules;
	var FoldMode = require("./folding/coffee").FoldMode;

	var Mode = function () {
		this.HighlightRules = SicXEHighlightRules;
		this.foldingRules = new FoldMode();
		this.$behaviour = this.$defaultBehaviour;
	};
	oop.inherits(Mode, TextMode);

	(function () {
		this.lineCommentStart = [";"];
		this.$id = "ace/mode/sicxe";
	}).call(Mode.prototype);

	exports.Mode = Mode;
}); (function () {
	ace.require(["ace/mode/sicxe"], function (m) {
		if (typeof module == "object" && typeof exports == "object" && module) {
			module.exports = m;
		}
	});
})();
