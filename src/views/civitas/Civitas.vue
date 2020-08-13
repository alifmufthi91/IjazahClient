<template>
  <CRow>
    <CCol col="12" xl="12">
      <CCard>
        <CCardHeader>Info Civitas</CCardHeader>
        <CCardBody>
          <CDataTable
            hover
            :items="this.civitas"
            :fields="fields"
            :items-per-page="5"
            :active-page="activePage"
            :pagination="{ doubleArrows: false, align: 'center'}"
            @page-change="pageChange"
          >
            <template #id="data">
              <td>{{ hexToString(data.item.id) }}</td>
            </template>
            <template #name="data">
              <td>{{ hexToString(data.item.name) }}</td>
            </template>
            <template #action="data">
              <td>
                <CCol class="mb-3 mb-xl-0 text-right">
                  <CButton
                    color="primary"
                    class="mr-3"
                    size="sm"
                    @click="detailClicked(data.item)"
                  >Detail</CButton>
                  <CButton color="info" class="mr-3" size="sm">Edit</CButton>
                  <CButton color="success" class="mr-3" size="sm">Link</CButton>
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
  name: "InfoCivitas",
  apollo: {
    civitas: gql`
      query {
        civitas {
          id
          name
        }
      }
    `,
  },
  data() {
    return {
      fields: [
        { key: "id" },
        { key: "name" },
        { key: "action", label: "Aksi" },
      ],
      activePage: 1,
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
  methods: {
    pageChange(val) {
      this.$router.push({ query: { page: val } });
    },
    detailClicked(item) {
      this.$router.replace({ path: "civitas/" + `${item.id}` });
    },
    hexToString(str) {
      return web3.utils.hexToUtf8(str);
    },
  },
};
</script>
