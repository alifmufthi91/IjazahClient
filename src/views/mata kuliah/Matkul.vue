<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Mata Kuliah</CCardHeader>
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
          <template #namaMatkul-filter>
              <input
                class="form-control form-control-sm"
                :value="filterNama"
                @change="setFilterNama"
              />
            </template>
          <template #namaMatkul="data">
              <td>
                {{ hexToString(data.item.namaMatkul) }}
              </td>
            </template>
            <template #timeCreated="data">
              <td>
                {{ timestampToDate(data.item.timeCreated) }}
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
        { key: "id", filter: false },
        { key: "namaMatkul" },
        { key: "timeCreated", label:"Waktu Dibuat", filter: false},
        { key: "action", label: "Aksi", sorter: false, filter: false }
      ],
      activePage: 1,
      filterNama: "",
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
  mounted() {
    this.$apollo.queries.mataKuliahs.refetch();
  },
  computed: {
    computedItems() {
      return this.mataKuliahs;
    },
    filteredItems() {
      if (!this.mataKuliahs) return [];
      return this.computedItems.filter((item) => {
        if (
          !this.filterNama
        )
          return true;
        const nama = item.namaMatkul;
        return (
          web3.utils
            .hexToUtf8(nama)
            .toLowerCase()
            .includes(this.filterNama.toLowerCase())
        );
      });
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "matkul/detail/" + `${item.id}` });
    },
    hexToString(str) {
      if(web3.utils.isHexStrict(str))
      return web3.utils.hexToUtf8(str)
    },
    setFilterNama(e) {
      this.filterNama = e.target.value;
    },
    timestampToDate(time) {
      return new Date(time * 1000)
    }
  }
};
</script>
