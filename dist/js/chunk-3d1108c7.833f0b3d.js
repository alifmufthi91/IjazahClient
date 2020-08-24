(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3d1108c7"],{"89f5":function(t,a,i){"use strict";(function(t){var e=i("3f55"),s=(i("9530"),i("94e4")),n=s({host:"ipfs.infura.io",port:5001,protocol:"https"});a["a"]={name:"TambahCivitas",data:function(){return{genderOptions:["Laki-laki","Perempuan"],dosenAktifOptions:[{label:"Ya",value:!0},{label:"Tidak",value:!1}],confirmModal:!1,successModal:!1,dismissSuccess:0,dismissFail:0,image:null,previewImage:null,civitas:{nama:String(),nip:String(),nik:String(),jenisKelamin:String(),tempatLahir:String(),tanggalLahir:null,statusPegawai:"Aktif",isDosen:!1,noTelp:String(),email:String(),foto:String()}}},methods:{createCivitas:function(){var a=this,i=this.showAlert;if(this.isDataReady(this.civitas)){var s=this.civitas,o=t.from(JSON.stringify(s));n.add(o).then((function(t){web3.eth.getAccounts().then((function(s){var n=t[0].hash;return e["a"].methods.createCivitas(web3.utils.utf8ToHex(a.civitas.nip),web3.utils.utf8ToHex(a.civitas.nama),web3.utils.utf8ToHex(n),a.civitas.isDosen).send({from:s[0]}).on("error",(function(t,a){console.log(t),i(!1)})).on("transactionHash",(function(t){console.log(t),i(!0)}))}))}))}},previewFiles:function(t){this.image=t[0]},uploadImage:function(){var t=this;n.add(this.image).then((function(a){var i=a[0].hash;t.civitas.foto=i,n.cat("/ipfs/"+i).then((function(a){var i=new Blob([a],{type:"image/png"}),e=URL.createObjectURL(i);t.previewImage=e}))}))},isDataReady:function(t){var a=!0;return Object.keys(t).filter((function(t){return"isDosen"!=t&&t})).forEach((function(i){null!=t[i]&&""!=t[i]||(a=!1)})),a},validator:function(t){return!!t&&t.length>1},inputValidator:function(t){return!!t},confirmRegister:function(t){this.confirmModal=!1,t&&this.createCivitas()},showAlert:function(t){t?this.dismissSuccess=5:this.dismissFail=5}}}}).call(this,i("b639").Buffer)},b7eb:function(t,a,i){"use strict";i.r(a);var e=function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"d-flex min-vh-100"},[i("CContainer",{attrs:{fluid:""}},[i("CRow",{staticClass:"justify-content-center"},[i("CCol",{attrs:{md:"8"}},[i("CAlert",{attrs:{show:t.dismissSuccess,closeButton:"",color:"success",fade:""},on:{"update:show":function(a){t.dismissSuccess=a}}},[t._v("Menambahkan Civitas Baru Berhasil.")]),i("CAlert",{attrs:{show:t.dismissFail,closeButton:"",color:"danger",fade:""},on:{"update:show":function(a){t.dismissFail=a}}},[i("strong",[t._v("Permintaan Gagal")]),t._v(" : "+t._s(t.dismissFail)+" ")])],1),i("CCol",{attrs:{md:"12"}},[i("CCard",{staticClass:"mx-4 mb-5"},[i("CCardBody",{staticClass:"p-4"},[i("CForm",[i("h2",{staticClass:"mb-3"},[t._v("Tambah Civitas")]),i("CRow",[i("CCol",{attrs:{sm:"8"}},[i("CInput",{attrs:{label:"Nama Lengkap",required:"","is-valid":t.validator,"invalid-feedback":"Data tidak boleh kosong.",value:t.civitas.nama},on:{"update:value":function(a){return t.$set(t.civitas,"nama",a)}}}),i("CSelect",{attrs:{label:"Jenis Kelamin",options:t.genderOptions,placeholder:"Pilih Jenis Kelamin","is-valid":t.inputValidator(this.civitas.jenisKelamin),value:t.civitas.jenisKelamin,required:""},on:{"update:value":function(a){return t.$set(t.civitas,"jenisKelamin",a)}}}),i("CInput",{attrs:{label:"NIP",required:"","is-valid":t.validator,"invalid-feedback":"Data tidak boleh kosong.",value:t.civitas.nip},on:{"update:value":function(a){return t.$set(t.civitas,"nip",a)}}}),i("CInput",{attrs:{label:"NIK",required:"","is-valid":t.validator,"invalid-feedback":"Data tidak boleh kosong.",value:t.civitas.nik},on:{"update:value":function(a){return t.$set(t.civitas,"nik",a)}}}),i("CRow",[i("CCol",{attrs:{sm:"8"}},[i("CInput",{attrs:{label:"Tempat Lahir",placeholder:"Kota Lahir","is-valid":t.validator,"invalid-feedback":"Data tidak boleh kosong.",value:t.civitas.tempatLahir},on:{"update:value":function(a){return t.$set(t.civitas,"tempatLahir",a)}}})],1),i("CCol",{attrs:{sm:"4"}},[i("CInput",{attrs:{label:"Tanggal Lahir",type:"date","is-valid":t.inputValidator(this.civitas.tanggalLahir),value:t.civitas.tanggalLahir},on:{"update:value":function(a){return t.$set(t.civitas,"tanggalLahir",a)}}})],1)],1),i("CInput",{attrs:{label:"Email",required:"","is-valid":t.validator,"invalid-feedback":"Data tidak boleh kosong.",value:t.civitas.email},on:{"update:value":function(a){return t.$set(t.civitas,"email",a)}}}),i("CInput",{attrs:{label:"No. Telepon",required:"","is-valid":t.validator,"invalid-feedback":"Data tidak boleh kosong.",value:t.civitas.noTelp},on:{"update:value":function(a){return t.$set(t.civitas,"noTelp",a)}}}),i("CSelect",{attrs:{label:"Dosen Aktif?",options:t.dosenAktifOptions,placeholder:"Pilih Status Mengajar","is-valid":t.inputValidator(this.civitas.isDosen.toString()),value:t.civitas.isDosen,required:""},on:{"update:value":function(a){return t.$set(t.civitas,"isDosen",a)}}})],1),i("CCol",[i("CCard",{staticClass:"mt-4"},[i("CCardHeader",[t._v("Upload Foto")]),i("CCardBody",{staticClass:"p-1 m-2"},[null==t.previewImage?i("div",[i("svg",{staticClass:"d-block w-100 h-1 00 img-fluid",staticStyle:{"background-color":"grey"}})]):t._e(),t.previewImage?i("div",[i("img",{staticClass:"d-block w-100 h-1 00 img-fluid",attrs:{src:t.previewImage}})]):t._e()]),i("CCardFooter",[i("CInputFile",{attrs:{placeholder:"Pilih Gambar",accept:"image/x-png, image/jpeg, image/bmp"},on:{change:t.previewFiles}}),i("CButton",{attrs:{color:"info",block:""},on:{click:t.uploadImage}},[t._v("Upload")])],1)],1)],1)],1),i("CButton",{attrs:{color:"success",block:""},on:{click:function(a){t.confirmModal=!0}}},[t._v("Buat Civitas")])],1)],1)],1)],1)],1)],1),i("CModal",{attrs:{show:t.confirmModal,"no-close-on-backdrop":!0,centered:!0,title:"Konfirmasi",size:"sm",color:"dark"},on:{"update:show":function(a){t.confirmModal=a}},scopedSlots:t._u([{key:"header",fn:function(){return[i("h6",{staticClass:"modal-title"},[t._v("Konfirmasi")]),i("CButtonClose",{staticClass:"text-white",on:{click:function(a){t.confirmModal=!1}}})]},proxy:!0},{key:"footer",fn:function(){return[i("CButton",{attrs:{color:"danger"},on:{click:function(a){return t.confirmRegister(!1)}}},[t._v("Kembali")]),i("CButton",{attrs:{color:"success"},on:{click:function(a){return t.confirmRegister(!0)}}},[t._v("Konfirmasi")])]},proxy:!0}])},[t._v(" Apakah data telah sesuai? ")])],1)},s=[],n=i("89f5"),o=n["a"],l=i("2877"),r=Object(l["a"])(o,e,s,!1,null,null,null);a["default"]=r.exports}}]);
//# sourceMappingURL=chunk-3d1108c7.833f0b3d.js.map