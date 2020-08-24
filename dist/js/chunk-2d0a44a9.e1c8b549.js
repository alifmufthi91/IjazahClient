(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0a44a9"],{"068e":function(a,e,t){"use strict";t.r(e);var s=function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("div",{staticClass:"c-app d-flex align-items-center min-vh-100"},[t("CContainer",{attrs:{fluid:""}},[t("CRow",{staticClass:"justify-content-center"},[t("CCol",{attrs:{md:"2"}},[t("CCard",{staticClass:"align-items-center"},[t("CCardBody",[t("div",[t("h3",[a._v("Jenis Akun :")]),t("CButton",{class:{active:!a.isMahasiswa},attrs:{block:"",variant:"ghost",color:"primary"},on:{click:function(e){a.isMahasiswa=!1}}},[a._v("Civitas")]),t("CButton",{class:{active:a.isMahasiswa},attrs:{block:"",variant:"ghost",color:"primary"},on:{click:function(e){a.isMahasiswa=!0}}},[a._v("Mahasiswa")])],1)])],1)],1)],1),t("CRow",{staticClass:"justify-content-center"},[t("CCol",{attrs:{md:"8"}},[t("CAlert",{attrs:{show:a.dismissSuccess,closeButton:"",color:"success",fade:""},on:{"update:show":function(e){a.dismissSuccess=e}}},[a._v("Permintaan pembuatan akun berhasil. Silahkan kontak admin dan minta untuk memverifikasi akun anda.")]),t("CAlert",{attrs:{show:a.dismissFail,closeButton:"",color:"danger",fade:""},on:{"update:show":function(e){a.dismissFail=e}}},[t("strong",[a._v("Permintaan Gagal")]),a._v(" : "+a._s(a.dismissFail)+" ")])],1),t("CCol",{attrs:{md:"6"}},[t("CCard",{staticClass:"mx-4 mb-0"},[t("CCardBody",{staticClass:"p-4"},[t("CForm",{directives:[{name:"show",rawName:"v-show",value:a.isMahasiswa,expression:"isMahasiswa"}]},[t("h1",[a._v("Daftar Mahasiswa Polban")]),t("p",{staticClass:"text-muted"},[a._v("Create your Mahasiswa account")]),t("CInput",{attrs:{placeholder:"Full Name",autocomplete:"name","is-valid":a.validatorNama,required:"","invalid-feedback":"Please provide at between 4-32 characters without symbols.","valid-feedback":"Okay!"},scopedSlots:a._u([{key:"prepend-content",fn:function(){return[t("CIcon",{attrs:{name:"cil-user"}})]},proxy:!0}]),model:{value:a.fullName,callback:function(e){a.fullName=e},expression:"fullName"}}),t("CInput",{attrs:{placeholder:"NIM",autocomplete:"nim","is-valid":a.validatorId,required:"","invalid-feedback":"Please provide at under 21 characters of id numbers.","valid-feedback":"Okay!"},scopedSlots:a._u([{key:"prepend-content",fn:function(){return[t("CIcon",{attrs:{name:"cil-user"}})]},proxy:!0}]),model:{value:a.id,callback:function(e){a.id=e},expression:"id"}}),t("CButton",{attrs:{color:"success",block:""},on:{click:function(e){a.confirmModal=!0}}},[a._v("Buat Akun")])],1),t("CForm",{directives:[{name:"show",rawName:"v-show",value:!a.isMahasiswa,expression:"!isMahasiswa"}]},[t("h1",[a._v("Daftar Civitas Polban")]),t("p",{staticClass:"text-muted"},[a._v("Create your Civitas account")]),t("CInput",{attrs:{placeholder:"Full Name",autocomplete:"name","is-valid":a.validatorNama,required:"","invalid-feedback":"Please provide at between 4-32 characters without symbols.","valid-feedback":"Okay!"},scopedSlots:a._u([{key:"prepend-content",fn:function(){return[t("CIcon",{attrs:{name:"cil-user"}})]},proxy:!0}]),model:{value:a.fullName,callback:function(e){a.fullName=e},expression:"fullName"}}),t("CInput",{attrs:{placeholder:"NIP",autocomplete:"nim","is-valid":a.validatorId,required:"","invalid-feedback":"Please provide at under 21 characters of id numbers.","valid-feedback":"Okay!"},scopedSlots:a._u([{key:"prepend-content",fn:function(){return[t("CIcon",{attrs:{name:"cil-user"}})]},proxy:!0}]),model:{value:a.id,callback:function(e){a.id=e},expression:"id"}}),t("CSelect",{attrs:{label:"Pilih Role",horizontal:"",options:a.options,placeholder:"Silahkan Pilih Role",value:a.role,required:""},on:{"update:value":function(e){a.role=e}}}),t("CButton",{attrs:{color:"success",block:""},on:{click:function(e){a.confirmModal=!0}}},[a._v("Buat Akun")])],1)],1)],1)],1)],1)],1),t("CModal",{attrs:{show:a.confirmModal,"no-close-on-backdrop":!0,centered:!0,title:"Konfirmasi",size:"sm",color:"dark"},on:{"update:show":function(e){a.confirmModal=e}},scopedSlots:a._u([{key:"header",fn:function(){return[t("h6",{staticClass:"modal-title"},[a._v("Konfirmasi")]),t("CButtonClose",{staticClass:"text-white",on:{click:function(e){a.confirmModal=!1}}})]},proxy:!0},{key:"footer",fn:function(){return[t("CButton",{attrs:{color:"danger"},on:{click:function(e){return a.confirmRegister(!1)}}},[a._v("Kembali")]),t("CButton",{attrs:{color:"success"},on:{click:function(e){return a.confirmRegister(!0)}}},[a._v("Konfirmasi")])]},proxy:!0}])},[a._v(" Apakah data telah sesuai? ")]),t("CModal",{attrs:{title:"Sukses",color:"success",show:a.successModal},on:{"update:show":function(e){a.successModal=e}}},[a._v("Permintaan pembuatan akun berhasil. Silahkan kontak admin dan minta untuk memverifikasi akun anda.")])],1)},n=[],i=t("4855"),o={name:"RegisterCivitas",data:function(){return{fullName:String(),options:[{value:"mahasiswa",label:"Mahasiswa"},{value:"admin",label:"Admin"},{value:"dosen",label:"Dosen"},{value:"pd2",label:"PD II"},{value:"rektor",label:"Rektor"},{value:"kajur",label:"Kepala Jurusan"}],id:String(),role:String(),isMahasiswa:!1,confirmModal:!1,successModal:!1,dismissSuccess:0,dismissFail:0}},methods:{createAccount:function(){var a=this;web3.eth.getAccounts().then((function(e){return a.isMahasiswa&&(a.role="mahasiswa"),i["a"].methods.createAccount(web3.utils.utf8ToHex(a.fullName),web3.utils.utf8ToHex(a.id),web3.utils.utf8ToHex(a.role)).send({from:e[0]}).on("error",(function(a,e){console.log(a)})).on("transactionHash",(function(a){console.log(a)}))}))},validatorNama:function(a){var e=/^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*){0,3}$/gm;return!(null==a||!a.match(e))&&(!!a&&(a.length>=4&&a.length<=32))},validatorId:function(a){var e=/^[0-9]*$/gm;return!(null==a||!a.match(e))&&(!!a&&(a.length>=1&&a.length<=21))},confirmRegister:function(a){this.confirmModal=!1,a&&this.createAccount()},showAlert:function(a){a?this.dismissSuccess=5:this.dismissFail=5}}},l=o,r=t("2877"),c=Object(r["a"])(l,s,n,!1,null,null,null);e["default"]=c.exports}}]);
//# sourceMappingURL=chunk-2d0a44a9.e1c8b549.js.map