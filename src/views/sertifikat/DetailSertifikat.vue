<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Sertifikat Detail</CCardHeader>
        <CCardBody>
          <h5>Data On-Chain</h5>
          <CDataTable striped small fixed :items="dataContract" :fields="fields" />
          <h5>Data Off-Chain (Subgraph)</h5>
          <CDataTable striped small fixed :items="dataSubgraph" :fields="fields" />
          <h5>Data Off-Chain (IPFS)</h5>
          <CDataTable striped small fixed :items="dataIpfs" :fields="fields" />
          <CRow class="justify-content-center"><CCol sm="6">
          <h5>Pemilik (IPFS)</h5>
          <CDataTable striped small fixed :items="dataPemilik" :fields="fields" />
          </CCol>
          <CCol sm="6">
          <template v-for="(input, indexSignature) in dataSignatures">
              <div :key="indexSignature">
            <h5>Tanda Tangan #{{indexSignature}} (IPFS)</h5>
            <CDataTable striped small fixed :items="signatureDataIpfs(dataSignatures[indexSignature])" :fields="fields" />
              </div>
          </template>
          </CCol></CRow>
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
import SertifikatHelper from "@/contracts/SertifikatHelper";

export const GET_SERTIFIKAT = gql`
  query sertifikat($id: ID!) {
    sertifikat(id: $id) {
      id
      owner
      ownerNIM
      jenis
      signedTimes
      signRequired
      isPublished
      isSignedByOwner
      timeSignedOwner
      isIjazah
      nomorIjazah
      timeCreated
      lastUpdated
      signatures
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
  name: "SertifikatDetail",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      dataSubgraph: null,
      sertifikatData: {
        ownerSign: String(),
        ipfsHash: String(),
        signRequired: null,
        signerSize: null,
        owner: String(),
        jenisSertifikat: String(),
      },
      sertifikatIpfs: null,
      dataContract: null,
      dataIpfs: null,
      dataPemilik: null,
      dataSignatures: [],
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
    sertifikatDataSubgraph() {
      const sertifikatDetails = this.sertifikat
        ? Object.entries(this.sertifikat)
        : [["id", "Not found"]];
      return sertifikatDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    sertifikatDataOnChain() {
      const sertifikat = this.sertifikatData
        ? Object.entries(this.sertifikatData)
        : [["id", "Not found"]];
      return sertifikat.map(([key, value]) => {
        return { key, value };
      });
    },
    sertifikatDataIpfs() {
      const sertifikatIpfs = this.sertifikatIpfs
        ? Object.entries(this.sertifikatIpfs)
        : [["id", "Not found"]];
      return sertifikatIpfs.map(([key, value]) => {
        return { key, value };
      });
    },
    pemilikDataIpfs() {
      const sertifikatPemilikIpfs = this.sertifikatIpfs.pemilik
        ? Object.entries(this.sertifikatIpfs.pemilik)
        : [["id", "Not found"]];
      return sertifikatPemilikIpfs.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.sertifikatDataSubgraph.filter((param) => {
        if (param.key == "timeCreated" || param.key == "lastUpdated") {
          param.value = new Date(param.value * 1000);
          return param;
        }
        if (web3.utils.isHexStrict(param.value) && param.key != "owner") {
          param.value = web3.utils.hexToUtf8(param.value);
        }
        if (param.value == null || param.key == "__typename") {
          return null;
        }
        return param;
      });
    },
    visibleDataSertifikat() {
      return this.sertifikatDataIpfs.filter((param) => {
        if (param.key == "pemilik" || param.key == "penandaTangan") {
          return null;
        }
        return param;
      });
    },
    visibleDataPemilik() {
      return this.pemilikDataIpfs.filter((param) => {
        if (param.key == "data") {
          return null;
        }
        if (web3.utils.isHexStrict(param.value) && param.key != "address") {
          param.value = web3.utils.hexToUtf8(param.value);
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
    signatureDataIpfs(signatureData) {
      const signatureIpfs = signatureData
        ? Object.entries(signatureData)
        : [["id", "Not found"]];
      return signatureIpfs.map(([key, value]) => {
        return { key, value };
      });
    },
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      SertifikatHelper.methods
        .getCertificateOfOwner(this.$route.params.id)
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.sertifikatData.signRequired = result[0];
            context.sertifikatData.signerSize = result[1];
            context.sertifikatData.owner = result[2];
            context.sertifikatData.jenisSertifikat = result[5]
              ? web3.utils.hexToUtf8(result[3])
              : "null";
            context.sertifikatData.ipfsHash = result[4]
              ? web3.utils.hexToUtf8(result[4])
              : "null";
            context.sertifikatData.ownerSign = result[5]
              ? web3.utils.hexToUtf8(result[5])
              : "null";
            context.dataContract = context.sertifikatDataOnChain;
            ipfs
              .cat("/ipfs/" + context.sertifikatData.ipfsHash)
              .then((data) => {
                context.sertifikatIpfs = JSON.parse(data.toString());
                context.dataIpfs = context.visibleDataSertifikat;
                context.dataPemilik = context.visibleDataPemilik;
                context.dataSignatures = context.sertifikatIpfs.penandaTangan;
                console.log(context.dataSignatures);
              });
          }
        });
    });
    this.$apollo
      .query({
        query: GET_SERTIFIKAT,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        this.sertifikat = response.data.sertifikat;
        this.dataSubgraph = this.visibleDataSubgraph;
      });
  },
};
</script>
