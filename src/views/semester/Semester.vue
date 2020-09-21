<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Semester</CCardHeader>
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
            <template #statusPenilaian="data">
              <td>{{ data.item.statusPenilaian?'BUKA':'TUTUP' }}</td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-left">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton color="info" size="sm">Edit</CButton>
                    <CButton
                      v-if="!data.item.statusPenilaian"
                      color="success"
                      class="mr-3"
                      size="sm"
                      @click="openStatusModal(data.item)"
                    >Buka Penilaian</CButton>
                    <CButton
                      v-if="data.item.statusPenilaian"
                      color="secondary"
                      size="sm"
                      @click="openStatusModal(data.item)"
                    >Tutup Penilaian</CButton>
                  </CButtonGroup>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal
      :show.sync="changeStatusModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Ubah Status Penilaian"
      md="8"
      color="success"
    >
      <CRow>
        <CCol>
          <CInput label="Kelas" horizontal readonly :value="hexToString(selectedSemester.kelas)" />
          <CInput label="Prodi" horizontal readonly :value="hexToString(selectedSemester.prodi)" />
          <CInput label="Semester Ke" horizontal readonly :value="selectedSemester.semesterKe" />
          <CInput label="Status Asal" horizontal readonly :value="selectedSemester.statusPenilaian?'BUKA':'TUTUP'" />
          <CInput label="Status Menjadi" horizontal readonly :value="!selectedSemester.statusPenilaian?'BUKA':'TUTUP'" />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Ubah Status Penilaian</h6>
        <CButtonClose @click="changeStatusModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmChangeStatus(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmChangeStatus(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import AkademikHelper from "@/contracts/AkademikHelper";

export default {
  name: "InfoSemester",
  apollo: {
    semesters: gql`
      query {
        semesters {
          id
          semesterKe
          prodi
          kelas
          statusPenilaian
        }
      }
    `,
  },
  data() {
    return {
      fields: [
        { key: "id", filter: false},
        { key: "semesterKe", label:"Semester", filter: false },
        { key: "prodi" },
        { key: "kelas" },
        { key: "statusPenilaian", label:"Status", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      selectedSemester: { },
      changeStatusModal: false,
      filterKelas: "",
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
    this.$apollo.queries.semesters.refetch();
  },
  computed: {
    computedItems() {
      return this.semesters;
    },
    filteredItems() {
      if (!this.semesters) return []
      return this.computedItems.filter((item) => {
        if (!this.filterKelas && !this.filterProdi)
          return true;
        const kelas = item.kelas;
        const prodi = item.prodi;
        return (
          web3.utils.hexToUtf8(kelas).toLowerCase().includes(this.filterKelas.toLowerCase()) &&
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
      this.$router.push({
        name: "Detail Semester",
        params: { id: item.id },
      });
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
    setFilterKelas(e) {
      this.filterKelas = e.target.value;
    },
    setFilterProdi(e) {
      this.filterProdi = e.target.value;
    },
    changeStatus() {
      const semester = this.selectedSemester;
      const status = !semester.statusPenilaian;
      web3.eth.getAccounts().then((accounts) => {
        AkademikHelper.methods
          .ubahStatusNilaiSemester(semester.id, status)
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error);
          })
          .on("transactionHash", function (transactionHash) {
            console.log(transactionHash);
            this.$apollo.queries.semesters.refetch();
          });
      });
    },
    openStatusModal: function (semester) {
      this.changeStatusModal = true;
      this.selectedSemester = semester;
    },
    confirmChangeStatus: function (confirm) {
      this.changeStatusModal = false;
      if (confirm) {
        this.changeStatus();
      }
    },
  },
};
</script>
