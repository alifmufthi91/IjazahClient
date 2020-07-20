import Vue from 'vue'
import Router from 'vue-router'
import AccountManager from '@/contracts/AccountManager'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')
const GetStarted = () => import('@/views/GettingStarted')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

const Charts = () => import('@/views/charts/Charts')
const Widgets = () => import('@/views/widgets/Widgets')

// Views - Components
const Cards = () => import('@/views/base/Cards')
const Forms = () => import('@/views/base/Forms')
const Switches = () => import('@/views/base/Switches')
const Tables = () => import('@/views/base/Tables')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tooltips = () => import('@/views/base/Tooltips')

// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')

// Views - Icons
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')
const Brands = () => import('@/views/icons/Brands')
const Flags = () => import('@/views/icons/Flags')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
// const Login = () => import('@/views/pages/Login')
const RegisterDIKTI = () => import('@/views/pages/RegisterDIKTI')
const RegisterCivitas = () => import('@/views/pages/RegisterCivitas')

// Users
// const Users = () => import('@/views/users/Users')
// const User = () => import('@/views/users/User')

// Views Admin/Account
const ManageRole = () => import('@/views/admin/ManageRole')
const RoleRequest = () => import('@/views/admin/RoleRequest')

// Views - Account
const AccountDetail= () => import('@/views/account/Account')
const EditAccount= () => import('@/views/account/EditAccount')

// Views - Mahasiswa
const Mahasiswa = () => import('@/views/mahasiswa/Mahasiswa')
const AntrianNINA = () => import('@/views/mahasiswa/AntrianNINA')

// Views - Civitas
const Civitas = () => import('@/views/civitas/Civitas')

Vue.use(Router)

function configRoutes () {
  return [
    {
      path: '/',
      redirect: "/get-started",
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: '',
          component: Dashboard
        },
        {
          path: 'edit-account',
          name: 'Edit Account',
          component: EditAccount
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
              path: 'account/:id',
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
          redirect: '/mahasiswa/list-info',
          meta: {
            label: 'Mahasiswa'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'mahasiswa',
              name: 'Info Mahasiswa',
              component: Mahasiswa
            },
            {
              path: 'antrian-NINA',
              name: 'Antrian NINA',
              component: AntrianNINA
            },
            {
              path: 'mahasiswa/:id',
              meta: {
                label: 'Mahasiswa Details'
              },
              name: 'Info Mahasiswa',
              component: AccountDetail
            }
          ]
        },
        {
          path: 'civitas',
          redirect: '/civitas/list-info',
          meta: {
            label: 'Civitas'
          },
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'civitas',
              name: 'Info Civitas',
              component: Civitas
            },
            {
              path: 'civitas/:id',
              meta: {
                label: 'Civitas Details'
              },
              name: 'Info Civitas',
              component: AccountDetail
            }
          ]
        },
        {
          path: 'theme',
          redirect: '/theme/colors',
          name: 'Theme',
          component: {
            render (c) { return c('router-view') }
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
          path: 'charts',
          name: 'Charts',
          component: Charts
        },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        // {
        //   path: 'users',
        //   meta: {
        //     label: 'Users'
        //   },
        //   component: {
        //     render(c) {
        //       return c('router-view')
        //     }
        //   },
        //   children: [
        //     {
        //       path: '',
        //       name: 'Users',
        //       component: ManageRole
        //     },
        //     {
        //       path: ':id',
        //       meta: {
        //         label: 'User Details'
        //       },
        //       name: 'User',
        //       component: User
        //     }
        //   ]
        // },
        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'forms',
              name: 'Forms',
              component: Forms
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tables',
              name: 'Tables',
              component: Tables
            },
            {
              path: 'tabs',
              name: 'Tabs',
              component: Tabs
            },
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'buttons',
          redirect: '/buttons/standard-buttons',
          name: 'Buttons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'brand-buttons',
              name: 'Brand Buttons',
              component: BrandButtons
            }
          ]
        },
        {
          path: 'icons',
          redirect: '/icons/coreui-icons',
          name: 'CoreUI Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'coreui-icons',
              name: 'Icons library',
              component: CoreUIIcons
            },
            {
              path: 'brands',
              name: 'Brands',
              component: Brands
            },
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            }
          ]
        },
        {
          path: 'notifications',
          redirect: '/notifications/alerts',
          name: 'Notifications',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            }
          ]
        }
      ]
    },
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
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
        // {
        //   path: 'login',
        //   name: 'Login',
        //   component: Login
        // }
      ]
    },
    {
      path: '/register-DIKTI',
      name: 'Register DIKTI',
      component: RegisterDIKTI
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
      path :'*',
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

router.beforeEach((to,from,next) => {
  switch(to.name){
    case 'Getting Started': next();break;
    case 'Register Civitas': next();break;
    case 'Register DIKTI': next();break;
    case 'Page404': next();break;
    case 'Page500': next();break;
    default : web3.eth.getAccounts().then(accounts => {
      AccountManager.methods
        .getAccount(accounts[0])
        .call({ from: accounts[0] })
        .then(function(result) {
          console.log("Result is : " + result[1]);
          if(!result[1]) next('/')
          else next()
        })
    })
  }
})

// router.afterEach((to, from) => {
//   switch(to.name){
//     case 'Getting Started': next();break;
//     case 'Register Civitas': next();break;
//     case 'Register DIKTI': next();break;
//     case 'Page404': next();break;
//     case 'Page500': next();break;
//     default : web3.eth.getAccounts().then(accounts => {
//       AccountManager.methods
//         .getAccount(accounts[0])
//         .call({ from: accounts[0] })
//         .then(function(result) {
//           console.log("Result is : " + result[1]);
//           if(!result[1]) router.push('')
//         })
//     })
//   }
// })

export default router