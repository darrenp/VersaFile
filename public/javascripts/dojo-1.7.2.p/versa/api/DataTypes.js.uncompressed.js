//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 07/11/11
 * Time: 2:46 PM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/DataTypes", ["dojo/_base/declare",
        "versa/api/DataType",
        "versa/api/_Collection"],
    function(declare){
        var o=declare("versa.api.DataTypes", [versa.api._Collection], {
            constructor: function(args){
                this.zone = null;
                this.target = versa.api.DataTypes.TRGT;
                this.schema = versa.api.DataType.schema;
                this.cache = true;

                this._initialize();
            }
        });

        o.types = {
            'VOID':     0,
            'BOOLEAN':  1,
            'INTEGER':  2,
            'FLOAT':    3,
            'DATETIME': 4,
            'STRING':   5,
            'TEXT':     6
        };

        o.TRGT = '/data_types';

        return o;
    }
);


