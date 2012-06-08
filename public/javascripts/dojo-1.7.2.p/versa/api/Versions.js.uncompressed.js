//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 19/09/11
 * Time: 1:14 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/Versions", ["dojo/_base/declare",
         "versa/api/_Collection",
         "versa/api/Version"],
    function(declare){
        var o=declare("versa.api.Versions", [versa.api._Collection], {
            zone: null,
            library: null,
            document: null,

            constructor: function(args){
                this.zone = args.zone;
                this.library = args.library;
                this.document = args.document;
                this.target = dojo.replace(versa.api.Versions.TRGT, [this.zone.subdomain, this.library.id, this.document.getId()]);
                this.schema = versa.api.Version.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.TRGT = '/zones/{0}/libraries/{1}/documents/{2}/versions';

        return o;
    }
);

