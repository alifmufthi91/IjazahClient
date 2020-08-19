import web3 from '@/js/web3';
const address = '0x5d658f5ad22cf59d582fd288096ead47f660fc89';
const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "accountManagerAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "oldAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "newAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "AccountManagerUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes9",
				"name": "tahunAjar",
				"type": "bytes9"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "ganjil",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "KalendarAkademikCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes9",
				"name": "newtahunAjar",
				"type": "bytes9"
			},
			{
				"indexed": false,
				"internalType": "bytes9",
				"name": "oldtahunAjar",
				"type": "bytes9"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "KalendarAkademikTahunAjarUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "namaMatkul",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "MatkulCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "namaMatkul",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "newIpfsHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "oldIpfsHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "MatkulUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "idDosen",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "idMatkul",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "namaMatkul",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "idSemester",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "prodi",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes9",
				"name": "kelas",
				"type": "bytes9"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "MengajarCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "namaProdi",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "namaJurusan",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "ProdiCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "namaProdi",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "namaJurusan",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "newIpfsHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "oldIpfsHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "ProdiUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "semesterKe",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "prodi",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes9",
				"name": "kelas",
				"type": "bytes9"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "kalendarAkademik",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "statusPenilaian",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeCreated",
				"type": "uint256"
			}
		],
		"name": "SemesterCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeChanged",
				"type": "uint256"
			}
		],
		"name": "SemesterNilaiStatusChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "newIpfsHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "bytes",
				"name": "oldIpfsHash",
				"type": "bytes"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeUpdated",
				"type": "uint256"
			}
		],
		"name": "SemesterUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "activeKalendarAkademik",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes9",
				"name": "_tahunAjar",
				"type": "bytes9"
			},
			{
				"internalType": "bool",
				"name": "_ganjil",
				"type": "bool"
			}
		],
		"name": "createKalendarAkademik",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_namaMatkul",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "_ipfsHash",
				"type": "bytes"
			}
		],
		"name": "createMatkul",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes",
				"name": "_namaProdi",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "_namaJurusan",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "_ipfsHash",
				"type": "bytes"
			}
		],
		"name": "createProdi",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_semesterKe",
				"type": "uint8"
			},
			{
				"internalType": "bytes",
				"name": "_ipfsHash",
				"type": "bytes"
			},
			{
				"internalType": "uint256[]",
				"name": "_listIdDosen",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_listMatkul",
				"type": "uint256[]"
			},
			{
				"internalType": "uint8[]",
				"name": "_listSKS",
				"type": "uint8[]"
			},
			{
				"internalType": "bytes",
				"name": "_prodi",
				"type": "bytes"
			},
			{
				"internalType": "bytes9",
				"name": "_kelas",
				"type": "bytes9"
			}
		],
		"name": "createSemester",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getAmpu",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getKalendarAkademik",
		"outputs": [
			{
				"internalType": "bytes9",
				"name": "",
				"type": "bytes9"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getMatkul",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getProgram",
		"outputs": [
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getSemester",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "idAmpu",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "idDosen",
				"type": "uint256"
			}
		],
		"name": "isDosenPengampu",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes9",
				"name": "_tahunAjar",
				"type": "bytes9"
			},
			{
				"internalType": "bool",
				"name": "_ganjil",
				"type": "bool"
			}
		],
		"name": "isKalendarAkademikExist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "isStatusSemesterOpen",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "setKalendarActive",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_semesterId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_status",
				"type": "bool"
			}
		],
		"name": "ubahStatusNilaiSemester",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newAddress",
				"type": "address"
			}
		],
		"name": "updateAccountManager",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_matkulId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_newIpfsHash",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "_namaMatkul",
				"type": "bytes"
			}
		],
		"name": "updateMatkulData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_prodiId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_newIpfsHash",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "_namaProdi",
				"type": "bytes"
			},
			{
				"internalType": "bytes",
				"name": "_namaJurusan",
				"type": "bytes"
			}
		],
		"name": "updateProdiData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_semesterId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "_newIpfsHash",
				"type": "bytes"
			}
		],
		"name": "updateSemesterData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "bytes9",
				"name": "_tahunAjar",
				"type": "bytes9"
			}
		],
		"name": "updateTahunAjarKalendar",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
// THE ABI END HERE
const instance = new web3.eth.Contract(abi, address);

export default instance;
