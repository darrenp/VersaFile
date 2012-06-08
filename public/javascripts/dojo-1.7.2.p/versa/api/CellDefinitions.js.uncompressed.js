//>>built
/**
 * @author Scott
 */
define("versa/api/CellDefinitions", ["dojo/_base/declare",
        "versa/api/CellDefinition",
        "versa/api/_Collection",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.CellDefinitions", [versa.api._Collection], {
            constructor: function(/* Object */args){
                this.zone=args.zone;
                this.library=args.library;
                this.target = dojo.replace(versa.api.CellDefinitions.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.CellDefinition.schema;
                this.cache=true;

                this._initialize();
            },

            isValidItem: function(args){
                var isValid = this.inherited(arguments);
                var item = args.item;

                if(!isValid) return;

                if((!item.width) || (item.width.length < 1))
                    throw new Error('Cell Definition \'Width\' property is empty or invalid');

                return true;
            }
        });

        o.getDefaultWidth = function(data_type_id){
            var w = 128

            switch(data_type_id){
                case versa.api.DataTypes.types.VOID:
                    w = 18;
                    break;
                case versa.api.DataTypes.types.BOOLEAN:
                    w = 64;
                    break;
                case versa.api.DataTypes.types.INTEGER:
                    w = 64;
                    break;
                case versa.api.DataTypes.types.FLOAT:
                    w = 64;
                    break;
                case versa.api.DataTypes.types.DATETIME:
                    w = 128;
                    break;
                case versa.api.DataTypes.types.STRING:
                    w = 128;
                    break;
                case versa.api.DataTypes.types.TEXT:
                    w = 128;
                    break;
            }

            return w;
        };
        o.TRGT="/zones/{0}/libraries/{1}/cell_definitions"

        return o;
    }
);



