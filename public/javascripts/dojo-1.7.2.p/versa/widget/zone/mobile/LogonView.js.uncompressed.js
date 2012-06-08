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

define("versa/widget/zone/mobile/LogonView", ["dojo/_base/declare",
        "dijit/_Widget",
        "dijit/_TemplatedMixin",
        "dijit/form/Form",
        "versa/api/User",
        "dojox/mobile/Button",
        "dojox/mobile/ScrollableView",
        "dojox/mobile/ContentPane",
        "versa/widget/mobile/TextBox",
        "dojox/mobile/Heading"],
    function(declare){
        var o=declare("versa.widget.zone.mobile.LogonView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            _btnReset: null,
            _btnSubmit: null,
            _frmLogon: null,
            _txtEmail: null,
            _txtPassword: null,
            _txtResetName: null,
            _txtUserName: null,


            user: null,
            zone: null,

            _onResetClick: function(e){

                var a1 = dojo.fadeOut({
                    node: this.logonNode,
                    duration: 500,
                    onEnd: dojo.hitch(this, function(){
                        dojo.toggleClass(this.logonNode, 'versaHide', true);
                        dojo.toggleClass(this.resetNode, 'versaHide', false);
                        var username = this._txtUsername.get('value');
                        this._txtResetName.set('value', username);
                    })
                });
                var a2 = dojo.fadeIn({
                    node: this.resetNode,
                    duration: 500,
                    onEnd: dojo.hitch(this, function(){
                        this._btnReset.set('disabled', true);
                        this._txtResetName.blur();
                        this._txtResetName.validate();
                        this._txtEmail.blur();
                        this._txtEmail.validate();
                        this._txtResetName.focus();
                        this._btnReset.set('disabled', false);
                    })
                });

                dojo.fx.chain([a1, a2]).play();

            },

            _onReturnClick: function(e){
                var a1 = dojo.fadeOut({
                    node: this.resetNode,
                    duration: 500,
                    onEnd: dojo.hitch(this, function(){
                        dojo.toggleClass(this.logonNode, 'versaHide', false);
                        dojo.toggleClass(this.resetNode, 'versaHide', true);
                    })
                });
                var a2 = dojo.fadeIn({
                    node: this.logonNode,
                    duration: 500,
                    onEnd: dojo.hitch(this, function(){
                        this._txtPassword.reset();
                        this._txtUsername.setFocus();

                    })
                });

                dojo.fx.chain([a1, a2]).play();
            },

            _onResetSubmit: function(e){

                try{

                    if(this._frmReset.validate()){

                        var username = this._txtResetName.get('value');
                        var email = this._txtEmail.get('value');

                        this.zone.resetPassword(username, email);
                        this.onReset(username);
                        this._txtUsername.set('value', username);
                    }

                }
                catch(e){
                    this.onResetError(e);
                    this._txtResetName.reset();
                    this._txtEmail.reset();
                    this._txtResetName.setFocus();
                }
                finally{
                    e.preventDefault();
                }

            },

            _onLogonSubmit: function(e){

                try{

                    if(this._frmLogon.isValid()){

                        var username = this._txtUsername.get('value');
                        var password = this._txtPassword.get('value');

                        var user = this.zone.logon(username, password);
                        this.onLogon(user);

                    }
                    else{
                        this._txtUsername.validate();
                    }

                }
                catch(e){
                    this.onError(e);
                    this._txtPassword.reset();
                    this._txtUsername.setFocus(true);
                }
                finally{
                    e.preventDefault();
                }

                //this.statusNode.innerHTML = stsMessage;
            },

            constructor: function(args){

            },

            onError: function(e){
            },

            onLogon: function(user){
            },

            onReset: function(username){
            },

            onResetError: function(e){
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.heading=new dojox.mobile.Heading({
                    fixed: "top"
                });
                this.heading.domNode.innerHTML='<img src="/images/versafile-32-tm.png"/>';
                this.addChild(this.heading);

                this.cpContent=new dojox.mobile.ContentPane({
                    content: dojo.cache("versa.widget.zone.mobile", "template/Logon.html", "<div align=\"center\">\n    <div id=\"logonFormNode\">\n\n        <div>\n            <div>Username</div>\n            <input id=\"userNameNode\"/>\n        </div>\n\n        <div>\n            <div>Password</div>\n            <input id=\"passwordNode\"/>\n        </div>\n\n        <table id=\"statusNode\">\n            <tr>\n                <td style=\"vertical-align:top;\">\n                    <img id=\"statusImgNode\" src=\"/images/icons/16/blank.png\" width=\"16\" height=\"16\" style=\"float:right;margin-right:8px\"/>\n                </td>\n                <td>\n                    <span id=\"statusMsgNode\"></span>\n                </td>\n            </tr>\n        </table>\n\n        <div>\n            <button id=\"logonButtonNode\" type=\"submit\"></button>\n        </div>\n\n    </div>\n</div>\n")
                });
                this.addChild(this.cpContent);

                this._frmLogon = new dijit.form.Form({
                    onSubmit: dojo.hitch(this, this._onLogonSubmit)
                }, 'logonFormNode');

                this._txtUsername = new versa.widget.mobile.TextBox({
                    name: 'txtUsername',
                    required: true,
                    //placeHolder: 'User name',
                    missingMessage: 'Username is required',
                    value: (this.user == null) ? null : this.user.name,
                    disabled: (this.user != null),
                    style:'width:160px'
                }, 'userNameNode');

                this._txtPassword = new versa.widget.mobile.TextBox({
                    name: 'txtPassword',
                    //placeHolder: 'Password',
                    required: false,
                    type: 'password',
                    style:'width:160px'
                }, 'passwordNode');

                this._btnSubmit = new dojox.mobile.Button({
                    iconClass: 'buttonIcon bfreeIconLock',
                    label: 'Log in',
                    type: 'submit'
                }, 'logonButtonNode');

                this._txtUsername.focus();

            },

            startup: function(){
                this.inherited('startup', arguments);

            }
        });

        o.STS_CODES = {'ERR': 0x0, 'OK': 0x1};
        o.ERR_MESSAGE = 'Error: <b>{message}</b>';
        o.OK_MESSAGE = 'Success: <b>Logged in as user \'{name}\'.</b>';

        return o;
    }
);


