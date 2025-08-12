<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container-fluid">
      <!-- Brand -->
      <router-link class="navbar-brand fw-bold text-primary" to="/">Caseworker App</router-link>

      <!-- Toggler -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapsible Content -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <!-- Center Nav Links -->
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link class="nav-link" to="/task">Task</router-link>
          </li> -->
        </ul>

      </div>
    </div>
  </nav>
</template>