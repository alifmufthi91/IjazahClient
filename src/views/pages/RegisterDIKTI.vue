<template>
  <div class="c-app d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CAlert
            :show.sync="dismissSuccess"
            closeButton
            color="success"
            fade
          >Permintaan pembuatan akun berhasil. Silahkan kontak admin dan minta untuk memverifikasi akun anda.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Daftar DIKTI</h1>
                <p class="text-muted">Create your DIKTI account</p>
                <CInput
                  placeholder="Full Name"
                  autocomplete="username"
                  v-model="fullName"
                  :is-valid="validator"
                  required
                  invalid-feedback="Please provide at between 4-32 characters without symbols."
                  valid-feedback="Okay!"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user" />
                  </template>
                </CInput>
                <CButton color="success" block @click="confirmModal = true">Buat Akun</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
    <CModal
      :show.sync="confirmModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Konfirmasi"
      size="sm"
      color="dark"
    >
      Apakah data telah sesuai?
      <template #header>
        <h6 class="modal-title">Konfirmasi</h6>
        <CButtonClose @click="confirmModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmRegister(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmRegister(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
    <CModal
      title="Sukses"
      color="success"
      :show.sync="successModal"
    >Permintaan pembuatan akun berhasil. Silahkan kontak admin dan minta untuk memverifikasi akun anda.</CModal>
  </div>
</template>

<script>
import AccountManager from "@/contracts/AccountManager";
export default {
  name: "RegisterDIKTI",
  data() {
    return {
      fullName: String(),
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0
    };
  },
  methods: {
    createDIKTIAccount: function() {
      let self = this;
      web3.eth.getAccounts().then(accounts => {
        console.log(this.fullName);
        AccountManager.methods
          .createAccount(
            web3.utils.utf8ToHex(this.fullName),
            web3.utils.utf8ToHex(""),
            web3.utils.utf8ToHex("dikti")
          )
          .send({ from: accounts[0] })
          .on("receipt", function(rec) {
            console.log(rec);
            self.showAlert(true);
          })
          .on("error", function(error, receipt) {
            console.log(error);
            self.showAlert(false);
          });
      });
    },
    validator (val) {
      var letters = /^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*){0,3}$/gm;
      if(val == null || !val.match(letters)) return false
      else return val ? val.length >= 4 && val.length <=32 : false
    },
    confirmRegister: function(confirm) {
      console.log(confirm);
      this.confirmModal = false;
      if (confirm) {
        this.createDIKTIAccount();
      }
    },
    showAlert: function(isSuccess) {
      if (isSuccess) {
        this.dismissSuccess = 5;
      } else {
        this.dismissFail = 5;
      }
    }
  }
};
</script>
