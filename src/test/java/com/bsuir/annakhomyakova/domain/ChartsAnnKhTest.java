package com.bsuir.annakhomyakova.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.bsuir.annakhomyakova.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChartsAnnKhTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChartsAnnKh.class);
        ChartsAnnKh chartsAnnKh1 = new ChartsAnnKh();
        chartsAnnKh1.setId(1L);
        ChartsAnnKh chartsAnnKh2 = new ChartsAnnKh();
        chartsAnnKh2.setId(chartsAnnKh1.getId());
        assertThat(chartsAnnKh1).isEqualTo(chartsAnnKh2);
        chartsAnnKh2.setId(2L);
        assertThat(chartsAnnKh1).isNotEqualTo(chartsAnnKh2);
        chartsAnnKh1.setId(null);
        assertThat(chartsAnnKh1).isNotEqualTo(chartsAnnKh2);
    }
}
