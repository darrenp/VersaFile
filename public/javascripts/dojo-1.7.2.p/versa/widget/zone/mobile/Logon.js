//>>built
define("versa/widget/zone/mobile/Logon",["dojo/_base/declare","dijit/_WidgetBase","versa/widget/zone/mobile/LogonView","dojox/mobile/View"],function(_1){return _1("versa.widget.zone.mobile.Logon",[dijit._WidgetBase],{constructor:function(_2){dojo.safeMixin(this,((!_2)?{}:_2));},postCreate:function(){this.inherited("postCreate",arguments);this.loadingView=dijit.byId("loadingView");},startup:function(){this.inherited("startup",arguments);this.logonView=new versa.widget.zone.mobile.LogonView({id:"logonView",zone:this.zone,onError:this.onError,onLogon:this.onLogon,onReset:this.onReset,onResetError:this.onError},dojo.create("div",{style:{height:"100%",width:"100%"}},dojo.body()));this.logonView.startup();this.loadingView=new dojox.mobile.View({id:"loadingView"});dojox.mobile.hideAddressBar();this.logonView.findAppBars();this.logonView.resize();}});});