//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 24/10/11
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Shares", ["dojo/_base/declare",
        "versa/api/_Collection",
        "versa/api/Share"],
    function(declare){
        var o=declare("versa.api.Shares", [versa.api._Collection], {
            constructor: function(args){

                this.zone = args.zone;
                this.target = dojo.replace(versa.api.Shares.TRGT, [this.zone.subdomain]);
                this.schema = versa.api.Share.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{0}/shares';

        return o;
    }
);


