<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="2">
          <CCard class="align-items-center">
            <CCardBody>
              <div>
                <h3>Jenis Akun :</h3>
                <CButton block variant="ghost" color="primary" @click="isMahasiswa = false">Civitas</CButton>
                <CButton block variant="ghost" color="primary" @click="isMahasiswa = true">Mahasiswa</CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CAlert
            :show.sync="dismissSuccess"
            closeButton
            color="success"
            fade
          >
            Permintaan pembuatan akun berhasil. Silahkan kontak admin dan minta untuk memverifikasi akun anda.
          </CAlert>
          <CAlert
            :show.sync="dismissFail"
            closeButton
            color="danger"
            fade
          >
            <strong>Permintaan Gagal</strong> : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4" >
              <CForm
              v-show="isMahasiswa">
                <h1>Daftar Mahasiswa Polban</h1>
                <p class="text-muted">Create your Mahasiswa account</p>
                <CInput
                  placeholder="Full Name"
                  autocomplete="name"
                  v-model="fullName"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  placeholder="NIM"
                  autocomplete="nim"
                  v-model="nim"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CButton color="success" block @click="showAlert(true)">Create Account</CButton>
              </CForm>
              <CForm
              v-show="!isMahasiswa">
                <h1>Daftar Civitas Polban</h1>
                <p class="text-muted">Create your Civitas account</p>
                <CInput
                  placeholder="Full Name"
                  autocomplete="name"
                  v-model="fullName"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  placeholder="NIP"
                  autocomplete="nim"
                  v-model="nim"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CSelect
                  label="Pilih Role"
                  horizontal
                  :options="options"
                  placeholder="Silahkan Pilih Role"
                />
                <CButton color="success" block @click="showAlert(true)">Create Account</CButton>
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
        <CButtonClose @click="confirmModal = false" class="text-white"/>
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

    >
      Permintaan pembuatan akun berhasil. Silahkan kontak admin dan minta untuk memverifikasi akun anda.
    </CModal>
  </div>
</template>

<script>
import AccountManager from '../../contracts/AccountManager'
export default {
  name: 'RegisterCivitas',
  data () {
    return {
      fullName: null,
      options: ['Dosen', 'Admin', 'Rektor'],
      nim: null,
      isMahasiswa: false,
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0
    }
  },
  methods: {
    createDIKTIAccount: function() {
      web3.eth.getAccounts().then((accounts) => {
        console.log(this.fullName)
        return AccountManager.methods.createAccount('besit','','dikti')
          .send({ from: accounts[0] });
      })
    },
    checkName: function() {
      console.log(this.fullName)
    },
    confirmRegister: function(confirm) {
      console.log(confirm)
      this.confirmModal = false
      if(confirm){
        createDIKTIAccount()
      }
    },
    showAlert: function(isSuccess) {
      if(isSuccess){
        this.dismissSuccess = 5
      }else{
        this.dismissFail = 5
      }
    }
  }
}
</script>
