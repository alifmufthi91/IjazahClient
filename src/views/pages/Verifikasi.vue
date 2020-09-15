<template>
  <div class="c-app d-flex align-items-top min-vh-100 pt-5">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="12">
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>{{dismissMsg}}</CAlert>
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>Verifikasi Sertifikat</h1>
                <p
                  class="text-muted"
                >Verifikasi sertifikat dengan tanda tangan yang telah diberikan.</p>
                <CRow>
                  <CCol sm="8">
                    <CInputFile
                      label="Pilih File Sertifikat"
                      placeholder="Pilih File Sertifikat..."
                      :accept="documentFormat"
                      @change="previewSertifikat"
                    />
                  </CCol>
                  <CCol sm="4">
                    <CButton color="success" v-if="fileHash" :href="fileUrl" target="_blank">Lihat</CButton>
                  </CCol>
                </CRow>
                <CInputFile
                  label="Pilih File Signature Pemilik"
                  placeholder="Pilih File Owner Signature..."
                  :accept="signFormat"
                  @change="previewSignOwner"
                />
                <CRow class="justify-content-center">
                  <template v-for="(input, index) in signatures">
                    <div class="d-flex" :key="index" style="width:100%">
                      <CContainer fluid>
                        <CRow class="mx-auto">
                          <CCard style="width:100%">
                            <CCardHeader>
                              Signature #{{index + 1}}
                              <div class="card-header-actions">
                                <CLink
                                  href="#"
                                  class="card-header-action btn-close"
                                  v-on:click="deleteSignature(index)"
                                >
                                  <CIcon name="cil-x-circle" />
                                </CLink>
                              </div>
                            </CCardHeader>
                            <CCardBody>
                              <CForm>
                                <CRow class="justify-content-center">
                                  <CCol sm="8">
                                    <CInputFile
                                      label="Pilih File Signature"
                                      placeholder="Pilih File Sertifikat..."
                                      :accept="signFormat"
                                      @change="previewSign($event, index)"
                                    />
                                  </CCol>
                                  <CCol sm="3">
                                    <CButton
                                      v-if="isSignatureValid[index] && isOwnerSignValid && fileHash"
                                      color="primary"
                                      @click="verifySigner(index)"
                                    >Verifikasi</CButton>
                                  </CCol>
                                </CRow>
                                <CCol>
                                  <CInput
                                    label="Address Signer"
                                    :value.sync="recoveredSignAddress[index]"
                                    disabled
                                  />
                                  <CInput
                                    v-if="subgraphSignData[index]"
                                    label="ID Signature"
                                    :value.sync="subgraphSignData[index].id"
                                    disabled
                                  />
                                  <CRow>
                                    <CCol sm="4">
                                      <CInput
                                        v-if="subgraphSignData[index]"
                                        label="Role"
                                        :value="hexToString(subgraphSignData[index].role)"
                                        disabled
                                      />
                                    </CCol>
                                    <CCol sm="4">
                                      <CInput
                                        v-if="subgraphSignData[index]"
                                        label="Time Assigned"
                                        :value="unixToDate(subgraphSignData[index].timeAssigned)"
                                        disabled
                                      />
                                    </CCol>
                                    <CCol sm="4">
                                      <CInput
                                        v-if="subgraphSignData[index]"
                                        label="Time Signed"
                                        :value="unixToDate(subgraphSignData[index].timeSigned)"
                                        disabled
                                      />
                                    </CCol>
                                  </CRow>
                                </CCol>
                              </CForm>
                            </CCardBody>
                          </CCard>
                        </CRow>
                      </CContainer>
                    </div>
                  </template>
                </CRow>
                <CButton color="success" @click="addSignature">Tambah Signature</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import gql from "graphql-tag";
import SertifikatHelper from "@/contracts/SertifikatHelper";

export const GET_SIGNATURE = gql`
  query signature($id: ID!) {
    signature(id: $id) {
      id
      idCertificate
      signer
      role
      timeAssigned
      timeSigned
    }
  }
`;

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "VerifikasiSertifikat",
  data() {
    return {
      fileHash: null,
      signatures: [],
      ownerSignature: {
        certificateId: null,
        sign: null,
      },
      recoveredSignAddress: [],
      isOwnerSignValid: false,
      isSignatureValid: [],
      dismissFail: 0,
      dismissMsg: "",
      subgraphSignData: [],
    };
  },
  methods: {
    hexToString(str) {
      return web3.utils.hexToUtf8(web3.utils.isHexStrict(str) ? str : 0);
    },
    unixToDate(unix) {
      const date = new Date(unix * 1000);
      return date.toString();
    },
    previewSign(event, index) {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        const parsedResult = JSON.parse(event.target.result);
        if (parsedResult.sign && parsedResult.certificateId) {
          this.isSignatureValid[index] = true;
          this.signatures[index] = parsedResult;
          this.$forceUpdate();
        } else {
          this.isSignatureValid[index] = false;
        }
        if (!this.isSignatureValid[index]) {
          this.dismissMsg = "Signature " + (index + 1) + " Tidak Valid";
          this.dismissFail = 5;
        }
      });
      reader.readAsText(event[0]);
    },
    previewSignOwner(event) {
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        const parsedResult = JSON.parse(event.target.result);
        if (parsedResult.sign && parsedResult.certificateId) {
          this.isOwnerSignValid = true;
          this.ownerSignature = parsedResult;
          this.$forceUpdate();
        } else {
          this.isOwnerSignValid = false;
        }
        if (!this.isOwnerSignValid) {
          this.dismissMsg = "Signature Owner Tidak Valid";
          this.dismissFail = 5;
        }
      });
      reader.readAsText(event[0]);
    },
    previewSertifikat(event) {
      ipfs.add(event[0]).then((ipfsHash) => {
        this.fileHash = ipfsHash[0].hash;
        this.$forceUpdate();
      });
    },
    addSignature() {
      this.isSignatureValid.push(false);
      this.recoveredSignAddress.push(null);
      this.subgraphSignData.push(null);
      this.signatures.push({
        certificateId: null,
        sign: null,
        role: null,
      });
    },
    deleteSignature(index) {
      this.isSignatureValid.splice(index, 1);
      this.signatures.splice(index, 1);
      this.recoveredSignAddress.splice(index, 1);
      this.subgraphSignData.splice(index, 1);
    },
    verifySigner(index) {
      if (this.isDataReady(index)) {
        const signature = this.signatures[index];
        const fileHash = this.fileHash;
        let context = this;
        const ownerSignature = this.ownerSignature;
        web3.eth.getAccounts().then((accounts) => {
          SertifikatHelper.methods
            .verifyCertificate(
              ownerSignature.certificateId,
              ownerSignature.sign,
              signature.sign,
              signature.role,
              web3.utils.sha3(fileHash)
            )
            .call({ from: accounts[0] })
            .then(function (result) {
              if (result) {
                context.recoveredSignAddress[index] = result;
                context.$forceUpdate();
                context.$apollo
                  .query({
                    query: GET_SIGNATURE,
                    variables: {
                      id:
                        web3.utils.toHex(ownerSignature.certificateId) +
                        "-" +
                        context.recoveredSignAddress[index].toLowerCase(),
                    },
                  })
                  .then((response) => {
                    context.subgraphSignData[index] = response.data.signature;
                    context.$forceUpdate();
                  });
              }
            });
        });
      } else {
        alert("Input tidak valid");
      }
    },
    isDataReady(index) {
      if (
        !this.fileHash ||
        !this.signatures[index].sign ||
        !this.ownerSignature.sign
      )
        return false;
      return true;
    },
  },
  computed: {
    documentFormat() {
      return "application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.presentationml.slideshow";
    },
    signFormat() {
      return "application/json";
    },
    fileUrl() {
      const gateway = "https://gateway.ipfs.io/ipfs/" + this.fileHash;
      return gateway;
    },
  },
};
</script>
