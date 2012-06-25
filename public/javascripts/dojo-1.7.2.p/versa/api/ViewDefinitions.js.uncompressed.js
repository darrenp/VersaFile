//>>built
/**
 * @author Scott
 */
define("versa/api/ViewDefinitions", ["dojo/_base/declare",
        "versa/api/ViewDefinition",
        "versa/api/_Collection",
        "versa/api/CellDefinitions",
        "versa/api/Error"],
    function(declare){
        var o=declare("versa.api.ViewDefinitions", [versa.api._Collection], {
            _system: null,

            documentTypes: null,


            _matchesQuery: function(item,request){

                //query returns array of cell definitions,
                //exclude them.
                if(dojo.isArray(item) || (item.hasOwnProperty('column_order')))
                    return false;

                var query = request.query;
                var ignoreCase = request.queryOptions && request.queryOptions.ignoreCase;
                for(var i in query){
                    // if anything doesn't match, than this should be in the query
                    var match = query[i];
                    var value = this.getValue(item,i);
                    if((typeof match == 'string' && (match.match(/[\*\.]/) || ignoreCase)) ?
                        !dojo.data.util.filter.patternToRegExp(match, ignoreCase).test(value) :
                        value != match){
                        return false;
                    }
                }
                return true;
            },

            copyFromTemplate: function(viewDef, user){
                var cell_definitions=viewDef.cell_definitions;
                var toReturn=this.create({
                    cell_definitions: [],
                    created_by: user.name,
                    is_system: false,
                    is_template: false,
                    library_id: viewDef.library_id,
                    name: viewDef.name,
                    scope: viewDef.scope,
                    sort_by: viewDef.sort_by,
                    updated_by: user.name
                });

                dojo.forEach(cell_definitions, function(cell){
                    toReturn.cell_definitions.push({
                        column_name: cell.column_name,
                        column_order: cell.column_order,
                        date_format: cell.date_format,
                        formatter: cell.formatter,
                        label: cell.label,
                        name: cell.name,
                        noresize: cell.noresize,
                        style: cell.style,
                        table_name: cell.table_name,
                        width: cell.width
                    })
                }, this);

                return toReturn;
            },

            /*
            generateView: function(viewDef, cellDefinitions){
                var view = {
                    name: viewDef.name,
                    view_definition_id: viewDef.id,
                    sort_column: 1,
                    cells: []
                }

                var cellDefs = cellDefinitions.query({
                    query: { view_definition_id: viewDef.id }
                });

                cellDefs=cellDefs.sort(versa.api.CellDefinition.compare);

                var idx = 1;
                dojo.forEach(cellDefs, function(cellDef){
                    var cell = {
                        field: cellDef.table_name + '.' + cellDef.column_name,
                        name: cellDef.label,
                        width: cellDef.width,
                        noresize: cellDef.noresize,
                        style: cellDef.style,
                        date_format: cellDef.date_format
                    };

                    if((cell.name == null) || (cell.name.length < 1))
                        cell.name = ' ';

                    cell.get = viewDef._generateGetFn(cellDef, this.library);
                    cell.formatter = viewDef._generateFormatterFn(cellDef);

                    view.cells.push(cell);

                    if(cell.field == viewDef.sort_by){
                        view.sort_column = idx;
                    }

                    idx++;
                }, this);

                return view;
            },
            */

            _getDocumentAttr: function(rowIndex, item){
                var value = '';
                var viewDef = this[0];
                var cellDef = this[1];

                if(!item)
                    return value;

                var column = cellDef.column_name

                switch(column){
                    case 'created_at':
                    case 'updated_at':
                        value = viewDef._formatDateTime(cellDef, item[column]);
                        break;
                    default:
                        if (/prp_dtt/.test(column) && item[column]) {
                            value = dojo.date.stamp.fromISOString(item[column]);
                            if(value){
                                value = viewDef._formatDateTime(cellDef, value);
                            }
                        }
                        else {
                            value = item[column];
                        }
                        break;
                }

                return value;
            },

            _getDocumentTypeAttr: function(rowIndex, item){
                var value = '';
                var viewDef = this[0];
                var cellDef = this[1];

                if(!item)
                    return value;

                if(!item.document_type_id)
                    return '';

                var docType = viewDef.documentTypes.fetchById({
                    id: item.document_type_id
                });

                switch(cellDef.column_name){
                    case 'name':
                        value = docType.name;
                        break;
                }

                return value;
            },

            _getVersionAttr: function(rowIndex, item){
                var value = '';
                var viewDef = this[0];
                var cellDef = this[1];

                if(!item)
                    return value;

                switch(cellDef.column_name){
                    case 'content_type':
                        value = (item.current_version) ? item.current_version.content_type : '';
                        break;
                    case 'version_number':
                        value = (item.current_version) ? item.current_version.version_number : 0;
                        break;
                    case 'size':
                        value = (item.current_version) ? item.current_version.size : 0;
                        break;
                }

                return value;
            },

            constructor: function(/* Object */args){
                this.zone=args.zone;
                this.library=args.library;
                this.target = dojo.replace(versa.api.ViewDefinitions.TRGT, [this.zone.subdomain, this.library.id]);
                this.schema = versa.api.ViewDefinition.schema;
                this.cache = true;
                this.cellDefinitions = args.cellDefinitions;

                this._initialize();
                //this.store.matchesQuery  = dojo.hitch(this, this._matchesQuery);
            },

            cloneItem: function(source){
                var clone = this.create({
                    name: source.name,
                    is_system: false,
                    description: source.description,
                    is_template: false,
                    scope: source.scope,
                    sort_by: source.sort_by
                });

                dojo.forEach(source.cell_definitions, function(cell_definition, idx){
                    clone.cell_definitions.push(versa.api.CellDefinition.clone(cell_definition));
                });

                return clone;
            },

            getSystem: function(){

                if(!this._system){
                    this._system = new Array();
                    this.forEach(function(item){
                        if(item.is_system){
                            this._system.push(item);
                        }
                    }, this);
                }

                return this._system;
            },

            isValidItem: function(args){
                var isValid = this.inherited(arguments);
                var item = args.item;

                if(!isValid) return;

                if (item.name.length < 1) {
                    throw new Error('View Definition \'Name\' is empty or invalid');
                }

                if ((!item.sort_by) || (item.sort_by.length < 1)){
                    throw new Error('View Definition must have a \'Sort By\' value');
                }

                return true;
            }
        });
        o.TRGT="/zones/{0}/libraries/{1}/view_definitions"

        return o;

    }
);

