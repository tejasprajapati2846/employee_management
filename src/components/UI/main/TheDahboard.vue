<template>
  <div>
    <the-header></the-header>
    <div id="layoutSidenav">
      <side-navbar></side-navbar>
      <div id="layoutSidenav_content">
        <main>
          <div class="container-fluid px-4">
            <h1 class="mt-4">Dashboard</h1>
            <ol class="breadcrumb mb-4">
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
            <div class="row">
              <dashboard-card cardClass="bg-primary" title="Employee" href="/employees" text="View Employees"
                :count="employees"></dashboard-card>

              <dashboard-card cardClass="bg-primary" title="Projects" href="/projects" text="View Projects"
                :count="projects"></dashboard-card>

              <dashboard-card cardClass="bg-primary" title="Departments" href="/departments" text="View Departments"
                :count="departments"></dashboard-card>

              <dashboard-card cardClass="bg-primary" title="Skills" href="/skills" text="View Skills"
                :count="skills"></dashboard-card>

              <dashboard-card cardClass="bg-primary" title="Roles" href="/roles" text="View Roles"
                :count="roles"></dashboard-card>

              <dashboard-card cardClass="bg-primary" title="Tasks" href="/tasks" text="View Tasks"
                :count="tasks"></dashboard-card>
            </div>
            <div class="card mb-4"></div>
          </div>
        </main>
        <the-footer></the-footer>
      </div>
    </div>
  </div>
</template>

<script>
import DashboardCard from "./DashboardCard.vue";
import axios from "axios";

export default {
  data() {
    return {
      employees: 0,
      departments: 0,
      skills: 0,
      roles: 0,
      projects: 0,
      tasks: 0,
      columns: [
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Age",
          field: "age",
        },
        {
          label: "Created On",
          field: "createdAt",
        },
        {
          label: "Percent",
          field: "score",
        },
      ],
      rows: [],
    };
  },
  mounted() {
    const token = localStorage.getItem('authToken');
    axios
      .get("http://127.0.0.1:8000/api/dashboard", {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.data.data) {
          this.employees = response.data.data.employees;
          this.skills = response.data.data.skills;
          this.projects = response.data.data.projects;
          this.tasks = response.data.data.tasks;
          this.roles = response.data.data.roles;
          this.departments = response.data.data.departments;
        }
      })
      .catch((error) => {
        localStorage.removeItem('authToken');
      });
  },
  components: {
    DashboardCard,
  },
};
</script>
