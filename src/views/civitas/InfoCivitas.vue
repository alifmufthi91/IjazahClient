<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Informasi Civitas Akademika</CCardHeader>
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

export const GET_CIVITAS = gql`
  query civita($nip: ID!) {
    civita(id: $nip) {
      id
      name
      role
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
  name: "InfoCivitas",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      dataSubgraph: null,
      civitasData: {
        nip: String(),
        ipfsHash: String(),
      },
      civitasIpfs: null,
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
          _style: "width:25%",
        },
        { key: "value", label: "Nilai" },
      ];
    },
    cvtDataSubgraph() {
      const cvtDetails = this.civita
        ? Object.entries(this.civita)
        : [["id", "Not found"]];
      return cvtDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    cvtDataOnChain() {
      const cvt = this.civitasData
        ? Object.entries(this.civitasData)
        : [["id", "Not found"]];
      return cvt.map(([key, value]) => {
        return { key, value };
      });
    },
    cvtDataIpfs() {
      const cvtIpfs = this.civitasIpfs
        ? Object.entries(this.civitasIpfs)
        : [["id", "Not found"]];
      return cvtIpfs.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.cvtDataSubgraph.filter((param) => {
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
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      CivitasHelper.methods
        .getNIPCivitas(accounts[0])
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            web3.eth.getAccounts().then((accounts) => {
              CivitasHelper.methods
                .getCivitas(result)
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (result) {
                    context.civitasData.nip = web3.utils.hexToUtf8(result[0]);
                    context.civitasData.ipfsHash = web3.utils.hexToUtf8(
                      result[1]
                    );
                    context.dataContract = context.cvtDataOnChain;
                    ipfs
                      .cat("/ipfs/" + context.civitasData.ipfsHash)
                      .then((data) => {
                        context.civitasIpfs = JSON.parse(data.toString());
                        context.dataIpfs = context.cvtDataIpfs;
                        ipfs
                          .cat("/ipfs/" + context.civitasIpfs.foto)
                          .then((data) => {
                            let blob = new Blob([data], { type: "image/png" });
                            let url = URL.createObjectURL(blob);
                            context.previewImage = url;
                          });
                      });
                  }
                });
            });
            context.$apollo
              .query({
                query: GET_CIVITAS,
                variables: {
                  nip: result,
                },
              })
              .then((response) => {
                context.civita = response.data.civita;
                context.dataSubgraph = context.visibleDataSubgraph;
              });
          }
        });
    });
  },
};
</script>
