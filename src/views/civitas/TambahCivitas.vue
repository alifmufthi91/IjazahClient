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
          >Menambahkan Civitas Baru Berhasil.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="12">
          <CCard class="mx-4 mb-5">
            <CCardBody class="p-4">
              <CForm>
                <h2 class="mb-3">Tambah Civitas</h2>
                <CRow>
                  <CCol sm="8">
                    <CInput
                      label="Nama Lengkap"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="civitas.nama"
                    />
                    <CSelect
                      label="Jenis Kelamin"
                      :options="genderOptions"
                      placeholder="Pilih Jenis Kelamin"
                      :is-valid="inputValidator(this.civitas.jenisKelamin)"
                      :value.sync="civitas.jenisKelamin"
                      required
                    />
                    <CInput
                      label="NIP"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="civitas.nip"
                    />
                    <CInput
                      label="NIK"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="civitas.nik"
                    />
                    <CRow>
                      <CCol sm="8">
                        <CInput
                          label="Tempat Lahir"
                          placeholder="Kota Lahir"
                          :is-valid="validator"
                          invalid-feedback="Data tidak boleh kosong."
                          :value.sync="civitas.tempatLahir"
                        />
                      </CCol>
                      <CCol sm="4">
                        <CInput
                          label="Tanggal Lahir"
                          type="date"
                          :is-valid="inputValidator(this.civitas.tanggalLahir)"
                          :value.sync="civitas.tanggalLahir"
                        />
                      </CCol>
                    </CRow>
                    <CInput
                      label="Email"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="civitas.email"
                    />
                    <CInput
                      label="No. Telepon"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="civitas.noTelp"
                    />
                    <CSelect
                      label="Dosen Aktif?"
                      :options="dosenAktifOptions"
                      placeholder="Pilih Status Mengajar"
                      :is-valid="inputValidator(this.civitas.isDosen.toString())"
                      :value.sync="civitas.isDosen"
                      required
                    />
                  </CCol>
                  <CCol>
                    <CCard class="mt-4">
                      <CCardHeader>Upload Foto</CCardHeader>
                      <CCardBody class="p-1 m-2">
                        <div v-if="previewImage == null">
                          <svg
                            class="d-block w-100 h-1 00 img-fluid"
                            style="background-color: grey;"
                          />
                        </div>
                        <div v-if="previewImage">
                          <img class="d-block w-100 h-1 00 img-fluid" :src="previewImage" />
                        </div>
                      </CCardBody>
                      <CCardFooter>
                        <CInputFile
                          placeholder="Pilih Gambar"
                          @change="previewFiles"
                          accept="image/x-png, image/jpeg, image/bmp"
                        />
                        <CButton color="info" block @click="uploadImage">Upload</CButton>
                      </CCardFooter>
                    </CCard>
                  </CCol>
                </CRow>
                <CButton color="success" block @click="confirmModal = true">Buat Civitas</CButton>
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
  </div>
</template>

<script>
import CivitasHelper from "@/contracts/CivitasHelper";
import gql from "graphql-tag";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "TambahCivitas",
  data() {
    return {
      genderOptions: ["Laki-laki", "Perempuan"],
      dosenAktifOptions: [
        { label: "Ya", value: true },
        { label: "Tidak", value: false },
      ],
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      image: null,
      previewImage: null,
      civitas: {
        nama: String(),
        nip: String(),
        nik: String(),
        jenisKelamin: String(),
        tempatLahir: String(),
        tanggalLahir: null,
        statusPegawai: "Aktif",
        isDosen: false,
        noTelp: String(),
        email: String(),
        foto: String(),
      },
    };
  },
  methods: {
    createCivitas: function () {
      let showAlert = this.showAlert;
      if (this.isDataReady(this.civitas)) {
        let data = this.civitas;
        let file = Buffer.from(JSON.stringify(data));
        ipfs.add(file).then((ipfsHash) => {
          web3.eth.getAccounts().then((accounts) => {
            let hash = ipfsHash[0].hash;
            return CivitasHelper.methods
              .createCivitas(
                web3.utils.utf8ToHex(this.civitas.nip),
                web3.utils.utf8ToHex(this.civitas.nama),
                web3.utils.utf8ToHex(hash),
                this.civitas.isDosen
              )
              .send({ from: accounts[0] })
              .on("error", function (error, receipt) {
                console.log(error);
                showAlert(false);
              })
              .on("transactionHash", function (hash) {
                console.log(hash);
                showAlert(true);
              });
          });
        });
      }else{
        alert("Input tidak valid");
      }
    },
    previewFiles(event) {
      this.image = event[0];
    },
    uploadImage: function () {
      ipfs.add(this.image).then((ipfsHash) => {
        let hash = ipfsHash[0].hash;
        this.civitas.foto = hash;
        ipfs.cat("/ipfs/" + hash).then((data) => {
          let blob = new Blob([data], { type: "image/png" });
          let url = URL.createObjectURL(blob);
          this.previewImage = url;
        });
      });
    },
    isDataReady(val) {
      let isReady = true;
      Object.keys(val)
        .filter((attribute) => {
          if (attribute == "isDosen")
            return false;
          return attribute;
        })
        .forEach((attribute) => {
          if (val[attribute] == null || val[attribute] == "") {
            isReady = false;
          }
        });
      return isReady;
    },
    validator(val) {
      return val ? val.length > 1 : false;
    },
    inputValidator(val) {
        return val? true : false;
    },
    confirmRegister: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.createCivitas();
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
