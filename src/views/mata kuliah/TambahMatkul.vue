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
          >Mata Kuliah berhasil ditambahkan.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="12">
          <CCard class="mx-4 mb-5">
            <CCardBody class="p-4">
              <CForm v-if="this.prodis">
                <h2 class="mb-3">Tambah Mata Kuliah</h2>
                <CRow>
                  <CCol sm="8">
                    <CSelect
                      label="Program Studi"
                      :options="prodiOptions"
                      placeholder="Pilih Prodi"
                      :value.sync="matkul.idProdi"
                      required
                    />
                    <CInput
                      label="Nama Mata Kuliah"
                      placeholder="cth. Proyek 5 : Proyek Penelitian dan Pengembangan Perangkat Lunak Ke-2"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="matkul.nama"
                    />
                    <CInput
                      label="Kode Mata Kuliah"
                      placeholder="cth. 16TIN8044"
                      required
                      :is-valid="validator"
                      invalid-feedback="Data tidak boleh kosong."
                      :value.sync="matkul.kodeMatkul"
                    />
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
                  <CButton color="success" block @click="confirmModal = true">Tambah Mata kuliah</CButton>
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
import AkademikHelper from "@/contracts/AkademikHelper";
import gql from "graphql-tag";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "TambahProdi",
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
      jenjangOptions: ["D4", "D3", "S2"],
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      matkul: {
        nama: String(),
        idProdi: null,
        kodeMatkul: String(),
      },
    };
  },
  computed: {
    prodiOptions() {
      let arrProdi = [];
      this.prodis.forEach((prodi) => {
        arrProdi.push({
          label: web3.utils.hexToUtf8(prodi.namaProdi),
          value: prodi.id,
        });
      });
      arrProdi.push({ label: "Umum", value: null });
      return arrProdi;
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    createMatkul: function () {
      let data = this.matkul;
      if (this.isDataReady(data)) {
        let file = Buffer.from(JSON.stringify(data));
        ipfs.add(file).then((ipfsHash) => {
          let hash = ipfsHash[0].hash;
          web3.eth.getAccounts().then((accounts) => {
            return AkademikHelper.methods
              .createMatkul(
                web3.utils.utf8ToHex(this.matkul.nama),
                web3.utils.utf8ToHex(hash)
              )
              .send({ from: accounts[0] })
              .on("error", function (error, receipt) {
                console.log(error);
              })
              .on("transactionHash", function (transactionHash) {
                console.log(transactionHash);
              });
          });
        });
      } else {
        alert("Input tidak valid");
      }
    },
    isDataReady(val) {
      let isReady = true;
      Object.keys(val)
        .filter((attribute) => {
          if (attribute == "idProdi") return null;
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
    confirmRegister: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.createMatkul();
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
