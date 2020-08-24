<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Daftar Tanda Tangan Pribadi</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="signatures"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            sorter
            @page-change="pageChange"
          >
            <template #role="data">
              <td>{{ hexToString(data.item.role) }}</td>
            </template>
            <template #timeAssigned="data">
              <td>{{ unixToDate(data.item.timeAssigned) }}</td>
            </template>
            <template #status="data">
              <td>
                <CBadge
                  :color="data.item.timeSigned?'success':'danger'"
                >{{ data.item.timeSigned?"Sudah":"Belum" }}</CBadge>
              </td>
            </template>
            <template #timeSigned="data">
              <td>{{ data.item.timeSigned?unixToDate(data.item.timeSigned):'not signed yet' }}</td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-center">
                  <CButtonGroup>
                    <CButton v-if="!data.item.timeSigned" color="success" size="sm" @click="openSignModal(data.item.idCertificate, data.item.role)">Tanda Tangan</CButton>
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
        <h6 class="modal-title">Publish Sertifikat</h6>
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

export const GET_SIGNATURES = gql`
  query signatures($id: ID!) {
    signatures(where: { signer: $id }) {
      id
      idCertificate
      signer
      role
      timeAssigned
      timeSigned
    }
  }
`;

export default {
  name: "InfoSignatureCivitas",
  data() {
    return {
      signatures: null,
      fields: [
        { key: "idCertificate", _style: "width:5%" },
        { key: "role" },
        { key: "timeAssigned" },
        { key: "status" },
        { key: "timeSigned" },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      selectedSertifikat: null,
      selectedRole: null,
      sertifikatIpfs: null,
      signData: {
        messageHash: null,
        signature: null,
      },
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
          query: GET_SIGNATURES,
          variables: {
            id: accounts[0],
          },
        })
        .then((response) => {
          this.signatures = response.data.signatures;
        });
    });
  },
  computed:{
    downloadUrl() {
      return "https://gateway.ipfs.io/ipfs/" + this.sertifikatIpfs;
    },
  },
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.push({ path: "signature/detail/" + `${item.id}` });
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
    unixToDate(unix) {
      const date = new Date(unix * 1000)
      return date.toString();
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
      const role = this.selectedRole;
      if (sertifikat && signature) {
        web3.eth.getAccounts().then((accounts) => {
          SertifikatHelper.methods
            .signCertificate(sertifikat, role, signature)
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
    openSignModal: function (sertifikat, role) {
      this.signData.messageHash = null;
      this.signData.signature = null;
      this.sertifikatIpfs = null;
      this.getSertifikatHash(sertifikat, role);
      this.signModal = true;
      this.selectedRole = role;
      this.selectedSertifikat = sertifikat;
    },
    confirmSign: function (confirm) {
      this.signModal = false;
      if (confirm) {
        this.signCertificate();
      }
    },
    getSertifikatHash: function (id,role) {
      let context = this;
      web3.eth.getAccounts().then((accounts) => {
        SertifikatHelper.methods
          .getCertificateOfSigner(id,role)
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
