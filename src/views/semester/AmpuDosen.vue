<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Perkuliahan Semester Ini</CCardHeader>
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
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-left">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton
                      v-if="data.item.semester?data.item.semester.statusPenilaian:false"
                      color="success"
                      size="sm"
                      @click="penilaianClicked(data.item)"
                    >Penilaian</CButton>
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

export const GET_AMPU = gql`
  query ampus($id: ID!, $kalendar: String) {
    ampus(where: { dosen: $id, kalendar: $kalendar }) {
      id
      dosen {
        id
      }
      matkul {
        id
      }
      namaMatkul
      semester {
        id
        statusPenilaian
      }
      kalendar {
        id
      }
      prodi
      kelas
    }
  }
`;

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
  data() {
    return {
      fields: [
        { key: "id", filter: false },
        { key: "namaMatkul" },
        { key: "prodi" },
        { key: "kelas" },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      ampus: null,
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
  mounted() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      AkademikHelper.methods
        .activeKalendarAkademik()
        .call({ from: accounts[0] })
        .then(function (kalendar) {
          CivitasHelper.methods
            .getNIPCivitas(accounts[0])
            .call({ from: accounts[0] })
            .then(function (result) {
              context.$apollo
                .query({
                  query: GET_DOSEN,
                  variables: {
                    nip: result,
                  },
                })
                .then((response) => {
                  context.$apollo
                    .query({
                      query: GET_AMPU,
                      variables: {
                        id: response.data.dosens[0].id,
                        kalendar: kalendar,
                      },
                    })
                    .then((response) => {
                      context.ampus = response.data.ampus;
                    });
                });
            });
        });
    });
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
      this.$router.push({
        name: "Detail Ampu",
        params: { id: item.id },
      });
    },
    penilaianClicked(item) {
      this.$router.push({
        name: "Penilaian Ampu",
        params: { id: item.id },
      });
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
