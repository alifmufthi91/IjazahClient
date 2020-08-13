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
          >Semester berhasil ditambahkan.</CAlert>
          <CAlert :show.sync="dismissFail" closeButton color="danger" fade>
            <strong>Permintaan Gagal</strong>
            : {{dismissFail}}
          </CAlert>
        </CCol>
        <CCol md="12" :show="ready">
          <CCard class="mx-4 mb-5">
            <CCardBody class="p-4">
              <CForm>
                <h2 class="mb-3">Tambah Semester</h2>
                <CRow>
                  <CCol sm="8">
                    <CInput label="Tahun Ajar" disabled :value="calendar.tahunAjar" />
                    <CInput label="Semester" disabled :value="getSemester(this.calendar.ganjil)" />
                    <CSelect
                      label="Prodi"
                      :options="prodiOptions"
                      placeholder="Pilih Prodi"
                      :value.sync="semester.prodi"
                      @update:value="updateJurusan"
                      :is-valid="inputValidator(this.semester.prodi)"
                      required
                    />
                    <CInput label="Jurusan" disabled :value.sync="semester.jurusan" />
                    <CRow>
                      <CCol sm="8">
                        <CInput
                          label="Kelas"
                          :value.sync="semester.kelas"
                          placeholder="cth. 1A"
                          :is-valid="validator"
                          invalid-feedback="Data tidak boleh kosong."
                        />
                      </CCol>
                      <CCol sm="4">
                        <CSelect
                          label="Semester"
                          :options="semesterKeOptions"
                          :value.sync="semester.semesterKe"
                          placeholder="Semester Ke"
                          :is-valid="inputValidator(this.semester.semesterKe)"
                        />
                      </CCol>
                    </CRow>
                    <h3 class="mb-3">Perkuliahan</h3>
                    <template v-for="(input, indexMatkul) in listMatkul">
                      <div :key="indexMatkul" class="justify-content-center">
                        <CCard>
                          <CCardHeader>
                            Mata Kuliah #{{indexMatkul + 1}}
                            <div class="card-header-actions">
                              <CLink
                                href="#"
                                class="card-header-action btn-close"
                                v-on:click="deleteMatkul(indexMatkul)"
                              >
                                <CIcon name="cil-x-circle" />
                              </CLink>
                            </div>
                          </CCardHeader>
                          <CCardBody>
                            <CForm>
                              <CRow>
                                <CCol md="6">
                                  <CSelect
                                    :options="matkulOptions"
                                    placeholder="Pilih Mata Kuliah"
                                    required
                                    :value.sync="listMatkul[indexMatkul].matkul"
                                  />
                                </CCol>
                                <CCol md="6">
                                  <template
                                    v-for="(input, indexDosen) in listMatkul[indexMatkul].dosen"
                                  >
                                    <CRow :key="indexDosen">
                                      <CCol md="9">
                                        <CSelect
                                          :options="dosenOptions"
                                          placeholder="Pilih Dosen"
                                          required
                                          :value.sync="listMatkul[indexMatkul].dosen[indexDosen].id"
                                        />
                                      </CCol>
                                      <CCol md="2" v-if="indexDosen">
                                        <CButton
                                          color="danger"
                                          @click="deleteDosen(indexMatkul,indexDosen)"
                                        >
                                          <CIcon name="cil-x" />
                                        </CButton>
                                      </CCol>
                                    </CRow>
                                  </template>
                                  <CRow class="justify-content-center">
                                    <CButton
                                      color="success"
                                      @click="addDosen(indexMatkul)"
                                    >Tambah Dosen</CButton>
                                  </CRow>
                                </CCol>
                                <CCol md="6">
                                  <CSelect
                                    :options="sksOptions"
                                    placeholder="Pilih SKS"
                                    required
                                    :value.sync="listMatkul[indexMatkul].sks"
                                  />
                                </CCol>
                              </CRow>
                            </CForm>
                          </CCardBody>
                        </CCard>
                      </div>
                    </template>
                    <CRow class="justify-content-center">
                      <CCol sm="4">
                        <CButton color="success" @click="addMatkul">Tambah Perkuliahan</CButton>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <CRow class="justify-content-center">
                <CCol sm="4">
                  <CButton color="danger" block @click="confirmModal = true">Kembali</CButton>
                </CCol>
                <CCol sm="4">
                  <CButton color="success" block @click="confirmModal = true">Tambah Semester</CButton>
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
import AkademikHelper from "../../contracts/AkademikHelper";
import gql from "graphql-tag";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

export default {
  name: "TambahSemester",
  apollo: {
    prodis: gql`
      query {
        prodis {
          id
          namaProdi
          namaJurusan
        }
      }
    `,
    mataKuliahs: gql`
      query {
        mataKuliahs {
          id
          namaMatkul
        }
      }
    `,
    dosens: gql`
      query {
        dosens {
          id
          name
        }
      }
    `,
  },
  data() {
    return {
      listMatkul: [],
      indexMatkul: null,
      indexDosen: null,
      semesterKeOptions: [1, 2, 3, 4, 5, 6, 7, 8],
      sksOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      confirmModal: false,
      successModal: false,
      dismissSuccess: 0,
      dismissFail: 0,
      calendar: {
        tahunAjar: null,
        ganjil: null,
      },
      semester: {
        semesterKe: Number(),
        kelas: null,
        totalSks: Number(),
        idKalendar: Number(),
        prodi: null,
        jurusan: null,
      },
    };
  },
  computed: {
    prodiOptions() {
      let arrProdi = [];
      this.prodis.forEach((prodi) => {
        arrProdi.push({
          label: web3.utils.hexToUtf8(prodi.namaProdi),
          value: prodi.id,
        });
      });
      console.log(this.prodis);
      return arrProdi;
    },
    matkulOptions() {
      let arrMatkul = [];
      console.log(this.mataKuliahs);
      this.mataKuliahs.forEach((matkul) => {
        arrMatkul.push({
          label: web3.utils.hexToUtf8(matkul.namaMatkul),
          value: Number(matkul.id),
        });
      });
      console.log(arrMatkul)
      return arrMatkul;
    },
    dosenOptions() {
      let arrDosen = [];
      console.log(this.dosens);
      this.dosens.forEach((dosen) => {
        arrDosen.push({
          label: web3.utils.hexToUtf8(dosen.name),
          value: Number(dosen.id),
        });
      });
      console.log(arrDosen)
      return arrDosen;
    },
    ready() {
      if (
        this.prodis == null ||
        this.calendar.tahunAjar == null ||
        this.mataKuliahs == null ||
        this.dosens == null
      )
        return false;
      return true;
    },
  },
  methods: {
    createSemester: function () {
      let data = this.semester;
      console.log(data)
      if (
        this.isDataReady(this.semester) &&
        this.isPerkuliahanReady(this.listMatkul)
      ) {
        let daftarDosen = [];
        let daftarMatkul = [];
        let daftarSks = [];
        let sks = 0;
        data.ampu = []
        data.totalSks = 0;
        this.listMatkul.forEach((matkul) => {
          sks = matkul.sks;
          data.totalSks+=sks;
          data.ampu.push({'matkul':matkul.matkul,'sks':sks, 'dosen':[]})
          matkul.dosen.forEach((dosen) => {
            daftarMatkul.push(matkul.matkul);
            daftarDosen.push(dosen.id);
            daftarSks.push(sks);
            sks = 0;
            data.ampu[data.ampu.length - 1].dosen.push(dosen.id);
          });
        });
        console.log('daftarMtk: '+daftarMatkul)
        console.log('daftarDsn: '+daftarDosen)
        console.log('daftarSKs: '+daftarSks)
        let file = Buffer.from(JSON.stringify(data));
        ipfs.add(file).then((ipfsHash) => {
        let hash = ipfsHash[0].hash;
        console.log(hash);
        console.log(
          "ke"+ data.semesterKe +
            " hash" +
            web3.utils.utf8ToHex(hash) +
            " prodi" +
            this.prodis[data.prodi].namaProdi +
            " kelas" +
            web3.utils.utf8ToHex(data.kelas)
        );
        web3.eth.getAccounts().then((accounts) => {
          return AkademikHelper.methods
            .createSemester(
              data.semesterKe,
              web3.utils.utf8ToHex(hash),
              daftarDosen,
              daftarMatkul,
              daftarSks,
              this.prodis[data.prodi].namaProdi,
              web3.utils.utf8ToHex(data.kelas)
            )
            .send({ from: accounts[0] })
            .on("error", function (error, receipt) {
              this.showAlert(false);
            })
            .on("receipt", function (receipt) {
              this.showAlert(true);
            });
        });
      });
      }
    },
    validator(val) {
      return val ? val.length > 1 : false;
    },
    inputValidator(val) {
      return val ? true : false;
    },
    getSemester(ganjil) {
      if (ganjil == null) return "";
      return ganjil ? "Ganjil" : "Genap";
    },
    confirmRegister: function (confirm) {
      this.confirmModal = false;
      if (confirm) {
        this.createSemester();
      }
    },
    showAlert: function (isSuccess) {
      if (isSuccess) {
        this.dismissSuccess = 5;
      } else {
        this.dismissFail = 5;
      }
    },
    addMatkul() {
      this.listMatkul.push({
        matkul: null,
        sks: null,
        dosen: [{ id: null }],
      });
    },
    addDosen(index) {
      if (this.listMatkul[index].dosen.length > 3) return null;
      this.listMatkul[index].dosen.push({ id: null });
    },
    deleteMatkul(index) {
      this.listMatkul.splice(index, 1);
    },
    deleteDosen(indexMatkul, indexDosen) {
      if (this.listMatkul[indexMatkul].dosen.length <= 1) return null;
      this.listMatkul[indexMatkul].dosen.splice(indexDosen, 1);
    },
    updateJurusan() {
      this.semester.jurusan = web3.utils.hexToUtf8(
        this.prodis[this.semester.prodi].namaJurusan
      );
    },
    isDataReady(val) {
      let isReady = true;
      Object.keys(val).forEach((attribute) => {
        console.log(attribute + " " + val[attribute]);
        if (typeof val[attribute] == "string") {
          if (val[attribute] == "") {
            isReady = false;
          }
        }else if(val[attribute] == null) {
          isReady = false;
        }else if(val["semesterKe"] == 0){
          isReady = false;
        }
      });
      console.log(isReady)
      return isReady;
    },
    isPerkuliahanReady(val) {
      let isReady = true;
      let arrMatkul = [];
      val.forEach((matkul) => {
        let arrDosen = [];
        matkul.dosen.forEach((dosen) => {
          if (dosen.id == null || arrDosen.includes(dosen.id)) {
            isReady = false;
          }
          arrDosen.push(dosen.id)
        });
        if (
          matkul.matkul == null ||
          matkul.sks == null ||
          arrMatkul.includes(matkul.matkul)
        ) {
          isReady = false;
        }
        arrMatkul.push(matkul.matkul);
      });
      console.log(isReady)
      return isReady;
    },
  },
  beforeMount() {
    web3.eth.getAccounts().then((accounts) => {
      let calendar = this.calendar;
      let semester = this.semester;
      AkademikHelper.methods
        .activeKalendarAkademik()
        .call({ from: accounts[0] })
        .then(function (result) {
          if (result) {
            semester.idKalendar = result
            AkademikHelper.methods
              .getKalendarAkademik(result)
              .call({ from: accounts[0] })
              .then(function (result) {
                calendar.tahunAjar = web3.utils.hexToUtf8(result[0]);
                calendar.ganjil = result[1];
              });
          }
        });
    });
  },
};
</script>
