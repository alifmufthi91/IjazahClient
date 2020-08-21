<template>
  <CRow>
    <CCol col="12">
      <CCard>
        <CCardHeader>Semester Detail</CCardHeader>
        <CCardBody>
          <h5>Data On-Chain</h5>
          <CDataTable striped small fixed :items="dataContract" :fields="fields" />
          <h5>Daftar Mata Kuliah (IPFS)</h5>
          <CDataTable striped small fixed :items="dataAmpu" :fields="ampuFields">
            <template #dosen="data">
              <td>  
                <CCol class="mb-3 mb-xl-0 text-center">
                  <template v-for="(input, indexDosen) in data.item.dosenList">
                    <CButton
                      :key="indexDosen"
                      color="primary"
                      size="sm"
                      @click="detailClicked(data.item)"
                    >{{indexDosen}}</CButton>
                  </template>
                </CCol>
              </td>
            </template>
          </CDataTable>
          <h5>Data Off-Chain (Subgraph)</h5>
          <CDataTable striped small fixed :items="dataSubgraph" :fields="fields" />
          <h5>Data Off-Chain (IPFS)</h5>
          <CDataTable striped small fixed :items="dataIpfs" :fields="fields" />
        </CCardBody>
        <CCardFooter>
          <CButton color="primary" @click="goBack">Back</CButton>
        </CCardFooter>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import gql from "graphql-tag";
import AkademikHelper from "@/contracts/AkademikHelper";

export const GET_SEMESTER = gql`
  query semester($id: ID!) {
    semester(id: $id) {
      id
      semesterKe
      prodi
      kelas
      KalendarAkademik
      statusPenilaian
      timeCreated
      lastUpdated
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
  name: "SemesterDetail",
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.usersOpened = from.fullPath;
    });
  },
  data() {
    return {
      usersOpened: null,
      dataSubgraph: null,
      semesterData: {
        semesterKe: null,
        ipfsHash: String(),
        KalendarAkademik: null,
        totalSKS: null,
      },
      semesterIpfs: null,
      dataContract: null,
      dataIpfs: null,
      dataAmpu: null,
    };
  },
  computed: {
    fields() {
      return [
        {
          key: "key",
          label: "Informasi",
          _classes: "font-weight-bold text-capitalize",
          _style: "width:25%",
        },
        { key: "value", label: "Nilai" },
      ];
    },
    ampuFields() {
      return [
        {
          key: "matkul",
          label: "ID Mata Kuliah",
          _classes: "font-weight-bold text-capitalize",
          _style: "width:25%",
        },
        { key: "sks", label: "SKS" },
        { key: "dosen", label: "List ID Dosen On-Chain" }
      ];
    },
    semesterDataSubgraph() {
      const semesterDetails = this.semester
        ? Object.entries(this.semester)
        : [["id", "Not found"]];
      return semesterDetails.map(([key, value]) => {
        return { key, value };
      });
    },
    semesterDataOnChain() {
      const semester = this.semesterData
        ? Object.entries(this.semesterData)
        : [["id", "Not found"]];
      return semester.map(([key, value]) => {
        return { key, value };
      });
    },
    semesterDataIpfs() {
      const semesterIpfs = this.semesterIpfs
        ? Object.entries(this.semesterIpfs)
        : [["id", "Not found"]];
      return semesterIpfs.map(([key, value]) => {
        return { key, value };
      });
    },
    visibleDataSubgraph() {
      return this.semesterDataSubgraph.filter((param) => {
        if (param.key == "timeCreated" || param.key == "lastUpdated") {
          param.value = new Date(param.value * 1000);
          return param;
        }
        if (web3.utils.isHexStrict(param.value)) {
          param.value = web3.utils.hexToUtf8(param.value);
        }
        if (param.value == null || param.key == "__typename") {
          return null;
        }
        return param;
      });
    },
    visibleDataIpfs() {
      return this.semesterDataIpfs.filter((param) => {
        if (param.key == "ampu") {
          return null;
        }
        return param;
      });
    },
    visibleDataAmpu() {
      this.semesterIpfs.ampu.forEach((ampu) => {
        ampu.dosenList = ampu.dosen.toString();
      });
      return this.semesterIpfs.ampu;
    },
  },
  methods: {
    goBack() {
      this.usersOpened
        ? this.$router.push(this.usersOpened)
        : this.$router.push("/dashboard");
    },
    detailClicked(item) {
      this.$router.push({
        name: "Detail Ampu",
        params: { id: item.matkul },
      });
    },
  },
  beforeMount() {
    let context = this;
    web3.eth.getAccounts().then((accounts) => {
      AkademikHelper.methods
        .getSemester(this.$route.params.id)
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            context.semesterData.semesterKe = result[0];
            context.semesterData.ipfsHash = web3.utils.hexToUtf8(result[1]);
            context.semesterData.KalendarAkademik = result[2];
            context.semesterData.totalSKS = result[3];
            context.dataContract = context.semesterDataOnChain;
            ipfs.cat("/ipfs/" + context.semesterData.ipfsHash).then((data) => {
              context.semesterIpfs = JSON.parse(data.toString());
              context.dataIpfs = context.visibleDataIpfs;
              console.log(context.visibleDataAmpu);
              context.dataAmpu = context.visibleDataAmpu;
            });
          }
        });
    });
    this.$apollo
      .query({
        query: GET_SEMESTER,
        variables: {
          id: this.$route.params.id,
        },
      })
      .then((response) => {
        this.semester = response.data.semester;
        this.dataSubgraph = this.visibleDataSubgraph;
      });
  },
};
</script>
