<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Informasi Mahasiswa</CCardHeader>
        <CCardBody>
          <h5>Data On-Chain</h5>
          <CDataTable striped small fixed :items="dataContract" :fields="fields" />
          <h5>Data Off-Chain (Subgraph)</h5>
          <CDataTable striped small fixed :items="dataSubgraph" :fields="fields" />
          <h5>Data Off-Chain (IPFS)</h5>
          <CDataTable striped small fixed :items="dataIpfs" :fields="fields" />
          <CRow class="justify-content-center">
            <CCol sm="3">
              <CCard>
                <CCardBody>
                  <div v-if="!previewImage">
                    <CProgress
                      color="success"
                      :value="100"
                      animated
                      style="height:20px;"
                      class="mt-1"
                    />
                  </div>
                  <div v-if="previewImage">
                    <img class="d-block w-100 h-100 img-fluid" :src="previewImage" />
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <h5>Riwayat Studi (Subgraph)</h5>
          <CDataTable striped small fixed :items="riwayatStudis" :fields="studiFields">
            <template #mataKuliah="data">
              <td>{{ data.item.ampu?hexToUtf8(data.item.ampu.namaMatkul):'' }}</td>
            </template>
            <template #nilai="data">
              <td>{{ hexToUtf8(data.item.nilai) }}</td>
            </template>
            <template #timeUpdated="data">
              <td>{{ unixToDate(data.item.timeUpdated) }}</td>
            </template>
          </CDataTable>
        </CCardBody>
        <CCardFooter>
          <CButton color="primary" @click="goBack">Back</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import CivitasHelper from "@/contracts/CivitasHelper";

export const GET_MAHASISWA = gql`
  query mahasiswa($nim: ID!) {
    mahasiswa(id: $nim) {
      id
      name
      prodi
      isLulus
      isAssignedNINA
      isUpdatedNINAData
      linkedAccount {
        id
      }
      timeCreated
      lastUpdated
    }
  }
`;

export const GET_STUDI = gql`
  query riwayatStudis($nim: ID!) {
    riwayatStudis(where: { nim: $nim }) {
      id
      ampu {
        id
        namaMatkul
      }
      nilai
      timeUpdated
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
  name: "InfoMahasiswa",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      dataSubgraph: null,
      mahasiswaData: {
        nim: String(),
        ipfsHash: String(),
      },
      mahasiswaIpfs: null,
      dataContract: null,
      dataIpfs: null,
      previewImage: null,
      riwayatStudis: null,
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
    studiFields() {
      return [
        {
          key: "id",
          _style: "width:5%",
        },
        { key: "mataKuliah" },
        { key: "nilai", _style: "width:5%" },
        { key: "timeUpdated" },
      ];
    },
    mhsDataSubgraph() {
      const mhsDetails = this.mahasiswa
        ? Object.entries(this.mahasiswa)
        : [["id", "Not found"]];
      return mhsDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    mhsDataOnChain() {
      const mhs = this.mahasiswaData
        ? Object.entries(this.mahasiswaData)
        : [["id", "Not found"]];
      return mhs.map(([key, value]) => {
        return { key, value };
      });
    },
    mhsDataIpfs() {
      const mhsIpfs = this.mahasiswaIpfs
        ? Object.entries(this.mahasiswaIpfs)
        : [["id", "Not found"]];
      return mhsIpfs.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.mhsDataSubgraph.filter((param) => {
        if (param.key == "timeCreated" || param.key == "lastUpdated") {
          param.value = new Date(param.value * 1000);
          return param;
        }
        if (web3.utils.isHexStrict(param.value)) {
          param.value = web3.utils.hexToUtf8(param.value);
        }
        if (param.key == "linkedAccount") {
          param.value = param.value ? param.value.id : "Tidak Ada";
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
    hexToUtf8(hex){
      return web3.utils.hexToUtf8(hex)
    },
    unixToDate(unix){
      const date = new Date(unix * 1000)
      return date.toString();
    }
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      CivitasHelper.methods
        .getNIMMahasiswa(accounts[0])
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.$apollo
              .query({
                query: GET_MAHASISWA,
                variables: {
                  nim: result,
                },
              })
              .then((response) => {
                context.mahasiswa = response.data.mahasiswa;
                context.dataSubgraph = context.visibleDataSubgraph;
              });
            CivitasHelper.methods
              .getMahasiswa(result)
              .call({ from: accounts[0] })
              .then(function (result) {
                if (result) {
                  context.mahasiswaData.nim = web3.utils.hexToUtf8(result[0]);
                  context.mahasiswaData.ipfsHash = web3.utils.hexToUtf8(
                    result[1]
                  );
                  context.dataContract = context.mhsDataOnChain;
                  ipfs
                    .cat("/ipfs/" + context.mahasiswaData.ipfsHash)
                    .then((data) => {
                      context.mahasiswaIpfs = JSON.parse(data.toString());
                      context.dataIpfs = context.mhsDataIpfs;
                      ipfs
                        .cat("/ipfs/" + context.mahasiswaIpfs.foto)
                        .then((data) => {
                          let blob = new Blob([data], { type: "image/png" });
                          let url = URL.createObjectURL(blob);
                          context.previewImage = url;
                        });
                    });
                }
              });
            context.$apollo
              .query({
                query: GET_STUDI,
                variables: {
                  nim: result,
                },
              })
              .then((response) => {
                context.riwayatStudis = response.data.riwayatStudis;
              });
          }
        });
    });
  },
};
</script>
