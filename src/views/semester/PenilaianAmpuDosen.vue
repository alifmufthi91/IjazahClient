<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Ampu Detail</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6">
              <h5>Data On-Chain</h5>
              <CDataTable striped small fixed :items="dataContract" :fields="fields" />
            </CCol>
            <CCol sm="6">
              <h5>Data Off-Chain (Subgraph)</h5>
              <CDataTable striped small fixed :items="dataSubgraph" :fields="fields" />
            </CCol>
          </CRow>
          <CForm>
            <h3 class="mb-3 mt-3">Penilaian Mahasiswa</h3>
            <CRow class="justify-content-center">
              <template v-for="(input, index) in listMahasiswa">
                <div class="d-flex" :key="index" style="width:100%">
                  <CContainer fluid>
                    <CRow class="mx-auto">
                      <CCard style="width:100%">
                        <CCardHeader>
                          Mahasiswa #{{index + 1}}
                          <div class="card-header-actions">
                            <CLink
                              href="#"
                              class="card-header-action btn-close"
                              v-on:click="deleteMahasiswa(index)"
                            >
                              <CIcon name="cil-x-circle" />
                            </CLink>
                          </div>
                        </CCardHeader>
                        <CCardBody>
                          <CForm>
                            <CRow class="justify-content-center">
                              <CCol sm="5">
                                <CInput
                                  label="NIM"
                                  horizontal
                                  :value.sync="listMahasiswa[index].id"
                                  maxlength="12"
                                  :is-valid="validator(listMahasiswa[index].id)"
                                />
                              </CCol>
                              <CCol sm="3">
                                <CSelect
                                  label="Nilai"
                                  placeholder="Input Nilai"
                                  horizontal
                                  :value.sync="listMahasiswa[index].nilai"
                                  :options="nilaiOptions"
                                  :is-valid="inputValidator(listMahasiswa[index].nilai)"
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
            <CButton color="success" @click="addMahasiswa">Tambah Mahasiswa</CButton>
          </CForm>
        </CCardBody>
        <CCardFooter>
          <CRow class="justify-content-center">
            <CCol sm="4">
              <CButton color="danger" block @click="goBack">Kembali</CButton>
            </CCol>
            <CCol sm="4">
              <CButton color="success" block @click="confirmModal = true">Konfirmasi Nilai</CButton>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>
    </CCol>
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
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import AkademikHelper from "@/contracts/AkademikHelper";
import SertifikatHelper from "@/contracts/SertifikatHelper";
import CivitasHelper from "@/contracts/CivitasHelper";

export const GET_AMPU = gql`
  query ampu($id: ID!) {
    ampu(id: $id) {
      namaMatkul
      prodi
      kelas
    }
  }
`;

export default {
  name: "AmpuDetail",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      ampuData: {
        idDosen: null,
        idMatkul: null,
        idSemester: null,
      },
      ampu: null,
      dataSubgraph: null,
      dataContract: null,
      listMahasiswa: [],
      nilaiOptions: ["A", "AB", "B", "BC", "C", "CD", "D", "DE", "E"],
      confirmModal: false,
    };
  },
  computed: {
    fields() {
      return [
        {
          key: "key",
          label: "Informasi",
          _classes: "font-weight-bold text-capitalize",
          _style: "width:25%",
        },
        { key: "value", label: "Nilai" },
      ];
    },
    ampuDataSubgraph() {
      const ampuDetails = this.ampu
        ? Object.entries(this.ampu)
        : [["id", "Not found"]];
      return ampuDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    ampuDataOnChain() {
      const ampu = this.ampuData
        ? Object.entries(this.ampuData)
        : [["id", "Not found"]];
      return ampu.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.ampuDataSubgraph.filter((param) => {
        if (param.key == "timeCreated" || param.key == "lastUpdated") {
          param.value = new Date(param.value * 1000);
          return param;
        }
        if (web3.utils.isHexStrict(param.value)) {
          param.value = web3.utils.hexToUtf8(param.value);
        }
        if (param.value == null || param.key == "__typename") {
          return null;
        }
        return param;
      });
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    confirmRegister: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.penilaianMahasiswa();
      }
    },
    validator(val) {
      if (val == null) return false;
      var letters = /^[0-9]*$/gm;
      if (!val.match(letters)) return false;
      else return true;
    },
    inputValidator(val) {
      return val ? true : false;
    },
    addMahasiswa() {
      this.listMahasiswa.push({
        id: null,
        nilai: null,
      });
    },
    deleteMahasiswa(index) {
      this.listMahasiswa.splice(index, 1);
    },
    penilaianMahasiswa() {
      const semester = this.ampuData.idSemester;
      const dosen = this.ampuData.idDosen;
      const ampuId = this.$route.params.id;
      let context = this;
      if (this.isDataReady()) {
        web3.eth.getAccounts().then((accounts) => {
          CivitasHelper.methods
            .getNIPDosen(dosen)
            .call({ from: accounts[0] })
            .then(function (result) {
              if (result) {
                context.listMahasiswa.forEach((mahasiswa) => {
                  SertifikatHelper.methods
                    .pengisianNilaiMatkul(
                      semester,
                      ampuId,
                      dosen,
                      result,
                      web3.utils.utf8ToHex(mahasiswa.id),
                      web3.utils.utf8ToHex(mahasiswa.nilai)
                    )
                    .send({ from: accounts[0] })
                    .on("error", function (error, receipt) {
                      console.log(error);
                    })
                    .on("transactionHash", function (transactionHash) {
                      console.log(transactionHash);
                    });
                });
              }
            });
        });
      }else{
        alert("Input tidak valid");
      }
    },
    isDataReady() {
      let isReady = true;
      this.listMahasiswa.forEach((mahasiswa) => {
        if (!mahasiswa.id || !mahasiswa.nilai) {
          isReady = false;
        }
      });
      return isReady;
    },
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      AkademikHelper.methods
        .getAmpu(this.$route.params.id)
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.ampuData.idDosen = result[0];
            context.ampuData.idMatkul = result[1];
            context.ampuData.idSemester = result[2];
            context.dataContract = context.ampuDataOnChain;
          }
        });
    });
    this.$apollo
      .query({
        query: GET_AMPU,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        this.ampu = response.data.ampu;
        this.dataSubgraph = this.visibleDataSubgraph;
      });
  },
};
</script>
