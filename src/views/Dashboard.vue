<template>
  <div class="c-app flex-row">
    <CContainer>
      <CRow>
        <CCol md="12">
          <CCard>
            <CCardHeader @click="cardCollapse = !cardCollapse" class="btn text-left">
              <strong>Selamat Datang</strong>
            </CCardHeader>
            <CCollapse :show="cardCollapse">
              <CCardBody class="m-1">
                <CJumbotron color="light">
                  <h1 class="display-5">Ijazah Digital</h1>
                  <p
                    class="lead"
                  >Selamat Datang di Aplikasi Penerbitan dan Verifikasi Ijazah Digital</p>
                </CJumbotron>
              </CCardBody>
            </CCollapse>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol md="6">
          <CCard accent-color="primary" class="text-center">
            <CCardHeader class="h4">Akun Pengguna</CCardHeader>
            <CCardBody>
              <CRow class="justify-content-center">
                <CCard :show="user.address">
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
              <CButton color="success" to="edit-account">
                <CIcon name="cil-pencil" />Edit
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md="6">
          <CCard accent-color="primary" class="text-center">
            <CCardHeader class="h4">Kalendar Akademik</CCardHeader>
            <CCardBody>
              <CRow class="justify-content-center">
                <CCard :show="calendar.tahunAjar">
                  <CCardBody>
                    <CCol sm="12">
                      <div>
                        <h5>Tahun Ajar :</h5>
                        <p>{{calendar.tahunAjar}}</p>
                      </div>
                      <div>
                        <h5>Semester :</h5>
                        <p>{{semester}}</p>
                      </div>
                    </CCol>
                  </CCardBody>
                </CCard>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import AccountManager from "@/contracts/AccountManager";
import AkademikHelper from "@/contracts/AkademikHelper";

export default {
  name: "Home",
  data() {
    return {
      homeTitle: "Aplikasi Penerbitan dan Verifikasi Ijazah Digital",
      user: {
        name: null,
        verified: null,
        address: null,
      },
      calendar: {
        tahunAjar: null,
        ganjil: null,
      },
      cardCollapse: true,
    };
  },
  methods: {
    getAccount(accounts) {
      let user = this.user;
      AccountManager.methods
        .getAccount(accounts[0])
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            user.address = result[0];
            user.name = web3.utils.hexToUtf8(result[2]);
            user.verified = result[1];
            user.isRegistered = true;
          }
        });
    },
    getCurrentCalendar(accounts) {
      let calendar = this.calendar;
      AkademikHelper.methods
        .activeKalendarAkademik()
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            AkademikHelper.methods
              .getKalendarAkademik(result)
              .call({ from: accounts[0] })
              .then(function (result) {
                calendar.tahunAjar = web3.utils.hexToUtf8(result[0]);
                calendar.ganjil = result[1];
                console.log(calendar);
              });
          }
        });
    },
  },
  computed: {
    semester() {
      if (this.calendar.ganjil == null) return '';
      return this.calendar.ganjil ? "Ganjil" : "Genap";
    },
  },
  beforeMount() {
    web3.eth.getAccounts().then((accounts) => {
      if(accounts.length < 1) return false
      this.getAccount(accounts);
      this.getCurrentCalendar(accounts);
    });
  },
};
</script>
