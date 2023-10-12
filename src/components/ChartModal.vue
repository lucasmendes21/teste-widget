<template>
  <div>
    <div class="modal fade" id="chartModal" tabindex="-1" aria-labelledby="chartModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="chartModalLabel">Dados Diarios da Arrecadação</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="button" class="btn btn-primary">Filtrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 992px) {
  .modal-lg, .modal-xl {
    max-width: 97%;
    min-height: 90%;
    height: 90%;
  }
}

@media (min-width: 1200px) {
  .modal-xl {
    max-width: 97%;
    min-height: 90%;
    height: 90%;
  }
}
</style>
