<template>
  <button type="button" class="btn btn-primary btn-lg end-0 m-3 shadow-sm rounded-4" id="fab" style="--bs-btn-bg: var(--bs-primary-bg-subtle); --bs-btn-border-color: var(--bs-primary-bg-subtle);">
    <i class="bi bi-pencil-fill"></i>
    </button>
</template>

<style>
:root {
    --bottom-navbar-height: 0px;
}

#fab {
    position: fixed;
    right: 1rem;
    bottom: calc(var(--bottom-navbar-height) + env(safe-area-inset-bottom));

    width: clamp(56px, 10vw, 96px);
    height: clamp(56px, 10vw, 96px);

    z-index: 1060;
}

#fab i {
    font-size: clamp(24px, 4vw, 36px);
}
</style>