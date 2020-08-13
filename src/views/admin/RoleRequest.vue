<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>{{ $options.name }}</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="this.accounts"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
            <template #name="data">
              <td class="font-weight-bold">{{ hexToString(data.item.name) }}</td>
            </template>
            <template #role="data">
              <td>{{ hexToString(data.item.role) }}</td>
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
                  <CButton
                    color="success"
                    class="mr-3"
                    size="sm"
                    @click="openConfirmModal(data.item)"
                  >Terima</CButton>
                  <CButton color="danger" class="mr-3" size="sm">Tolak</CButton>
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
          <CInput label="No. Induk" horizontal readonly :value="hexToString(selectedUser.nomorInduk)" />
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
        { key: "verified", label: "Verified" },
        { key: "action", label: "Aksi" },
      ],
      activePage: 1,
      confirmModal: false,
      selectedUser: {
        id: String(),
        name: String(),
        verified: null,
        role: String(),
        givenRole: String()
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
        }
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
  computed: {
    jenisVerify(){
      console.log('role :'+this.selectedUser.givenRole)
      switch(this.selectedUser.givenRole){
        case "mahasiswa": return "mahasiswa";
        case "dikti": return "dikti";
        default: return "civitas";
      }
    }
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
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "account/" + `${item.id}` });
    },
    confirmVerify: function (confirm) {
      console.log(confirm);
      this.confirmModal = false;
      if (confirm) {
        this.verifyAccount();
        console.log(this.selectedUser);
      }
    },
    verifyAccount: function () {
      let self = this;
      web3.eth.getAccounts().then((accounts) => {
        self.verify[self.jenisVerify](
          self.selectedUser.id,
          self.selectedUser.nomorInduk,
          web3.utils.utf8ToHex(self.selectedUser.givenRole),
          accounts[0]
        )
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error);
            self.goBack();
          })
          .on("receipt", function (receipt) {
            console.log(receipt.contractAddress);
            self.goBack();
          });
      });
    },
    openConfirmModal: function (user) {
      this.confirmModal = true;
      this.selectedUser = user;
    },
    hexToString(str) {
      if(web3.utils.isHexStrict(str))
      return web3.utils.hexToUtf8(str);
    },
  },
};
</script>
