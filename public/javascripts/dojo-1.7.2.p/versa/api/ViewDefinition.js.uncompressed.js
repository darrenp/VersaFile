//>>built
/**
 * @author Scott
 */
define("versa/api/ViewDefinition", ["dojo/_base/declare",
        "versa/api/_Object",
        "versa/api/Error",
        "versa/api/Formatter"],
    function(declare){
        var o=declare("versa.api.ViewDefinition", [versa.api._Object], {
            _view: null,

            constructor: function(/* Object */args){
                dojo.safeMixin(this, ((!args) ? { } : args));
            },

            _generate: function(library){

                var view = {
                    name: this.name,
                    id: this.getId(),
                    sort_column: 1,
                    cells: []
                };

                dojo.forEach(this.cell_definitions, function(item, idx){

                    var cell = {
                        field: dojo.replace('{table_name}.{column_name}', item),
                        name: String.isBlank(item.label) ? '&nbsp;': item.label,
                        width: item.width,
                        noresize: item.noresize,
                        style: item.style,
                        date_format: item.date_format
                    }

                    cell.get = this._generateGetFn(item, library);
                    cell.formatter = this._generateFormatterFn(item);

                    view.cells.push(cell);

                    if(cell.field == this.sort_by)
                        view.sort_column = (this.is_desc) ? ((idx + 1) * -1) : (idx + 1);

                }, this);

                return view;

            },

            _generateFormatterFn: function(cell_definition){
                var fn = versa.api.CellDefinition.formatData;
                if(cell_definition.column_name.indexOf('prp_bln')>=0){
                    fn=versa.api.CellDefinition.formatBoolean
                }
                switch(cell_definition.formatter){
                    case versa.api.CellDefinition.formats.icon:
                        fn = versa.api.CellDefinition.formatIcon;
                        break;
                    case versa.api.CellDefinition.formats.size:
                        fn = versa.api.CellDefinition.formatSize;
                        break;
                    case versa.api.CellDefinition.formats.status:
                        fn = versa.api.CellDefinition.formatStatus;
                        break;
                }

                return fn;
            },

            _generateGetFn: function(cell_definition, library){
                var fn = null

                switch(cell_definition.table_name){
                    case 'versions':
                        fn = dojo.hitch([this, cell_definition], versa.api.ViewDefinition._getVersionAttrFn);
                        break;
                    case 'documents':
                        fn = dojo.hitch([this, cell_definition], versa.api.ViewDefinition._getDocumentAttrFn);
                        break;
                    case 'document_types':
                        fn = dojo.hitch([this, cell_definition, library], versa.api.ViewDefinition._getDocumentTypeAttrFn);
                        break;
                }

                return fn;
            },

            _formatDateTime: function(cellDef, datetime){
                return versa.api.Formatter.formatDateTime(datetime);
            },

            getCellByField: function(field){
                var cell = null;

                dojo.some(this.cell_definitions, function(cell_definition, idx){
                    if(versa.api.CellDefinition.getDbName(cell_definition) == field)
                        cell = cell_definition;
                    return (cell);
                }, this);

                return cell;
            },

            getView: function(library){

                /*
                if(!this._view){
                    this._view = this._generate(library);
                }

                return this._view;
                */
                return this._generate(library);
            },

            isValid: function(){
                var isValid = true;

                if (String.isEmpty(this.name.trim())) {
                    isValid = false;
                }

                if (String.isEmpty(this.sort_by)){
                    isValid = false;
                }

                return isValid;
            },

            findColumn: function(table, column){
                for(var i=0;i<this.cell_definitions.length;i++){
                    //turn into method
                    if(this.cell_definitions[i].table_name&&
                       this.cell_definitions[i].column_name&&
                       table==this.cell_definitions[i].table_name&&
                       column==this.cell_definitions[i].column_name){
                        return this.cell_definitions[i];
                    }
                }
                return null;
            }
        });

        o.getCustomName = function(user, folder){
            return dojo.replace('{0}.{1}', [user.name, folder.name]);
        };

        o._getDocumentAttrFn =  function(rowIndex, item){
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
                        value = viewDef._formatDateTime(cellDef, item[column]);
                    }
                    else {
                        value = item[column];
                    }
                    break;
            }

            return value;
        };

        o._getDocumentTypeAttrFn = function(rowIndex, item){
            var value = '';

            var viewDef = this[0];
            var cellDef = this[1];
            var activeLibrary = this[2];

            if((!item))
                return value;

            switch(cellDef.column_name){
                case 'name':
                    value = item.document_type_name;
                    break;
            }

            return value;
        };

        o._getVersionAttrFn = function(rowIndex, item){
            var value = null;
            var viewDef = this[0];
            var cellDef = this[1];

            if(!item)
                return value;

            try{
                switch(cellDef.column_name){
                    case 'binary_content_type':
                        value = item.binary_content_type
                        break;
                    case 'version_number':
                        value = item.major_version_number;
                        break;
                    case 'binary_file_size':
                        value = item.binary_file_size;
                        break;
                }
            }
            catch(e){
                console.log(e);
            }
            return (!value) ? '' : value;
        };


        o.compare=function(viewA, viewB){

            if((!viewA) && (viewB))
                return -1;
            if((viewA) && (!viewB))
                return 1;
            if((!viewA) && (!viewB))
                return 0;

            if((!viewA.name) && (viewB.name))
                return -1;
            if((viewA.name) && (!viewB.name))
                return 1;
            if((!viewA.name) && (!viewB.name))
                return 0;

            if(viewA.name.toLowerCase() == viewB.name.toLowerCase()){
                return 0;
            }

            return (viewA.name.toLowerCase() < viewB.name.toLowerCase()) ? -1 : 1;
        };

        o.schema = {
            type: 'object',
            properties: {
                'id': {
                    type: 'integer'
                },
                'name': {
                    type: 'string'
                },
                'description': {
                    type: 'string'
                },
                'is_desc': {
                    type: 'boolean',
                    'default': false
                },
                'is_template': {
                    type: 'boolean',
                    'default': false
                },
                'scope': {
                    type: 'string',
                    'default': '*'
                },
                'sort_by': {
                    type: 'string'
                },
                'cell_definitions': {
                    type: 'array',
                    'default': [],
                    'items': {
                        type: 'object',
                        properties: {
                            'table_name': {
                                type: 'string'
                            },
                            'column_name': {
                                type: 'string'
                            },
                            'name': {
                                type: 'string'
                            },
                            'label': {
                                type: 'string'
                            },
                            'column_order': {
                                type: 'integer'
                            },
                            'formatter': {
                                type: 'integer'
                            },
                            'date_format': {
                                type: 'string'
                            },
                            'width': {
                                type: 'string'
                            }
                        }
                    }
                },
                'created_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'created_by': {
                    type: 'string',
                    'default': ''
                },
                'updated_at': {
                    type: 'date',
                    format: 'date-time'
                },
                'updated_by': {
                    type: 'string',
                    'default': ''
                }
            },
            prototype: o.prototype
        };

        return o;
    }
);


