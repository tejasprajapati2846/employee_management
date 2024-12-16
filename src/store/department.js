import axios from "axios";

export default {
  state: {
    departments: [],
    department: {
      id: null,
      name: "",
      employees_count: null,
      created_at: null,
    },
    modalTitle: "Add Skill",
  },

  mutations: {
    SET_DEPARTMENTS(state, departments) {
      state.departments = departments;
    },
    SET_DEPARTMENT(state, department) {
      state.department = department;
    },
    RESET_DEPARTMENT(state) {
      state.department = {
        id: null,
        name: "",
        employees_count: null,
        created_at: null,
      };
    },
    SET_MODAL_TITLE(state, title) {
      state.modalTitle = title;
    },
  },

  actions: {
    async fetchDepartments({ commit }, { token }) {
      try {
        await axios
          .get("http://127.0.0.1:8000/api/department", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            commit("SET_DEPARTMENTS", response.data.data);
            return true;
          })
          .catch((error) => {
            return false;
          });
      } catch (error) {
        return false;
      }
    },
    async addDepartment({ commit, dispatch }, departmentData) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/department",
          departmentData
        );
        commit("SET_DEPARTMENTS", [...state.departments, response.data.data]);
        commit("RESET_DEPARTMENT");
        return response.data;
      } catch (error) {
        console.error("Error adding department:", error);
        throw error;
      }
    },
    async deleteDepartment({ commit }, departmentId) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/department/${departmentId}`
        );
        commit(
          "SET_DEPARTMENTS",
          state.departments.filter(
            (department) => department.id !== departmentId
          )
        );
        return true;
      } catch (error) {
        console.error("Error deleting department:", error);
        throw error;
      }
    },
    async updateDepartment({ commit }, { departmentId, departmentData }) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/department/${departmentId}`,
          departmentData
        );
        const updatedDepartments = state.departments.map((department) => {
          if (department.id === departmentId) {
            return response.data.data;
          }
          return department;
        });
        commit("SET_DEPARTMENTS", updatedDepartments);
        return response.data;
      } catch (error) {
        console.error("Error updating department:", error);
        throw error;
      }
    },
  },

  getters: {
    departments: (state) =>  {
        return state.departments;
    },
    department: (state) => state.department,
    modalTitle: (state) => state.modalTitle,
  },
};
