<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Daftar Antrian Kelulusan</CCardHeader>
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
            <template #isLulus="data">
              <td><CBadge :color="data.item.isLulus?'success':'danger'">{{ data.item.isLulus?'Lulus':'Belum' }}</CBadge></td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-left">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton
                      color="success"
                      class="mr-3"
                      size="sm"
                      @click="openLulusModal(data.item)"
                    >Luluskan</CButton>
                  </CButtonGroup>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal
      :show.sync="lulusModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Luluskan Mahasiswa"
      md="8"
      color="success"
    >
      <CRow>
        <CCol>
          <CInput label="Name" horizontal readonly :value="hexToString(selectedMhs.name)" />
          <CInput label="NIM" horizontal readonly :value="hexToString(selectedMhs.id)" />
          <CInput label="SKS Dibutuhkan" horizontal :value.sync="reqSKS" />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Luluskan Mahasiswa</h6>
        <CButtonClose @click="lulusModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmLulus(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmLulus(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import SertifikatHelper from "@/contracts/SertifikatHelper";


export default {
  name: "PelulusanMahasiswa",
  apollo: {
    mahasiswas: gql`
      query {
        mahasiswas(where:{isLulus:false}){
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
        { key: "id", label: "NIM" },
        { key: "name" },
        { key: "prodi" },
        { key: "isLulus",label: "Status Kelulusan", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      selectedMhs: {
        id: String(),
        name: String()
      },
      lulusModal: false,
      filterNim: "",
      filterNama: "",
      filterProdi: "",
      reqSKS:Number()
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
      this.$router.push({
        name: "Detail Mahasiswa",
        params: { id: item.id },
      });
    },
    editClicked(item) {
      this.$router.push({
        name: "Edit Mahasiswa",
        params: { id: item.id },
      });
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
    setFilterId(e) {
      this.filterNim = e.target.value;
    },
    setFilterNama(e) {
      this.filterNama = e.target.value;
    },
    setFilterProdi(e) {
      this.filterProdi = e.target.value;
    },
    luluskanMahasiswa() {
      let mahasiswa = this.selectedMhs;
      let req = this.reqSKS;
      web3.eth.getAccounts().then((accounts) => {
        SertifikatHelper.methods
          .setMahasiswaLulus(mahasiswa.id, true, req)
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error);
          })
          .on("transactionHash", function (transactionHash) {
            console.log(transactionHash.contractAddress);
          });
      });
    },
    openLulusModal: function (mahasiswa) {
      this.lulusModal = true;
      this.selectedMhs = mahasiswa;
    },
    confirmLulus: function (confirm) {
      this.lulusModal = false;
      if (confirm) {
        this.luluskanMahasiswa();
      }
    },
  },
};
</script>
