<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Mahasiswa</CCardHeader>
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
                <CCol class="mb-3 mb-xl-0 text-left">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton color="info" size="sm">Edit</CButton>
                    <CButton
                      v-if="!data.item.linkedAccount"
                      color="success"
                      class="mr-3"
                      size="sm"
                      @click="openLinkModal(data.item)"
                    >Link Akun</CButton>
                    <CButton
                      v-if="data.item.linkedAccount"
                      color="secondary"
                      size="sm"
                      @click="openUnlinkModal(data.item)"
                    >Unlink Akun</CButton>
                  </CButtonGroup>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal
      :show.sync="linkModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Link Akun"
      md="8"
      color="success"
    >
      <CRow>
        <CCol>
          <CInput label="Name" horizontal readonly :value="hexToString(selectedMhs.name)" />
          <CInput label="NIM" horizontal readonly :value="hexToString(selectedMhs.id)" />
          <CSelect
            label="Akun"
            horizontal
            :options="accountOptions"
            :value.sync="selectedMhs.address"
            placeholder="Pilih Akun"
          />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Link Akun</h6>
        <CButtonClose @click="linkModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmLink(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmLink(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
    <CModal
      :show.sync="unlinkModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Unlink Akun"
      md="8"
      color="success"
    >
      <CRow>
        <CCol>
          <CInput label="Name" horizontal readonly :value="hexToString(selectedMhs.name)" />
          <CInput label="NIM" horizontal readonly :value="hexToString(selectedMhs.id)" />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Unlink Akun</h6>
        <CButtonClose @click="unlinkModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmUnlink(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmUnlink(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import CivitasHelper from "@/contracts/CivitasHelper";

export const GET_ACCOUNTS = gql`
  query accounts($nomorInduk: Bytes) {
    accounts(where: { nomorInduk_contains: $nomorInduk }) {
      id
      name
    }
  }
`;

export default {
  name: "InfoMahasiswa",
  apollo: {
    mahasiswas: gql`
      query {
        mahasiswas {
          id
          name
          prodi
          linkedAccount {
            id
          }
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
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      selectedMhs: {
        id: String(),
        name: String(),
        address: String(),
      },
      linkModal: false,
      unlinkModal: false,
      accountOptions: [],
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
      this.$router.replace({ path: "mahasiswa/detail/" + `${item.id}` });
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
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
    linkMahasiswa() {
      console.log(this.selectedMhs);
      let mahasiswa = this.selectedMhs;
      web3.eth.getAccounts().then((accounts) => {
        CivitasHelper.methods
          .linkMahasiswaAccount(mahasiswa.address, mahasiswa.id)
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error);
          })
          .on("receipt", function (receipt) {
            console.log(receipt.contractAddress);
          });
      });
    },
    unlinkMahasiswa() {
      console.log(this.selectedMhs);
      let mahasiswa = this.selectedMhs;
      web3.eth.getAccounts().then((accounts) => {
        CivitasHelper.methods
          .unlinkMahasiswaAccount(mahasiswa.linkedAccount.id)
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error);
          })
          .on("receipt", function (receipt) {
            console.log(receipt.contractAddress);
          });
      });
    },
    openLinkModal: function (mahasiswa) {
      this.linkModal = true;
      this.selectedMhs = mahasiswa;
      console.log(mahasiswa);
      this.getAccountById();
    },
    openUnlinkModal: function (mahasiswa) {
      this.unlinkModal = true;
      this.selectedMhs = mahasiswa;
      console.log(mahasiswa);
    },
    confirmLink: function (confirm) {
      console.log(confirm);
      this.linkModal = false;
      if (confirm) {
        this.linkMahasiswa();
      }
    },
    confirmUnlink: function (confirm) {
      console.log(confirm);
      this.unlinkModal = false;
      if (confirm) {
        this.unlinkMahasiswa();
      }
    },
    getAccountById() {
      this.accountOptions = [];
      console.log(this.selectedMhs.id);
      this.$apollo
        .query({
          query: GET_ACCOUNTS,
          variables: {
            nomorInduk: this.selectedMhs.id,
          },
        })
        .then((response) => {
          console.log(response);
          response.data.accounts.forEach((account) => {
            this.accountOptions.push({
              label:
                web3.utils.hexToUtf8(account.name) + " (" + account.id + ")",
              value: account.id,
            });
          });
        });
    },
  },
};
</script>
