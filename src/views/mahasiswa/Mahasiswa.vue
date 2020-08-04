<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Mahasiswa</CCardHeader>
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
  name: "InfoMahasiswa",
    apollo: {
      mahasiswas: gql`
        query {
          mahasiswas {
            id
            name
            prodi
          }
        }
      `
    },
  data() {
    return {
      fields: [
        { key: "id" },
        { key: "name" },
        { key: "prodi" },
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
      this.$router.replace({ path: "mahasiswa/" + `${item.id}` });
    }
  },
  computed: {
    visibleData() {
      console.log(this.mahasiswas)
      if(this.mahasiswas == null) return null
      return this.mahasiswas.filter(mhs => {
        let mahasiswa = mhs
        Object.keys(mhs).forEach(function(attribute) {
          if(mhs[attribute] != "" && mhs[attribute].startsWith('0x') && web3.utils.isHex(mhs[attribute])){
            console.log(mhs[attribute])
            mahasiswa[attribute] = web3.utils.hexToUtf8(mhs[attribute])
          }
        })
        return mahasiswa
      })
    }
  }
};
</script>
