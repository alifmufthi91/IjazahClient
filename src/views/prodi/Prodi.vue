<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Prodi</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="this.prodis"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
            <template #namaProdi="data">
              <td>
                {{ hexToString(data.item.namaProdi) }}
              </td>
            </template>
            <template #namaJurusan="data">
              <td>
                {{ hexToString(data.item.namaJurusan) }}
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
    `,
  },
  data() {
    return {
      fields: [
        { key: "id" },
        { key: "namaProdi" },
        { key: "namaJurusan" },
        { key: "action", label: "Aksi" },
      ],
      activePage: 1,
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        if (route.query && route.query.page) {
          this.activePage = Number(route.query.page);
        }
      },
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "prodi/" + `${item.id}` });
    },
    hexToString(str) {
      return web3.utils.hexToUtf8(str)
    }
  }
};
</script>
