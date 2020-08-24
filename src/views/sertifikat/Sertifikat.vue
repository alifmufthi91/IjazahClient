<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Sertifikat</CCardHeader>
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
              <input
                class="form-control form-control-sm"
                :value="filterNIM"
                @change="setFilterNIM"
              />
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
              <td>{{ formattedSigners(data.item) }}</td>
            </template>
            <template #isSignedByOwner="data">
              <td><CBadge :color="data.item.isSignedByOwner?'info':'danger'" >{{ data.item.isSignedByOwner?'SUDAH':'BELUM' }}</CBadge></td>
            </template>
            <template #isPublished="data">
              <td><CBadge :color="data.item.isPublished?'info':'danger'"> {{ data.item.isPublished?'SUDAH':'BELUM' }}</CBadge></td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-left">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton color="info" size="sm">Edit</CButton>
                    <CButton
                      v-if="!data.item.isPublished"
                      color="success"
                      class="mr-3"
                      size="sm"
                      @click="openPublishModal(data.item)"
                    >Publish Sertifikat</CButton>
                  </CButtonGroup>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal
      :show.sync="publishModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Publish Sertifikat"
      md="8"
      color="success"
    >
      <CRow>
        <CCol>
          <CInput label="NIM Pemilik" horizontal readonly :value="hexToString(selectedSertifikat.ownerNIM)" />
          <CInput label="Jenis" horizontal readonly :value="hexToString(selectedSertifikat.jenis)" />
          <CInput label="Jumlah TTD" horizontal readonly :value="selectedSertifikat.signedTimes+'/'+selectedSertifikat.signRequired" />
          <CInput label="TTD Pemilik" horizontal readonly :value="selectedSertifikat.isSignedByOwner ?'SUDAH':'BELUM'" />
          <CInput label="Alamat Pemilik" horizontal readonly :value="selectedSertifikat.owner" />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Publish Sertifikat</h6>
        <CButtonClose @click="publishModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmPublish(false)" color="danger">Kembali</CButton>
        <CButton @click="confirmPublish(true)" color="success">Konfirmasi</CButton>
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
        sertifikats {
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
        { key: "id", filter: false},
        { key: "ownerNIM", label:"Pemilik"},
        { key: "jenis" },
        { key: "tandaTangan", label:"TTD", filter: false },
        { key: "isSignedByOwner", label:"TTD Pemilik", filter: false },
        { key: "isPublished", label:"Status Rilis", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      selectedSertifikat: { },
      publishModal: false,
      filterNIM: "",
      filterJenis: "",
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
      if (!this.sertifikats) return []
      return this.computedItems.filter((item) => {
        if (!this.filterNIM && !this.filterJenis)
          return true;
        const nim = item.ownerNIM;
        const jenis = item.jenis;
        return (
          web3.utils.hexToUtf8(nim).toLowerCase().includes(this.filterNIM.toLowerCase()) &&
          web3.utils.hexToUtf8(jenis).toLowerCase().includes(this.filterJenis.toLowerCase())
        );
      });
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
    formattedSigners(item){
      return item.signedTimes+'/'+item.signRequired
    },
    setFilterNIM(e) {
      this.filterNIM = e.target.value;
    },
    setFilterJenis(e) {
      this.filterJenis = e.target.value;
    },
    publishSertifikat() {
      const sertifikat = this.selectedSertifikat;
      web3.eth.getAccounts().then((accounts) => {
        SertifikatHelper.methods
          .publishCertificate(sertifikat.id)
          .send({ from: accounts[0] })
          .on("error", function (error, receipt) {
            console.log(error);
          })
          .on("transactionHash", function (transactionHash) {
            console.log(transactionHash);
            this.$apollo.queries.sertifikats.refetch();
          });
      });
    },
    openPublishModal: function (sertifikat) {
      this.publishModal = true;
      this.selectedSertifikat = sertifikat;
    },
    confirmPublish: function (confirm) {
      this.publishModal = false;
      if (confirm) {
        this.publishSertifikat();
      }
    },
  },
};
</script>
