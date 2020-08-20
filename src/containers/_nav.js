const def = {
  'def':
    [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-home'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Theme']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Colors',
            to: '/theme/colors',
            icon: 'cil-drop'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Typography',
            to: '/theme/typography',
            icon: 'cil-pencil'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Akademik']
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Kalendar Akademik',
            route: '/kalendar-akademik',
            icon: 'cil-3d',
            items: [
              {
                name: 'Daftar Kalendar Akademik',
                to: '/kalendar-akademik'
              },
              {
                name: 'Tambah Kalendar Akademik',
                to: '/kalendar-akademik/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Semester',
            route: '/semester',
            icon: 'cil-3d',
            items: [
              {
                name: 'Daftar Semester',
                to: '/semester'
              },
              {
                name: 'Tambah Semester',
                to: '/semester/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Sertifikat',
            route: '/sertifikat',
            icon: 'cil-3d',
            items: [
              {
                name: 'Daftar Sertifikat',
                to: '/sertifikat'
              },{
                name: 'Tambah Sertifikat',
                to: '/sertifikat/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Accounts']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Role Management',
            to: '/accounts/management',
            icon: 'cil-pencil'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Permintaan Role',
            to: '/accounts/request',
            icon: 'cil-pencil'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Perguruan Tinggi']
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Mahasiswa',
            route: '/mahasiswa',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Info Mahasiswa',
                to: '/mahasiswa'
              },
              {
                name: 'Tambah Mahasiswa',
                to: '/mahasiswa/tambah'
              },
              {
                name: 'Antrian NINA',
                to: '/mahasiswa/antrian-nina'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Civitas',
            route: '/civitas',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Info Civitas',
                to: '/civitas'
              },
              {
                name: 'Tambah Civitas',
                to: '/civitas/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Program Studi',
            route: '/prodi',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Info Prodi',
                to: '/prodi'
              },
              {
                name: 'Tambah Prodi',
                to: '/prodi/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Mata Kuliah',
            route: '/matkul',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Daftar Mata Kuliah',
                to: '/matkul'
              },
              {
                name: 'Tambah Mata Kuliah',
                to: '/matkul/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Components']
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Base',
            route: '/base',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Breadcrumbs',
                to: '/base/breadcrumbs'
              },
              {
                name: 'Cards',
                to: '/base/cards'
              },
              {
                name: 'Carousels',
                to: '/base/carousels'
              },
              {
                name: 'Collapses',
                to: '/base/collapses'
              },
              {
                name: 'Forms',
                to: '/base/forms'
              },
              {
                name: 'Jumbotrons',
                to: '/base/jumbotrons'
              },
              {
                name: 'List Groups',
                to: '/base/list-groups'
              },
              {
                name: 'Navs',
                to: '/base/navs'
              },
              {
                name: 'Navbars',
                to: '/base/navbars'
              },
              {
                name: 'Paginations',
                to: '/base/paginations'
              },
              {
                name: 'Popovers',
                to: '/base/popovers'
              },
              {
                name: 'Progress Bars',
                to: '/base/progress-bars'
              },
              {
                name: 'Switches',
                to: '/base/switches'
              },
              {
                name: 'Tables',
                to: '/base/tables'
              },
              {
                name: 'Tabs',
                to: '/base/tabs'
              },
              {
                name: 'Tooltips',
                to: '/base/tooltips'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Buttons',
            route: '/buttons',
            icon: 'cil-cursor',
            items: [
              {
                name: 'Buttons',
                to: '/buttons/standard-buttons'
              },
              {
                name: 'Button Dropdowns',
                to: '/buttons/dropdowns'
              },
              {
                name: 'Button Groups',
                to: '/buttons/button-groups'
              },
              {
                name: 'Brand Buttons',
                to: '/buttons/brand-buttons'
              }
            ]
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Charts',
            to: '/charts',
            icon: 'cil-chart-pie'
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Icons',
            route: '/icons',
            icon: 'cil-star',
            items: [
              {
                name: 'CoreUI Icons',
                to: '/icons/coreui-icons',
                badge: {
                  color: 'info',
                  text: 'NEW'
                }
              },
              {
                name: 'Brands',
                to: '/icons/brands'
              },
              {
                name: 'Flags',
                to: '/icons/flags'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Notifications',
            route: '/notifications',
            icon: 'cil-bell',
            items: [
              {
                name: 'Alerts',
                to: '/notifications/alerts'
              },
              {
                name: 'Badges',
                to: '/notifications/badges'
              },
              {
                name: 'Modals',
                to: '/notifications/modals'
              }
            ]
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Widgets',
            to: '/widgets',
            icon: 'cil-calculator',
            badge: {
              color: 'primary',
              text: 'NEW',
              shape: 'pill'
            }
          },
          {
            _name: 'CSidebarNavDivider',
            _class: 'm-2'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Extras']
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Pages',
            route: '/pages',
            icon: 'cil-star',
            items: [
              {
                name: 'Login',
                to: '/pages/login'
              },
              {
                name: 'Register',
                to: '/pages/register'
              },
              {
                name: 'Error 404',
                to: '/pages/404'
              },
              {
                name: 'Error 500',
                to: '/pages/500'
              }
            ]
          }
        ]
      }
    ],
    'admin':
    [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-home'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Akademik']
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Kalendar Akademik',
            route: '/kalendar-akademik',
            icon: 'cil-3d',
            items: [
              {
                name: 'Daftar Kalendar Akademik',
                to: '/kalendar-akademik'
              },
              {
                name: 'Tambah Kalendar Akademik',
                to: '/kalendar-akademik/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Semester',
            route: '/semester',
            icon: 'cil-3d',
            items: [
              {
                name: 'Daftar Semester',
                to: '/semester'
              },
              {
                name: 'Tambah Semester',
                to: '/semester/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Sertifikat',
            route: '/sertifikat',
            icon: 'cil-3d',
            items: [
              {
                name: 'Daftar Sertifikat',
                to: '/sertifikat'
              },{
                name: 'Tambah Sertifikat',
                to: '/sertifikat/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Accounts']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Role Management',
            to: '/accounts/management',
            icon: 'cil-pencil'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Permintaan Role',
            to: '/accounts/request',
            icon: 'cil-pencil'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Perguruan Tinggi']
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Mahasiswa',
            route: '/mahasiswa',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Info Mahasiswa',
                to: '/mahasiswa'
              },
              {
                name: 'Tambah Mahasiswa',
                to: '/mahasiswa/tambah'
              },
              {
                name: 'Antrian NINA',
                to: '/mahasiswa/antrian-nina'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Civitas',
            route: '/civitas',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Info Civitas',
                to: '/civitas'
              },
              {
                name: 'Tambah Civitas',
                to: '/civitas/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Program Studi',
            route: '/prodi',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Info Prodi',
                to: '/prodi'
              },
              {
                name: 'Tambah Prodi',
                to: '/prodi/tambah'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Mata Kuliah',
            route: '/matkul',
            icon: 'cil-puzzle',
            items: [
              {
                name: 'Daftar Mata Kuliah',
                to: '/matkul'
              },
              {
                name: 'Tambah Mata Kuliah',
                to: '/matkul/tambah'
              }
            ]
          },
        ]
      }
    ],
    'tes':
    [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-layers'
          }
        ]
      }
    ]
}

export default def
