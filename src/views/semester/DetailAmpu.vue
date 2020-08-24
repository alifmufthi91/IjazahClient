<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Ampu Detail</CCardHeader>
        <CCardBody>
          <h5>Data On-Chain</h5>
          <CDataTable striped small fixed :items="dataContract" :fields="fields" />
          <h5>Data Off-Chain (Subgraph)</h5>
          <CDataTable striped small fixed :items="dataSubgraph" :fields="fields" />
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

export const GET_AMPU = gql`
  query ampu($id: ID!) {
    ampu(id: $id) {
      id
      idMatkul
      idDosen
      namaMatkul
      idSemester
      prodi
      kelas
      timeCreated
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
      dataSubgraph: null,
      ampuData: {
        idDosen: null,
        idMatkul: null,
        idSemester: null,
      },
      dataContract: null,
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
