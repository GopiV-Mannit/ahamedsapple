<template>
  <div class="full">
    <Header class="Header" />
    <div class="top">
      <div class="expected-date">
        <label for="chooseDate">Choose the Date</label>
        <input type="date" id="chooseDate" @input="updateDate" class="custom-input" />
      </div>
      <div class="search-input">
        <span class="search-icon" @click="searchReport">&#128269;</span>
      </div>
    </div>
    <div class="table-container" id="no-more-tables">
      <table class="table">
                <thead>
                    <tr>
                        <th>PhoneNumber</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Location</th>
                        <th>Compliant</th>
                        <th>Remarks</th>
                        <th>Doctor Selection</th>
                        <th>Follow-up Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedItems" :key="index">
                        <td>{{ item.phonenumber }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.gender }}</td>
                        <td>{{ item.location }}</td>
                        <td>{{ item.compliant }}</td>
                        <td>{{ item.remarks }}</td>
                        <td>{{ item.doctorSelection }}</td>
                        <td>{{ item.followUpDate }}</td>
                    </tr>
                </tbody>
            </table>
    </div>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" @click="changePage(pagination.page - 1)" href="#" :disabled="pagination.page === 1">
            &lt;
          </a>
        </li>
        <li class="page-item" :class="{ active: pagination.page === index + 1 }" v-for="(page, index) in totalPages"
          :key="index">
          <a class="page-link" @click="changePage(index + 1)" href="#">{{ index + 1 }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="changePage(pagination.page + 1)" href="#"
            :disabled="pagination.page === totalPages">
            &gt;
          </a>
        </li>
      </ul>
    </nav>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header.vue';

export default {
  components: {
    Header,
  },
  data() {
    return {
      searchDate: '',
      source: [],
      pagination: {
        page: 1,
        itemsPerPage: 5,
      },
      // Remove the apiEndpoint since it's now embedded in the fetch statement
      tableColumns: [
        'Id', 'Name', 'Age', 'Gender', 'Location', 'Complaint', 'Remarks', 'Turnup Ratio', 'Doctor Selection',
        'Finance', 'Distance', 'Treatment', 'Result', 'Expected Date', 'Follow-up Date'
      ],
    };
  },
  computed: {
    paginatedItems() {
      const start = (this.pagination.page - 1) * this.pagination.itemsPerPage;
      const end = start + this.pagination.itemsPerPage;
      return this.source.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.source.length / this.pagination.itemsPerPage);
    },
  },
  methods: {
    async searchReport() {
  try {
    if (!this.searchDate) {
      console.warn('Search date is empty');
      return;
    }

    const parsedDate = Date.parse(this.searchDate);

    if (isNaN(parsedDate)) {
      console.warn('Invalid date format');
      return;
    }

    const formattedDate = new Date(parsedDate).toISOString().split('T')[0];
    const apiUrl = `http://localhost:8080/mannit/eSearch?domain=healthCare&subdomain=clinic&userId=657ef4b72bafd911c42813b3&f=createDated_D eq ${formattedDate}`;
console.log('API URL:', apiUrl);
const response = await fetch(apiUrl);


    if (response.ok) {
      const data = await response.json();

      if (Array.isArray(data)) {
        this.source = data.source;
        this.pagination.page = 1;
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } else {
      console.error('Failed to fetch data:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
},


    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.pagination.page = page;
      }
    },
    updateDate(event) {
      // Handle date input changes if needed
      this.searchDate = event.target.value;
    },
  },
};
</script>


<style scoped>
.full {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Arial', sans-serif;
}

.top {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.expected-date label {
  margin-right: 10px;
  font-weight: bold;
  color: #333;
}

.search-input {
  display: flex;
  align-items: center;

}

.search-icon {
  cursor: pointer;
  margin-left: 10px;
  font-size: 25px;
}

.custom-input {
  padding: 8px;
  border-radius: 8px;
  border: 3px solid #ccc;
  margin-top: 10px;
  /* Adjust the margin as needed */
}

.table-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;

}

.table {
  border-collapse: collapse;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 10px #8bd600;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 12px;
}

.table th {
  background-color: #8bd600;
  color: white;
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.pagination li {
  margin-right: 5px;
}

.pagination a {
  text-decoration: none;
  color: #333;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: all 0.3s ease;
}

.pagination .active a {
  background-color: blue;
  color: white;
  font-weight: bold;
}

.pagination a:hover {
  background-color: #f2f2f2;
  color: blue;
}

@media only screen and (max-width: 800px) {

  #no-more-tables tbody,
  #no-more-tables tr,
  #no-more-tables td {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #ddd;
    margin-bottom: 10px;


  }

  #no-more-tables thead tr {
    position: relative;
    top: -9999;
    left: -9999;
  }

  #no-more-tables thead td {
    position: relative;
    padding-left: 50%;
  }

  #no-more-tables thead td:before {
    content: attr(data-title);
    position: absolute;
    left: 6px;
    font-weight: bold;

  }

  .table th {
    display: none;

  }

  .table td:before {
    content: attr(data-title);
    position: absolute;
    left: 1px;
    font-weight: bold;
    background-color: #8bd600;
    border: 1px solid #ddd;
    padding: 10px;
  }
}</style>