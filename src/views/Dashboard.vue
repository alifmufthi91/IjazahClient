<template>
  <div class="c-app flex-row">
    <CContainer>
      <CRow>
        <CCol md="6">
          <CCard accent-color="primary" class="text-center">
            <CCardHeader class="h4">Akun Pengguna</CCardHeader>
            <CCardBody>
              <CRow class="justify-content-center">
                <CCard v-if="user.address">
                  <CCardBody>
                    <CCol sm="12">
                      <div>
                        <h4>{{user.name}}</h4>
                      </div>
                      <div class="small text-muted">
                        <span>
                          <template v-if="user.verified">Terverifikasi</template>
                        </span>
                        | Alamat : {{user.address}}
                      </div>
                    </CCol>
                  </CCardBody>
                </CCard>
              </CRow>
              <CButton color="success" to="edit-account"><CIcon name="cil-pencil"/> Edit</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import MainChartExample from "./charts/MainChartExample";
import WidgetsDropdown from "./widgets/WidgetsDropdown";
import WidgetsBrand from "./widgets/WidgetsBrand";
import AccountManager from "@/contracts/AccountManager";

export default {
  name: "Home",
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand
  },
  data() {
    return {
      homeTitle: "Aplikasi Penerbitan dan Verifikasi Ijazah Digital",
      user: {
        name: null,
        verified: null,
        address: null
      }
    };
  },
  methods: {
    getAccount() {
      let self = this;
      web3.eth.getAccounts().then(accounts => {
        AccountManager.methods
          .getAccount(accounts[0])
          .call({ from: accounts[0] })
          .then(function(result) {
            console.log("Result is : " + result[0]);
            if (result) {
              self.user.address = result[0];
              self.user.name = web3.utils.hexToAscii(result[2]);
              self.user.verified = result[1];
              self.isRegistered = true;
            }
          });
      });
    }
  },
  beforeMount() {
    this.getAccount();
  }
};
</script>
