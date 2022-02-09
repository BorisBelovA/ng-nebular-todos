describe('Переход на страницу и создание нового списка дел', () => {

  before(() => {
    /** Очищаем localStorage для чистоты теста */
    localStorage.clear()
  })

  it('Перейти на стартовую страницу, создать новый список дел и вернуться назад', () => {
    cy.visit('/');
    /** Т.к дел нет, ожидаем увидеть сообщение */
    cy.get('[data-id="empty-todo-list-text"]')

    /** Находим кнопку созданий списка и кликаем по ней */
    cy.get('[data-id="add-item-list"]').click()
    
    /** После перехода на новую страницу, проверяем ее url */
    cy.url().should('include', 'list/0');

    /** Заполнение названия списка */
    cy.get('[data-id="list-header-input"]').type('Первый список дел через Cypress');

    cy.get('[data-id="input"]').type('Проверить написание названия списка дел').blur();
    cy.get('[data-id="add-item-btn"]').click();

    cy.get('[data-id="input"]').type('Проверить написание задачи').blur()
    cy.get('[data-id="add-item-btn"]').click();


    cy.get('[data-id="input"]').type('Проверить вычеркивание задачи из списка').blur();
    cy.get('[data-id="add-item-btn"]').click();

    cy.get('[data-id="item-1"]').should('not.have.class', 'done');

    console.log(cy.get('[data-id="checkbox_1"]'));
    
    cy.get('[data-id="checkbox_1"]').children('label').click();
    cy.get('[data-id="item-1"]').should('have.class', 'done');

    cy.get('[data-id="back-to-all-lists"]').click();

    cy.url().should('contain', '/gallery');

    cy.get('.todo-gallery').find('[data-id="todo-list-card"]').its('length').should('eq', 1)

    cy.get('.todo-gallery').find('[data-id="todo-list-card"]').first().click();

    cy.url().should('contain', 'list/1');

  })

})
