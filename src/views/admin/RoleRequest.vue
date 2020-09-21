<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>{{ $options.name }}</CCardHeader>
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
              <input
                class="form-control form-control-sm"
                :value="filterAlamat"
                @change="setFilterAlamat"
              />
            </template>
            <template #name-filter>
              <input
                class="form-control form-control-sm"
                :value="filterNama"
                @change="setFilterNama"
              />
            </template>
            <template #name="data">
              <td class="font-weight-bold">{{ hexToString(data.item.name) }}</td>
            </template>
            <template #role-filter>
              <input
                class="form-control form-control-sm"
                :value="filterRole"
                @change="setFilterRole"
              />
            </template>
            <template #role="data">
              <td>{{ hexToString(data.item.role) }}</td>
            </template>
            <template #nomorInduk-filter>
              <input
                class="form-control form-control-sm"
                :value="filterNomorId"
                @change="setFilterNI"
              />
            </template>
            <template #nomorInduk="data">
              <td>{{ hexToString(data.item.nomorInduk) }}</td>
            </template>
            <template #verified="data">
              <td>
                <CBadge :color="getBadge(data.item.verified)">{{ getVerified(data.item.verified) }}</CBadge>
              </td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-center">
                  <CButtonGroup>
                  <CButton
                    color="success"
                    size="sm"
                    @click="openConfirmModal(data.item)"
                  >Terima</CButton>
                  <CButton color="danger" size="sm">Tolak</CButton>
                  </CButtonGroup>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal
      :show.sync="confirmModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Konfirmasi"
      md="8"
      color="success"
    >
      <CRow>
        <CCol>
          <CInput label="Alamat" horizontal readonly :value="selectedUser.id" />
          <CInput label="Name" horizontal readonly :value="hexToString(selectedUser.name)" />
          <CInput label="Status" horizontal readonly :value="getVerified(selectedUser.verified)" />
          <CInput
            label="No. Induk"
            horizontal
            readonly
            :value="hexToString(selectedUser.nomorInduk)"
          />
          <CInput label="Role Diminta" horizontal readonly :value="hexToString(selectedUser.role)" />
          <CSelect
            label="Role"
            horizontal
            :options="selectOptions"
            :value.sync="selectedUser.givenRole"
            placeholder="Please select"
          />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Konfirmasi</h6>
        <CButtonClose @click="confirmModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmVerify(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmVerify(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import AccountManager from "@/contracts/AccountManager";

export default {
  name: "RoleRequest",
  apollo: {
    accounts: gql`
      query {
        accounts(where: { verified: false, isDeleted: false }, orderBy: name) {
          id
          name
          nomorInduk
          verified
          role
        }
      }
    `,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name" },
        { key: "id", label: "Alamat" },
        { key: "role" },
        { key: "nomorInduk", label: "Nomor Induk" },
        { key: "verified", label: "Verified", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      filterNama: "",
      filterAlamat: "",
      filterRole: "",
      filterNomorId: "",
      confirmModal: false,
      selectedUser: {
        id: String(),
        name: String(),
        verified: null,
        role: String(),
        givenRole: String(),
      },
      verify: {
        mahasiswa: AccountManager.methods.verifyMahasiswa,
        dikti: AccountManager.methods.verifyDIKTI,
        civitas: AccountManager.methods.verifyCivitas,
      },
      selectOptions: [
        {
          value: "mahasiswa",
          label: "Mahasiswa",
        },
        {
          value: "admin",
          label: "Admin",
        },
        {
          value: "dosen",
          label: "Dosen",
        },
        {
          value: "dikti",
          label: "Dikti",
        },
        {
          value: "pd2",
          label: "PD II",
        },
        {
          value: "rektor",
          label: "Rektor",
        },
        {
          value: "kajur",
          label: "Kepala Jurusan",
        },
      ],
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
    this.$apollo.queries.accounts.refetch();
  },
  computed: {
    jenisVerify() {
      switch (this.selectedUser.givenRole) {
        case "mahasiswa":
          return "mahasiswa";
        case "dikti":
          return "dikti";
        default:
          return "civitas";
      }
    },
    computedItems() {
      return this.accounts;
    },
    filteredItems() {
      if (!this.accounts) return [];
      return this.computedItems.filter((item) => {
        if (!this.filterNama && !this.filterAlamat && !this.filterRole && !this.filterNomorId)
          return true;
        const nama = item.name;
        const alamat = item.id;
        const role = item.role;
        const nomorId = item.nomorInduk;
        return (
          web3.utils
            .hexToUtf8(nama)
            .toLowerCase()
            .includes(this.filterNama.toLowerCase()) &&
          alamat
            .toLowerCase()
            .includes(this.filterAlamat.toLowerCase()) &&
          web3.utils
            .hexToUtf8(role)
            .toLowerCase()
            .includes(this.filterRole.toLowerCase()) &&
          web3.utils
            .hexToUtf8(nomorId)
            .toLowerCase()
            .includes(this.filterNomorId.toLowerCase())
        );
      });
    },
  },
  methods: {
    getBadge(status) {
      if (status) return "success";
      return "warning";
    },
    getVerified(status) {
      if (status) return "Terverifikasi";
      return "Belum Diverifikasi";
    },
    setFilterNama(e) {
      this.filterNama = e.target.value;
    },
    setFilterAlamat(e) {
      this.filterAlamat = e.target.value;
    },
    setFilterRole(e) {
      this.filterRole = e.target.value;
    },
    setFilterNI(e) {
      this.filterNomorId = e.target.value;
    },
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.push({
        name: "Account",
        params: { id: item.id },
      });
    },
    confirmVerify: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.verifyAccount();
      }
    },
    verifyAccount: function () {
      let self = this;
      web3.eth.getAccounts().then((accounts) => {
        if (self.selectedUser.givenRole == "mahasiswa") {
          self.verify[self.jenisVerify](
            self.selectedUser.id,
            web3.utils.utf8ToHex(web3.utils.hexToUtf8(self.selectedUser.nomorInduk)),
            accounts[0]
          )
            .send({ from: accounts[0] })
            .on("error", function (error, receipt) {
              console.log(error);
            })
            .on("transactionHash", function (hash) {
              console.log(hash);
            });
        } else if(self.selectedUser.givenRole == "dikti"){
          self.verify[self.jenisVerify](
            self.selectedUser.id
          )
            .send({ from: accounts[0] })
            .on("error", function (error, receipt) {
              console.log(error);
            })
            .on("transactionHash", function (hash) {
              console.log(hash);
            });
        } else {
          self.verify[self.jenisVerify](
            self.selectedUser.id,
            web3.utils.utf8ToHex(web3.utils.hexToUtf8(self.selectedUser.nomorInduk)),
            web3.utils.utf8ToHex(self.selectedUser.givenRole),
            accounts[0]
          )
            .send({ from: accounts[0] })
            .on("error", function (error, receipt) {
              console.log(error);
            })
            .on("transactionHash", function (hash) {
              console.log(hash);
            });
        }
      });
    },
    openConfirmModal: function (user) {
      this.confirmModal = true;
      this.selectedUser = user;
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
  },
};
</script>
