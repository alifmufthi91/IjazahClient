<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Account Detail</CCardHeader>
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
import AccountManager from "@/contracts/AccountManager";

export const GET_ACCOUNT = gql`
  query account($address: ID!) {
    account(id: $address) { 
      id
      name
      verified
      role
      nomorInduk
      timeCreated
      lastUpdated
    }
  }
`;

export default {
  name: "AccountDetail",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      dataSubgraph: null,
      user: {
        address: String(),
        name: String(),
        verified: null,
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
    userDataSubgraph() {
      const userDetails = this.account
        ? Object.entries(this.account)
        : [["id", "Not found"]];
      return userDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    userDataOnChain() {
      const user = this.user
        ? Object.entries(this.user)
        : [["id", "Not found"]];
      return user.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.userDataSubgraph.filter((param) => {
        if (param.key == "timeCreated" || param.key == "lastUpdated") {
          param.value = new Date(param.value * 1000);
          return param;
        }
        if (
          param.key != "id" &&
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
      this.usersOpened
        ? this.$router.push(this.usersOpened)
        : this.$router.push("/dashboard");
    },
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      AccountManager.methods
        .getAccount(this.$route.params.id)
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.user.address = result[0];
            context.user.name = web3.utils.hexToUtf8(result[2]);
            context.user.verified = result[1];
            context.dataContract = context.userDataOnChain;
          }
        });
    });
    this.$apollo
      .query({
        query: GET_ACCOUNT,
        variables: {
          address: this.$route.params.id,
        },
      })
      .then((response) => {
        this.account = response.data.account;
        this.dataSubgraph = this.visibleDataSubgraph;
      });
  },
};
</script>
