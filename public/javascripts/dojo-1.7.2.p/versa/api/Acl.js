//>>built
define("versa/api/Acl",["dojo/_base/declare"],function(_1){var o=_1("versa.api.Acl",[],{id:null,inherited:false,acl_entries:[],constructor:function(_2){dojo.safeMixin(this,((!_2)?{}:_2));},getAdministrator:function(){for(var i=0;i<this.acl_entries.length;i++){var _3=this.acl_entries[i];if((_3.grantee_type.toLowerCase()=="group")&&(_3.grantee.name.toLowerCase()=="administrators")){return this.acl_entries[i];}}},getEveryone:function(_4){var _5=null;dojo.some(this.acl_entries,function(_6,_7){var _8=(_6.grantee_type.toLowerCase()=="group")?_4.getGroups().fetchById({id:_6.grantee_id}):_4.getUsers().fetchById({id:_6.grantee_id});if(_8.isInstanceOf(versa.api.Group)&&_8.is_everyone){_5=_6;}return (_5!=null);},this);return _5;},hasAccess:function(_9,_a,_b){var _c=Number.NaN;var _d=Number.NaN;var _e=Number.NaN;dojo.forEach(this.acl_entries,function(_f,idx){var _10=_9.getRoles().fetchById({id:_f.role_id});var _11=(_f.grantee_type.toLowerCase()=="group")?_9.getGroups().fetchById({id:_f.grantee_id}):_9.getUsers().fetchById({id:_f.grantee_id});if((_11.isInstanceOf(versa.api.User))&&(_f.grantee_id==_a.id)){_c=_10.permissions;}else{if((_11.isInstanceOf(versa.api.Group))&&(_f.grantee_id==_b.id)){_d=_10.permissions;}else{if((_11.isInstanceOf(versa.api.Group))&&(_11.is_everyone)){_e=_10.permissions;}}}},this);if(!isNaN(_c)){return (_c>0);}if(!isNaN(_d)){return (_d>0);}if(!isNaN(_e)){return (_e>0);}return false;}});o.schema={type:"object",properties:{"id":{type:"integer"},"inherit_state":{type:"integer"},"inherited":{type:"boolean","default":false}},prototype:new o()};return o;});