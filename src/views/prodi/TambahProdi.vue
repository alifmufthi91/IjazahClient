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
          >Prodi berhasil ditambahkan.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="12">
          <CCard class="mx-4 mb-5">
            <CCardBody class="p-4">
              <CForm>
                <h2 class="mb-3">Tambah Prodi</h2>
                <CRow>
                  <CCol sm="8">
                    <CInput
                      label="Nama Prodi"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="prodi.nama"
                    />
                    <CInput
                      label="Nama Jurusan"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="prodi.namaJurusan"
                    />
                    <CSelect
                      label="Jenjang Pendidikan"
                      :options="jenjangOptions"
                      placeholder="Pilih Jenjang"
                      :value.sync="prodi.jenjang"
                      required
                    />
                    <CInput label="Tanggal Berdiri" type="date" :value.sync="prodi.tanggalBerdiri" />
                    <CInput
                      label="Nomor SK"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="prodi.nomorSk"
                    />
                    <CInput label="Tanggal SK" type="date" :value.sync="prodi.tanggalSk" />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow class="justify-content-center">
                <CCol sm="4">
                  <CButton color="danger" block @click="confirmModal = true">Kembali</CButton>
                </CCol>
                <CCol sm="4">
                  <CButton color="success" block @click="confirmModal = true">Tambah Prodi</CButton>
                </CCol>
              </CRow>
            </CCardFooter>
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
  </div>
</template>

<script>
import AkademikHelper from "../../contracts/AkademikHelper";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "TambahProdi",
  data() {
    return {
      jenjangOptions: ["D4", "D3", "S2"],
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      prodi: {
        nama: null,
        jenjang: null,
        namaJurusan: null,
        nomorSk: null,
        tanggalSk: null,
        tanggalBerdiri: null,
      },
    };
  },
  methods: {
    createProdi: function () {
      let data = this.prodi;
      let file = Buffer.from(JSON.stringify(data))
      ipfs.add(file).then((ipfsHash) => {
        let hash = ipfsHash[0].hash;
        console.log(hash);
        console.log(web3.utils.utf8ToHex(this.prodi.nama)+' '+
              web3.utils.utf8ToHex(this.prodi.namaJurusan)+' '+
              web3.utils.utf8ToHex(hash))
        web3.eth.getAccounts().then((accounts) => {
          return AkademikHelper.methods
            .createProdi(
              web3.utils.utf8ToHex(this.prodi.nama),
              web3.utils.utf8ToHex(this.prodi.namaJurusan),
              web3.utils.utf8ToHex(hash)
            )
            .send({ from: accounts[0] })
            .on("error", function (error, receipt) {
              this.showAlert(false)
            })
            .on("receipt", function (receipt) {
              this.showAlert(true)
            });
        });
      });
    },
    validator(val) {
      return val ? val.length > 1 : false;
    },
    confirmRegister: function (confirm) {
      console.log(confirm);
      console.log(this.prodi);
      this.confirmModal = false;
      if (confirm) {
        this.createProdi();
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
