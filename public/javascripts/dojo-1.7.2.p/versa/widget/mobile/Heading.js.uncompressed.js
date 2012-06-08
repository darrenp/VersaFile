//>>built
require(["dojo/_base/declare",
         "dojox/mobile/Heading"],
    function(declare){
        declare("versa.widget.mobile.Heading", [dijit._WidgetBase, dojox.mobile.Heading], {
            fixed: "top",
            back: null,
            backTransition: null,
            backDirection: null,
            backButton: null,
            logoffButton: null,


            constructor: function(args){
                this.inherited('constructor', arguments);
            },

            postCreate: function(args){
                this.set('label', this.label.display_limit(12));
                this.inherited('postCreate', arguments);

                this.logoffButton=new dojox.mobile.ToolBarButton({
                    label: "Logoff",
                    from: this.from,
                    onClick: dojo.hitch(this, function(){
                        this.onCommand(versa.widget.zone.mobile.Show.COMMANDS.LOGOFF, {from: this.from});
                    }),
                    style: "float: right;"
                });
                this.addChild(this.logoffButton);
            },

            _setBackAttr: function(back){
                this.back=back;
                if(!this.backButton&&this.back){
                    this.backButton=new dojox.mobile.ToolBarButton({
                        moveTo: this.back,
                        label: "Back",
                        transition: this.backTransition?this.backTransition:"slide",
                        transitionDir: this.backDirection?this.backDirection:-1
                    });
                    this.addChild(this.backButton);
                }else if(this.backButton&&this.back){
                    this.backButton.set("moveTo", this.back);
                }
            }
        })
    }
);
