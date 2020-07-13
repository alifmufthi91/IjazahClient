<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4" >
              <CForm>
                <h1>Daftar DIKTI</h1>
                <p class="text-muted">Create your DIKTI account</p>
                <CInput
                  placeholder="Full Name"
                  autocomplete="username"
                  v-model="fullName"
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CButton color="success" block @click="checkName">Create Account</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import AccountManager from '../../contracts/AccountManager'
export default {
  name: 'Register',
  data () {
    return {
      fullName:null
    }
  },
  methods: {
    createDIKTIAccount: function() {
      web3.eth.getAccounts().then((accounts) => {
        console.log(this.fullName)
        return AccountManager.methods.createAccount('besit','','dikti')
          .send({ from: accounts[0] });
      })
    },
    checkName: function() {
      console.log(this.fullName)
    }
  }
}
</script>
