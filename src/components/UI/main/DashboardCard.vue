<template>
  <div class="col-xl-3 col-md-6">
    <div class="card text-white mb-4" :class="cardClass">
      <div class="card-body d-flex align-items-center justify-content-between">
        {{ title }} <span>{{ count }}</span>
      </div>
      <div
        class="card-footer d-flex align-items-center justify-content-between"
      >
        <router-link
          class="small text-white stretched-link text-decoration-none"
          :to="href"
          >{{ text }}</router-link
        >
        <div class="small text-white">
          <i class="fas fa-angle-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["cardClass", "title", "text", "href", "count"],
};
</script>
