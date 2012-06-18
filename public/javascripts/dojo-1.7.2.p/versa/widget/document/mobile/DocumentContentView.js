//>>built
require(["dojo/_base/declare","dijit/_WidgetBase","dojox/mobile/Heading","dojox/mobile/ScrollableView","dojox/mobile/EdgeToEdgeDataList","dojox/mobile/ToolBarButton","dojox/mobile/ContentPane","versa/api/Folders","versa/api/Documents","versa/api/Zones","dojo/data/ItemFileWriteStore","dojo/date/locale"],function(_1){_1("versa.widget.document.mobile.DocumentContentView",[dijit._WidgetBase,dojox.mobile.ScrollableView],{reference:null,zone:null,library:null,header:null,footer:null,cpContent:null,constructor:function(_2){},postCreate:function(){this.inherited("postCreate",arguments);this.header=new versa.widget.mobile.Heading({label:this.reference.name,from:this,moveTo:this.back,onCommand:this.onCommand});this.footer=new versa.widget.mobile.Footing({onCommand:this.onCommand,from:this});if(this.reference.binary_content_type.indexOf("image")>=0){this.cpContent=new dojox.mobile.ContentPane({content:dojo.replace("<div style=\"text-align: center;vertical-align: middle;width: 100%; height: 100%;\">"+"<img src=\"{0}\" style=\"max-width: 100%; max-height: 100%;\"/>"+"</div>",[this.reference.getViewUrl(this.zone,this.library)])});}else{if(this.reference.binary_content_type.indexOf("text")>=0){this.cpContent=new dojox.mobile.ContentPane({content:""});dojo.xhrGet({url:this.reference.getViewUrl(this.zone,this.library),handleAs:"text",load:dojo.hitch(this,function(_3){_3=_3.replace(/\n/g,"<br/>");_3=_3.replace(/\t/g,"&nbsp;&nbsp;&nbsp;");this.cpContent.domNode.innerHTML=_3;})});}}this.addChild(this.header);this.addChild(this.footer);this.addChild(this.cpContent);},onBeforeTransitionIn:function(){this.findAppBars();this.resize();},onBeforeTransitionOut:function(){this.findAppBars();this.resize();},startup:function(){this.inherited("startup",arguments);}});});