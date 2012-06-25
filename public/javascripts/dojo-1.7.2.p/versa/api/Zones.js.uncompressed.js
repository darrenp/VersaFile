//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/09/11
 * Time: 4:08 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Zones", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Zone"],
    function(declare){
        var o=declare("versa.api.Zones", [versa.api._Collection], {
            /**
             * Creates a new instance of versa.api.Libraries
             * @constructor
             */
            constructor: function(args){
                this.target = versa.api.Zones.TRGT;
                this.schema = versa.api.Zone.schema;
                this.cache = true;

                this._initialize();
            }

        });

        o.TRGT = '/zones';

        return o;
    }
);

