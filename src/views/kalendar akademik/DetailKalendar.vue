<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Kalendar Akademik Detail</CCardHeader>
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

export const GET_KALENDAR = gql`
  query kalendarAkademik($id: ID!) {
    kalendarAkademik(id: $id) { 
      id
      tahunAjar
      ganjil
      timeCreated
      lastUpdated
    }
  }
`;

export default {
  name: "KalendarDetail",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      dataSubgraph: null,
      kalendarAkademikData: {
        tahunAjar: String(),
        isSemesterGanjil: null,
      },
      dataContract: null,
    };
  },
  computed: {
    fields() {
      return [
        { key: "key", label: "Informasi", _classes:"font-weight-bold text-capitalize", _style: 'width:25%'},
        { key: "value", label: "Nilai" },
      ];
    },
    kalendarDataSubgraph() {
      const kalendarDetails = this.kalendarAkademik
        ? Object.entries(this.kalendarAkademik)
        : [["id", "Not found"]];
      return kalendarDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    kalendarDataOnChain() {
      const kalendar = this.kalendarAkademikData
        ? Object.entries(this.kalendarAkademikData)
        : [["id", "Not found"]];
      return kalendar.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.kalendarDataSubgraph.filter((param) => {
        if (param.key == "timeCreated" || param.key == "lastUpdated") {
          param.value = new Date(param.value * 1000);
          return param;
        }
        if (
          web3.utils.isHexStrict(param.value)
        ) {
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
        .getKalendarAkademik(this.$route.params.id)
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.kalendarAkademikData.tahunAjar = web3.utils.hexToUtf8(result[0]);
            context.kalendarAkademikData.isSemesterGanjil = result[1];
            context.dataContract = context.kalendarDataOnChain;
          }
        });
    });
    this.$apollo
      .query({
        query: GET_KALENDAR,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        this.kalendarAkademik = response.data.kalendarAkademik;
        this.dataSubgraph = this.visibleDataSubgraph;
      });
  },
};
</script>
