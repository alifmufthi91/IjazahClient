<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Role Management</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="visibleData"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
            <template #verified="data">
              <td>
                <CBadge :color="getBadge(data.item.verified)">{{ getVerified(data.item.verified) }}</CBadge>
              </td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-center">
                  <CButton
                    color="primary"
                    class="mr-3"
                    size="sm"
                    @click="detailClicked(data.item)"
                  >Detail</CButton>
                  <CButton color="success" class="mr-3" size="sm">Edit</CButton>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "RoleManagement",
  apollo: {
    accounts: gql`
      query {
        accounts(where:{ isDeleted:false }, orderBy:name) {
          id
          name
          verified
          role
        }
      }
    `
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name", _classes: "font-weight-bold" },
        { key: "id", label: "Alamat" },
        { key: "role" },
        { key: "verified", label: "Verified" },
        { key: "action", label: "Aksi" }
      ],
      activePage: 1
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      }
    }
  },
  methods: {
    getBadge(status) {
      if (status) return "success";
      return "warning";
    },
    getVerified(status) {
      if (status) return "Terverifikasi";
      return "Belum Diverifikasi";
    },
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "account/" + `${item.id}` });
    }
  },
  computed: {
    visibleData() {
      if(this.accounts == null) return null
      return this.accounts.filter(account => {
        Object.keys(account).forEach(function(attribute) {
          if(account[attribute] != "" && attribute != "id" && web3.utils.isHex(account[attribute])){
            account[attribute] = web3.utils.hexToUtf8(account[attribute])
          }
        })
        return account
      })
    }
  }
};
</script>
