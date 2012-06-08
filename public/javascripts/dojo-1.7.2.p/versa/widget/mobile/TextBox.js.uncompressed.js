//>>built
/**
 * Created by JetBrains RubyMine.
 * User: aarons
 * To change this template use File | Settings | File Templates.
 */
define("versa/widget/mobile/TextBox", ["dojo/_base/declare",
         "dojox/mobile/TextBox"],
    function(declare){
        return declare("versa.widget.mobile.TextBox", [dojox.mobile.TextBox], {
            buildRendering: function(){
                this.inherited('buildRendering', arguments);

                if(this.type){
                    this.domNode.type=this.type;
                }
            }
        });
    }
);
