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
                    color="primary"
                    class="mr-3"
                    size="sm"
                    @click="openConfirmModal(data.item)"
                  >Terima</CButton>
                  <CButton color="success" class="mr-3" size="sm">Edit</CButton>
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
          <CInput label="Alamat" horizontal readonly v-model="selectedUser.id" />
          <CInput label="Name" horizontal readonly v-model="selectedUser.name" />
          <CInput label="Status" horizontal readonly v-model="selectedUser.verified" />
          <CSelect
                label="Select"
                horizontal
                :options="options"
                placeholder="Please select"
                :value.sync=selectedUser.role
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
        accounts(where: { verified: false }) {
          id
          address
          name
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
        { key: "address", label: "Alamat" },
        { key: "role" },
        { key: "verified", label: "Verified" },
        { key: "action", label: "Aksi" }
      ],
      activePage: 1,
      confirmModal: false,
      selectedUser: {
        id: null,
        name: null,
        verified: null
      },
      verify: {
        mahasiswa: AccountManager.methods.verifyMahasiswa,
        dikti: AccountManager.methods.verifyDIKTI,
        civitas: AccountManager.methods.verifyCivitas
      },
      options: [{value:'mahasiswa', label:'Mahasiswa'}, {value:'dikti', label:'Dikti'}, {value:'admin', label:'Admin'}]
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
      }
    },
    verifyAccount: function() {
      let self = this;
      web3.eth.getAccounts().then(accounts => {
        self.verify["civitas"](web3.utils.toHex(self.selectedUser.name))
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
      this.confirmModal = true;
      this.selectedUser = user;
    }
  },
  computed: {
    visibleData() {
      return this.accounts.filter(account => {
        Object.keys(account).forEach(function(attribute) {
          if(web3.utils.isHex(account[attribute])){
            account[attribute] = web3.utils.hexToAscii(account[attribute])
          }
        })
        return account
      })
    }
  }
};
</script>
