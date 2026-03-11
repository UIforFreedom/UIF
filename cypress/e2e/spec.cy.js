describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:9527')
    cy.get('.el-submenu__title').eq(0).click()
    cy.get('.nest-menu').eq(0).click()
  })
})
