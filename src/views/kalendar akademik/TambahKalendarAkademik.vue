<template>
  <div class="d-flex min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CAlert
            :show.sync="dismissSuccess"
            closeButton
            color="success"
            fade
          >Kalendar Akademik berhasil ditambahkan.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="12">
          <CCard class="mx-4 mb-5">
            <CCardBody class="p-4">
              <CForm>
                <h2 class="mb-3">Tambah Kalendar Akademik</h2>
                <CRow>
                  <CCol sm="8">
                    <CSelect
                      label="Tahun Ajar"
                      :options="getTahunOptions"
                      placeholder="Pilih Tahun Ajar"
                      :value.sync="kalendarAkademik.tahunAjar"
                      required
                    />
                    <CSelect
                      label="Semester"
                      :options="semesterOptions"
                      placeholder="Pilih Semester"
                      :value.sync="kalendarAkademik.ganjil"
                      required
                    />
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow class="justify-content-center">
                <CCol sm="4">
                  <CButton color="danger" block @click="goBack">Kembali</CButton>
                </CCol>
                <CCol sm="4">
                  <CButton color="success" block @click="confirmModal = true">Tambah Kalendar</CButton>
                </CCol>
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
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
        <CButton @click="confirmRegister(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmRegister(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import AkademikHelper from "@/contracts/AkademikHelper";

export default {
  name: "TambahKalendarAkademik",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      semesterOptions: [
        {
          label: "Ganjil",
          value: true,
        },
        {
          label: "Genap",
          value: false,
        },
      ],
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      kalendarAkademik: {
        tahunAjar: String(),
        ganjil: null,
      },
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    createKalendarAkademik: function () {
      web3.eth.getAccounts().then((accounts) => {
        return AkademikHelper.methods
          .createKalendarAkademik(
            web3.utils.utf8ToHex(this.kalendarAkademik.tahunAjar),
            this.kalendarAkademik.ganjil
          )
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error)
          })
          .on("transactionHash", function (transactionHash) {
            console.log(transactionHash)
          });
      });
    },
    confirmRegister: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.createKalendarAkademik();
      }
    },
    showAlert: function (isSuccess) {
      if (isSuccess) {
        this.dismissSuccess = 5;
      } else {
        this.dismissFail = 5;
      }
    },
  },
  computed: {
    getTahunOptions() {
      let yearsArray = [];
      let currYear;
      let lastYear;
      for (let i = 0; i < 100; i++) {
        currYear = new Date().getFullYear() + i;
        lastYear = new Date().getFullYear() + i - 1;
        yearsArray.push(lastYear.toString() + "/" + currYear.toString());
      }
      return yearsArray;
    },
  },
};
</script>
