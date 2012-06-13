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
        	templateString: dojo.cache("versa.widget.search.mobile", "template/TextBox.html", "<div>\n\n<div dojoAttachPoint=\"formNode\">\n    <div style=\"width: inherit;padding: 10px; text-align: center;\">\n        <table cellpadding=\"0\" cellspacing=\"0\" style=\"width: 100%\" class=\"searchTextBox\">\n            <tr>\n                <td style=\"\"><input dojoAttachPoint=\"textboxNode,focusNode\"></input></td>\n                <td style=\"width:1px\"><button dojoAttachPoint=\"resetButtonNode\"></button></td>\n                <td style=\"width:1px\"><button dojoAttachPoint=\"submitButtonNode\"></button></td>\n            </tr>\n        </table>\n    </div>\n</div>\n\n</div>"),

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

                this.btnSearch=new dojox.mobile.Button({
                    baseClass: 'imageButton imageIcon bfreeIconSearch',
                    label: '',
                    showLabel: false,
                    type: 'submit',
                    onClick: dojo.hitch(this, this._onClick)
                }, this.submitButtonNode);

                this.btnReset=new dojox.mobile.Button({
                    baseClass: 'imageButton imageIcon bfreeIconError',
                    label: '',
                    showLabel: false,
                    onClick: dojo.hitch(this, function(){
                        this.txtSearch.set('value', '');
                    })
                }, this.resetButtonNode);

                this.txtSearch = new versa.widget.mobile.TextBox({
                    intermediateChanges: true,
                    placeHolder: 'Search documents...',
                    style: 'border:0;font-size:13px;width:100%;background:transparent;'
                }, this.textboxNode);

//                new bfree.widget.search.DropDown({
//                    library: this.library,
//                    iconClass: 'searchIcon bfreeIcon',
//                    showLabel: false,
//                    onSearch: dojo.hitch(this, this._onSearch)
//                }, this.advancedButtonNode);

            },

            _onClick: function(){
                this.onClick();
            },

            onClick: function(){

            },

            startup: function(){
                this.inherited('startup', arguments);
            }
        }
    );
});