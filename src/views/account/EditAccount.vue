<template>
  <CRow>
    <CCol col="12">
      <CCard>
          <CCardHeader>
            <strong>Edit Account</strong>
          </CCardHeader>
          <CForm novalidate>
            <CCardBody>
              <CInput
                label="Alamat"
                horizontal
                readonly
                :value.sync="user.address"
              />
              <CInput
                label="Name"
                required
                horizontal
                :placeholder="user.name"
                invalid-feedback="Please provide at between 4-32 characters without symbols."
                :is-valid="validator"
              />
              <CInput
                label="Status"
                horizontal
                readonly
                :value.sync="user.verified"
              />
            </CCardBody>
            <CCardFooter>
              <CButton type="submit" size="sm" color="primary" class="mr-3" @click="confirmModal = true"><CIcon name="cil-check-circle"/> Submit</CButton>
              <CButton type="reset" size="sm" color="danger" @click="goBack"><CIcon name="cil-ban"/> Back</CButton>
            </CCardFooter>
          </CForm>
        </CCard>
    </CCol>
    <CModal
      :show.sync="confirmModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Konfirmasi"
      size="sm"
      color="dark"
    >
      Apakah data telah sesuai?
      <template #header>
        <h6 class="modal-title">Konfirmasi</h6>
        <CButtonClose @click="confirmModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmChange(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmChange(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import AccountManager from "@/contracts/AccountManager";
export default {
  name: "AccountDetail",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      user: {
        name: String(),
        verified: null,
        address: String()
      },
      confirmModal: false
    };
  },
  computed: {
    verified() {
      return this.verified ? "Telah diverifikasi" : "Belum diverifikasi"
    }
  },
  methods: {
    goBack() {
      this.usersOpened ? this.$router.push(this.usersOpened) : this.$router.push('/dashboard')
    },
    validator (val) {
      if(val == null) return false
      var letters = /^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*){0,3}$/gm;
      if(!val.match(letters)) return false
      else return val ? val.length >= 4 && val.length <=32 : false
    },
    updateName() {
      let self = this;
      web3.eth.getAccounts().then(accounts => {
        AccountManager.methods
          .updateAccountName(web3.utils.utf8ToHex(self.user.name))
          .send({ from: accounts[0] })
          .on("error", function(error, receipt) {
            console.log(error);
            self.goBack()
          })
          .on("transactionHash", function(hash) {
            console.log(hash);
            self.goBack()
          })
      })
    },
    confirmChange: function(confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.updateName();
      }
    }
  },
  beforeMount() {
    let self = this;
      web3.eth.getAccounts().then(accounts => {
        AccountManager.methods
          .getAccount(accounts[0])
          .call({ from: accounts[0] })
          .then(function(result) {
            if (result) {
              self.user.address = result[0];
              self.user.name = web3.utils.hexToUtf8(result[2]);
              self.user.verified = result[1] ? "Terverifikasi" : "Belum diverifikasi";
            }
          })
      })
  }
}
</script>
