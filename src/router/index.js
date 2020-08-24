import Vue from 'vue'
import Router from 'vue-router'
import AccountManager from '@/contracts/AccountManager'
import CivitasHelper from '@/contracts/CivitasHelper'
import Roles from '@/js/roles'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')
const GetStarted = () => import('@/views/GettingStarted')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
// const Login = () => import('@/views/pages/Login')
const RegisterDIKTI = () => import('@/views/pages/RegisterDIKTI')
const RegisterCivitas = () => import('@/views/pages/RegisterCivitas')
const Verifikasi = () => import('@/views/pages/Verifikasi')

// Views Admin/Account
const ManageRole = () => import('@/views/admin/ManageRole')
const RoleRequest = () => import('@/views/admin/RoleRequest')

// Views - Account
const AccountDetail = () => import('@/views/account/Account')
const EditAccount = () => import('@/views/account/EditAccount')

// Views - Mahasiswa
const Mahasiswa = () => import('@/views/mahasiswa/Mahasiswa')
const AntrianNINA = () => import('@/views/mahasiswa/AntrianNINA')
const TambahMahasiswa = () => import('@/views/mahasiswa/TambahMahasiswa')
const DetailMahasiswa = () => import('@/views/mahasiswa/DetailMahasiswa')
const EditMahasiswa = () => import('@/views/mahasiswa/UpdateMahasiswa')
const InfoMahasiswa = () => import('@/views/mahasiswa/InfoMahasiswa')
const MahasiswaLulus = () => import('@/views/mahasiswa/MahasiswaLulus')

// Views - Civitas
const Civitas = () => import('@/views/civitas/Civitas')
const TambahCivitas = () => import('@/views/civitas/TambahCivitas')
const DetailCivitas = () => import('@/views/civitas/DetailCivitas')
const InfoCivitas = () => import('@/views/civitas/InfoCivitas')

// Views - Prodi
const TambahProdi = () => import('@/views/prodi/TambahProdi')
const Prodi = () => import('@/views/prodi/Prodi')
const DetailProdi = () => import('@/views/prodi/DetailProdi')

// Views = Matkul
const TambahMatkul = () => import('@/views/mata kuliah/TambahMatkul')
const Matkul = () => import('@/views/mata kuliah/Matkul')
const DetailMatkul = () => import('@/views/mata kuliah/DetailMatkul')

// Views - Kalendar Akademik
const TambahKalendarAkademik = () => import('@/views/kalendar akademik/TambahKalendarAkademik')
const KalendarAkademik = () => import('@/views/kalendar akademik/KalendarAkademik')
const DetailKalendar = () => import('@/views/kalendar akademik/DetailKalendar')

// Views - Semester
const TambahSemester = () => import('@/views/semester/TambahSemester')
const Semester = () => import('@/views/semester/Semester')
const DetailSemester = () => import('@/views/semester/DetailSemester')

//Views - Sertifikat
const TambahSertifikat = () => import('@/views/sertifikat/TambahSertifikat')
const Sertifikat = () => import('@/views/sertifikat/Sertifikat')
const DetailSertifikat = () => import('@/views/sertifikat/DetailSertifikat')
const SertifikatOwner = () => import('@/views/sertifikat/SertifikatOwner')
const Signatures = () => import('@/views/sertifikat/Signature')
const SertifikatDikti = () => import('@/views/sertifikat/SertifikatDikti')

//Views - Ampu
const DetailAmpu = () => import('@/views/semester/DetailAmpu')
const AmpuDosen = () => import('@/views/semester/AmpuDosen')
const AmpuDosenAll = () => import('@/views/semester/AmpuDosenAll')
const Ampu = () => import('@/views/semester/Ampu')
const PenilaianAmpuDosen = () => import('@/views/semester/PenilaianAmpuDosen')

Vue.use(Router)

function configRoutes() {
  return [
    {
      path: '/',
      redirect: "/dashboard",
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: '',
          component: Dashboard,
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .getAccount(accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result[1]) next('/get-started')
                  else next()
                })
            })
          }
        },
        {
          path: 'edit-account',
          name: 'Edit Account',
          component: EditAccount,
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .getAccount(accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result[1]) next('/get-started')
                  else next()
                })
            })
          }
        },
        {
          path: 'accounts',
          redirect: '/accounts/management',
          meta: {
            label: 'Accounts'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.admin, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          children: [
            {
              path: 'management',
              name: 'Role Management',
              component: ManageRole
            },
            {
              path: 'request',
              name: 'Role Request',
              component: RoleRequest
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Account Details'
              },
              name: 'Account',
              component: AccountDetail
            }
          ]
        },
        {
          path: 'mahasiswa',
          redirect: '/mahasiswa',
          meta: {
            label: 'Mahasiswa'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.admin, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          children: [
            {
              path: '',
              name: 'Info Mahasiswa',
              component: Mahasiswa
            },
            {
              path: 'antrian-nina',
              name: 'Antrian NINA',
              component: AntrianNINA
            },
            {
              path: 'antrian-lulus',
              name: 'Antrian Lulus',
              component: MahasiswaLulus
            },
            {
              path: 'tambah',
              name: 'Tambah Mahasiswa',
              component: TambahMahasiswa
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Mahasiswa Details'
              },
              name: 'Detail Mahasiswa',
              component: DetailMahasiswa
            },
            {
              path: 'edit/:id',
              meta: {
                label: 'Edit Mahasiswa'
              },
              name: 'Edit Mahasiswa',
              component: EditMahasiswa
            }
          ]
        },
        {
          path: 'civitas',
          redirect: '/civitas',
          meta: {
            label: 'Civitas'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.admin, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          children: [
            {
              path: '',
              name: 'Info Civitas',
              component: Civitas
            },
            {
              path: 'tambah',
              name: 'Tambah Civitas',
              component: TambahCivitas
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Civitas Details'
              },
              name: 'Detail Civitas',
              component: DetailCivitas
            }
          ]
        },
        {
          path: 'prodi',
          redirect: '/prodi',
          meta: {
            label: 'Prodi'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.admin, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          children: [
            {
              path: '',
              name: 'Info Prodi',
              component: Prodi
            },
            {
              path: 'tambah',
              name: 'Tambah Prodi',
              component: TambahProdi
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Prodi Details'
              },
              name: 'Detail Prodi',
              component: DetailProdi
            }
          ]
        },
        {
          path: 'ampu',
          redirect: '/ampu',
          meta: {
            label: 'Ampu'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Info Ampu',
              component: Ampu
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Ampu Details'
              },
              name: 'Detail Ampu',
              component: DetailAmpu
            }
          ]
        },
        {
          path: 'matkul',
          redirect: '/matkul',
          meta: {
            label: 'Mata Kuliah'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.admin, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          children: [
            {
              path: '',
              name: 'Info Mata Kuliah',
              component: Matkul
            },
            {
              path: 'tambah',
              name: 'Tambah Mata Kuliah',
              component: TambahMatkul
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Matakuliah Details'
              },
              name: 'Detail Matakuliah',
              component: DetailMatkul
            }
          ]
        },
        {
          path: 'kalendar-akademik',
          redirect: '/kalendar-akademik',
          meta: {
            label: 'Kalendar Akademik'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.admin, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          children: [
            {
              path: '',
              name: 'Info Kalendar Akademik',
              component: KalendarAkademik
            },
            {
              path: 'tambah',
              name: 'Tambah Kalendar Akademik',
              component: TambahKalendarAkademik
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Kalendar Akademik Details'
              },
              name: 'Detail Kalendar Akademik',
              component: DetailKalendar
            }
          ]
        },
        {
          path: 'semester',
          redirect: '/semester',
          meta: {
            label: 'Semester'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.admin, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          children: [
            {
              path: '',
              name: 'Daftar Semester',
              component: Semester
            },
            {
              path: 'tambah',
              name: 'Tambah Semester',
              component: TambahSemester
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Semester Details'
              },
              name: 'Detail Semester',
              component: DetailSemester
            }
          ]
        },
        {
          path: 'sertifikat',
          redirect: '/sertifikat',
          meta: {
            label: 'Sertifikat'
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.admin, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: '',
              name: 'Daftar Sertifikat',
              component: Sertifikat
            },
            {
              path: 'tambah',
              name: 'Tambah Sertifikat',
              component: TambahSertifikat
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Sertifikat Details'
              },
              name: 'Detail Sertifikat',
              component: DetailSertifikat
            }
          ]
        },
        {
          path: 'my-signature',
          name: 'Daftar Tanda Tangan',
          component: Signatures,
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .getAccount(accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result[1]) next('/get-started');
                  else CivitasHelper.methods
                    .getNIPCivitas(accounts[0])
                    .call({ from: accounts[0] })
                    .then(function (result) {
                      if (result == "0x000000000000000000000000000000000000000000") next('/get-started');
                      else next()
                    })
                })
            })
          }
        },
        {
          path: 'verifikasi-signed',
          name: 'Verifikasi Sertifikat',
          component: Verifikasi,
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .getAccount(accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result[1]) next('/get-started')
                  else next()
                })
            })
          }
        },
        {
          path: 'my-perkuliahan',
          redirect: '/my-perkuliahan/active',
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.dosen, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'active',
              name: 'Perkuliahan Semester Ini',
              component: AmpuDosen
            },
            {
              path: 'all',
              name: 'Daftar Matakuliah',
              component: AmpuDosenAll
            },
            {
              path: 'penilaian/:id',
              meta: {
                label: 'Penilaian Matakuliah'
              },
              name: 'Penilaian Ampu',
              component: PenilaianAmpuDosen
            }
          ]
        },
        {
          path: 'my-sertifikat',
          redirect: '/my-sertifikat',
          meta: {
            label: 'Sertifikat Saya'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .getAccount(accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result[1]) next('/get-started');
                  else CivitasHelper.methods
                    .getNIMMahasiswa(accounts[0])
                    .call({ from: accounts[0] })
                    .then(function (result) {
                      if (result == "0x000000000000000000000000000000000000000000") next('/get-started');
                      else next()
                    })
                })
            })
          },
          children: [
            {
              path: '',
              name: 'Daftar Sertifikat Dimiliki',
              component: SertifikatOwner
            },
            {
              path: 'detail/:id',
              meta: {
                label: 'Sertifikat Details'
              },
              name: 'Detail Sertifikat',
              component: DetailSertifikat
            }
          ]
        },
        {
          path: 'theme',
          redirect: '/theme/colors',
          name: 'Theme',
          component: {
            render(c) { return c('router-view') }
          },
          children: [
            {
              path: 'colors',
              name: 'Colors',
              component: Colors
            },
            {
              path: 'typography',
              name: 'Typography',
              component: Typography
            }
          ]
        },
        {
          path: '/info-mahasiswa',
          name: 'Info Mahasiswa',
          component: InfoMahasiswa,
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.mahasiswa, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          }
        },
        {
          path: '/info-civitas',
          name: 'Info Civitas',
          component: InfoCivitas,
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .getAccount(accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result[1]) next('/get-started');
                  else CivitasHelper.methods
                    .getNIPCivitas(accounts[0])
                    .call({ from: accounts[0] })
                    .then(function (result) {
                      if (result == "0x000000000000000000000000000000000000000000") next('/get-started');
                      else next()
                    })
                })
            })
          },
        },
        {
          path: '/dikti-antrian-ijazah',
          name: 'Antrian Nomor Ijazah',
          component: SertifikatDikti,
          beforeEnter: (to, from, next) => {
            web3.eth.getAccounts().then(accounts => {
              if (accounts.length < 1) next('/get-started')
              AccountManager.methods
                .hasRole(Roles.dikti, accounts[0])
                .call({ from: accounts[0] })
                .then(function (result) {
                  if (!result) next('/get-started')
                  else next()
                })
            })
          }
        },
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render(c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
      ]
    },
    {
      path: '/register-DIKTI',
      name: 'Register DIKTI',
      component: RegisterDIKTI
    },
    {
      path: '/verifikasi',
      name: 'Verifikasi Sertifikat',
      component: Verifikasi
    },
    {
      path: '/register-civitas',
      name: 'Register Civitas',
      component: RegisterCivitas
    },
    {
      path: '/get-started',
      name: 'Getting Started',
      component: GetStarted
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404
    }
  ]
}

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

export default router