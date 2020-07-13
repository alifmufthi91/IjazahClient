<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
        <CCard accent-color="primary" class="text-center">
          <CCardHeader class="h3">{{homeTitle}}</CCardHeader>
          <CCardBody>
			<CRow>
				<CCol sm="12">
                    <small class="h4">Silahkan untuk mendaftarkan diri terlebih dahulu untuk menggunakan aplikasi.</small>
                  </CCol>
			</CRow>
			<CRow class="align-items-center mt-3">
               <CCol sm="6" class="mb-3 mb-xl-0 text-center">
                    <CButton color="success" size="md" shape="pill">Verifikasi Sertifikat</CButton>
                </CCol>
                <CCol sm="6" class="mb-3 mb-xl-0 text-center">
                    <CButton color="info" size="md" shape="pill">Mendaftar sebagai Civitas Polban</CButton>
                </CCol>			
            </CRow>
			<CRow class="align-items-r mt-2">
               <CCol sm="6" class="mb-3 mb-xl-0 text-center">
                    
                </CCol>
                <CCol sm="6" class="mb-3 mb-xl-0 text-center">
                    <CButton color="info" size="md" shape="pill">Mendaftar sebagai DIKTI</CButton>
                </CCol>			
            </CRow>
		  </CCardBody>
        </CCard>
      </CCol>
    </CRow>
	</CContainer>
  </div>
</template>

<script>
import MainChartExample from './charts/MainChartExample'
import WidgetsDropdown from './widgets/WidgetsDropdown'
import WidgetsBrand from './widgets/WidgetsBrand'

export default {
  name: 'Home',
  components: {
    MainChartExample,
    WidgetsDropdown,
    WidgetsBrand
  },
  data () {
    return {
      selected: 'Month',
	  homeTitle: 'Aplikasi Penerbitan dan Verifikasi Ijazah Digital'
    }
  },
  methods: {
    color (value) {
      let $color
      if (value <= 25) {
        $color = 'info'
      } else if (value > 25 && value <= 50) {
        $color = 'success'
      } else if (value > 50 && value <= 75) {
        $color = 'warning'
      } else if (value > 75 && value <= 100) {
        $color = 'danger'
      }
      return $color
    }
  }
}
</script>
