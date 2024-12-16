<template>
  <div id="layoutSidenav_nav">
    <nav class="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div class="sb-sidenav-menu">
        <div class="nav">
          <div class="sb-sidenav-menu-heading">Menu</div>
          <nav-item
            icon="fas fa-tachometer-alt"
            href="/dashboard"
            text="Dashboard"
          ></nav-item>
          <nav-item
            icon="fas fa-building"
            href="/departments"
            text="Departments"
          ></nav-item>
          <nav-item
            icon="fas fa-users"
            href="/employees"
            text="Employees"
          ></nav-item>
          <nav-item
            icon="fas fa-project-diagram	"
            href="/projects"
            text="Projects"
          ></nav-item>
          <nav-item 
            icon="fas fa-tasks" 
            href="/tasks" 
            text="Tasks"
          ></nav-item>
          <nav-item
            icon="fas fa-user-circle"
            href="/roles"
            text="Roles"
          ></nav-item>
          <nav-item
            icon="fas fa-building"
            href="/skills"
            text="Skills"
          ></nav-item>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {};
</script>
