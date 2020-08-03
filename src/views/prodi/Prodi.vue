<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Prodi</CCardHeader>
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
  name: "InfoProdi",
    apollo: {
      prodis: gql`
        query {
          prodis {
            id
            namaProdi
            namaJurusan
          }
        }
      `
    },
  data() {
    return {
      fields: [
        { key: "id" },
        { key: "namaProdi" },
        { key: "namaJurusan" },
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
      this.$router.replace({ path: "prodi/" + `${item.id}` });
    }
  },
  computed: {
    visibleData() {
      if(this.prodis == null) return null
      return this.prodis.filter(prodi => {
        let program = prodi
        Object.keys(prodi).forEach(function(attribute) {
          if(prodi[attribute] != "" && attribute != "id" && prodi[attribute].startsWith('0x') && web3.utils.isHex(prodi[attribute])){
            console.log(prodi[attribute])
            program[attribute] = web3.utils.hexToUtf8(prodi[attribute])
          }
        })
        return program
      })
    }
  }
};
</script>
