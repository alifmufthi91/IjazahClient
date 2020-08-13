<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Mahasiswa</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="this.mahasiswas"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
            <template #name="data">
              <td>{{ hexToString(data.item.name) }}</td>
            </template>
            <template #prodi="data">
              <td>{{ hexToString(data.item.prodi) }}</td>
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
    `,
  },
  data() {
    return {
      fields: [
        { key: "id" },
        { key: "name" },
        { key: "prodi" },
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
      this.$router.replace({ path: "mahasiswa/" + `${item.id}` });
    },
    hexToString(str) {
      return web3.utils.hexToUtf8(str);
    },
  },
};
</script>
