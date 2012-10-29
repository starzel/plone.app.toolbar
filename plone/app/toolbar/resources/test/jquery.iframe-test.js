// tests for jquery.iframe.js script.
//
// @author Rok Garbas
// @version 1.0
// @licstart  The following is the entire license notice for the JavaScript
//            code in this page.
//
// Copyright (C) 2010 Plone Foundation
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along with
// this program; if not, write to the Free Software Foundation, Inc., 51
// Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// @licend  The above is the entire license notice for the JavaScript code in
//          this page.
//

/*jshint bitwise:true, curly:true, eqeqeq:true, immed:true, latedef:true,
  newcap:true, noarg:true, noempty:true, nonew:true, plusplus:true,
  regexp:true, undef:true, strict:true, trailing:true, browser:true */
/*global buster:false, jQuery:false, */


(function($, undefined) {
"use strict";

var testCase = buster.testCase,
    assert = buster.assert;


testCase("jquery.iframe.js", {

  setUp: function() {
    $.iframe = new $.IFrame({
      el: $('<div><p>some</p><a href="#">some link</a></div>').appendTo('body'),
      position: 'top'
    });
    this._window_location = $.iframe._window_location;
    this._window_open = $.iframe._window_open;
    $.iframe._window_location = function() {};
    $.iframe._window_open = function() {};
  },

  tearDown: function() {
    $.iframe.el.remove();
    $.iframe = undefined;
  },

  //  --- tests --- //

  "simple stretch and shrink": function() {
    var initial_height = $.iframe.el.height();

    assert(initial_height !== 0);

    $.iframe.stretch();
    assert(initial_height < $.iframe.el.height());

    $.iframe.shrink();
    assert(initial_height === $.iframe.el.height());
  },

  "defult handling of clicks inside iframe": function() {
    var stub_location = this.stub($.iframe, '_window_location'),
        stub_open = this.stub($.iframe, '_window_open');

    $('a', $.iframe.el).trigger({ type: 'click', which: 1 });  // left click
    $('a', $.iframe.el).trigger({ type: 'click', which: 2 });  // middle click

    assert.calledOnceWith(stub_location, '#');
    assert.calledOnceWith(stub_open, '#');
    assert.callOrder(stub_location, stub_open);
  },

  "custom handling of clicks inside iframe": function() {
    $.iframe.clickActions.push([
      function(e, iframe) { return true; },  // condition
      function(e, iframe) { assert(true); }  // action
    ]);
    $('p', $.iframe.el).trigger({ type: 'click' });
  }

});

}(jQuery));
