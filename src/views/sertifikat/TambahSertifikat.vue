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
        <CCol md="12" :show="ready">
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
                    <CInput label="NIM Pemilik" :value.sync="sertifikat.pemilik">
                      <template #append>
                        <CButton color="primary">Check</CButton>
                      </template>
                    </CInput>
                  </CCol>
                </CRow>
                <CRow class="justify-content-center my-3">
                  <CCol md="10">
                    <h4 class="text-center">Info Pemilik</h4>
                    <CCard color="light">
                      <CCardBody>
                        <CForm>
                          <CRow>
                            <CCol sm="4">
                              <CSelect
                                label="Role"
                                :options="roleOptions"
                                placeholder="Pilih Role"
                                :is-valid="inputValidator()"
                                required
                              />
                            </CCol>
                            <CCol sm="4">
                              <CSelect
                                label="Jenis Sertifikat"
                                :options="jenisOptions"
                                placeholder="Pilih Jenis Sertifikat"
                                :is-valid="inputValidator()"
                                required
                              />
                            </CCol>
                            <CCol sm="4">
                              <CInput disabled label="Nama" />
                            </CCol>
                          </CRow>
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
                <h3 class="mb-3">Sertifikat</h3>
                <CRow class="justify-content-center">
                  <CCol sm="6" class="my-3">
                    <CInputFile placeholder="Pilih File Sertifikat..." accept="*" custom />
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
                                      placeholder="Pilih Role"
                                      :is-valid="inputValidator()"
                                      required
                                    />
                                  </CCol>
                                  <CCol sm="4">
                                    <CSelect
                                      label="Nama"
                                      :options="jenisOptions"
                                      placeholder="Pilih Jenis Sertifikat"
                                      :is-valid="inputValidator()"
                                      required
                                    />
                                  </CCol>
                                  <CCol sm="4">
                                    <CInput disabled label="NIP" />
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
import AkademikHelper from "../../contracts/AkademikHelper";
import gql from "graphql-tag";

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
      jenisOptions: ["Ijazah", "SKPI"],
      roleOptions: ["Kajur", "Rektor", "PD2"],
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      sertifikat: {
        jenis: null,
        pemilik: null,
      },
      listSigners: [],
    };
  },
  computed: {
    civitasOptions() {
      let arrCivitas = [];
      this.civitas.forEach((civitas) => {
        arrCivitas.push({
          label: web3.utils.hexToUtf8(civitas.name),
          value: Number(civitas.id),
        });
      });
      console.log(arrCivitas);
      return arrCivitas;
    },
    ready() {
      if (this.civitas == null) return false;
      return true;
    },
  },
  methods: {
    createSemester: function () {
      let data = this.semester;
      console.log(data);
      if (this.isDataReady(this.semester)) {
        let file = Buffer.from(JSON.stringify(data));
        ipfs.add(file).then((ipfsHash) => {
          let hash = ipfsHash[0].hash;
          console.log(hash);
          web3.eth.getAccounts().then((accounts) => {
            return AkademikHelper.methods
              .createSemester(
                data.semesterKe,
                web3.utils.utf8ToHex(hash),
                daftarDosen,
                daftarMatkul,
                daftarSks,
                this.prodis[data.prodi].namaProdi,
                web3.utils.utf8ToHex(data.kelas)
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
    validator(val) {
      return val ? val.length > 1 : false;
    },
    inputValidator(val) {
      return val ? true : false;
    },
    confirmRegister: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.createSemester();
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
        name: null,
        role: null,
      });
    },
    deleteSigner(index) {
      this.listSigners.splice(index, 1);
    },
    isDataReady(val) {
      let isReady = true;
      return isReady;
    },
  },
};
</script>
