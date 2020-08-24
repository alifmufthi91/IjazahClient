const def = {
  'admin':
    [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-layers'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Verifikasi Sertifikat',
            to: '/verifikasi-signed',
            icon: 'cil-check'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Akademik']
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Kalendar Akademik',
            route: '/kalendar-akademik',
            icon: 'cil-calendar',
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
            icon: 'cil-clipboard',
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
            icon: 'cil-file',
            items: [
              {
                name: 'Daftar Sertifikat',
                to: '/sertifikat'
              }, {
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
            icon: 'cil-people'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Permintaan Role',
            to: '/accounts/request',
            icon: 'cil-user-follow'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Perguruan Tinggi']
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Mahasiswa',
            route: '/mahasiswa',
            icon: 'cil-education',
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
              },
              {
                name: 'Antrian Lulus',
                to: '/mahasiswa/antrian-lulus'
              }
            ]
          },
          {
            _name: 'CSidebarNavDropdown',
            name: 'Civitas',
            route: '/civitas',
            icon: 'cil-group',
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
            icon: 'cil-badge',
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
            icon: 'cil-contact',
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
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Verifikasi Sertifikat',
            to: '/verifikasi-signed',
            icon: 'cil-check'
          }
        ]
      },
    ],
  'mahasiswa':
    [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-layers'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Verifikasi Sertifikat',
            to: '/verifikasi-signed',
            icon: 'cil-check'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Mahasiswa']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Info Mahasiswa',
            to: '/info-mahasiswa',
            icon: 'cil-user'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Sertifikat']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Daftar Sertifikat',
            to: '/my-sertifikat',
            icon: 'cil-description'
          },
        ],
      },
    ],
    'civitas':
    [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-layers'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Verifikasi Sertifikat',
            to: '/verifikasi-signed',
            icon: 'cil-check'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Civitas Akademika']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Info Civitas',
            to: '/info-civitas',
            icon: 'cil-user'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Tanda Tangan']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Daftar Tanda Tangan',
            to: '/my-signature',
            icon: 'cil-description'
          },
        ],
      },
    ],
    'dosen':
    [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-layers'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Verifikasi Sertifikat',
            to: '/verifikasi-signed',
            icon: 'cil-check'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Civitas Akademika']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Info Civitas',
            to: '/info-civitas',
            icon: 'cil-user'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Tanda Tangan']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Daftar Tanda Tangan',
            to: '/my-signature',
            icon: 'cil-description'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Perkuliahan']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Perkuliahan Semester Ini',
            to: '/my-perkuliahan/active',
            icon: 'cil-calendar-check'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Daftar Matakuliah',
            to: '/my-perkuliahan/all',
            icon: 'cil-contact'
          },
        ],
      },
    ],
    'dikti':
    [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavItem',
            name: 'Dashboard',
            to: '/dashboard',
            icon: 'cil-layers'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Verifikasi Sertifikat',
            to: '/verifikasi-signed',
            icon: 'cil-check'
          },
          {
            _name: 'CSidebarNavTitle',
            _children: ['Nomor Ijazah']
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Antrian Nomor Ijazah',
            to: '/dikti-antrian-ijazah',
            icon: 'cil-description'
          },
        ],
      },
    ]
    
}

export default def
