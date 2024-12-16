<template>
  <div>
    <the-header name="header"></the-header>
    <div id="layoutSidenav">
      <side-navbar></side-navbar>
      <div id="layoutSidenav_content">
        <div class="container-fluid px-4">
          <div class="row">
            <div class="col">
              <h3 class="mt-4">Skills</h3>
            </div>
            <div class="col-auto m-4">
              <button class="btn btn-primary" @click="addSkill()">
                Add Skill
              </button>
            </div>
          </div>
          <div class="card m-2">
            <vue-good-table :columns="columns" :rows="rows" :search-options="{
              enabled: true,
            }" :pagination-options="{
  enabled: true,
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
              <label for="skill">Skill :</label>
              <input type="text" class="form-control" id="skill" v-model="skill" aria-describedby="skill"
                placeholder="Enter Skill Name" />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal()">
            Close
          </button>
          <button v-if="showAddSkill" type="button" class="btn btn-success" @click="saveSkill()">
            Add Skill
          </button>
          <button v-if="showEditSkill" type="button" class="btn btn-success" @click="saveChanges()">
            Update
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
      modalTitle: "Edit Skill",
      showAddSkill: false,
      showEditSkill: false,
      skill: "",
      columns: [
        {
          label: "Id",
          field: "id",
          type: "number",
        },
        {
          label: "Stack",
          field: "name",
        },
        {
          label: "Total Employee",
          field: "employees_count",
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
  methods: {
    closeModal() {
      mymodal.hide();
      this.clearModalField();
    },
    addSkill() {
      this.modalTitle = "Add Skill",
        this.showEditSkill = false;
      this.showAddSkill = true;
      this.skill = '';
      mymodal.show();
    },
    saveSkill() {
      try {
        const editedRow = {
          role: this.skill,
        };

        axios
          .post(`http://127.0.0.1:8000/api/skill`, editedRow,
            {
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
      (this.modalTitle = "Edit Employee"), (this.showAddSkill = false);
      this.showEditSkill = true;
      this.currentRow = row;
      this.skill = row.name;
      mymodal.show();
    },
    saveChanges() {
      try {
        const editedRow = {
          skill: this.skill,
        };
        axios
          .put(
            `http://127.0.0.1:8000/api/skill/${this.currentRow.id}`,
            editedRow,
            {
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
    clearModalField() {
      this.skill = "";
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
            .delete(`http://127.0.0.1:8000/api/skill/${row.id}`,
              {
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
  mounted() {
    token = localStorage.getItem('authToken');
    mymodal = new bootstrap.Modal(document.getElementById("exampleModal"));

    axios
      .get("http://127.0.0.1:8000/api/skill",
        {
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
  },
  components: {
    VueGoodTable,
  },
};
</script>
  