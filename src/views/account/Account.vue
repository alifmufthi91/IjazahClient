<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Account Detail</CCardHeader>
        <CCardBody>
          <CDataTable striped small fixed :items="data" :fields="fields" />
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
    next(vm => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      data: null
    };
  },
  computed: {
    fields() {
      return [
        { key: "key", label: "Informasi" },
        { key: "value", label: "Nilai" }
      ];
    },
    userData() {
      const userDetails = this.account
        ? Object.entries(this.account)
        : [["id", "Not found"]];
      return userDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleData() {
      return this.userData.filter(param => {
        console.log(param.key);
        if (param.key == "timeCreated" || param.key == "lastUpdated") {
          param.value = new Date(param.value * 1000)
          return param
        }
        if(param.value != "" && param.key != "id" && web3.utils.isHex(param.value)){
          param.value = web3.utils.hexToAscii(param.value)
        }
        if (param.value == null || param.key == "__typename") {
          return null
        }
        return param;
      });
    }
  },
  methods: {
    goBack() {
      this.usersOpened ? this.$router.push(this.usersOpened) : this.$router.push('/dashboard')
    }
  },
  beforeMount() {
    console.log(this.$route.params.id);
    this.$apollo
      .query({
        query: GET_ACCOUNT,
        variables: {
          address: this.$route.params.id
        }
      })
      .then(response => {
        console.log(response);
        this.account = response.data.account;
        this.data = this.visibleData;
      });
  } 
};
</script>
