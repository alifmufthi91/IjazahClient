<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCard accent-color="primary" class="text-center">
            <CCardHeader class="h3">{{homeTitle}}</CCardHeader>
            <CCardBody>
              <CRow class="justify-content-center">
                <CCard v-if="isRegistered">
                  <CCardBody>
                    <CCol sm="12">
                      <div>
                        <h4>{{user.name}}</h4>
                      </div>
                      <div class="small text-muted">
                        <span>
                          <template v-if="user.verified">Terverifikasi</template>
                          <template v-else>Belum diverifikasi</template>
                        </span>
                        | Alamat : {{user.address}}
                      </div>
                    </CCol>
                    <CRow class="align-items-center mt-2" v-if="user.verified">
                      <CCol sm="12">
                        <CButton color="primary" shape="pill" to="/dashboard">Masuk</CButton>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
                <CCard v-if="!isRegistered">
                  <CCardBody>
                    <CCol sm="12">
                      <div>
                        <h4>Kamu belum membuat akun.</h4>
                      </div>
                    </CCol>
                  </CCardBody>
                </CCard>
              </CRow>
              <div v-show="!isRegistered">
                <CRow>
                  <CCol sm="12">
                    <small
                      class="h4"
                    >Silahkan untuk mendaftar terlebih dahulu untuk menggunakan aplikasi.</small>
                  </CCol>
                </CRow>
                <CRow class="align-items-center mt-3">
                  <CCol sm="6" class="mb-3 mb-xl-0 text-center">
                    <CButton color="success" shape="pill" to="verifikasi">Verifikasi Sertifikat</CButton>
                  </CCol>
                  <CCol sm="6" class="mb-3 mb-xl-0 text-center">
                    <CButton
                      color="info"
                      shape="pill"
                      to="register-civitas"
                    >Mendaftar sebagai Civitas Polban</CButton>
                  </CCol>
                </CRow>
                <CRow class="align-items-r mt-2">
                  <CCol sm="6" class="mb-3 mb-xl-0 text-center"></CCol>
                  <CCol sm="6" class="mb-3 mb-xl-0 text-center">
                    <CButton color="info" shape="pill" to="register-DIKTI">Mendaftar sebagai DIKTI</CButton>
                  </CCol>
                </CRow>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import AccountManager from "@/contracts/AccountManager";
import AppVue from "../App.vue";

export default {
  name: "Home",
  data() {
    return {
      isRegistered: false,
      homeTitle: "Aplikasi Penerbitan dan Verifikasi Ijazah Digital",
      user: {
        name: null,
        verified: null,
        address: null,
      },
    };
  },
  methods: {
    getAccount() {
      let self = this;
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length < 1) return false;
        AccountManager.methods
          .getAccount(accounts[0])
          .call({ from: accounts[0] })
          .then(function (result) {
            if (result[0] != 0) {
              self.user.address = result[0];
              self.user.name = web3.utils.hexToUtf8(result[2]);
              self.user.verified = result[1];
              self.isRegistered = true;
            }
          });
      });
    },
  },
  beforeMount() {
    this.getAccount();
  },
};
</script>
