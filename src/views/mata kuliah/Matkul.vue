<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Mata Kuliah</CCardHeader>
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
  name: "InfoMatkul",
    apollo: {
      mataKuliahs: gql`
        query {
          mataKuliahs {
            id
            namaMatkul
            timeCreated
          }
        }
      `
    },
  data() {
    return {
      fields: [
        { key: "id" },
        { key: "namaMatkul" },
        { key: "timeCreated", label:"Waktu Dibuat"},
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
      this.$router.replace({ path: "matkul/" + `${item.id}` });
    }
  },
  computed: {
    visibleData() {
      if(this.mataKuliahs == null) return null
      return this.mataKuliahs.filter(matkul => {
        let course = matkul
        Object.keys(matkul).forEach(function(attribute) {
          if(matkul[attribute] != "" && attribute != "id" && web3.utils.isHex(matkul[attribute]) && matkul[attribute].startsWith('0x')){
            console.log(matkul[attribute])
            course[attribute] = web3.utils.hexToUtf8(matkul[attribute])
          }
          if(attribute == "timeCreated"){
            console.log(matkul[attribute])
            course[attribute] = new Date(matkul[attribute] * 1000)
          }
        })
        return course
      })
    }
  }
};
</script>
