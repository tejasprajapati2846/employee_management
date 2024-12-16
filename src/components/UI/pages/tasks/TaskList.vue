<template>
  <div>
    <the-header name="header"></the-header>
    <div id="layoutSidenav">
      <side-navbar></side-navbar>
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <div class="row">
            <div class="col">
              <h3 class="mt-4">Task</h3>
            </div>
            <div class="col-auto m-4">
              <button class="btn btn-primary" @click="addTask()">
                Add Task
              </button>
            </div>
          </div>
          <div class="card m-4">
            <vue-good-table
              :columns="columns"
              :rows="rows"
              :search-options="{
                enabled: true,
              }"
              :pagination-options="{
                enabled: true,
              }"
              :sort-options="{
                enabled: true,
                multipleColumns: true,
                initialSortBy: [{ field: 'id', type: 'asc' }],
              }"
            >
              <template v-slot:table-row="props">
                <span v-if="props.column.field == 'action'">
                  {{ props.formattedRow[props.column.field] }}
                  <span v-on:click="editRow(props.row)">
                    <i class="fas fa-edit text-warning mx-1 z-10"></i>
                  </span>
                  <span>|</span>
                  <span @click="deleteRow(props.row)">
                    <i class="fas fa-trash text-danger mx-1"></i>
                  </span>
                </span>
              </template>
            </vue-good-table>
          </div>
        </div>
        <the-footer name="footer"></the-footer>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-2">
              <label for="name">Name :</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="name"
                aria-describedby="name"
                placeholder="Enter Name"
              />
            </div>
            <div class="mb-2">
              <label for="description">Description :</label>
              <input
                type="text"
                class="form-control"
                id="description"
                v-model="description"
                aria-describedby="description"
                placeholder="Enter description"
              />
            </div>
            <div class="mb-2">
              <label for="status" class="form-label">Status</label>
              <select
                class="form-select form-select mb-3"
                aria-label=".form-select-lg example"
                v-model="status"
              >
                <option value="" disabled>No status Selected</option>
                <option v-for="st in statusList" :key="st.id" :value="st">
                  {{ st }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label for="start_date">Start Date :</label>
              <input
                type="date"
                class="form-control"
                id="start_date"
                v-model="start_date"
                aria-describedby="start_date"
                placeholder="Enter start date"
              />
            </div>
            <div class="mb-2">
              <label for="joining_date">End Date :</label>
              <input
                type="date"
                class="form-control"
                id="end_date"
                v-model="end_date"
                aria-describedby="end_date"
                placeholder="Enter end date"
              />
            </div>
            <div class="mb-2">
              <label for="employee_ids" class="form-label">Employees</label>
              <select
                class="form-select"
                multiple
                aria-label="multiple select"
                v-model="employee_ids"
              >
                <option
                  v-for="employee in employees"
                  :key="employee.id"
                  :value="employee.id"
                >
                  {{ employee.name }}
                </option>
              </select>
            </div>
            <div
              class="modal-footer border-top-0 d-flex justify-content-center"
            ></div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal()">
            Close
          </button>
          <button
            v-if="showAddTask"
            type="button"
            class="btn btn-success"
            @click="saveEmployee()"
          >
            Add Task
          </button>
          <button
            v-if="showEditTask"
            type="button"
            class="btn btn-success"
            @click="saveChanges()"
          >
            Update Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { VueGoodTable } from "vue-good-table-next";
import axios from "axios";
let mymodal;
let token;

export default {
  data() {
    return {
      name: null,
      description: null,
      status: null,
      statusList: ["active", "inactive", "onhold", "complete"],
      start_date: null,
      end_date: null,
      employee_ids: [],
      employees: null,
      modalTitle: "Edit Employee",
      showEditTask: false,
      showAddTask: false,
      isEditModalVisible: false,
      columns: [
        {
          label: "Id",
          field: "id",
          type: "number",
        },
        {
          label: "Task Name",
          field: "name",
        },
        {
          label: "Project Name",
          field: "name",
        },
        {
          label: "Description",
          field: "description",
        },
        {
          label: "Status",
          field: "status",
          tdClass: this.tdClassFunc,
        },
        {
          label: "Employees",
          field: "employees_count",
        },
        {
          label: "Start Date",
          field: "start_date",
        },
        {
          label: "End Date",
          field: "end_date",
        },
        {
          label: "Action",
          field: "action",
          sortable: false,
        },
      ],
      rows: [],
    };
  },
  mounted() {
    token = localStorage.getItem("authToken");
    mymodal = new bootstrap.Modal(document.getElementById("exampleModal"));

    axios
      .get("http://127.0.0.1:8000/api/task", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        this.rows = response.data.data;
      })
      .catch((error) => {
        this.error = error.message;
        this.loading = false;
      });

    axios
      .get("http://127.0.0.1:8000/api/employee", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        this.employees = response.data.data;
      })
      .catch((error) => {
        this.error = error.message;
        this.loading = false;
      });
  },
  components: {
    VueGoodTable,
  },
  methods: {
    tdClassFunc(row) {
      if (row.status == "inactive") {
        return "text-danger";
      } else if (row.status == "active") {
        return "text-primary";
      } else if (row.status == "complete") {
        return "text-success";
      } else if (row.status == "onhold") {
        return "text-warning";
      }
    },
    closeModal() {
      mymodal.hide();
    },
    addTask() {
      (this.modalTitle = "Add Task"), (this.showEditTask = false);
      this.showAddTask = true;
      this.name = "";
      this.description = "";
      this.status = "";
      this.start_date = "";
      this.end_date = "";
      this.employee_ids = [];
      mymodal.show();
    },
    saveEmployee() {
      try {
        const adddRow = {
          name: this.name,
          description: this.description,
          status: this.status,
          start_date: this.start_date,
          end_date: this.end_date,
          employee_ids: this.employee_ids,
        };

        axios
          .post(`http://127.0.0.1:8000/api/task`, adddRow, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (response.data.success) {
              this.rows.push(response.data.data);
              mymodal.hide();
              this.$swal.fire({
                title: "Created!",
                text: response.data.message,
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.warn(error);
            mymodal.hide();
            this.$swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    },
    editRow(row) {
      (this.showEditTask = true), mymodal.show();
      this.currentRow = row;
      this.name = row.name;
      this.description = row.description;
      this.status = row.status;
      this.start_date = row.start_date;
      this.end_date = row.end_date;
      if (row.employees) {
        this.employee_ids = [];
        row.employees.map((employee) => this.employee_ids.push(employee.id));
      }
    },
    saveChanges() {
      try {
        const editedRow = {
          name: this.name,
          description: this.description,
          status: this.status,
          start_date: this.start_date,
          end_date: this.end_date,
          employee_ids: this.employee_ids,
        };

        axios
          .put(
            `http://127.0.0.1:8000/api/task/${this.currentRow.id}`,
            editedRow,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            if (response.data.success) {
              let rowIndex = this.rows.findIndex(
                (row) => row.id === this.currentRow.id
              );

              if (rowIndex !== -1) {
                this.rows[rowIndex] = response.data.data;
              }
              mymodal.hide();
              this.$swal.fire({
                title: "Updated!",
                text: response.data.message,
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.$swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      } catch (error) {
        this.$swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    },
    deleteRow(row) {
      const confirmed = this.$swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`http://127.0.0.1:8000/api/task/${row.id}`, {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              if (response.data.success) {
                const index = this.rows.findIndex((r) => r.id === row.id);
                if (index !== -1) {
                  this.rows.splice(index, 1);
                  this.$swal.fire({
                    title: "Deleted!",
                    text: response.data.message,
                    icon: "success",
                  });
                }
              }
            })
            .catch((error) => {
              mymodal.hide();
              this.$swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            });
        }
      });
    },
  },
};
</script>
