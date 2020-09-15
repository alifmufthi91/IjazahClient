<template>
  <div class="c-app d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="2">
          <CCard class="align-items-center">
            <CCardBody>
              <div>
                <h3>Jenis Akun :</h3>
                <CButton
                  block
                  variant="ghost"
                  color="primary"
                  @click="isMahasiswa = false"
                  v-bind:class="{ active: !isMahasiswa }"
                >Civitas</CButton>
                <CButton
                  block
                  variant="ghost"
                  color="primary"
                  @click="isMahasiswa = true"
                  v-bind:class="{ active: isMahasiswa }"
                >Mahasiswa</CButton>
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
          >Permintaan pembuatan akun berhasil. Silahkan kontak admin dan minta untuk memverifikasi akun anda.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm v-show="isMahasiswa">
                <h1>Daftar Mahasiswa Polban</h1>
                <p class="text-muted">Create your Mahasiswa account</p>
                <CInput
                  placeholder="Full Name"
                  autocomplete="name"
                  v-model="fullName"
                  :is-valid="validatorNama"
                  required
                  invalid-feedback="Please provide at between 4-32 characters without symbols."
                  valid-feedback="Okay!"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user" />
                  </template>
                </CInput>
                <CInput
                  placeholder="NIM"
                  autocomplete="nim"
                  v-model="id"
                  :is-valid="validatorId"
                  required
                  invalid-feedback="Please provide at under 21 characters of id numbers."
                  valid-feedback="Okay!"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user" />
                  </template>
                </CInput>
                <CButton color="success" block @click="confirmModal = true">Buat Akun</CButton>
              </CForm>
              <CForm v-show="!isMahasiswa">
                <h1>Daftar Civitas Polban</h1>
                <p class="text-muted">Create your Civitas account</p>
                <CInput
                  placeholder="Full Name"
                  autocomplete="name"
                  v-model="fullName"
                  :is-valid="validatorNama"
                  required
                  invalid-feedback="Please provide at between 4-32 characters without symbols."
                  valid-feedback="Okay!"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user" />
                  </template>
                </CInput>
                <CInput
                  placeholder="NIP"
                  autocomplete="nim"
                  v-model="id"
                  :is-valid="validatorId"
                  required
                  invalid-feedback="Please provide at under 21 characters of id numbers."
                  valid-feedback="Okay!"
                >
                  <template #prepend-content>
                    <CIcon name="cil-user" />
                  </template>
                </CInput>
                <CSelect
                  label="Pilih Role"
                  horizontal
                  :options="options"
                  placeholder="Silahkan Pilih Role"
                  :value.sync="role"
                  required
                />
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
  name: "RegisterCivitas",
  data() {
    return {
      fullName: String(),
      options: [
        {
          value: "mahasiswa",
          label: "Mahasiswa",
        },
        {
          value: "admin",
          label: "Admin",
        },
        {
          value: "dosen",
          label: "Dosen",
        },
        {
          value: "pd2",
          label: "PD II",
        },
        {
          value: "rektor",
          label: "Rektor",
        },
        {
          value: "kajur",
          label: "Kepala Jurusan",
        },
      ],
      id: String(),
      role: String(),
      isMahasiswa: false,
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
    };
  },
  methods: {
    createAccount: function () {
      let self = this;
      if (this.validatorId(self.id) && this.validatorNama(self.fullName)) {
        web3.eth.handleRevert = true;
        web3.eth.getAccounts().then((accounts) => {
          if (self.isMahasiswa) self.role = "mahasiswa";
          return AccountManager.methods
            .createAccount(
              web3.utils.utf8ToHex(self.fullName),
              web3.utils.utf8ToHex(self.id),
              web3.utils.utf8ToHex(self.role)
            )
            .send({ from: accounts[0] })
            .on("error", function (error, receipt) {
              console.log(error);
            })
            .on("transactionHash", function (transactionHash) {
              console.log(transactionHash);
            });
        });
      }else{
        alert("Input tidak valid.")
      }
    },
    validatorNama(val) {
      var letters = /^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*){0,3}$/gm;
      if (val == null || !val.match(letters)) return false;
      else return val ? val.length >= 4 && val.length <= 32 : false;
    },
    validatorId(val) {
      var letters = /^[0-9]*$/gm;
      if (val == null || !val.match(letters)) return false;
      else return val ? val.length >= 1 && val.length <= 21 : false;
    },
    confirmRegister: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.createAccount();
        // console.log(this.fullName+this.role)
      }
    },
    showAlert: function (isSuccess) {
      if (isSuccess) {
        this.dismissSuccess = 5;
      } else {
        this.dismissFail = 5;
      }
    },
  },
};
</script>
