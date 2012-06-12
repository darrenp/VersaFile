//>>built
require(["dojo/_base/declare",
         "dijit/_WidgetBase",
         "dojox/mobile/Heading",
         "dojox/mobile/ScrollableView",
         "dojox/mobile/EdgeToEdgeDataList",
         "dojox/mobile/ToolBarButton",
         "dojox/mobile/ContentPane",
         "versa/api/Folders",
         "versa/api/Documents",
         "versa/api/Zones",
         "dojo/data/ItemFileWriteStore",
         "dojo/date/locale"],
    function(declare){
        declare("versa.widget.document.mobile.LargeTextView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            document: null,
            library: null,
            property: null,

            header: null,
            footer: null,
            cpContent: null,

            constructor: function(args){
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);


                this.header=new versa.widget.mobile.Heading({
                    label: this.label,
                    from: this,
                    back: this.back,
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    onCommand: this.onCommand,
                    from: this
                });

                this.cpContent=new dojox.mobile.ContentPane({
                    content: this.document[this.property]
                });

                this.addChild(this.header);
                this.addChild(this.footer);
                this.addChild(this.cpContent);
            },

            onBeforeTransitionIn: function(){
                this.findAppBars();
                this.resize();
            },

            onBeforeTransitionOut: function(){
                this.findAppBars();
                this.resize();
            },

            startup: function(){
                this.inherited('startup', arguments);
            }
        });
    }
);

