package com.bsuir.annakhomyakova.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.bsuir.annakhomyakova.IntegrationTest;
import com.bsuir.annakhomyakova.domain.ChartsAnnKh;
import com.bsuir.annakhomyakova.repository.ChartsRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ChartsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChartsResourceIT {

    private static final String ENTITY_API_URL = "/api/charts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChartsRepository chartsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChartsMockMvc;

    private ChartsAnnKh chartsAnnKh;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChartsAnnKh createEntity(EntityManager em) {
        ChartsAnnKh chartsAnnKh = new ChartsAnnKh();
        return chartsAnnKh;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChartsAnnKh createUpdatedEntity(EntityManager em) {
        ChartsAnnKh chartsAnnKh = new ChartsAnnKh();
        return chartsAnnKh;
    }

    @BeforeEach
    public void initTest() {
        chartsAnnKh = createEntity(em);
    }

    @Test
    @Transactional
    void createCharts() throws Exception {
        int databaseSizeBeforeCreate = chartsRepository.findAll().size();
        // Create the Charts
        restChartsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chartsAnnKh))
            )
            .andExpect(status().isCreated());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeCreate + 1);
        ChartsAnnKh testCharts = chartsList.get(chartsList.size() - 1);
    }

    @Test
    @Transactional
    void createChartsWithExistingId() throws Exception {
        // Create the Charts with an existing ID
        chartsAnnKh.setId(1L);

        int databaseSizeBeforeCreate = chartsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChartsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chartsAnnKh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCharts() throws Exception {
        // Initialize the database
        chartsRepository.saveAndFlush(chartsAnnKh);

        // Get all the chartsList
        restChartsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chartsAnnKh.getId().intValue())));
    }

    @Test
    @Transactional
    void getCharts() throws Exception {
        // Initialize the database
        chartsRepository.saveAndFlush(chartsAnnKh);

        // Get the charts
        restChartsMockMvc
            .perform(get(ENTITY_API_URL_ID, chartsAnnKh.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chartsAnnKh.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingCharts() throws Exception {
        // Get the charts
        restChartsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCharts() throws Exception {
        // Initialize the database
        chartsRepository.saveAndFlush(chartsAnnKh);

        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();

        // Update the charts
        ChartsAnnKh updatedChartsAnnKh = chartsRepository.findById(chartsAnnKh.getId()).get();
        // Disconnect from session so that the updates on updatedChartsAnnKh are not directly saved in db
        em.detach(updatedChartsAnnKh);

        restChartsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChartsAnnKh.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChartsAnnKh))
            )
            .andExpect(status().isOk());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
        ChartsAnnKh testCharts = chartsList.get(chartsList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingCharts() throws Exception {
        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();
        chartsAnnKh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChartsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chartsAnnKh.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chartsAnnKh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCharts() throws Exception {
        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();
        chartsAnnKh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChartsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chartsAnnKh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCharts() throws Exception {
        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();
        chartsAnnKh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChartsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chartsAnnKh))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChartsWithPatch() throws Exception {
        // Initialize the database
        chartsRepository.saveAndFlush(chartsAnnKh);

        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();

        // Update the charts using partial update
        ChartsAnnKh partialUpdatedChartsAnnKh = new ChartsAnnKh();
        partialUpdatedChartsAnnKh.setId(chartsAnnKh.getId());

        restChartsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChartsAnnKh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChartsAnnKh))
            )
            .andExpect(status().isOk());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
        ChartsAnnKh testCharts = chartsList.get(chartsList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateChartsWithPatch() throws Exception {
        // Initialize the database
        chartsRepository.saveAndFlush(chartsAnnKh);

        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();

        // Update the charts using partial update
        ChartsAnnKh partialUpdatedChartsAnnKh = new ChartsAnnKh();
        partialUpdatedChartsAnnKh.setId(chartsAnnKh.getId());

        restChartsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChartsAnnKh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChartsAnnKh))
            )
            .andExpect(status().isOk());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
        ChartsAnnKh testCharts = chartsList.get(chartsList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingCharts() throws Exception {
        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();
        chartsAnnKh.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChartsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chartsAnnKh.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chartsAnnKh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCharts() throws Exception {
        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();
        chartsAnnKh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChartsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chartsAnnKh))
            )
            .andExpect(status().isBadRequest());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCharts() throws Exception {
        int databaseSizeBeforeUpdate = chartsRepository.findAll().size();
        chartsAnnKh.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChartsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chartsAnnKh))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Charts in the database
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCharts() throws Exception {
        // Initialize the database
        chartsRepository.saveAndFlush(chartsAnnKh);

        int databaseSizeBeforeDelete = chartsRepository.findAll().size();

        // Delete the charts
        restChartsMockMvc
            .perform(delete(ENTITY_API_URL_ID, chartsAnnKh.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChartsAnnKh> chartsList = chartsRepository.findAll();
        assertThat(chartsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
