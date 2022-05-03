package com.bsuir.annakhomyakova.web.rest;

import com.bsuir.annakhomyakova.domain.ChartsAnnKh;
import com.bsuir.annakhomyakova.repository.ChartsRepository;
import com.bsuir.annakhomyakova.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.bsuir.annakhomyakova.domain.ChartsAnnKh}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChartsResource {

    private final Logger log = LoggerFactory.getLogger(ChartsResource.class);

    private static final String ENTITY_NAME = "charts";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChartsRepository chartsRepository;

    public ChartsResource(ChartsRepository chartsRepository) {
        this.chartsRepository = chartsRepository;
    }

    /**
     * {@code POST  /charts} : Create a new charts.
     *
     * @param chartsAnnKh the chartsAnnKh to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new chartsAnnKh, or with status {@code 400 (Bad Request)} if the charts has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/charts")
    public ResponseEntity<ChartsAnnKh> createCharts(@RequestBody ChartsAnnKh chartsAnnKh) throws URISyntaxException {
        log.debug("REST request to save Charts : {}", chartsAnnKh);
        if (chartsAnnKh.getId() != null) {
            throw new BadRequestAlertException("A new charts cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChartsAnnKh result = chartsRepository.save(chartsAnnKh);
        return ResponseEntity
            .created(new URI("/api/charts/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /charts/:id} : Updates an existing charts.
     *
     * @param id the id of the chartsAnnKh to save.
     * @param chartsAnnKh the chartsAnnKh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chartsAnnKh,
     * or with status {@code 400 (Bad Request)} if the chartsAnnKh is not valid,
     * or with status {@code 500 (Internal Server Error)} if the chartsAnnKh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/charts/{id}")
    public ResponseEntity<ChartsAnnKh> updateCharts(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChartsAnnKh chartsAnnKh
    ) throws URISyntaxException {
        log.debug("REST request to update Charts : {}, {}", id, chartsAnnKh);
        if (chartsAnnKh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chartsAnnKh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chartsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // no save call needed as we have no fields that can be updated
        ChartsAnnKh result = chartsAnnKh;
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chartsAnnKh.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /charts/:id} : Partial updates given fields of an existing charts, field will ignore if it is null
     *
     * @param id the id of the chartsAnnKh to save.
     * @param chartsAnnKh the chartsAnnKh to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated chartsAnnKh,
     * or with status {@code 400 (Bad Request)} if the chartsAnnKh is not valid,
     * or with status {@code 404 (Not Found)} if the chartsAnnKh is not found,
     * or with status {@code 500 (Internal Server Error)} if the chartsAnnKh couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/charts/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChartsAnnKh> partialUpdateCharts(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChartsAnnKh chartsAnnKh
    ) throws URISyntaxException {
        log.debug("REST request to partial update Charts partially : {}, {}", id, chartsAnnKh);
        if (chartsAnnKh.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, chartsAnnKh.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!chartsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChartsAnnKh> result = chartsRepository
            .findById(chartsAnnKh.getId())
            .map(existingCharts -> {
                return existingCharts;
            })// .map(chartsRepository::save)
        ;

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, chartsAnnKh.getId().toString())
        );
    }

    /**
     * {@code GET  /charts} : get all the charts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of charts in body.
     */
    @GetMapping("/charts")
    public List<ChartsAnnKh> getAllCharts() {
        log.debug("REST request to get all Charts");
        return chartsRepository.findAll();
    }

    /**
     * {@code GET  /charts/:id} : get the "id" charts.
     *
     * @param id the id of the chartsAnnKh to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the chartsAnnKh, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/charts/{id}")
    public ResponseEntity<ChartsAnnKh> getCharts(@PathVariable Long id) {
        log.debug("REST request to get Charts : {}", id);
        Optional<ChartsAnnKh> chartsAnnKh = chartsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(chartsAnnKh);
    }

    /**
     * {@code DELETE  /charts/:id} : delete the "id" charts.
     *
     * @param id the id of the chartsAnnKh to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/charts/{id}")
    public ResponseEntity<Void> deleteCharts(@PathVariable Long id) {
        log.debug("REST request to delete Charts : {}", id);
        chartsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
