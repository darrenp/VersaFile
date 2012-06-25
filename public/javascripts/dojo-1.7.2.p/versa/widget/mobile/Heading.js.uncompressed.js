//>>built
require(["dojo/_base/declare",
         "dojox/mobile/Heading"],
    function(declare){
        declare("versa.widget.mobile.Heading", [dijit._WidgetBase, dojox.mobile.Heading], {
            fixed: "top",
            logoffButton: null,

            constructor: function(args){
                if(args.moveTo){
                    this.back="Back";
                }
                this.inherited('constructor', arguments);
            },

            findCurrentView: function(){
                // summary:
                //		Search for the view widget that contains this widget.
                var w = this;
                while(true){
                    w = w.getParent();
                    if(!w){ return null; }
                    if(w.isInstanceOf(dojox.mobile.View)){ break; }
                }
                return w;
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

            _setMoveToAttr: function(moveTo){
                this.moveTo=moveTo;
                if(this.moveTo){
                    this.set('back', "Back");
                }else{
                    this.set('back', null);
                }
            }

            //,

//            _setBackAttr: function(back){
//                this.back=back;
//                if(!this.backButton&&this.back){
//                    this.backButton=new dojox.mobile.ToolBarButton({
//                        moveTo: this.back,
//                        label: "Back",
//                        transition: this.backTransition?this.backTransition:"slide",
//                        transitionDir: this.backDirection?this.backDirection:-1
//                    });
//                    this.addChild(this.backButton);
//                }else if(this.backButton&&this.back){
//                    this.backButton.set("moveTo", this.back);
//                }
//            }
        })
    }
);
