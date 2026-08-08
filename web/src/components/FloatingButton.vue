<template>
  <button type="button" class="btn btn-primary btn-lg end-0 m-3 shadow-sm rounded-4">
    <i class="bi bi-pencil-fill"></i>
    </button>
</template>

<style scoped>
:root {
    --bottom-navbar-height: 0px;
}

.btn {
    position: fixed;
    right: 1rem;
    bottom: calc(var(--bottom-navbar-height) + env(safe-area-inset-bottom));

    width: clamp(56px, 10vw, 96px);
    height: clamp(56px, 10vw, 96px);

    z-index: 1060;
}

[data-custom-theme="frappe"] .btn {
  color: color-mix(in srgb, var(--ctp-blue), black 65%);
}

.btn i {
    font-size: clamp(24px, 4vw, 36px);
}

.btn-primary {
  --bs-btn-color: var(--ctp-crust);
  --bs-btn-hover-color: color-mix(in srgb, var(--ctp-crust), black 8%);
  --bs-btn-focus-color: color-mix(in srgb, var(--ctp-crust), black 18%);
  --bs-btn-active-color: color-mix(in srgb, var(--ctp-crust), black 18%);
  
  --bs-btn-bg: var(--ctp-blue);
  --bs-btn-hover-bg: color-mix(in srgb, var(--ctp-blue), black 8%);
  --bs-btn-focus-bg: color-mix(in srgb, var(--ctp-blue), black 18%);
  --bs-btn-active-bg: color-mix(in srgb, var(--ctp-blue), black 18%);
}
</style>