<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Prodi Detail</CCardHeader>
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

export const GET_PRODI = gql`
  query prodi($id: ID!) {
    prodi(id: $id) {
      id
      namaProdi
      namaJurusan
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
  name: "ProdiDetail",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      dataSubgraph: null,
      prodiData: {
        nama: String(),
        ipfsHash: String(),
      },
      prodiIpfs: null,
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
    prodiDataSubgraph() {
      const prodiDetails = this.prodi
        ? Object.entries(this.prodi)
        : [["id", "Not found"]];
      return prodiDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    prodiDataOnChain() {
      const prodi = this.prodiData
        ? Object.entries(this.prodiData)
        : [["id", "Not found"]];
      return prodi.map(([key, value]) => {
        return { key, value };
      });
    },
    prodiDataIpfs() {
      const prodiIpfs = this.prodiIpfs
        ? Object.entries(this.prodiIpfs)
        : [["id", "Not found"]];
      return prodiIpfs.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.prodiDataSubgraph.filter((param) => {
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
      this.usersOpened
        ? this.$router.push(this.usersOpened)
        : this.$router.push("/dashboard");
    },
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      AkademikHelper.methods
        .getProgram(this.$route.params.id)
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.prodiData.nama = web3.utils.hexToUtf8(result[0]);
            context.prodiData.ipfsHash = web3.utils.hexToUtf8(result[1]);
            context.dataContract = context.prodiDataOnChain;
            ipfs.cat("/ipfs/" + context.prodiData.ipfsHash).then((data) => {
              context.prodiIpfs = JSON.parse(data.toString());
              context.dataIpfs = context.prodiDataIpfs;
            });
          }
        });
    });
    this.$apollo
      .query({
        query: GET_PRODI,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        console.log(response);
        this.prodi = response.data.prodi;
        this.dataSubgraph = this.visibleDataSubgraph;
      });
  },
};
</script>
