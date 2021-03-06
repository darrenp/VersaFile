//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 22/09/11
 * Time: 4:49 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Libraries", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Library"],
    function(declare){
        var o=declare("versa.api.Libraries", [versa.api._Collection], {
            zone: null,

            constructor: function(args){
                this.zone = args.zone;
                this.target = dojo.replace(versa.api.Libraries.TRGT, this.zone);
                this.schema = versa.api.Library.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{subdomain}/libraries';

        return o;
    }
);
