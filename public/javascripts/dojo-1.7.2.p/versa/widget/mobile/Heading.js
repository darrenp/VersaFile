//>>built
require(["dojo/_base/declare","dojox/mobile/Heading"],function(_1){_1("versa.widget.mobile.Heading",[dijit._WidgetBase,dojox.mobile.Heading],{fixed:"top",logoffButton:null,constructor:function(_2){if(_2.moveTo){this.back="Back";}this.inherited("constructor",arguments);},findCurrentView:function(){var w=this;while(true){w=w.getParent();if(!w){return null;}if(w.isInstanceOf(dojox.mobile.View)){break;}}return w;},postCreate:function(_3){this.set("label",this.label.display_limit(12));this.inherited("postCreate",arguments);this.logoffButton=new dojox.mobile.ToolBarButton({label:"Logoff",from:this.from,onClick:dojo.hitch(this,function(){this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.LOGOFF,{from:this.from});}),style:"float: right;"});this.addChild(this.logoffButton);},_setMoveToAttr:function(_4){this.moveTo=_4;if(this.moveTo){this.set("back","Back");}else{this.set("back",null);}}});});