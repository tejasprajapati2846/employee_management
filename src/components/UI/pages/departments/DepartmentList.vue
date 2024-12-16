<template>
  <div>
    <the-header name="header"></the-header>
    <div id="layoutSidenav">
      <side-navbar></side-navbar>
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <div class="row">
            <div class="col">
              <h3 class="mt-4">Departments</h3>
            </div>
            <div class="col-auto m-4">
              <button class="btn btn-primary" @click="addDepartment()">
                Add Department
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
              :line-numbers="true"
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
          <h5 class="modal-title" id="exampleModalLabel">Edit Department</h5>
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
              <label for="department">Department Name :</label>
              <input
                type="text"
                class="form-control"
                id="department"
                v-model="department"
                aria-describedby="department"
                placeholder="Enter Department Name"
                required
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal()">
            Close
          </button>
          <button
            v-if="showAddDepartment"
            type="button"
            class="btn btn-success"
            @click="saveDepartment()"
          >
            Add Role
          </button>
          <button
            v-if="showEditDepartment"
            type="button"
            class="btn btn-success"
            @click="saveChanges()"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import axios from "axios";
let mymodal;
let token;
token = localStorage.getItem("authToken");
export default {
  data() {
    return {
      modalTitle: "Add Skill",
      showEditDepartment: false,
      showAddDepartment: true,
      department: "",
      currentRow: null,
      columns: [
        {
          label: "Id",
          field: "id",
          type: "number",
        },
        {
          label: "Name",
          field: "name",
        },
        {
          label: "Total Employees",
          field: "employees_count",
        },
        {
          label: "Created Date",
          field: "created_at",
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
    mymodal = new bootstrap.Modal(document.getElementById("exampleModal"));
    const token = localStorage.getItem('authToken');
    const success = this.$store.dispatch('fetchDepartments', { token });
        if (success) {
          this.rows = JSON.parse(JSON.stringify(this.$store.getters.departments))
        } else {
          this.$swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch departments!',
          });
        }
  },
  methods: {
    closeModal() {
      mymodal.hide();
    },
    addDepartment() {
      (this.modalTitle = "Add Department"), (this.showEditDepartment = false);
      this.showAddDepartment = true;
      this.department = "";
      mymodal.show();
    },
    saveDepartment() {
      try {
        const editedRow = {
          department: this.department,
        };
        axios
          .post(`http://127.0.0.1:8000/api/department`, editedRow,{headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }})
          .then((response) => {
            console.log(response.data);
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
            console.log(error);
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
            .delete(`http://127.0.0.1:8000/api/department/${row.id}`,{headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }})
            .then((response) => {
              const index = this.rows.findIndex((r) => r.id === row.id);
              if (index !== -1) {
                this.rows.splice(index, 1);
                this.$swal.fire({
                  title: "Deleted!",
                  text: response.data.message,
                  icon: "success",
                });
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
    editRow(row) {
      this.currentRow = row;
      (this.modalTitle = "Edit Department"), (this.showEditDepartment = true);
      this.showAddDepartment = false;
      this.department = row.name;
      mymodal.show();
    },
    viewDetails(row) {
      console.log("Viewing details of row:", row);
    },
    closeEditModal() {
      this.isEditModalVisible = false;
    },
    saveChanges() {
      try {
        const editedRow = {
          department: this.department,
        };

        axios
          .put(
            `http://127.0.0.1:8000/api/department/${this.currentRow.id}`,
            editedRow,{headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }}
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
            mymodal.hide();
            this.$swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          });
      } catch (error) {
        console.error("Error saving changes:", error);
      }
    },
  },
};
</script>
