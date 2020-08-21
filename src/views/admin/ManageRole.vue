<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Role Management</CCardHeader>
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
            <template #id-filter>
              <input
                class="form-control form-control-sm"
                :value="filterAlamat"
                @change="setFilterAlamat"
              />
            </template>
            <template #name-filter>
              <input
                class="form-control form-control-sm"
                :value="filterNama"
                @change="setFilterNama"
              />
            </template>
            <template #name="data">
              <td class="font-weight-bold">{{ hexToString(data.item.name) }}</td>
            </template>
            <template #role-filter>
              <input
                class="form-control form-control-sm"
                :value="filterRole"
                @change="setFilterRole"
              />
            </template>
            <template #role="data">
              <td>{{ hexToString(data.item.role) }}</td>
            </template>
            <template #nomorInduk-filter>
              <input
                class="form-control form-control-sm"
                :value="filterNomorId"
                @change="setFilterNI"
              />
            </template>
            <template #nomorInduk="data">
              <td>{{ hexToString(data.item.nomorInduk) }}</td>
            </template>
            <template #verified="data">
              <td>
                <CBadge :color="getBadge(data.item.verified)">{{ getVerified(data.item.verified) }}</CBadge>
              </td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-center">
                  <CButtonGroup>
                    <CButton color="primary" size="sm" @click="detailClicked(data.item)">Detail</CButton>
                    <!-- <CButton color="info" size="sm">Edit</CButton> -->
                  </CButtonGroup>
                </CCol>
              </td>
            </template>
          </CDataTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "RoleManagement",
  apollo: {
    accounts: gql`
      query {
        accounts(where: { isDeleted: false }, orderBy: name) {
          id
          name
          verified
          role
          nomorInduk
        }
      }
    `,
  },
  data() {
    return {
      fields: [
        { key: "name", label: "Name" },
        { key: "id", label: "Alamat" },
        { key: "role" },
        { key: "nomorInduk", label: "Nomor Induk" },
        { key: "verified", label: "Verified", filter: false },
        { key: "action", label: "Aksi", sorter: false, filter: false },
      ],
      activePage: 1,
      filterNama: "",
      filterAlamat: "",
      filterRole: "",
      filterNomorId: "",
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
    this.$apollo.queries.accounts.refetch();
  },
  computed: {
    computedItems() {
      return this.accounts;
    },
    filteredItems() {
      if (!this.accounts) return [];
      return this.computedItems.filter((item) => {
        if (
          !this.filterNama &&
          !this.filterAlamat &&
          !this.filterRole &&
          !this.filterNomorId
        )
          return true;
        const nama = item.name;
        const alamat = item.id;
        const role = item.role;
        const nomorId = item.nomorInduk;
        return (
          web3.utils
            .hexToUtf8(nama)
            .toLowerCase()
            .includes(this.filterNama.toLowerCase()) &&
          alamat.toLowerCase().includes(this.filterAlamat.toLowerCase()) &&
          web3.utils
            .hexToUtf8(role)
            .toLowerCase()
            .includes(this.filterRole.toLowerCase()) &&
          web3.utils
            .hexToUtf8(nomorId)
            .toLowerCase()
            .includes(this.filterNomorId.toLowerCase())
        );
      });
    },
  },
  methods: {
    getBadge(status) {
      if (status) return "success";
      return "warning";
    },
    getVerified(status) {
      if (status) return "Terverifikasi";
      return "Belum Diverifikasi";
    },
    setFilterNama(e) {
      this.filterNama = e.target.value;
    },
    setFilterAlamat(e) {
      this.filterAlamat = e.target.value;
    },
    setFilterRole(e) {
      this.filterRole = e.target.value;
    },
    setFilterNI(e) {
      this.filterNomorId = e.target.value;
    },
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "detail/" + `${item.id}` });
    },
    hexToString(str) {
      if (web3.utils.isHexStrict(str)) return web3.utils.hexToUtf8(str);
    },
  },
};
</script>
