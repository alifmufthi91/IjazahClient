<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Mata Kuliah Detail</CCardHeader>
        <CCardBody>
          <h5>Data On-Chain</h5>
          <CDataTable striped small fixed :items="dataContract" :fields="fields" />
          <h5>Data Off-Chain (Subgraph)</h5>
          <CDataTable striped small fixed :items="dataSubgraph" :fields="fields" />
          <h5>Data Off-Chain (IPFS)</h5>
          <CDataTable striped small fixed :items="dataIpfs" :fields="fields" />
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
import AkademikHelper from "@/contracts/AkademikHelper";

export const GET_MATAKULIAH = gql`
  query mataKuliah($id: ID!) {
    mataKuliah(id: $id) {
      id
      namaMatkul
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
  name: "MatkulDetail",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      dataSubgraph: null,
      matkulData: {
        nama: String(),
        ipfsHash: String(),
      },
      matkulIpfs: null,
      dataContract: null,
      dataIpfs: null,
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
    matkulDataSubgraph() {
      const matkulDetails = this.mataKuliah
        ? Object.entries(this.mataKuliah)
        : [["id", "Not found"]];
      return matkulDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    matkulDataOnChain() {
      const matkul = this.matkulData
        ? Object.entries(this.matkulData)
        : [["id", "Not found"]];
      return matkul.map(([key, value]) => {
        return { key, value };
      });
    },
    matkulDataIpfs() {
      const matkulIpfs = this.matkulIpfs
        ? Object.entries(this.matkulIpfs)
        : [["id", "Not found"]];
      return matkulIpfs.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.matkulDataSubgraph.filter((param) => {
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
      this.$router.go(-1)
    },
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      AkademikHelper.methods
        .getMatkul(this.$route.params.id)
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.matkulData.nama = web3.utils.hexToUtf8(result[0]);
            context.matkulData.ipfsHash = web3.utils.hexToUtf8(result[1]);
            context.dataContract = context.matkulDataOnChain;
            ipfs.cat("/ipfs/" + context.matkulData.ipfsHash).then((data) => {
              context.matkulIpfs = JSON.parse(data.toString());
              context.dataIpfs = context.matkulDataIpfs;
            });
          }
        });
    });
    this.$apollo
      .query({
        query: GET_MATAKULIAH,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        this.mataKuliah = response.data.mataKuliah;
        this.dataSubgraph = this.visibleDataSubgraph;
      });
  },
};
</script>
