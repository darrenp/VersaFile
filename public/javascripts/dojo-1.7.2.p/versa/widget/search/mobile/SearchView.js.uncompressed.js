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
         "versa/widget/search/mobile/TextBox",
         "dojo/data/ItemFileWriteStore",
         "dojo/date/locale"],
    function(declare){
        declare("versa.widget.search.mobile.SearchView", [dijit._WidgetBase, dojox.mobile.ScrollableView], {
            header: null,
            cpContent: null,
            footer: null,

            constructor: function(args){
            },

            _setBackAttr: function(back){
                this.back=back;
                if(this.header){
                    this.header.set('moveTo', back)
                }
            },

            postCreate: function(){
                this.inherited('postCreate', arguments);

                this.header=new versa.widget.mobile.Heading({
                    label: "Search",
                    from: this,
                    back: this.back,
                    transition: "slidev",
                    onCommand: this.onCommand
                });

                this.footer=new versa.widget.mobile.Footing({
                    showSearch: false,
                    onCommand: this.onCommand,
                    from: this
                });

                this.cpContent=new dojox.mobile.ContentPane({
                    content: dojo.cache("versa.widget.search.mobile", "template/SearchView.html", "<div style=\"width: 100%; height: 100%; text-align: center;\">\n    <input id=\"searchField\"   data-dojo-type=\"versa.widget.search.mobile.TextBox\"/>\n</div>\n"),
                    parseOnLoad: true
                });

                this.searchField=dijit.byId('searchField');
                this.searchField.txtSearch.onFocus = dojo.hitch(this, function(){
                    if(this.searchField.txtSearch.focused){
                        this.footer.domNode.style.visibility='hidden';
                    }
                    this.findAppBars();
                    this.resize();
                });
                this.searchField.txtSearch.onBlur = dojo.hitch(this, function(){
                    this.findAppBars();
                    this.resize();
                    this.footer.domNode.style.visibility='visible';
                });
                this.searchField.set('submit', dojo.hitch(this, function(){
                    this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.PERFORM_SEARCH, {search: this.searchField.txtSearch.get('value')});
                }));

                this.addChild(this.cpContent);
                this.addChild(this.footer);
                this.addChild(this.header);
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

