<template>
  <div class="d-flex min-vh-100">
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
        <CCol md="12">
          <CCard class="mx-4 mb-5">
            <CCardBody class="p-4">
              <CForm>
                <h2 class="mb-3">Tambah Mahasiswa</h2>
                <CRow>
                  <CCol sm="8">
                    <CInput
                      label="Nama Lengkap"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                    />
                    <CInput
                      label="NIM"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                    />
                    <CInput
                      label="NIK"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                    />
                  </CCol>
                  <CCol>
                    <CCard class="mt-4">
                      <CCardBody class="p-4">test</CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="8">
                    <CInput
                      label="Tempat Lahir"
                      placeholder="Kota Lahir"
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                    />
                  </CCol>
                  <CCol sm="4">
                    <CInput label="Tanggal Lahir" type="date" />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="8">
                    <CInput
                      label="Email"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                    />
                    <CInput
                      label="No. Telepon"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                    />
                  </CCol>
                </CRow>
                <CButton color="success" block @click="confirmModal = true">Create Account</CButton>
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
import AccountManager from "../../contracts/AccountManager";
export default {
  name: "TambahMahasiswa",
  data() {
    return {
      gender: ["Laki-laki","Perempuan"],
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      mahasiswa: {
        nama: null,
        nim: null,
        nik: null,
        jenisKelamin: null,
        tempatLahir: null,
        tanggalLahir: null,
        prodiId: null,
        semester: 1,
        riwayatStudi: null,
        statusMahasiswa: "Aktif",
        statusKelulusan: false,
        noTelp: null,
        email: null,
        foto: null
      }
    };
  },
  methods: {
    createAccount: function() {
      let self = this;
      web3.eth.getAccounts().then(accounts => {
        console.log(self.role);
        if (self.isMahasiswa) self.role = "mahasiswa";
        return AccountManager.methods
          .createAccount(
            web3.utils.toHex(self.fullName),
            web3.utils.toHex(self.id),
            web3.utils.toHex(self.role)
          )
          .send({ from: accounts[0] })
          .on("error", function(error, receipt) {
            console.log(error);
            self.showAlert(false);
          })
          .on("receipt", function(receipt) {
            console.log(receipt.contractAddress);
            self.showAlert(true);
          });
      });
    },
    validator(val) {
      return val ? val.length > 1 : false;
    },
    confirmRegister: function(confirm) {
      console.log(confirm);
      this.confirmModal = false;
      if (confirm) {
        this.createAccount();
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
