<!-- src/components/Modals.vue -->
<template>
  <div>
    <ModalRevenue
      v-if="store.activeModal === 'revenue'"
      @close="store.closeModal()"
    />
    <ModalLeads
      v-if="store.activeModal === 'leads'"
      @close="store.closeModal()"
    />
    <ModalPromo
      v-if="store.activeModal === 'promo'"
      @close="store.closeModal()"
    />
    <ModalTarget
      v-if="store.activeModal === 'target'"
      @close="store.closeModal()"
    />
    <ModalKodeAkses
      v-if="store.activeModal === 'kodeakses'"
      @close="store.closeModal()"
    />
    <ModalProgress
      v-if="store.activeModal === 'progress'"
      @close="store.closeModal()"
    />
    <ModalSpvReport
      v-if="store.activeModal === 'spv-report'"
      @close="store.closeModal()"
    />
    <ModalAlert
      v-if="store.activeModal === 'alert'"
      @close="store.closeModal()"
    />
  </div>
</template>

<script setup>
import { store } from "../store";
import ModalRevenue from "./modals/ModalRevenue.vue";
import ModalLeads from "./modals/ModalLeads.vue";
import ModalPromo from "./modals/ModalPromo.vue";
import ModalTarget from "./modals/ModalTarget.vue";
import ModalKodeAkses from "./modals/ModalKodeAkses.vue";
import ModalProgress from "./modals/ModalProgress.vue";
import ModalSpvReport from "./modals/ModalSpvReport.vue";
import ModalAlert from "./modals/ModalAlert.vue";
</script>
