import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Charts e2e test', () => {
  const chartsPageUrl = '/charts';
  const chartsPageUrlPattern = new RegExp('/charts(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const chartsSample = {};

  let charts: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/charts+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/charts').as('postEntityRequest');
    cy.intercept('DELETE', '/api/charts/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (charts) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/charts/${charts.id}`,
      }).then(() => {
        charts = undefined;
      });
    }
  });

  it('Charts menu should load Charts page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('charts');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Charts').should('exist');
    cy.url().should('match', chartsPageUrlPattern);
  });

  describe('Charts page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(chartsPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Charts page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/charts/new$'));
        cy.getEntityCreateUpdateHeading('Charts');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', chartsPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/charts',
          body: chartsSample,
        }).then(({ body }) => {
          charts = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/charts+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [charts],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(chartsPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Charts page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('charts');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', chartsPageUrlPattern);
      });

      it('edit button click should load edit Charts page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Charts');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', chartsPageUrlPattern);
      });

      it('last delete button click should delete instance of Charts', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('charts').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', chartsPageUrlPattern);

        charts = undefined;
      });
    });
  });

  describe('new Charts page', () => {
    beforeEach(() => {
      cy.visit(`${chartsPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Charts');
    });

    it('should create an instance of Charts', () => {
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        charts = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', chartsPageUrlPattern);
    });
  });
});
