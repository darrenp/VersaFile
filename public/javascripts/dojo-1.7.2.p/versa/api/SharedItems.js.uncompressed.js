//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 16/04/12
 * Time: 9:49 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/SharedItems", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/SharedItem"],
    function(declare){
        var o=declare("versa.api.SharedItems", [versa.api._Collection], {
            zone: null,
            share: null,

            constructor: function(args){
                this.zone = args.zone;
                this.share = args.share;
                this.target = dojo.replace(versa.api.SharedItems.TRGT, [this.zone.subdomain, this.share.fingerprint]);
                this.schema = versa.api.SharedItem.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{0}/shares/{1}/shared_items';

        return o;
    }
);

