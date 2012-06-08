//>>built
/**
 * Created by JetBrains RubyMine.
 * User: scotth
 * Date: 08/03/12
 * Time: 11:51 AM
 * To change this template use File | Settings | File Templates.
 */
define("versa/api/PermissionSet", ["dojo/_base/declare"],
    function(declare){
        var o= declare("versa.api.PermissionSet", [], {
            _values: null,

            constructor: function(args){
                var seed = (args) ? args : false;
                this._values = new Array();
                for(var p in versa.api.PermissionIndices){
                    var idx = versa.api.PermissionIndices[p];
                    this._values[idx] = seed;
                }
            },

            andSet: function(prmSet){
                var resultSet = new versa.api.PermissionSet(true);

                for(var p in versa.api.PermissionIndices){
                    var idx = versa.api.PermissionIndices[p];
                    resultSet._values[idx] = (this._values[idx] && prmSet._values[idx]);
                }

                return resultSet;
            },

            orSet: function(prmSet){
                var resultSet = new versa.api.PermissionSet();

                for(var p in versa.api.PermissionIndices){
                    var idx = versa.api.PermissionIndices[p];
                    resultSet._values[idx] = (this._values[idx] || prmSet._values[idx]);
                }

                return resultSet;
            },

            getValue: function(index){
                return this._values[index];
            },

            setValue: function(index, value){
                this._values[index] = value;
            }
        });

        versa.api.PermissionIndices = {
            'CREATE':       0x00,
            'VIEW':         0x01,
            'COPY':         0x02,
            'EDIT':         0x03,
            'MOVE':         0x04,
            'CKO':          0x05,
            'CKI':          0x06,
            'CANCEL_CKO':   0x07,
            'VERSION':      0x08,
            'DELETE':       0x09,
            'SECURE':       0x0A,
            'RESTORE':      0x0B,
            'DESTROY':      0x0C

        }

        return o;
    }
);
