//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 21/11/11
 * Time: 1:40 PM
 * To change this template use File | Settings | File Templates.
 */
//dojo.provide('bfree.widget.search.TextBox');
//
//dojo.require('bfree.api.Search');
//
//dojo.require('bfree.widget.ValidationTextBox');
//dojo.require('bfree.widget.search.DropDown');
//
//dojo.require('dijit._Templated');
//dojo.require('dijit._Widget');
//dojo.require('dijit.form.Button');
//dojo.require('dijit.form.TextBox');

define("versa/widget/search/mobile/TextBox", ["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dojox/mobile/Button",
        "dijit/form/Form",
        "versa/api/Search",
        "versa/widget/mobile/TextBox"],
    function(declare){
        return declare("versa.widget.search.mobile.TextBox", [dijit._WidgetBase, dijit._TemplatedMixin], {
            header: null,
        	templateString: dojo.cache("versa.widget.search.mobile", "template/TextBox.html", "<div>\n\n<div style=\"width: inherit;padding: 10px; text-align: center;\">\n    <table cellpadding=\"0\" cellspacing=\"0\" style=\"width: 300px;margin-left: auto; margin-right: auto; height: 35px;\" class=\"searchTextBox\">\n        <tr>\n            <td style=\"\">\n                <div dojoAttachPoint=\"formNode\">\n                    <input dojoAttachPoint=\"textboxNode,focusNode\"/>\n                </div>\n            </td>\n            <td style=\"width:1px\"><button dojoAttachPoint=\"resetButtonNode\"></button></td>\n            <td style=\"width:1px\"><button dojoAttachPoint=\"submitButtonNode\"></button></td>\n        </tr>\n    </table>\n</div>\n\n</div>"),

            operators: null,
            library: null,

            _form: null,
            activeQuery: null,
            txtSearch: null,

            constructor: function(args){
            },

            onSearch: function(searchItem){
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this._form = new dijit.form.Form({
                    onSubmit: dojo.hitch(this, this._onSubmit),
                    onReset: dojo.hitch(this, this.reset)
                }, this.formNode);

                this.btnSearch=new dojox.mobile.Button({
                    baseClass: 'imageButton commandIcon32 bfreeIconSearch32',
                    label: '',
                    showLabel: false,
                    type: 'submit',
                    onClick: dojo.hitch(this, this._onClick)
                }, this.submitButtonNode);

                this.btnReset=new dojox.mobile.Button({
                    baseClass: 'imageButton commandIcon32 bfreeIconError32',
                    label: '',
                    showLabel: false,
                    type: 'reset',
                    onClick: dojo.hitch(this, this.reset)
                }, this.resetButtonNode);
                this.resetButtonNode.type='reset';

                this.txtSearch = new versa.widget.mobile.TextBox({
                    intermediateChanges: true,
                    placeHolder: 'Search documents...',
                    style: 'border:0;font-size:20px;width:100%;background:transparent;'
                }, this.textboxNode);

//                new bfree.widget.search.DropDown({
//                    library: this.library,
//                    iconClass: 'searchIcon bfreeIcon',
//                    showLabel: false,
//                    onSearch: dojo.hitch(this, this._onSearch)
//                }, this.advancedButtonNode);

            },

            _onSubmit: function(e){
                e.preventDefault();
                this.submit();
            },

            _onClick: function(){
                this.submit();
            },

            reset: function(){
                this.txtSearch.set('value', '');
            },

            submit: function(){

            },

            startup: function(){
                this.inherited('startup', arguments);
            }
        }
    );
});