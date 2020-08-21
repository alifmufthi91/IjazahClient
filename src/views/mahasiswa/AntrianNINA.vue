<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Antrian Nomor Ijazah</CCardHeader>
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
            <template #id-filter>
              <input class="form-control form-control-sm" :value="filterNim" @change="setFilterId" />
            </template>
            <template #id="data">
              <td>{{ hexToString(data.item.id) }}</td>
            </template>
            <template #name-filter>
              <input
                class="form-control form-control-sm"
                :value="filterNama"
                @change="setFilterNama"
              />
            </template>
            <template #name="data">
              <td>{{ hexToString(data.item.name) }}</td>
            </template>
            <template #prodi-filter>
              <input
                class="form-control form-control-sm"
                :value="filterProdi"
                @change="setFilterProdi"
              />
            </template>
            <template #prodi="data">
              <td>{{ hexToString(data.item.prodi) }}</td>
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
  name: "InfoMahasiswa",
  apollo: {
    mahasiswas: gql`
      query {
        mahasiswas {
          id
          name
          prodi
          isLulus
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
        { key: "isLulus",label: "Status Kelulusan", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      filterNim: "",
      filterNama: "",
      filterProdi: "",
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
    this.$apollo.queries.mahasiswas.refetch();
  },
  computed: {
    computedItems() {
      return this.mahasiswas;
    },
    filteredItems() {
      if (!this.mahasiswas) return []
      return this.computedItems.filter((item) => {
        if (!this.filterNim && !this.filterNama && !this.filterProdi)
          return true;
        const id = item.id;
        const nama = item.name;
        const prodi = item.prodi;
        return (
          web3.utils.hexToUtf8(id).toLowerCase().includes(this.filterNim.toLowerCase()) &&
          web3.utils.hexToUtf8(nama).toLowerCase().includes(this.filterNama.toLowerCase()) &&
          web3.utils.hexToUtf8(prodi).toLowerCase().includes(this.filterProdi.toLowerCase())
        );
      });
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
      if(web3.utils.isHexStrict(str))
      return web3.utils.hexToUtf8(str);
    },
    setFilterId(e) {
      console.log(e.target.value);
      this.filterNim = e.target.value;
    },
    setFilterNama(e) {
      console.log(e.target.value);
      this.filterNama = e.target.value;
    },
    setFilterProdi(e) {
      console.log(e.target.value);
      this.filterProdi = e.target.value;
    },
  },
};
</script>
