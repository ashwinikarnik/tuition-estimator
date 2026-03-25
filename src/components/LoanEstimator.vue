<template>
  <section id="estimator" class="estimator" aria-labelledby="estimator-title">
    <div class="rds-container">
      <div class="estimator-card">
        <p class="estimator-card__label">2026-27 academic year</p>
        <h2 id="estimator-title">Estimate your tuition and loan eligibility</h2>
        <p class="estimator-card__intro">{{ APP_COPY.sectionIntro }}</p>

        <form class="estimator-form" @submit.prevent="handleEstimate">
          <fieldset class="estimator-fieldset">
            <legend>Student details</legend>

            <div class="form-grid">
              <label>
                Student type
                <DropdownApollo
                  v-model:selected-values="levelSelectedValues"
                  button-text="Select..."
                  class="estimator-dropdown"
                  :clearable="false"
                >
                  <DropdownItemApollo v-for="level in STUDENT_LEVELS" :key="level.value" :value="level.value">
                    {{ level.label }}
                  </DropdownItemApollo>
                </DropdownApollo>
              </label>

              <label>
                Degree
                <DropdownApollo
                  v-model:selected-values="degreeSelectedValues"
                  button-text="Select online degree..."
                  class="estimator-dropdown"
                  :disabled="!form.level"
                  :clearable="false"
                >
                  <DropdownItemApollo v-for="degree in degreeOptions" :key="degree.value" :value="degree.value">
                    {{ degree.label }}
                  </DropdownItemApollo>
                </DropdownApollo>
              </label>

              <label>
                Residency
                <DropdownApollo
                  v-model:selected-values="residencySelectedValues"
                  button-text="Select..."
                  class="estimator-dropdown"
                  :disabled="!form.level"
                  :clearable="false"
                >
                  <DropdownItemApollo
                    v-for="residency in RESIDENCIES"
                    :key="residency.value"
                    :value="residency.value"
                  >
                    {{ residency.label }}
                  </DropdownItemApollo>
                </DropdownApollo>
              </label>

              <template v-if="showUndergradAidFields">
                <label>
                  Are you a dependent student?
                  <DropdownApollo
                    v-model:selected-values="dependencyStatusSelectedValues"
                    button-text="Select..."
                    class="estimator-dropdown"
                    :clearable="false"
                  >
                    <DropdownItemApollo value="dependent">Yes</DropdownItemApollo>
                    <DropdownItemApollo value="independent">No</DropdownItemApollo>
                  </DropdownApollo>
                </label>

                <label>
                  Completed credits
                  <DropdownApollo
                    v-model:selected-values="completedCreditBandSelectedValues"
                    button-text="Select..."
                    class="estimator-dropdown"
                    :clearable="false"
                  >
                    <DropdownItemApollo v-for="band in COMPLETED_CREDIT_BANDS" :key="band.value" :value="band.value">
                      {{ band.label }}
                    </DropdownItemApollo>
                  </DropdownApollo>
                </label>
              </template>
            </div>
          </fieldset>

          <fieldset class="estimator-fieldset" :disabled="!isStepOneComplete">
            <legend>Credits per semester</legend>
            <p class="small-copy">Select each semester you plan to attend.</p>

            <div class="semester-toggle-group" role="group" aria-label="Semesters">
              <FormCheckbox
                v-for="semester in SEMESTERS"
                :id="`semester-${semester.id}`"
                :key="semester.id"
                v-model="form.semesters[semester.id]"
                :label="semester.label"
                name="semester-selection"
                size="sm"
                variant="outline"
                @changed="onSemesterChanged"
              />
            </div>

            <label class="range-input">
              Credits each selected semester: <strong>{{ form.creditsPerSemester }}</strong>
              <input v-model.number="form.creditsPerSemester" type="range" min="0" max="18" step="1" />
            </label>
            <div class="ticks" aria-hidden="true">
              <span>0</span>
              <span>3</span>
              <span>6</span>
              <span>9</span>
              <span>{{ fullTimeThreshold }} (full-time)</span>
              <span>15</span>
              <span>18</span>
            </div>

            <p v-if="eligibilityMessage" class="eligibility-message">{{ eligibilityMessage }}</p>
            <p v-if="!isStepOneComplete" class="small-copy">Complete step 1 first.</p>
          </fieldset>

          <p v-if="validationMessage" class="error-message">{{ validationMessage }}</p>

          <div class="cta-row">
            <button type="submit" class="btn btn-primary" :disabled="!isReadyToEstimate">Estimate my costs</button>
            <button type="button" class="btn btn-outline-primary" @click="resetForm">Start over</button>
          </div>
        </form>

        <section v-if="estimate" class="results" aria-live="polite">
          <h3>Your annual student loan estimate and tuition costs</h3>
          <p>{{ resultsContext }}</p>

          <div class="results-summary">
            <article>
              <p>Estimated tuition</p>
              <strong>{{ formatCurrency(estimate.totalTuition) }}</strong>
            </article>
            <article>
              <p>Estimated federal loan</p>
              <strong>{{ formatCurrency(estimate.totalLoan) }}</strong>
            </article>
            <article>
              <p>Remaining cost</p>
              <strong>{{ formatCurrency(estimate.totalRemainingCost) }}</strong>
            </article>
          </div>

          <p v-if="prorationMessage" class="small-copy">{{ prorationMessage }}</p>

          <table>
            <thead>
              <tr>
                <th>Semester</th>
                <th>Credits</th>
                <th>Tuition &amp; fees</th>
                <th>Federal loan</th>
                <th>Remaining cost</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in estimate.rows" :key="row.id">
                <td>{{ row.semester }}</td>
                <td>{{ row.credits }}</td>
                <td>{{ formatCurrency(row.tuition) }}</td>
                <td>({{ formatCurrency(row.loan) }})</td>
                <td>{{ formatCurrency(row.remainingCost) }}</td>
              </tr>
              <tr class="totals-row">
                <td>Total</td>
                <td>{{ estimate.totalCredits }}</td>
                <td>{{ formatCurrency(estimate.totalTuition) }}</td>
                <td>({{ formatCurrency(estimate.totalLoan) }})</td>
                <td>{{ formatCurrency(estimate.totalRemainingCost) }}</td>
              </tr>
            </tbody>
          </table>

          <aside v-if="showPellCallout" class="pell-callout">
            This estimate does not include Pell Grant funding, which can provide up to
            <strong>{{ formatCurrency(POLICY.maxPellGrant) }}</strong> per year for eligible undergraduate students.
          </aside>
        </section>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import {
  APP_COPY,
  COMPLETED_CREDIT_BANDS,
  DEGREE_OPTIONS,
  POLICY,
  RESIDENCIES,
  SEMESTERS,
  STUDENT_LEVELS
} from '../config/estimatorConfig';
import { formatCurrency, getFullTimeThreshold, runEstimate } from '../composables/useLoanEstimator';
import { FormCheckbox } from '@rds-vue-ui/form-checkbox';
import { DropdownApollo } from '@rds-vue-ui/dropdown-apollo';
import DropdownItemApollo from '@rds-vue-ui/dropdown-apollo/DropdownItemApollo.vue';

const initialState = () => ({
  level: '',
  degree: '',
  residency: '',
  dependencyStatus: '',
  completedCreditBand: '',
  semesters: {
    fall: false,
    spring: false,
    summer: false
  },
  creditsPerSemester: 0
});

const form = reactive(initialState());
const validationMessage = ref('');
const estimate = ref(null);

const toSelectedValues = (value) => {
  return value === '' || value === undefined || value === null ? [] : [value];
};

const toSingleSelectedValue = (values) => {
  return values?.length ? values[0] : '';
};

const degreeOptions = computed(() => DEGREE_OPTIONS[form.level] ?? []);
const showUndergradAidFields = computed(() => form.level === 'ug');
const levelSelectedValues = computed({
  get: () => toSelectedValues(form.level),
  set: (values) => {
    const nextLevel = String(toSingleSelectedValue(values));
    if (nextLevel === form.level) {
      return;
    }
    form.level = nextLevel;
    onLevelChange();
  }
});
const degreeSelectedValues = computed({
  get: () => toSelectedValues(form.degree),
  set: (values) => {
    form.degree = String(toSingleSelectedValue(values));
  }
});
const residencySelectedValues = computed({
  get: () => toSelectedValues(form.residency),
  set: (values) => {
    form.residency = String(toSingleSelectedValue(values));
  }
});
const dependencyStatusSelectedValues = computed({
  get: () => toSelectedValues(form.dependencyStatus),
  set: (values) => {
    form.dependencyStatus = String(toSingleSelectedValue(values));
  }
});
const completedCreditBandSelectedValues = computed({
  get: () => toSelectedValues(form.completedCreditBand),
  set: (values) => {
    const selectedValue = toSingleSelectedValue(values);
    form.completedCreditBand = selectedValue === '' ? '' : Number(selectedValue);
  }
});
const selectedSemesterIds = computed(() =>
  SEMESTERS.filter((semester) => form.semesters[semester.id]).map((semester) => semester.id)
);
const fullTimeThreshold = computed(() => getFullTimeThreshold(form.level));

const isStepOneComplete = computed(() => {
  const baseComplete = Boolean(form.level && form.degree && form.residency);
  if (!baseComplete) return false;

  if (form.level === 'ug') {
    return Boolean(form.dependencyStatus && form.completedCreditBand);
  }

  return true;
});

const isReadyToEstimate = computed(() => {
  return isStepOneComplete.value && selectedSemesterIds.value.length > 0 && form.creditsPerSemester > 0;
});

const eligibilityMessage = computed(() => {
  if (!selectedSemesterIds.value.length || form.creditsPerSemester === 0) return '';

  if (form.creditsPerSemester < POLICY.minCreditsToBorrow) {
    return 'Students taking fewer than 6 credits in a semester are not eligible for federal loans.';
  }

  if (form.creditsPerSemester < fullTimeThreshold.value) {
    return `Taking under ${fullTimeThreshold.value} credits prorates federal loan eligibility.`;
  }

  return '';
});

const resultsContext = computed(() => {
  const names = SEMESTERS.filter((semester) => selectedSemesterIds.value.includes(semester.id)).map(
    (semester) => semester.label
  );

  if (!names.length) return '';
  if (names.length === 1) return `This estimate is based on your enrollment in ${names[0]}.`;

  const tail = names.at(-1);
  return `This estimate is based on your enrollment in ${names.slice(0, -1).join(', ')} and ${tail}.`;
});

const prorationMessage = computed(() => {
  if (!estimate.value) return '';
  if (form.creditsPerSemester < POLICY.minCreditsToBorrow) return 'Below minimum enrollment: no federal loan eligibility.';

  const ratio = estimate.value.enrollmentRatio;
  if (ratio >= 1) return '';
  return `Eligible for ${Math.round(ratio * 100)}% of the annual Direct Loan limit based on enrollment intensity.`;
});

const showPellCallout = computed(() => {
  return form.level === 'ug' && Boolean(estimate.value?.totalRemainingCost > 0);
});

function onLevelChange() {
  form.degree = '';
  form.residency = '';

  if (form.level !== 'ug') {
    form.dependencyStatus = '';
    form.completedCreditBand = '';
  }

  estimate.value = null;
  validationMessage.value = '';
}

function handleEstimate() {
  validationMessage.value = '';

  if (!isReadyToEstimate.value) {
    validationMessage.value = 'Complete all required fields and select credits before estimating.';
    return;
  }

  const output = runEstimate({
    level: form.level,
    degree: form.degree,
    residency: form.residency,
    dependencyStatus: form.dependencyStatus,
    completedCreditBand: Number(form.completedCreditBand),
    selectedSemesterIds: selectedSemesterIds.value,
    creditsPerSemester: Number(form.creditsPerSemester)
  });

  if (!output) {
    validationMessage.value = 'Unable to calculate with the selected combination. Please review your selections.';
    return;
  }

  estimate.value = output;
}

function resetForm() {
  Object.assign(form, initialState());
  validationMessage.value = '';
  estimate.value = null;
}

function onSemesterChanged() {
  validationMessage.value = '';
}
</script>
