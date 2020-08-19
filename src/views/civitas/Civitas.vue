<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Civitas</CCardHeader>
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
              <input class="form-control form-control-sm" :value="filterNip" @change="setFilterId" />
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
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton color="info" size="sm">Edit</CButton>
                    <CButton
                      v-if="!data.item.linkedAccount"
                      color="success"
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
          <CInput label="Name" horizontal readonly :value="hexToString(selectedCivitas.name)" />
          <CInput label="NIP" horizontal readonly :value="hexToString(selectedCivitas.id)" />
          <CSelect
            label="Akun"
            horizontal
            :options="accountOptions"
            :value.sync="selectedCivitas.address"
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
          <CInput label="Name" horizontal readonly :value="hexToString(selectedCivitas.name)" />
          <CInput label="NIP" horizontal readonly :value="hexToString(selectedCivitas.id)" />
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
  query accounts($nomorInduk: Bytes!) {
    accounts(where: { nomorInduk: $nomorInduk }) {
      id
      name
    }
  }
`;

export default {
  name: "InfoCivitas",
  apollo: {
    civitas: gql`
      query {
        civitas {
          id
          name
          linkedAccount{
            id
          }
        }
      }
    `,
  },
  data() {
    return {
      fields: [
        { key: "id", label: "NIP" },
        { key: "name" },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      selectedCivitas: {
        id: String(),
        name: String(),
        address: String(),
      },
      linkModal: false,
      unlinkModal: false,
      accountOptions: [],
      filterNip: "",
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
      },
    },
  },
  mounted() {
    console.log("test");
    this.$apollo.queries.civitas.refetch();
  },
  computed: {
    computedItems() {
      return this.civitas;
    },
    filteredItems() {
      if (!this.civitas) return [];
      return this.computedItems.filter((item) => {
        if (!this.filterNip && !this.filterNama) return true;
        const id = item.id;
        const nama = item.name;
        return (
          web3.utils
            .hexToUtf8(id)
            .toLowerCase()
            .includes(this.filterNip.toLowerCase()) &&
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
      this.$router.replace({ path: "civitas/" + `${item.id}` });
    },
    setFilterId(e) {
      console.log(e.target.value);
      this.filterNip = e.target.value;
    },
    setFilterNama(e) {
      console.log(e.target.value);
      this.filterNama = e.target.value;
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
    linkCivitas() {
      console.log(this.selectedCivitas);
      let civitas = this.selectedCivitas;
      web3.eth.getAccounts().then((accounts) => {
        CivitasHelper.methods
          .linkCivitasAccount(civitas.address, civitas.id)
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error);
          })
          .on("receipt", function (receipt) {
            console.log(receipt.contractAddress);
          });
      });
    },
    unlinkCivitas() {
      console.log(this.selectedCivitas);
      let civitas = this.selectedCivitas;
      web3.eth.getAccounts().then((accounts) => {
        CivitasHelper.methods
          .unlinkCivitasAccount(civitas.linkedAccount.id)
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error);
          })
          .on("receipt", function (receipt) {
            console.log(receipt.contractAddress);
          });
      });
    },
    openLinkModal: function (civitas) {
      this.linkModal = true;
      this.selectedCivitas = civitas;
      this.getAccountById();
    },
    openUnlinkModal: function (civitas) {
      this.unlinkModal = true;
      this.selectedCivitas = civitas;
    },
    confirmLink: function (confirm) {
      console.log(confirm);
      this.linkModal = false;
      if (confirm) {
        this.linkCivitas();
      }
    },
    confirmUnlink: function (confirm) {
      console.log(confirm);
      this.unlinkModal = false;
      if (confirm) {
        this.unlinkCivitas();
      }
    },
    getAccountById() {
      this.accountOptions = [];
      console.log(this.selectedCivitas);
      this.$apollo
        .query({
          query: GET_ACCOUNTS,
          variables: {
            nomorInduk: this.selectedCivitas.id,
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
