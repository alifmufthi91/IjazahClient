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
          >Sertifikat berhasil ditambahkan.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="12">
          <CCard class="mx-4 mb-5">
            <CCardBody class="p-4">
              <CForm>
                <h2 class="mb-3">Tambah Sertifkat</h2>
                <CRow>
                  <CCol sm="6">
                    <CSelect
                      label="Jenis Sertifikat"
                      :options="jenisOptions"
                      :value.sync="sertifikat.jenis"
                      placeholder="Pilih Jenis Sertifikat"
                      :is-valid="inputValidator(this.sertifikat.jenis)"
                      required
                    />
                  </CCol>
                  <CCol sm="6">
                    <CInput
                      label="NIM Pemilik"
                      :value.sync="sertifikat.pemilik"
                      :is-valid="validator(this.sertifikat.pemilik)"
                    >
                      <template #append>
                        <CButton color="primary" @click="getMahasiswaInfo">Check</CButton>
                      </template>
                    </CInput>
                  </CCol>
                </CRow>
                <CRow class="justify-content-center my-3">
                  <CCol md="10" v-if="pemilik.data">
                    <h4 class="text-center">Info Pemilik</h4>
                    <CCard color="light">
                      <CCardBody>
                        <CForm>
                          <CRow class="justify-content-center my-3">
                            <CCol sm="4">
                              <CInput disabled label="Nama" :value="pemilik.data.nama" />
                            </CCol>
                            <CCol sm="4">
                              <CInput disabled label="NIM" :value="pemilik.data.nim" />
                            </CCol>
                            <CCol sm="4">
                              <CInput disabled label="Prodi" :value="pemilik.data.prodi" />
                            </CCol>
                            <CCol sm="4">
                              <CInput
                                disabled
                                label="Jenis Kelamin"
                                :value="pemilik.data.jenisKelamin"
                              />
                            </CCol>
                            <CCol sm="4">
                              <CInput disabled label="NIK" :value="pemilik.data.nik" />
                            </CCol>
                            <CCol sm="4">
                              <CInput
                                disabled
                                label="Status Lulus"
                                :value="pemilik.data.statusKelulusan.toString()"
                              />
                            </CCol>
                          </CRow>
                          <CRow class="justify-content-center">
                            <CCol v-if="pemilik.address">
                              <CInput disabled label="Address" :value="pemilik.address" />
                            </CCol>
                            <CCol v-if="!pemilik.address">
                              <h4 class="text-danger text-center">Mahasiswa Belum Memiliki Akun</h4>
                            </CCol>
                          </CRow>
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol md="10" v-if="pemilik.hash && !pemilik.data">
                    <CProgress
                      color="success"
                      :value="100"
                      animated
                      style="height:20px;"
                      class="mt-1"
                    />
                  </CCol>
                  <CCol md="10" v-if="pemilik.hash == null">
                    <h4 class="text-center">Pemilik Tidak ditemukan</h4>
                  </CCol>
                </CRow>
                <h3 class="mb-3">Sertifikat</h3>
                <CRow class="justify-content-center">
                  <CCol sm="6">
                    <CInputFile
                      placeholder="Pilih File Sertifikat..."
                      :accept="documentFormat"
                      @change="previewFiles"
                    />
                    <div v-if="isUploadingFile">
                      <CProgress
                        color="success"
                        :value="100"
                        animated
                        style="height:20px;"
                        class="mt-1"
                      />
                    </div>
                  </CCol>
                  <CCol>
                    <CButtonGroup>
                      <CButton color="primary" @click="uploadSertifikat">Upload</CButton>
                      <CButton
                        color="success"
                        v-if="uploadedSertifikat"
                        :href="fileUrl"
                        target="_blank"
                      >Lihat</CButton>
                    </CButtonGroup>
                  </CCol>
                </CRow>
                <h3 class="mb-3 mt-3">Penanda Tangan</h3>
                <CRow class="justify-content-center">
                  <template v-for="(input, indexSigner) in listSigners">
                    <div class="d-flex" :key="indexSigner">
                      <CContainer fluid>
                        <CRow class="mx-auto">
                          <CCard>
                            <CCardHeader>
                              Penandatangan #{{indexSigner + 1}}
                              <div class="card-header-actions">
                                <CLink
                                  href="#"
                                  class="card-header-action btn-close"
                                  v-on:click="deleteSigner(indexSigner)"
                                >
                                  <CIcon name="cil-x-circle" />
                                </CLink>
                              </div>
                            </CCardHeader>
                            <CCardBody>
                              <CForm>
                                <CRow>
                                  <CCol sm="4">
                                    <CSelect
                                      label="Role"
                                      :options="roleOptions"
                                      :value.sync="listSigners[indexSigner].role"
                                      @change="updateCivitasOptions(indexSigner)"
                                      placeholder="Pilih Role"
                                      :is-valid="inputValidator(listSigners[indexSigner].role)"
                                      required
                                    />
                                  </CCol>
                                  <CCol sm="4">
                                    <CSelect
                                      label="Nama"
                                      :options.sync="listCivitasOptions[indexSigner]"
                                      :value.sync="listSigners[indexSigner].id"
                                      placeholder="Pilih Penandatangan"
                                      :is-valid="inputValidator(listSigners[indexSigner].id)"
                                      required
                                    />
                                  </CCol>
                                  <CCol sm="4">
                                    <CInput
                                      disabled
                                      label="Address"
                                      :value.sync="listSigners[indexSigner].id"
                                    />
                                  </CCol>
                                </CRow>
                              </CForm>
                            </CCardBody>
                          </CCard>
                        </CRow>
                      </CContainer>
                    </div>
                  </template>
                </CRow>
                <CButton color="success" @click="addSigner">Tambah Penanda Tangan</CButton>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow class="justify-content-center">
                <CCol sm="4">
                  <CButton color="danger" block @click="confirmModal = true">Kembali</CButton>
                </CCol>
                <CCol sm="4">
                  <CButton color="success" block @click="confirmModal = true">Tambah Sertifikat</CButton>
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
import CivitasHelper from "../../contracts/CivitasHelper";
import SertifikatHelper from "../../contracts/SertifikatHelper";
import gql from "graphql-tag";

export const GET_CIVITAS = gql`
  query civitas($role: Bytes!) {
    civitas(where: { role_contains: $role }) {
      id
      name
      linkedAccount {
        id
      }
    }
  }
`;

export const GET_MAHASISWA = gql`
  query mahasiswa($id: Bytes!) {
    mahasiswa(id: $id) {
      linkedAccount {
        id
      }
    }
  }
`;

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "TambahSertifikat",
  apollo: {
    civitas: gql`
      query {
        civitas {
          id
          name
        }
      }
    `,
  },
  data() {
    return {
      jenisOptions: [
        { label: "Ijazah", value: "ijazah" },
        { label: "SKPI", value: "skpi" },
      ],
      roleOptions: [
        {
          value: "admin",
          label: "Admin",
        },
        {
          value: "dosen",
          label: "Dosen",
        },
        {
          value: "dikti",
          label: "Dikti",
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
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      sertifikat: {
        jenis: null,
        pemilik: String(),
        file: null,
      },
      previewImage: null,
      uploadedSertifikat: null,
      pemilik: {
        nim: String(),
        hash: String(),
        address: String(),
        data: null,
      },
      listSigners: [],
      listCivitasOptions: [],
      isUploadingFile: false,
    };
  },
  computed: {
    fileUrl() {
      const gateway = "https://gateway.ipfs.io/ipfs/" + this.uploadedSertifikat;
      console.log(gateway);
      return gateway;
    },
    documentFormat() {
      return "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow";
    },
  },
  methods: {
    createSertifikat: function () {
      let pemilik = this.pemilik;
      if (this.isDataReady()) {
        let listSigners = [];
        let listRole = [];
        this.listSigners.forEach((signer) => {
          console.log(signer.id + signer.role);
          listSigners.push(signer.id);
          listRole.push(web3.utils.utf8ToHex(signer.role));
        });
        let data = this.packSertifikat();
        console.log(listSigners);
        console.log(listRole);
        let file = Buffer.from(JSON.stringify(data));
        ipfs.add(file).then((ipfsHash) => {
          const hash = ipfsHash[0].hash;
          console.log(hash);
          web3.eth.getAccounts().then((accounts) => {
            console.log(
              pemilik.address,
              " ",
              pemilik.nim,
              " ",
              data.jenis,
              " ",
              listSigners.length,
              " ",
              hash
            );
            return SertifikatHelper.methods
              .createSertifikat(
                pemilik.address,
                pemilik.nim,
                web3.utils.utf8ToHex(data.jenis),
                listSigners.length,
                web3.utils.utf8ToHex(hash),
                listSigners,
                listRole
              )
              .send({ from: accounts[0] })
              .on("error", function (error, receipt) {
                this.showAlert(false);
              })
              .on("receipt", function (receipt) {
                this.showAlert(true);
              });
          });
        });
      }
    },
    packSertifikat: function () {
      let sertifikat = {};
      sertifikat.jenis = this.sertifikat.jenis;
      sertifikat.file = this.uploadedSertifikat;
      sertifikat.pemilik = this.pemilik;
      sertifikat.penandaTangan = this.listSigners;
      return sertifikat;
    },
    getMahasiswaInfo: function () {
      const nim = this.sertifikat.pemilik;
      const getMahasiswaAddress = this.getMahasiswaAddress;
      let pemilik = this.pemilik;
      pemilik.hash = "";
      pemilik.data = "";
      pemilik.nim = "";
      web3.eth.getAccounts().then((accounts) => {
        return CivitasHelper.methods
          .getMahasiswa(web3.utils.utf8ToHex(nim))
          .call({ from: accounts[0] })
          .then(function (result) {
            console.log(result);
            pemilik.nim = result[0];
            pemilik.hash = result[1];
            if (pemilik.hash != null) {
              ipfs
                .cat("/ipfs/" + web3.utils.hexToUtf8(pemilik.hash))
                .then((data) => {
                  pemilik.data = JSON.parse(data.toString());
                  getMahasiswaAddress();
                });
            }
          });
      });
    },
    getMahasiswaAddress: function () {
      if (!this.pemilik.nim) return false;
      this.$apollo
        .query({
          query: GET_MAHASISWA,
          variables: {
            id: this.pemilik.nim,
          },
        })
        .then((response) => {
          console.log(response);
          if (!response.data.mahasiswa.linkedAccount) return false;
          this.pemilik.address = response.data.mahasiswa.linkedAccount.id;
          console.log(this.pemilik.address);
        });
    },
    updateCivitasOptions(index) {
      const role = this.listSigners[index].role;
      this.$apollo
        .query({
          query: GET_CIVITAS,
          variables: {
            role: web3.utils.utf8ToHex(role),
          },
        })
        .then((response) => {
          console.log(response);
          let newArr = [];
          response.data.civitas.forEach((civitas) => {
            newArr.push({
              label: web3.utils.hexToUtf8(civitas.name),
              value: civitas.linkedAccount.id,
            });
          });
          this.listCivitasOptions[index] = newArr;
          this.$forceUpdate();
          console.log(this.listCivitasOptions);
        });
    },
    uploadSertifikat: function () {
      this.isUploadingFile = true;
      console.log(this.sertifikat.file);
      ipfs.add(this.sertifikat.file).then((ipfsHash) => {
        console.log(ipfsHash);
        let hash = ipfsHash[0].hash;
        this.uploadedSertifikat = hash;
        this.isUploadingFile = false;
      });
    },
    civitasOptions(index) {
      console.log("id" + index);
      return this.listCivitasOptions[index];
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
        this.createSertifikat();
      }
    },
    showAlert: function (isSuccess) {
      if (isSuccess) {
        this.dismissSuccess = 5;
      } else {
        this.dismissFail = 5;
      }
    },
    addSigner() {
      this.listSigners.push({
        id: null,
        role: null,
      });
      this.listCivitasOptions[this.listSigners.length - 1] = [];
    },
    deleteSigner(index) {
      this.listSigners.splice(index, 1);
    },
    previewFiles(event) {
      console.log(event[0]);
      this.sertifikat.file = event[0];
    },
    isStringEmpty(str) {
      return !str || 0 === str.length;
    },
    isDataReady() {
      let isReady = true;
      let arrSigner = [];
      console.log("check data");
      if (
        this.isStringEmpty(this.pemilik.address) ||
        this.isStringEmpty(this.pemilik.nim) ||
        this.isStringEmpty(this.pemilik.data.nama) ||
        this.isStringEmpty(this.sertifikat.jenis) ||
        this.listSigners.length < 1 ||
        this.uploadedSertifikat == null
      )
        return false;
      this.listSigners.forEach((signer) => {
        if (
          signer.id == null ||
          signer.role == null ||
          arrSigner.includes(signer.id)
        )
          isReady = false;
        arrSigner.push(signer.id);
      });
      console.log(arrSigner);
      return isReady;
    },
  },
};
</script>
