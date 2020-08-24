<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Daftar Ampu</CCardHeader>
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
                :value="filterMatkul"
                @change="setFilterMatkul"
              />
            </template>
            <template #namaMatkul="data">
              <td>{{ hexToString(data.item.namaMatkul) }}</td>
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
            <template #kelas-filter>
              <input
                class="form-control form-control-sm"
                :value="filterKelas"
                @change="setFilterKelas"
              />
            </template>
            <template #kelas="data">
              <td>{{ hexToString(data.item.kelas) }}</td>
            </template>
            <template #idDosen="data">
              <td>{{ data.item.dosen.id }}</td>
            </template>
            <template #idSemester="data">
              <td>{{ data.item.semester.id }}</td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-left">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
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
import AkademikHelper from "@/contracts/AkademikHelper";
import CivitasHelper from "@/contracts/CivitasHelper";


export const GET_DOSEN = gql`
  query dosens($nip: ID!) {
    dosens(where: { nip: $nip }, first: 1) {
      id
      nip
    }
  }
`;

export default {
  name: "InfoAmpu",
  apollo: {
    ampus: gql`
      query {
        ampus {
          id
          dosen{
            id
          }
          matkul{
            id
          }
          namaMatkul
          semester{
            id
          }
          prodi
          kelas
        }
      }
    `,
  },
  data() {
    return {
      fields: [
        { key: "id", filter: false },
        { key: "namaMatkul" },
        { key: "prodi" },
        { key: "kelas" },
        { key: "idDosen", filter: false },
        { key: "idSemester", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      filterMatkul: "",
      filterProdi: "",
      filterKelas: "",
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
  computed: {
    computedItems() {
      return this.ampus;
    },
    filteredItems() {
      if (!this.ampus) return [];
      return this.computedItems.filter((item) => {
        if (!this.filterMatkul && !this.filterProdi && !this.filterKelas)
          return true;
        const matkul = item.namaMatkul;
        const prodi = item.prodi;
        const kelas = item.kelas;
        return (
          web3.utils
            .hexToUtf8(matkul)
            .toLowerCase()
            .includes(this.filterMatkul.toLowerCase()) &&
          web3.utils
            .hexToUtf8(prodi)
            .toLowerCase()
            .includes(this.filterProdi.toLowerCase()) &&
          web3.utils
            .hexToUtf8(kelas)
            .toLowerCase()
            .includes(this.filterKelas.toLowerCase())
        );
      });
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.push({ path: "ampu/detail/" + `${item.id}` });
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
    setFilterMatkul(e) {
      this.filterMatkul = e.target.value;
    },
    setFilterProdi(e) {
      this.filterProdi = e.target.value;
    },
    setFilterKelas(e) {
      this.filterKelas = e.target.value;
    },
  },
};
</script>
