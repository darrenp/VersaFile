//>>built
/**
 * Created by JetBrains RubyMine.
 * User: aarons
 * Date: 05/17/12
 * Time: 10:15 AM
 * To change this template use File | Settings | File Templates.
 */

//dojo.provide('versa.widget.zone.Logon');
//
//dojo.require('dijit._Widget');
//dojo.require('dijit._Templated');
//dojo.require('dijit.form.Form') ;
//
//dojo.require('versa.api.User');
//
//dojo.require('versa.widget.Button');
//dojo.require('versa.widget.ValidationTextBox');
//
//dojo.require('dojo.fx');

define("versa/widget/zone/mobile/Logon", ["dojo/_base/declare",
        "dijit/_WidgetBase",
        "versa/widget/zone/mobile/LogonView",
        "dojox/mobile/View"],
    function(declare){
        return declare("versa.widget.zone.mobile.Logon", [dijit._WidgetBase], {
            constructor: function(args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.loadingView=dijit.byId('loadingView');
            },

            startup: function(){
                this.inherited('startup', arguments);


                this.logonView=new versa.widget.zone.mobile.LogonView({
                    id: 'logonView',
                    zone: this.zone,
                    onError: this.onError,
                    onLogon: this.onLogon,
                    onReset: this.onReset,
                    onResetError: this.onError
                }, dojo.create("div", {style: {height: "100%", width: "100%"}}, dojo.body()));
                this.logonView.startup();

                this.loadingView=new dojox.mobile.View({
                    id: 'loadingView'
                });

                dojox.mobile.hideAddressBar();

//                this.loadingView.performTransition("logonView", 1, "fade");
                this.logonView.findAppBars();
                this.logonView.resize();
            }
        });
    }
);


