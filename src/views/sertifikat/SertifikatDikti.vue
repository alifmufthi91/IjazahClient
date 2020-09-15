<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Antrian Nomor Ijazah</CCardHeader>
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
            <template #ownerNIM-filter>
              <input class="form-control form-control-sm" :value="filterNIM" @change="setFilterNIM" />
            </template>
            <template #ownerNIM="data">
              <td>{{ hexToString(data.item.ownerNIM) }}</td>
            </template>
            <template #jenis-filter>
              <input
                class="form-control form-control-sm"
                :value="filterJenis"
                @change="setFilterJenis"
              />
            </template>
            <template #jenis="data">
              <td>{{ hexToString(data.item.jenis) }}</td>
            </template>
            <template #tandaTangan="data">
              <td>{{ data.item.signedTimes+'/'+data.item.signRequired }}</td>
            </template>
            <template #isSignedByOwner="data">
              <td>{{ data.item.isSignedByOwner?'SUDAH':'BELUM' }}</td>
            </template>
            <template #isPublished="data">
              <td>{{ data.item.isPublished?'SUDAH':'BELUM' }}</td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-left">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton
                      v-if="!data.item.isPublished"
                      color="success"
                      class="mr-3"
                      size="sm"
                      @click="openPenomoranModal(data.item)"
                    >Beri No Ijazah</CButton>
                  </CButtonGroup>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal
      :show.sync="penomoranModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Penomoran Ijazah"
      size="lg"
      color="success"
    >
      <CRow>
        <CCol>
          <CInput label="NIM Pemilik" readonly :value="hexToString(selectedSertifikat.ownerNIM)" />
        </CCol>
      </CRow>
      <h5>Nomor Ijazah</h5>
      <CRow>
        <CCol sm="3">
          <CInput
            label="Kode Prodi"
            maxlength="5"
            :value.sync="nomorIjazah.kodeProdi"
            :is-valid="validator(nomorIjazah.kodeProdi,5)"
          />
        </CCol>
        <CCol sm="3">
          <CInput
            label="Tahun Lulus"
            maxlength="4"
            :value.sync="nomorIjazah.tahunLulus"
            :is-valid="validator(nomorIjazah.tahunLulus,4)"
          />
        </CCol>
        <CCol sm="3">
          <CInput
            label="Nomor Urut"
            maxlength="5"
            :value.sync="nomorIjazah.noUrut"
            :is-valid="validator(nomorIjazah.noUrut,5)"
          />
        </CCol>
        <CCol sm="3">
          <CInput
            label="Check Digit"
            maxlength="1"
            :value.sync="nomorIjazah.checkDigit"
            :is-valid="validator(nomorIjazah.checkDigit,1)"
          />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Penomoran Ijazah</h6>
        <CButtonClose @click="penomoranModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmPenomoran(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmPenomoran(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import SertifikatHelper from "@/contracts/SertifikatHelper";

export default {
  name: "InfoSertifikat",
  apollo: {
    sertifikats: gql`
      query {
        sertifikats(
          where: { jenis_contains: "0x696a617a6168", nomorIjazah: null }
        ) {
          id
          ownerNIM
          jenis
          signedTimes
          signRequired
          isPublished
          isSignedByOwner
          owner
        }
      }
    `,
  },
  data() {
    return {
      fields: [
        { key: "id", filter: false },
        { key: "ownerNIM", label: "NIM Pemilik" },
        { key: "jenis" },
        { key: "tandaTangan", label: "TTD", filter: false },
        { key: "isSignedByOwner", label: "TTD Pemilik", filter: false },
        { key: "isPublished", label: "Status Rilis", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      selectedSertifikat: {},
      penomoranModal: false,
      filterNIM: "",
      filterJenis: "",
      nomorIjazah: {
        kodeProdi: String(),
        tahunLulus: String(),
        noUrut: String(),
        checkDigit: String(),
      },
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
    this.$apollo.queries.sertifikats.refetch();
  },
  computed: {
    computedItems() {
      return this.sertifikats;
    },
    filteredItems() {
      if (!this.sertifikats) return [];
      return this.computedItems.filter((item) => {
        if (!this.filterNIM && !this.filterJenis) return true;
        const nim = item.ownerNIM;
        const jenis = item.jenis;
        return (
          web3.utils
            .hexToUtf8(nim)
            .toLowerCase()
            .includes(this.filterNIM.toLowerCase()) &&
          web3.utils
            .hexToUtf8(jenis)
            .toLowerCase()
            .includes(this.filterJenis.toLowerCase())
        );
      });
    },
    computedNomorIjazah() {
      const nomorIjazah = this.nomorIjazah;
      return (
        nomorIjazah.kodeProdi +
        nomorIjazah.tahunLulus +
        nomorIjazah.noUrut +
        nomorIjazah.checkDigit
      );
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.push({ path: "sertifikat/detail/" + `${item.id}` });
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
    setFilterNIM(e) {
      this.filterNIM = e.target.value;
    },
    setFilterJenis(e) {
      this.filterJenis = e.target.value;
    },
    isDataReady() {
      let isReady = true;
      return (
        this.validator(this.nomorIjazah.kodeProdi, 5) &&
        this.validator(this.nomorIjazah.tahunLulus, 4) &&
        this.validator(this.nomorIjazah.noUrut, 5) &&
        this.validator(this.nomorIjazah.checkDigit, 1)
      );
    },
    validator(val, size) {
      if (val == null) return false;
      var letters = /^[0-9]*$/gm;
      if (!val.match(letters)) return false;
      else return val ? val.length == size : false;
    },
    penomoranIjazah() {
      const sertifikat = this.selectedSertifikat;
      const nomorIjazah = this.computedNomorIjazah;
      if (this.isDataReady()) {
        web3.eth.getAccounts().then((accounts) => {
          SertifikatHelper.methods
            .penomoranIjazah(sertifikat.id, web3.utils.utf8ToHex(nomorIjazah))
            .send({ from: accounts[0] })
            .on("error", function (error, receipt) {
              console.log(error);
            })
            .on("transactionHash", function (transactionHash) {
              console.log(transactionHash);
              this.$apollo.queries.sertifikats.refetch();
            });
        });
      }else{
        alert("Input tidak valid");
      }
    },
    openPenomoranModal: function (sertifikat) {
      this.penomoranModal = true;
      this.selectedSertifikat = sertifikat;
    },
    confirmPenomoran: function (confirm) {
      this.penomoranModal = false;
      if (confirm) {
        this.penomoranIjazah()
      }
    },
  },
};
</script>
