//>>built
require(["dojo/_base/declare",
         "dojox/mobile/TabBar",
         "dojox/mobile/TabBarButton"],
    function(declare){
        declare("versa.widget.mobile.Footing", [dijit._WidgetBase, dojox.mobile.TabBar], {
            barType: "segmentedControl",
            center: true,
            fixed: "bottom",
            showRoot: true,
            showSearch: true,
            reference: null,

            constructor: function(args){
                this.inherited('constructor', arguments);
            },

            postCreate: function(args){
                this.inherited('postCreate', arguments);

                if(this.showRoot){
                    this.footerRootButton=new dojox.mobile.TabBarButton({
                        label: "Root",
                        from: this.from,
                        onCommand: this.onCommand,
                        onClick: function(){
                            this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_ROOT, {from: this.from});
                            this.set('selected', false);
                        }
                    }, dojo.create("div"));
                    this.addChild(this.footerRootButton);
                }
                if(this.reference){
                    this.footerViewButton=new dojox.mobile.TabBarButton({
                        label: "View",
                        onCommand: this.onCommand,
                        reference: this.reference,
                        onClick: function(){
                            this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_DOCUMENT_CONTENT, {reference: this.reference});
                            this.set('selected', false);
                        }
                    }, dojo.create("div"));
                    this.addChild(this.footerViewButton);
                }
                if(this.showSearch){
                    this.footerSearchButton=new dojox.mobile.TabBarButton({
                        label: "Search",
                        from: this.from,
                        onCommand: this.onCommand,
                        onClick: function(){
                            this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.SHOW_SEARCH, {from: this.from});
                            this.set('selected', false);
                        }
                    }, dojo.create("div"));
                    this.addChild(this.footerSearchButton);
                }
            }
        })
    }
);
