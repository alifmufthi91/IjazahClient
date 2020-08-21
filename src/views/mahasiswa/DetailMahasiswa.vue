<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Mahasiswa Detail</CCardHeader>
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

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "MahasiswaDetail",
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
    };
  },
  computed: {
    fields() {
      return [
        {
          key: "key",
          label: "Informasi",
          _classes: "font-weight-bold text-capitalize",
          _style: 'width:25%'
        },
        { key: "value", label: "Nilai" },
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
      this.usersOpened
        ? this.$router.push(this.usersOpened)
        : this.$router.push("/dashboard");
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
            context.dataContract = context.mhsDataOnChain;
            ipfs.cat("/ipfs/" + context.mahasiswaData.ipfsHash).then((data) => {
              context.mahasiswaIpfs = JSON.parse(data.toString());
              context.dataIpfs = context.mhsDataIpfs;
              ipfs.cat("/ipfs/" + context.mahasiswaIpfs.foto).then((data) => {
                let blob = new Blob([data], { type: "image/png" });
                let url = URL.createObjectURL(blob);
                context.previewImage = url;
              });
            });
          }
        });
    });
    this.$apollo
      .query({
        query: GET_MAHASISWA,
        variables: {
          nim: this.$route.params.id,
        },
      })
      .then((response) => {
        this.mahasiswa = response.data.mahasiswa;
        this.dataSubgraph = this.visibleDataSubgraph;
      });
  },
};
</script>
