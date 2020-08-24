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
          >Update Data Mahasiswa Berhasil.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="12">
          <CCard class="mx-4 mb-5">
            <CCardBody class="p-4">
              <CForm>
                <h2 class="mb-3">Edit Mahasiswa</h2>
                <CRow>
                  <CCol sm="8" v-if="this.isDataLoaded">
                    <CInput
                      label="Nama Lengkap"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="mahasiswa.nama"
                    />
                    <CSelect
                      label="Jenis Kelamin"
                      :options="genderOptions"
                      placeholder="Pilih Jenis Kelamin"
                      :is-valid="inputValidator(this.mahasiswa.jenisKelamin)"
                      :value.sync="mahasiswa.jenisKelamin"
                      required
                    />
                    <CInput
                      label="NIM"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="mahasiswa.nim"
                    />
                    <CInput
                      label="NIK"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="mahasiswa.nik"
                    />
                    <CRow>
                      <CCol sm="8">
                        <CInput
                          label="Tempat Lahir"
                          placeholder="Kota Lahir"
                          :is-valid="validator"
                          invalid-feedback="Data tidak boleh kosong."
                          :value.sync="mahasiswa.tempatLahir"
                        />
                      </CCol>
                      <CCol sm="4">
                        <CInput
                          label="Tanggal Lahir"
                          type="date"
                          :is-valid="inputValidator(this.mahasiswa.tanggalLahir)"
                          :value.sync="mahasiswa.tanggalLahir"
                        />
                      </CCol>
                    </CRow>
                    <CInput
                      label="Email"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="mahasiswa.email"
                    />
                    <CInput
                      label="No. Telepon"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="mahasiswa.noTelp"
                    />
                    <CSelect
                      label="Prodi"
                      :options="prodiOptions"
                      placeholder="Pilih Prodi"
                      :is-valid="inputValidator(this.mahasiswa.prodi)"
                      :value.sync="mahasiswa.prodi"
                      required
                      v-if="this.prodis"
                    />
                  </CCol>
                  <CCol v-if="this.previewImage">
                    <CCard class="mt-4">
                      <CCardHeader>Ganti Foto</CCardHeader>
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
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow class="justify-content-center">
                <CCol sm="4">
                  <CButton color="danger" block @click="goBack">Kembali</CButton>
                </CCol>
                <CCol sm="4">
                  <CButton
                    v-if="!isDataReady||!previewImage"
                    color="success"
                    block
                    disabled
                  >Konfirmasi Edit</CButton>
                  <CButton
                    v-if="isDataReady&&previewImage"
                    color="success"
                    block
                    @click="confirmModal = true"
                  >Konfirmasi Edit</CButton>
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
import CivitasHelper from "@/contracts/CivitasHelper";
import gql from "graphql-tag";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "TambahMahasiswa",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  apollo: {
    prodis: gql`
      query {
        prodis {
          id
          namaProdi
        }
      }
    `,
  },
  data() {
    return {
      usersOpened: null,
      genderOptions: ["Laki-laki", "Perempuan"],
      confirmModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      image: null,
      previewImage: null,
      mahasiswaData: {},
      mahasiswa: {
        nama: String(),
        nim: String(),
        nik: String(),
        jenisKelamin: String(),
        tempatLahir: String(),
        tanggalLahir: null,
        prodi: String(),
        noTelp: String(),
        email: String(),
        foto: String(),
      },
      isDataLoaded: false,
    };
  },
  computed: {
    prodiOptions() {
      let arrProdi = [];
      this.prodis.forEach((prodi) => {
        arrProdi.push({
          label: web3.utils.hexToUtf8(prodi.namaProdi),
          value: web3.utils.hexToUtf8(prodi.namaProdi),
        });
      });
      return arrProdi;
    },
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      CivitasHelper.methods
        .getMahasiswa(this.$route.params.id)
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.mahasiswaData.nim = web3.utils.hexToUtf8(result[0]);
            context.mahasiswaData.ipfsHash = web3.utils.hexToUtf8(result[1]);
            context.isDataLoaded = true;
            ipfs.cat("/ipfs/" + context.mahasiswaData.ipfsHash).then((data) => {
              context.mahasiswa = JSON.parse(data.toString());
              ipfs.cat("/ipfs/" + context.mahasiswa.foto).then((data) => {
                let blob = new Blob([data], { type: "image/png" });
                let url = URL.createObjectURL(blob);
                context.previewImage = url;
              });
            });
          }
        });
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    updateMahasiswa: function () {
      if (this.isDataReady(this.mahasiswa)) {
        const mahasiswaData = this.mahasiswaData;
        let data = this.mahasiswa;
        let file = Buffer.from(JSON.stringify(data));
        ipfs.add(file).then((ipfsHash) => {
          web3.eth.getAccounts().then((accounts) => {
            let hash = ipfsHash[0].hash;
            if (data.nim != mahasiswaData.nim) {
              CivitasHelper.methods
                .updateNIMMahasiswa(
                  web3.utils.utf8ToHex(mahasiswaData.nim),
                  web3.utils.utf8ToHex(data.nim)
                )
                .send({ from: accounts[0] })
                .on("error", function (error, receipt) {
                  console.log(error);
                })
                .on("transactionHash", function (receipt) {
                  console.log(receipt);
                });
              CivitasHelper.methods
                .updateMahasiswaData(
                  web3.utils.utf8ToHex(data.nim),
                  web3.utils.utf8ToHex(data.nama),
                  web3.utils.utf8ToHex(hash)
                )
                .send({ from: accounts[0] })
                .on("error", function (error, receipt) {
                  console.log(error);
                })
                .on("transactionHash", function (receipt) {
                  console.log(receipt);
                });
            } else {
              CivitasHelper.methods
                .updateMahasiswaData(
                  web3.utils.utf8ToHex(data.nim),
                  web3.utils.utf8ToHex(data.nama),
                  web3.utils.utf8ToHex(hash)
                )
                .send({ from: accounts[0] })
                .on("error", function (error, receipt) {
                  console.log(error);
                })
                .on("transactionHash", function (receipt) {
                  console.log(receipt);
                });
            }
          });
        });
      }
    },
    previewFiles(event) {
      this.image = event[0];
    },
    uploadImage: function () {
      ipfs.add(this.image).then((ipfsHash) => {
        let hash = ipfsHash[0].hash;
        this.mahasiswa.foto = hash;
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
          return attribute;
        })
        .forEach((attribute) => {
          if (
            val[attribute] == null ||
            (val[attribute] == "" && attribute != "statusKelulusan")
          ) {
            isReady = false;
          }
        });
      return isReady;
    },
    validator(val) {
      return val ? val.length > 1 : false;
    },
    inputValidator(val) {
      return val ? true : false;
    },
    confirmRegister: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.updateMahasiswa();
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
