<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Sertifikat Dimiliki</CCardHeader>
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
              <td><CBadge :color="data.item.isSignedByOwner?'success':'danger'">{{ data.item.isSignedByOwner?'SUDAH':'BELUM' }}</CBadge></td>
            </template>
            <template #isPublished="data">
              <td><CBadge :color="data.item.isPublished?'success':'danger'">{{ data.item.isPublished?'SUDAH':'BELUM' }}</CBadge></td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-left">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <CButton
                      v-if="!data.item.isSignedByOwner"
                      color="success"
                      size="sm"
                      @click="openSignModal(data.item.id)"
                    >Tanda Tangani</CButton>
                  </CButtonGroup>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
    <CModal
      :show.sync="signModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Tanda Tangani Sertifikat"
      md="8"
      color="success"
    >
      <CRow class="justify-content-center">
        <CCol>
          <CInput label="IPFS Hash" readonly :value.sync="sertifikatIpfs" />
          <CButton
            v-if="!signData.messageHash&&sertifikatIpfs"
            color="info"
            class="mr-3"
            @click="signMessage"
          >Tanda Tangani</CButton>
          <CButton
            color="success"
            v-if="sertifikatIpfs"
            :href="downloadUrl"
            target="_blank"
          >Download Sertifikat</CButton>
          <CInput
            v-if="signData.messageHash"
            label="Message Hash"
            readonly
            :value.sync="signData.messageHash"
          />
          <CInput
            v-if="signData.signature"
            label="Signature"
            readonly
            :value.sync="signData.signature"
          />
        </CCol>
      </CRow>
      <template #header>
        <h6 class="modal-title">Tandatangani Sertifikat</h6>
        <CButtonClose @click="signModal = false" class="text-white" />
      </template>
      <template #footer>
        <CButton @click="confirmSign(false)" color="danger">Kembali</CButton>
        <CButton v-if="!signData.signature" disabled color="success">Konfirmasi</CButton>
        <CButton v-if="signData.signature" @click="confirmSign(true)" color="success">Konfirmasi</CButton>
      </template>
    </CModal>
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import SertifikatHelper from "@/contracts/SertifikatHelper";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export const GET_CERTIFICATES = gql`
  query sertifikats($id: ID!) {
    sertifikats(where: { owner: $id }) {
      id
      jenis
      signedTimes
      signRequired
      isPublished
      isSignedByOwner
      owner
    }
  }
`;

export default {
  name: "InfoSertifikat",
  data() {
    return {
      fields: [
        { key: "id", filter: false },
        { key: "jenis" },
        { key: "tandaTangan", label: "TTD", filter: false },
        { key: "isSignedByOwner", label: "TTD Pemilik", filter: false },
        { key: "isPublished", label: "Status Rilis", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      selectedSertifikat: null,
      sertifikatIpfs: null,
      signData: {
        messageHash: null,
        signature: null,
      },
      sertifikats: null,
      filterJenis: "",
      signModal: false,
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
    web3.eth.getAccounts().then((accounts) => {
      this.$apollo
        .query({
          query: GET_CERTIFICATES,
          variables: {
            id: accounts[0],
          },
        })
        .then((response) => {
          this.sertifikats = response.data.sertifikats;
        });
    });
  },
  computed: {
    computedItems() {
      return this.sertifikats;
    },
    filteredItems() {
      if (!this.sertifikats) return [];
      return this.computedItems.filter((item) => {
        if (!this.filterJenis) return true;
        const jenis = item.jenis;
        return web3.utils
          .hexToUtf8(jenis)
          .toLowerCase()
          .includes(this.filterJenis.toLowerCase());
      });
    },
    downloadUrl() {
      return "https://gateway.ipfs.io/ipfs/" + this.sertifikatIpfs;
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.push({
        name: "Detail Sertifikat Owned",
        params: { id: item.id },
      });
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
    setFilterJenis(e) {
      this.filterJenis = e.target.value;
    },
    signMessage() {
      const message = this.sertifikatIpfs;
      const messageHash = web3.utils.sha3(message);
      let signData = this.signData;
      web3.eth.getAccounts().then((accounts) => {
        web3.eth.personal.sign(messageHash, accounts[0]).then((result) => {
          signData.messageHash = messageHash;
          signData.signature = result;
        });
      });
    },
    signCertificate() {
      const sertifikat = this.selectedSertifikat;
      const signature = this.signData.signature;
      if (sertifikat && signature) {
        web3.eth.getAccounts().then((accounts) => {
          SertifikatHelper.methods
            .signCertificateByOwner(sertifikat, signature)
            .send({ from: accounts[0] })
            .on("error", function (error, receipt) {
              console.log(error);
            })
            .on("transactionHash", function (hash) {
              console.log(hash);
            });
        });
      }
    },
    openSignModal: function (sertifikat) {
      this.signData.messageHash = null;
      this.signData.signature = null;
      this.sertifikatIpfs = null;
      this.getSertifikatHash(sertifikat);
      this.signModal = true;
      this.selectedSertifikat = sertifikat;
    },
    confirmSign: function (confirm) {
      this.signModal = false;
      if (confirm) {
        this.signCertificate();
      }
    },
    getSertifikatHash: function (id) {
      let context = this;
      web3.eth.getAccounts().then((accounts) => {
        SertifikatHelper.methods
          .getCertificateOfOwner(id)
          .call({ from: accounts[0] })
          .then(function (result) {
            ipfs
              .cat("/ipfs/" + web3.utils.hexToUtf8(result[4]))
              .then((data) => {
                const sertifikat = JSON.parse(data.toString());
                context.sertifikatIpfs = sertifikat.file;
              });
          });
      });
    },
  },
};
</script>
