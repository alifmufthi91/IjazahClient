<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>{{ $options.name }}</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="visibleData"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
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
      size="sm"
      color="success"
    >
      <CRow>
        <CCol>
          <CInput label="Alamat" horizontal readonly :value="selectedUser.id" />
          <CInput label="Name" horizontal readonly :value="selectedUser.name" />
          <CInput label="Status" horizontal readonly :value="getVerified(selectedUser.verified)" />
          <CSelect
                label="Role"
                horizontal
                :options="selectOptions"
                :value.sync="selectedUser.role"
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
        accounts(where: { verified: false , isDeleted:false }, orderBy:name) {
          id
          name
          nomorInduk
          verified
          role
        }
      }
    `
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name", _classes: "font-weight-bold" },
        { key: "id", label: "Alamat" },
        { key: "role" },
        { key: "nomorInduk", label: "Nomor Induk"},
        { key: "verified", label: "Verified" },
        { key: "action", label: "Aksi" }
      ],
      activePage: 1,
      confirmModal: false,
      selectedUser: {
        id: String(),
        name: String(),
        verified: null,
        role: String()
      },
      verify: {
        mahasiswa: AccountManager.methods.verifyMahasiswa,
        dikti: AccountManager.methods.verifyDIKTI,
        civitas: AccountManager.methods.verifyCivitas
      },
      selectOptions: [
        { 
          value: 'mahasiswa', 
          label: 'Mahasiswa'
        }, 
        { 
          value: 'admin', 
          label: 'Admin'
        }, 
        { 
          value: 'dosen', 
          label: 'Dosen'
        },
        { 
          value: 'dikti', 
          label: 'Dikti'
        }
      ]
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
    confirmVerify: function(confirm) {
      console.log(confirm);
      this.confirmModal = false;
      if (confirm) {
        this.verifyAccount();
        console.log(this.selectedUser)
      }
    },
    verifyAccount: function() {
      let self = this;
      web3.eth.getAccounts().then(accounts => {
        self.verify["civitas"](
          self.selectedUser.id,
          web3.utils.utf8ToHex(self.selectedUser.nomorInduk),
          web3.utils.utf8ToHex(self.selectedUser.role),
          accounts[0]
          )
          .send({ from: accounts[0] })
          .on("error", function(error, receipt) {
            console.log(error);
            self.goBack();
          })
          .on("receipt", function(receipt) {
            console.log(receipt.contractAddress);
            self.goBack();
          });
      });
    },
    openConfirmModal: function(user) {
      this.confirmModal = true
      this.selectedUser = user
    }
  },
  computed: {
    visibleData() {
      if(this.accounts == null) return null
      return this.accounts.filter(account => {
        let akun = account
        Object.keys(account).forEach(function(attribute) {
          if(account[attribute] != "" && attribute != "id" && web3.utils.isHex(account[attribute]) && account[attribute].startsWith('0x')){
            console.log(account[attribute])
            akun[attribute] = web3.utils.hexToUtf8(account[attribute])
          }
        })
        return akun
      })
    }
  }
};
</script>
