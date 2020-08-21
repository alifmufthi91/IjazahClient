<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Kalendar Akademik</CCardHeader>
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
            <template #tahunAjar-filter>
              <input
                class="form-control form-control-sm"
                :value="filterTahun"
                @change="setFilterTahun"
              />
            </template>
            <template #tahunAjar="data">
              <td>{{ hexToString(data.item.tahunAjar) }}</td>
            </template>
            <template #semester="data">
              <td>{{ semester(data.item) }}</td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-left">
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
    `,
  },
  data() {
    return {
      fields: [
        { key: "id", filter: false },
        { key: "tahunAjar" },
        { key: "semester", filter: false },
        { key: "action", label: "Aksi", filter: false, sorter: false },
      ],
      activePage: 1,
      filterTahun: "",
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
    this.$apollo.queries.kalendarAkademiks.refetch();
  },
  computed: {
    computedItems() {
      return this.kalendarAkademiks;
    },
    filteredItems() {
      if (!this.kalendarAkademiks) return [];
      return this.computedItems.filter((item) => {
        if (!this.filterTahun) return true;
        const tahun = item.tahunAjar;
        return web3.utils
          .hexToUtf8(tahun)
          .toLowerCase()
          .includes(this.filterTahun.toLowerCase());
      });
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "kalendar-akademik/detail/" + `${item.id}` });
    },
    semester(val) {
      return val.ganjil ? "Ganjil" : "Genap";
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
    setFilterTahun(e) {
      this.filterTahun = e.target.value;
    },
  },
};
</script>
