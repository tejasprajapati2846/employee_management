<template>
  <div>
    <the-header name="header"></the-header>
    <div id="layoutSidenav">
      <side-navbar></side-navbar>
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <div class="row">
            <div class="col">
              <h3 class="mt-4">Employees</h3>
            </div>
            <div class="col-auto m-4">
              <button class="btn btn-primary" @click="addEmployee()">
                Add Employee
              </button>
            </div>
          </div>
          <div class="card m-4">
            <vue-good-table :columns="columns" :rows="rows" :search-options="{
              enabled: true,
            }" :pagination-options="{
  enabled: true,
}" :sort-options="{
  enabled: true,
  multipleColumns: true,
  initialSortBy: [{ field: 'id', type: 'asc' }],
}">
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

  <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-2">
              <label for="name">Name :</label>
              <input type="text" class="form-control" id="name" v-model="name" aria-describedby="name"
                placeholder="Enter Name" required="required"/>
            </div>
            <div class="mb-2">
              <label for="email">Email :</label>
              <input type="email" class="form-control" id="email" v-model="email" aria-describedby="emailHelp"
                placeholder="Enter email" :disabled="!showAddEmployee" required/>
            </div>
            <div class="mb-2">
              <label for="phone">Phone :</label>
              <input type="text" class="form-control" id="phone" v-model="phone" aria-describedby="phone"
                placeholder="Enter Phone" required/>
            </div>
            <div class="mb-2">
              <label for="date_of_birth">Date Of Birth :</label>
              <input type="date" class="form-control" id="date_of_birth" v-model="date_of_birth"
                aria-describedby="date_of_birth" placeholder="Enter Date of Birth" required/>
            </div>
            <div class="mb-2">
              <label for="joining_date">Joining Date :</label>
              <input type="date" class="form-control" id="joining_date" v-model="joining_date"
                aria-describedby="joining_date" placeholder="Enter joining date" required/>
            </div>
            <div class="mb-2">
              <label for="role" class="form-label">Role</label>
              <select class="form-select" multiple aria-label="multiple select" v-model="selectedRole" required>
                <option v-for="role in roles" :key="role.id" :value="role.id">
                  {{ role.name }}
                </option>
              </select>
            </div>
            <div class="mb-2">
              <label for="department" class="form-label">Department</label>
              <select class="form-select form-select mb-3" aria-label=".form-select-lg example" v-model="department" required>
                <option value="" disabled>Not Selected</option>
                <option v-for="department in departments" :key="department.id" :value="department.id">
                  {{ department.name }}
                </option>
              </select>
            </div>
            <div class="modal-footer border-top-0 d-flex justify-content-center"></div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal()">
            Close
          </button>
          <button v-if="showAddEmployee" type="submit" class="btn btn-success">
            Add Employee
          </button>
          <button v-if="showEditEmployee" type="button" class="btn btn-success" @click="saveChanges()">
            Update Employee
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
      email: null,
      phone: null,
      date_of_birth: null,
      joining_date: null,
      department: null,
      selectedRole: [],
      currentRow: null,
      departments: [],
      roles: [],
      modalTitle: "Edit Employee",
      showEditEmployee: false,
      showAddEmployee: false,
      isEditModalVisible: false,
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
          label: "Email",
          field: "email",
        },
        {
          label: "Phone",
          field: "phone",
        },
        {
          label: "Department",
          field: "department.name",
        },
        {
          label: "Role",
          field: "roles",
          formatFn(value) {
            return value.map((roles) => roles.name).join(", ");
          },
        },
        {
          label: "Date of Birth",
          field: "date_of_birth",
        },
        {
          label: "Joining Date",
          field: "joining_date",
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
    token = localStorage.getItem('authToken');
    mymodal = new bootstrap.Modal(document.getElementById("exampleModal"));

    //Employee Details
    axios
      .get("http://127.0.0.1:8000/api/employee", {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        this.rows = response.data.data;
      })
      .catch((error) => {
        this.error = error.message;
        this.loading = false;
      });

    //Departments
    axios
      .get("http://127.0.0.1:8000/api/department", {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        this.departments = response.data.data;
      })
      .catch((error) => {
        this.error = error.message;
        this.loading = false;
      });

    //Roles
    axios
      .get("http://127.0.0.1:8000/api/role", {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        this.roles = response.data.data;
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
    closeModal() {
      mymodal.hide();
    },
    addEmployee() {
      (this.modalTitle = "Add Role"), (this.showEditEmployee = false);
      this.showAddEmployee = true;
      this.name = "";
      this.email = "";
      this.phone = "";
      this.department = "";
      this.date_of_birth = "";
      this.joining_date = "";
      this.department = "";
      this.role_ids = "";
      mymodal.show();
    },
    saveEmployee() {
      return;
      try {
        const adddRow = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          department: this.department,
          date_of_birth: this.date_of_birth,
          joining_date: this.joining_date,
          department_id: this.department,
          role_ids: this.selectedRole
        };

        axios
          .post(`http://127.0.0.1:8000/api/employee`, adddRow, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            }
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
      mymodal.show();
      const roleIds = row.roles.map((role) => role.id);
      this.currentRow = row;
      this.name = row.name;
      this.email = row.email;
      this.phone = row.phone;
      this.date_of_birth = row.date_of_birth;
      this.joining_date = row.joining_date;
      this.department = row.department ? row.department.id : "";
      this.selectedRole = roleIds;
    },
    saveChanges() {
      try {
        const editedRow = {
          name: this.name,
          phone: this.phone,
          date_of_birth: this.date_of_birth,
          joining_date: this.joining_date,
          department_id: this.department,
          role_ids: this.selectedRole,
        };

        axios
          .put(
            `http://127.0.0.1:8000/api/employee/${this.currentRow.id}`,
            editedRow, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              }
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
            console.warn(error);
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
            .delete(`http://127.0.0.1:8000/api/employee/${row.id}`, {
              headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              }
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
