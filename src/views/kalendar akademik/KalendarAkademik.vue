<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Kalendar AKademik</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="this.kalendarAkademiks"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
          <template #tahunAjar="data" >
              <td class="font-weight-bold" >
                {{ hexToString(data.item.tahunAjar) }}
              </td>
            </template>
          <template #semester="data">
              <td>
                {{ semester(data.item) }}
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
  name: "InfoKalendarAkademik",
    apollo: {
      kalendarAkademiks: gql`
        query {
          kalendarAkademiks {
            id
            tahunAjar
            ganjil
          }
        }
      `
    },
  data() {
    return {
      fields: [
        { key: "id" },
        { key: "tahunAjar" },
        { key: "semester" },
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
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "kalendar-akademik/" + `${item.id}` });
    },
    semester(val){
      return val.ganjil? 'Ganjil' : 'Genap'
    },
    hexToString(str) {
      if(web3.utils.isHexStrict(str))
      return web3.utils.hexToUtf8(str)
    }
  }
};
</script>
