(self.webpackChunkant_design_pro=self.webpackChunkant_design_pro||[]).push([[654],{70271:function(Q,x,e){"use strict";var E=e(22122),h=e(28991),P=e(81253),R=e(67294),m=e(38622),Z=["fieldProps","proFieldProps"],A=function(C,o){var c=C.fieldProps,M=C.proFieldProps,U=(0,P.Z)(C,Z);return R.createElement(m.Z,(0,E.Z)({mode:"edit",valueType:"digitRange",fieldProps:(0,h.Z)({},c),ref:o,filedConfig:{defaultProps:{width:"100%"}},proFieldProps:M},U))};x.Z=R.forwardRef(A)},64317:function(Q,x,e){"use strict";var E=e(22122),h=e(28991),P=e(81253),R=e(22270),m=e(67294),Z=e(66758),A=e(38622),g=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","showSearch","options"],C=["fieldProps","children","params","proFieldProps","mode","valueEnum","request","options"],o=m.forwardRef(function(s,W){var D=s.fieldProps,_=s.children,L=s.params,K=s.proFieldProps,V=s.mode,y=s.valueEnum,G=s.request,w=s.showSearch,z=s.options,N=(0,P.Z)(s,g),H=(0,m.useContext)(Z.Z);return m.createElement(A.Z,(0,E.Z)({mode:"edit",valueEnum:(0,R.h)(y),request:G,params:L,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,h.Z)({options:z,mode:V,showSearch:w,getPopupContainer:H.getPopupContainer},D),ref:W,proFieldProps:K},N),_)}),c=m.forwardRef(function(s,W){var D=s.fieldProps,_=s.children,L=s.params,K=s.proFieldProps,V=s.mode,y=s.valueEnum,G=s.request,w=s.options,z=(0,P.Z)(s,C),N=(0,h.Z)({options:w,mode:V||"multiple",labelInValue:!0,showSearch:!0,showArrow:!1,autoClearSearchValue:!0,optionLabelProp:"label"},D),H=(0,m.useContext)(Z.Z);return m.createElement(A.Z,(0,E.Z)({mode:"edit",valueEnum:(0,R.h)(y),request:G,params:L,valueType:"select",filedConfig:{customLightMode:!0},fieldProps:(0,h.Z)({getPopupContainer:H.getPopupContainer},N),ref:W,proFieldProps:K},z),_)}),M=o,U=c,S=M;S.SearchSelect=U,S.displayName="ProFormComponent",x.Z=S},90672:function(Q,x,e){"use strict";var E=e(22122),h=e(81253),P=e(67294),R=e(38622),m=["fieldProps","proFieldProps"],Z=function(g,C){var o=g.fieldProps,c=g.proFieldProps,M=(0,h.Z)(g,m);return P.createElement(R.Z,(0,E.Z)({ref:C,mode:"edit",valueType:"textarea",fieldProps:o,proFieldProps:c},M))};x.Z=P.forwardRef(Z)},94750:function(Q,x,e){"use strict";var E=e(81910),h=e(85893),P=function(m){var Z=(0,E.md)();return(0,h.jsx)(E.Nv,{accessible:Z[m.access],children:m.children})};x.Z=P},92321:function(Q,x,e){"use strict";e.r(x),e.d(x,{default:function(){return Fe}});var E=e(62350),h=e(24565),P=e(86582),R=e(57663),m=e(71577),Z=e(91220),A=e(34792),g=e(48086),C=e(11849),o=e(39428),c=e(3182),M=e(69610),U=e(54941),S=e(81306),s=e(80017),W=e(94750),D=e(62260),_=e(49101),L=e(1870),K=e(67265),V=e(25590),y=e(67294),G=e(9715),w=e(55843),z=e(2824),N=e(71975),H=e(5966),Y=e(64317),J=e(70271),de=e(90672),n=e(85893),fe=function(a){var r,F,v,f,l,u,d,p,i,O,t,ee,ae,re,ne,te,le,se,ue,ie,xe=w.Z.useForm(),Ee=(0,z.Z)(xe,1),Ze=Ee[0];return(0,n.jsxs)(N.a,{title:a.values?"\u7F16\u8F91":"\u6DFB\u52A0",form:Ze,preserve:!1,trigger:a.btn,layout:"horizontal",autoFocusFirstInput:!0,drawerProps:{destroyOnClose:!0},submitTimeout:2e3,onFinish:function(){var oe=(0,c.Z)((0,o.Z)().mark(function $(B){var X;return(0,o.Z)().wrap(function(j){for(;;)switch(j.prev=j.next){case 0:return B.id=((X=a.values)===null||X===void 0?void 0:X.id)||0,j.abrupt("return",a.onSubmit(B));case 2:case"end":return j.stop()}},$)}));return function($){return oe.apply(this,arguments)}}(),width:"600px",children:[(0,n.jsx)(H.Z,{name:"name",rules:[{required:!0,message:"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A"}],labelCol:{span:5},label:"\u540D\u79F0",initialValue:((r=a.values)===null||r===void 0?void 0:r.name)||""}),(0,n.jsx)(Y.Z,{label:"\u6027\u522B",options:[{label:"\u7537",value:1},{label:"\u5973",value:2},{label:"\u672A\u77E5",value:3}],mode:"multiple",name:"gender",rules:[{required:!0,message:"\u6027\u522B\u4E0D\u80FD\u4E3A\u7A7A"}],initialValue:((F=a.values)===null||F===void 0?void 0:F.gender)&&JSON.parse((v=a.values)===null||v===void 0?void 0:v.gender),labelCol:{span:5}}),(0,n.jsx)(J.Z,{label:"\u5E74\u9F84\u533A\u95F4",name:"age_range",labelCol:{span:5},separator:"-",separatorWidth:60,initialValue:[(f=a.values)===null||f===void 0?void 0:f.min_age,(l=a.values)===null||l===void 0?void 0:l.max_age],extra:"\u4E0D\u586B\u6216\u8005\u90FD\u586B0\u8868\u793A\u4E0D\u9650\u5236"}),(0,n.jsx)(Y.Z,{mode:"multiple",name:"province_id",initialValue:(u=a.values)!==null&&u!==void 0&&u.province_id?JSON.parse((d=a.values)===null||d===void 0?void 0:d.province_id):void 0,labelCol:{span:5},label:"IP\u9650\u5236",rules:[{required:!0,message:" IP\u9650\u5236\u4E0D\u80FD\u4E3A\u7A7A"}],request:(0,c.Z)((0,o.Z)().mark(function oe(){var $,B;return(0,o.Z)().wrap(function(I){for(;;)switch(I.prev=I.next){case 0:return I.next=2,a.getProvince();case 2:if($=I.sent,!$.success){I.next=7;break}return B=$.data.map(function(j){return{label:j.name,value:j.id}}),B.unshift({label:"\u4E0D\u9650\u5236",value:0}),I.abrupt("return",B);case 7:case"end":return I.stop()}},oe)})),extra:"\u5982\u679C\u7528\u6237\u7684IP\u6EE1\u8DB3\u6B64\u8981\u6C42\uFF0C\u624D\u4F1A\u5BF9\u6B64\u7528\u6237\u8FDB\u884C\u64CD\u4F5C"}),(0,n.jsx)(Y.Z,{label:"\u4E2A\u4EBA\u53F7",options:[{label:"\u4E0D\u9650",value:0},{label:"\u662F",value:1},{label:"\u5426",value:2}],name:"is_person",rules:[{required:!0,message:"\u4E2A\u4EBA\u53F7\u4E0D\u80FD\u4E3A\u7A7A"}],initialValue:(p=a.values)===null||p===void 0?void 0:p.is_person,labelCol:{span:5}}),(0,n.jsx)(Y.Z,{label:"\u5F00\u901A\u6A71\u7A97",options:[{label:"\u4E0D\u9650",value:0},{label:"\u662F",value:1},{label:"\u5426",value:2}],name:"open_window",rules:[{required:!0,message:"\u5F00\u901A\u6A71\u7A97\u4E0D\u80FD\u4E3A\u7A7A"}],initialValue:(i=a.values)===null||i===void 0?void 0:i.open_window,labelCol:{span:5}}),(0,n.jsx)(Y.Z,{label:"\u56E2\u8D2D\u8FBE\u4EBA",options:[{label:"\u4E0D\u9650",value:0},{label:"\u662F",value:1},{label:"\u5426",value:2}],name:"is_tuangou",rules:[{required:!0,message:"\u56E2\u8D2D\u8FBE\u4EBA\u4E0D\u80FD\u4E3A\u7A7A"}],initialValue:(O=a.values)===null||O===void 0?void 0:O.is_tuangou,labelCol:{span:5}}),(0,n.jsx)(J.Z,{label:"\u83B7\u8D5E\u6570\u533A\u95F4",name:"zan_range",labelCol:{span:5},separator:"-",separatorWidth:60,initialValue:[(t=a.values)===null||t===void 0?void 0:t.min_zan,(ee=a.values)===null||ee===void 0?void 0:ee.max_zan],extra:"\u4E0D\u586B\u6216\u8005\u90FD\u586B0\u8868\u793A\u4E0D\u9650\u5236"}),(0,n.jsx)(J.Z,{label:"\u5173\u6CE8\u6570\u533A\u95F4",name:"focus_range",labelCol:{span:5},separator:"-",separatorWidth:60,initialValue:[(ae=a.values)===null||ae===void 0?void 0:ae.min_focus,(re=a.values)===null||re===void 0?void 0:re.max_focus],extra:"\u4E0D\u586B\u6216\u8005\u90FD\u586B0\u8868\u793A\u4E0D\u9650\u5236"}),(0,n.jsx)(J.Z,{label:"\u7C89\u4E1D\u6570\u533A\u95F4",name:"fans_range",labelCol:{span:5},separator:"-",separatorWidth:60,initialValue:[(ne=a.values)===null||ne===void 0?void 0:ne.min_fans,(te=a.values)===null||te===void 0?void 0:te.max_fans],extra:"\u4E0D\u586B\u6216\u8005\u90FD\u586B0\u8868\u793A\u4E0D\u9650\u5236"}),(0,n.jsx)(J.Z,{label:"\u4F5C\u54C1\u6570\u533A\u95F4",name:"works_range",labelCol:{span:5},separator:"-",separatorWidth:60,initialValue:[(le=a.values)===null||le===void 0?void 0:le.min_works,(se=a.values)===null||se===void 0?void 0:se.max_works],extra:"\u4E0D\u586B\u6216\u8005\u90FD\u586B0\u8868\u793A\u4E0D\u9650\u5236"}),(0,n.jsx)(de.Z,{tooltip:"\u7B80\u4ECB\u5305\u542B\u5173\u952E\u8BCD",label:"\u5305\u542B\u5173\u952E\u8BCD",labelCol:{span:5},initialValue:((ue=a.values)===null||ue===void 0?void 0:ue.contain)||"",name:"contain",extra:(0,n.jsxs)("div",{children:["\u591A\u4E2A\u5173\u952E\u8BCD\u4F7F\u7528\u4E2D\u6587\u9017\u53F7\uFF08\uFF0C\uFF09\u6216\u8005\u82F1\u6587\u9017\u53F7\uFF08,\uFF09\u9694\u5F00\u5373\u53EF\uFF01",(0,n.jsx)("a",{target:"_blank",href:"https://docs.qq.com/doc/DTk9sQ1RMdnZsaU5P",children:"\u70B9\u51FB\u67E5\u770B\u8BE6\u7EC6\u89C4\u5219"})]})}),(0,n.jsx)(de.Z,{tooltip:"\u7B80\u4ECB\u4E0D\u5305\u542B\u5173\u952E\u8BCD",label:"\u4E0D\u5305\u542B\u5173\u952E\u8BCD",labelCol:{span:5},initialValue:((ie=a.values)===null||ie===void 0?void 0:ie.no_contain)||"",name:"no_contain",extra:(0,n.jsxs)("div",{children:["\u591A\u4E2A\u5173\u952E\u8BCD\u4F7F\u7528\u4E2D\u6587\u9017\u53F7\uFF08\uFF0C\uFF09\u6216\u8005\u82F1\u6587\u9017\u53F7\uFF08,\uFF09\u9694\u5F00\u5373\u53EF\uFF01",(0,n.jsx)("a",{target:"_blank",href:"https://docs.qq.com/doc/DTk9sQ1RMdnZsaU5P",children:"\u70B9\u51FB\u67E5\u770B\u8BE6\u7EC6\u89C4\u5219"})]})})]})},ve=fe,ge=e(71153),k=e(60331),he=e(30381),Pe=e.n(he),q=[{title:"ID",dataIndex:"id",search:!1,fixed:"left",width:100},{title:"\u540D\u79F0",dataIndex:"name",ellipsis:!0,width:200,copyable:!0},{title:"\u6027\u522B",dataIndex:"gender",search:!1,render:function(a){if(!a)return"-";if(a=JSON.parse(a),a.length===3)return(0,n.jsx)(k.Z,{children:"\u4E0D\u9650"});var r=["","\u7537","\u5973","\u672A\u77E5"];return a.map(function(F,v){return(0,n.jsx)(k.Z,{children:r[F]},v)})}},{title:"\u5E74\u9F84",tip:"\u5E74\u9F84\u8303\u56F4",dataIndex:"min_age",search:!1,render:function(a,r){return r.min_age===0&&r.max_age===0?"-":r.min_age+" - "+r.max_age}},{title:"IP\u9650\u5236",dataIndex:"province_name",search:!1,render:function(a){return a?a.map(function(r,F){return(0,n.jsx)(k.Z,{children:r},F)}):"-"}},{title:"\u4E2A\u4EBA\u53F7",dataIndex:"is_person",search:!1,valueEnum:{0:{text:"\u4E0D\u9650"},1:{text:"\u662F"},2:{text:"\u5426"}}},{title:"\u5F00\u901A\u6A71\u7A97",dataIndex:"open_window",search:!1,valueEnum:{0:{text:"\u4E0D\u9650"},1:{text:"\u662F"},2:{text:"\u5426"}}},{title:"\u56E2\u8D2D\u8FBE\u4EBA",dataIndex:"is_tuangou",search:!1,valueEnum:{0:{text:"\u4E0D\u9650"},1:{text:"\u662F"},2:{text:"\u5426"}}},{title:"\u83B7\u8D5E\u6570",tip:"\u83B7\u8D5E\u6570\u8303\u56F4",dataIndex:"min_zan",render:function(a,r){return r.min_zan===0&&r.max_zan===0?"-":r.min_zan+" - "+r.max_zan},search:!1},{title:"\u5173\u6CE8\u6570",tip:"\u5173\u6CE8\u6570\u8303\u56F4",dataIndex:"min_focus",search:!1,render:function(a,r){return r.min_focus===0&&r.max_focus===0?"-":r.min_focus+" - "+r.max_focus}},{title:"\u7C89\u4E1D\u6570",tip:"\u7C89\u4E1D\u6570\u8303\u56F4",dataIndex:"min_fans",search:!1,render:function(a,r){return r.min_fans===0&&r.max_fans===0?"-":r.min_fans+" - "+r.max_fans}},{title:"\u4F5C\u54C1\u6570",tip:"\u4F5C\u54C1\u6570\u8303\u56F4",dataIndex:"min_works",search:!1,render:function(a,r){return r.min_works===0&&r.max_works===0?"-":r.min_works+" - "+r.max_works}},{title:"\u5305\u542B\u5173\u952E\u8BCD",tip:"\u7B80\u4ECB\u5305\u542B\u5173\u952E\u8BCD",dataIndex:"contain",ellipsis:!0,width:200,copyable:!0,search:!1},{title:"\u4E0D\u5305\u542B\u5173\u952E\u8BCD",tip:"\u7B80\u4ECB\u4E0D\u5305\u542B\u5173\u952E\u8BCD",dataIndex:"no_contain",ellipsis:!0,width:200,copyable:!0,search:!1},{title:"\u521B\u5EFA\u65F6\u95F4",dataIndex:"created_at",valueType:"dateTime",width:180,search:!1,render:function(a){return Pe()(a.props.text*1e3).format("YYYY-MM-DD HH:mm:ss")}}],me,pe,ce,T,Fe=(me=window.connectModel("user","@@initialState"),pe=Reflect.metadata("design:type",Function),ce=Reflect.metadata("design:paramtypes",[Object]),me(T=pe(T=ce(T=function(b){(0,S.Z)(r,b);var a=(0,s.Z)(r);function r(F){var v,f,l;return(0,M.Z)(this,r),l=a.call(this,F),l.actionRef=void 0,l.state={user:(v=l.props.user)===null||v===void 0||(f=v.initialState)===null||f===void 0?void 0:f.currentUser,columns:q},l.getData=function(){var u=(0,c.Z)((0,o.Z)().mark(function d(p){var i;return(0,o.Z)().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,D.HM)(p);case 2:return i=t.sent,t.abrupt("return",i);case 4:case"end":return t.stop()}},d)}));return function(d){return u.apply(this,arguments)}}(),l.handleUpdate=function(){var u=(0,c.Z)((0,o.Z)().mark(function d(p){var i;return(0,o.Z)().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,D.Jq)((0,C.Z)({},p));case 2:if(i=t.sent,!i.success){t.next=7;break}return l.actionRef.current.reload(),g.ZP.success(i.msg),t.abrupt("return",!0);case 7:case"end":return t.stop()}},d)}));return function(d){return u.apply(this,arguments)}}(),l.handleAdd=function(){var u=(0,c.Z)((0,o.Z)().mark(function d(p){var i;return(0,o.Z)().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,D.YH)((0,C.Z)({},p));case 2:if(i=t.sent,!i.success){t.next=7;break}return l.actionRef.current.reload(),g.ZP.success(i.msg),t.abrupt("return",!0);case 7:case"end":return t.stop()}},d)}));return function(d){return u.apply(this,arguments)}}(),l.handleRemove=function(){var u=(0,c.Z)((0,o.Z)().mark(function d(p){var i;return(0,o.Z)().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,D.CQ)({id:p});case 2:i=t.sent,console.log(i),i.success&&(l.actionRef.current.reload(),g.ZP.success(i.msg));case 5:case"end":return t.stop()}},d)}));return function(d){return u.apply(this,arguments)}}(),l.actionRef=y.createRef(),l}return(0,U.Z)(r,[{key:"componentDidMount",value:function(){if(this.state.user.role_type!==2){var v=[],f=0,l=(0,Z.Z)(q),u;try{for(l.s();!(u=l.n()).done;){var d=u.value;f++,f===q.length-1&&v.push({title:"\u7528\u6237",dataIndex:"userName",search:!1}),v.push(d)}}catch(p){l.e(p)}finally{l.f()}this.setState({columns:v})}}},{key:"render",value:function(){var v=this;return(0,n.jsx)(K.ZP,{children:(0,n.jsx)(V.Z,{actionRef:this.actionRef,scroll:{x:2e3},rowKey:"id",search:{labelWidth:42},toolBarRender:function(){return[(0,n.jsx)(W.Z,{access:"Api_addUserRule",children:(0,n.jsx)(ve,{btn:(0,n.jsxs)(m.Z,{type:"primary",children:[(0,n.jsx)(_.Z,{}),"\u6DFB\u52A0"]}),onSubmit:v.handleAdd,values:void 0,getProvince:D.ol})},"unique")]},request:this.getData,columns:[].concat((0,P.Z)(this.state.columns),[{title:"\u64CD\u4F5C",fixed:"right",dataIndex:"option",width:120,valueType:"option",render:function(l,u){return[(0,n.jsx)(ve,{btn:(0,n.jsx)("a",{children:"\u4FEE\u6539"},"update_"+u.id),onSubmit:v.handleUpdate,values:u,getProvince:D.ol},"update__"+u.id),(0,n.jsxs)(h.Z,{title:"\u786E\u5B9A\u5220\u9664\u5417\uFF1F",icon:(0,n.jsx)(L.Z,{style:{color:"red"}}),onConfirm:function(){return v.handleRemove(u.id)},children:[" ",(0,n.jsx)("a",{children:"\u5220\u9664"},"delete_"+u.id)]},"delete__"+u.id)]}}])})})}}]),r}(y.Component))||T)||T)||T)}}]);