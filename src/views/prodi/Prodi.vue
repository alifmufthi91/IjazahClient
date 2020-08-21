<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Prodi</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="filteredItems"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            sorter
            columnFilter
            @page-change="pageChange"
          >
            <template #namaProdi-filter>
              <input
                class="form-control form-control-sm"
                :value="filterProdi"
                @change="setFilterProdi"
              />
            </template>
            <template #namaProdi="data">
              <td>
                {{ hexToString(data.item.namaProdi) }}
              </td>
            </template>
            <template #namaJurusan-filter>
              <input
                class="form-control form-control-sm"
                :value="filterJurusan"
                @change="setFilterJurusan"
              />
            </template>
            <template #namaJurusan="data">
              <td>
                {{ hexToString(data.item.namaJurusan) }}
              </td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-center">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton color="info" size="sm">Edit</CButton>
                  </CButtonGroup>
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
        { key: "id", filter: false },
        { key: "namaProdi" },
        { key: "namaJurusan" },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      filterProdi: "",
      filterJurusan: "",
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
  mounted() {
    this.$apollo.queries.prodis.refetch();
  },
  computed: {
    computedItems() {
      return this.prodis;
    },
    filteredItems() {
      if (!this.prodis) return [];
      return this.computedItems.filter((item) => {
        if (!this.filterProdi && !this.filterJurusan)
          return true;
        const prodi = item.namaProdi;
        const jurusan = item.namaJurusan;
        return (
          web3.utils
            .hexToUtf8(prodi)
            .toLowerCase()
            .includes(this.filterProdi.toLowerCase()) &&
          web3.utils
            .hexToUtf8(jurusan)
            .toLowerCase()
            .includes(this.filterJurusan.toLowerCase())
        );
      });
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "prodi/detail/" + `${item.id}` });
    },
    hexToString(str) {
      if(web3.utils.isHexStrict(str))
      return web3.utils.hexToUtf8(str)
    },
    setFilterProdi(e) {
      this.filterProdi = e.target.value;
    },
    setFilterJurusan(e) {
      this.filterJurusan = e.target.value;
    },
  }
};
</script>
