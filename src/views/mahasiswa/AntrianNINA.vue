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
            <template #isAssignedNINA="data">
              <td>
                <CBadge
                  :color="data.item.isAssignedNINA?'info':'warning'"
                >{{ data.item.isAssignedNINA?'Sudah':'Menunggu' }}</CBadge>
              </td>
            </template>
            <template #isUpdatedNINAData="data">
              <td>
                <CBadge
                  :color="data.item.isUpdatedNINAData?'success':'danger'"
                >{{ data.item.isUpdatedNINAData?'Updated':'Menunggu' }}</CBadge>
              </td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-center">
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
    <!-- <CModal
      :show.sync="updateModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Update Nomor Ijazah"
      size="lg"
      color="success"
    >
      <CRow>
        <CCol sm="4">
          <CInput label="Nama" readonly :value.sync="mahasiswaIpfs.nama" />
        </CCol>
        <CCol sm="4">
          <CInput label="NIM" readonly :value.sync="mahasiswaIpfs.nim" />
        </CCol>
        <CCol sm="4">
          <CInput label="Jenis Kelamin" readonly :value.sync="mahasiswaIpfs.jenisKelamin" />
        </CCol>
        <CCol sm="4">
          <CInput label="Tempat Lahir" readonly :value.sync="mahasiswaIpfs.tempatLahir" />
        </CCol>
        <CCol sm="4">
          <CInput label="Tanggal Lahir" readonly :value.sync="mahasiswaIpfs.tanggalLahir" />
        </CCol>
        <CCol sm="4">
          <CInput label="NIK" readonly :value.sync="mahasiswaIpfs.nik" />
        </CCol>
        <CCol sm="4">
          <CInput label="Prodi" readonly :value.sync="mahasiswaIpfs.prodi" />
        </CCol>
        <CCol sm="4">
          <CInput label="No. Telepon" readonly :value.sync="mahasiswaIpfs.noTelp" />
        </CCol>
        <CCol sm="4">
          <CInput label="Email" readonly :value.sync="mahasiswaIpfs.email" />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Update Data ke IPFS</h6>
        <CButtonClose @click="lulusModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmLulus(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmLulus(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal> -->
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import CivitasHelper from "@/contracts/CivitasHelper";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "InfoMahasiswa",
  apollo: {
    mahasiswas: gql`
      query {
        mahasiswas(
          where: { isLulus: true }
          orderBy: isAssignedNINA
          orderDirection: desc
        ) {
          id
          name
          prodi
          isLulus
          isAssignedNINA
          isUpdatedNINAData
        }
      }
    `,
  },
  data() {
    return {
      fields: [
        { key: "id", label: "NIM" },
        { key: "name", label: "Nama" },
        { key: "prodi" },
        { key: "isAssignedNINA", label: "Status NINA", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      filterNim: "",
      filterNama: "",
      filterProdi: "",
      updateModal: false,
      selectedMhs: {
        name: String(),
        id: String(),
      },
      mahasiswaIpfs: {
        nama: String(),
        nim: String(),
        nik: String(),
        jenisKelamin: String(),
        tempatLahir: String(),
        tanggalLahir: String(),
        prodi: String(),
        noTelp: String(),
        email: String(),
        foto: String(),
      },
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
      if (!this.mahasiswas) return [];
      return this.computedItems.filter((item) => {
        if (!this.filterNim && !this.filterNama && !this.filterProdi)
          return true;
        const id = item.id;
        const nama = item.name;
        const prodi = item.prodi;
        return (
          web3.utils
            .hexToUtf8(id)
            .toLowerCase()
            .includes(this.filterNim.toLowerCase()) &&
          web3.utils
            .hexToUtf8(nama)
            .toLowerCase()
            .includes(this.filterNama.toLowerCase()) &&
          web3.utils
            .hexToUtf8(prodi)
            .toLowerCase()
            .includes(this.filterProdi.toLowerCase())
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
    // luluskanMahasiswa() {
    //   console.log(this.selectedMhs);
    //   let mahasiswa = this.selectedMhs;
    //   web3.eth.getAccounts().then((accounts) => {
    //     CivitasHelper.methods
    //       .setMahasiswaLulus(mahasiswa.id, true)
    //       .send({ from: accounts[0] })
    //       .on("error", function (error, receipt) {
    //         console.log(error);
    //       })
    //       .on("transactionHash", function (transactionHash) {
    //         console.log(transactionHash.contractAddress);
    //       });
    //   });
    // },
    // getMahasiswaData(mahasiswa) {
    //   let context = this;
    //   web3.eth.getAccounts().then((accounts) => {
    //     CivitasHelper.methods
    //       .getMahasiswa(mahasiswa.id)
    //       .call({ from: accounts[0] })
    //       .then(function (result) {
    //         ipfs
    //           .cat("/ipfs/" + web3.utils.hexToUtf8(result[1]))
    //           .then((data) => {
    //             context.mahasiswaIpfs = JSON.parse(data.toString());
    //             console.log(context.mahasiswaIpfs);
    //           });
    //       });
    //   });
    // },
    // openUpdateModal: function (mahasiswa) {
    //   this.updateModal = true;
    //   this.selectedMhs = mahasiswa;
    //   console.log(mahasiswa);
    //   this.getMahasiswaData(this.selectedMhs);
    // },
    // confirmLulus: function (confirm) {
    //   console.log(confirm);
    //   this.lulusModal = false;
    //   if (confirm) {
    //     this.luluskanMahasiswa();
    //   }
    // },
  },
};
</script>
