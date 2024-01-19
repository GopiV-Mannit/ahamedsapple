<template>
  <div class="full">
    <Header class="Header" />
    <div class="top">
      <div class="expected-date">
        <label for="chooseDate">Choose the Date</label>
        <input type="date" id="chooseDate" @input="updatedate" class="custom-input" />
      </div>
      <div class="search-input">
        <span class="search-icon" @click="searchReport">&#128269;</span>
      </div>
    </div>
    <div class="primary-table">
      <div class="button-group">
        <button type="button" class="primary-btn" :class="{ 'selected': selectedTable === 'patientBooking' }" @click="toggleTable('patientBooking')">Patient Booking</button>
        <button type="button" class="secondary-btn"  :class="{ 'selected': selectedTable === 'queriedPatient' }" @click="toggleTable('queriedPatient')">Queried Patient</button>
        <button type="button" class="third-btn" :class="{ 'selected': selectedTable === 'rejectedPatient' }" @click="toggleTable('rejectedPatient')">Rejected Patient</button>
      </div>
    </div>
    <div class="table-container" :class="{ 'selected-table': selectedTable === 'patientBooking' }">
      <table v-if="selectedTable === 'patientBooking'" class="table">
        <thead>
          <tr>
            <th>Phonenumber</th>
            <th>Patient Choice</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedItems" :key="index">
            <td data-title="phonenumber">{{ item.phonenumber }}</td>
            <td data-title="patientchoice">{{ item.patientchoice }}</td>
            <td data-title="timestamp">{{ item.timestamp }}</td>
          </tr>
        </tbody>
      </table>
      <div class="table-container" :class="{ 'selected-table': selectedTable === 'queriedPatient' }">
      <table v-if="selectedTable === 'queriedPatient'" class="table">
        <thead>
          <tr>
            <th>Phonenumber</th>
            <th>Patient Choice</th>
            <th>TimeStamp</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedItems" :key="index">
            <td data-title="phonenumber">{{ item.phonenumber }}</td>
            <td data-title="patientchoice">{{ item.patientchoice }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-container" :class="{ 'selected-table': selectedTable === 'rejectedPatient' }">
      <table v-if="selectedTable === 'rejectedPatient'" class="table">
        <thead>
          <tr>
            <th>Phonenumber</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in paginatedItems" :key="index">
            <td data-title="phonenumber">{{ item.phonenumber }}</td>
          </tr>
        </tbody>
      </table>
    </div>

      <p v-if="!reportData.length"></p>
    </div>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item">
          <a class="page-link" @click="changePage(pagination.page - 1)" href="#" :disabled="pagination.page === 1">
            &lt;
          </a>
        </li>
        <li class="page-item" :class="{ active: pagination.page === index + 1 }" v-for="(page, index) in totalPages" :key="index">
          <a class="page-link" @click="changePage(index + 1)" href="#">{{ index + 1 }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" @click="changePage(pagination.page + 1)" href="#" :disabled="pagination.page === totalPages">
            &gt;
          </a>
        </li>
      </ul>
    </nav>
    <Footer/>
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
      serachDate: '',
      selectedTable: 'patientBooking',
      reportData: [],
      pagination: {
        page: 1,
        itemsPerPage: 8,
      },
      // Assuming you have some initial data
      originalReportData: [
        { phonenumber: '9014349359', patientchoice: 'ChiefDoctor rs:4000/-', timestamp: '2022-01-01  13:05:48' },
        { phonenumber: '8667275188', patientchoice: 'DutyDoctor rs:1000/', timestamp: '2022-01-02  13:10:38' },
        { phonenumber: '9014349359', patientchoice: 'ChiefDoctor rs:4000/-', timestamp: '2022-01-01  13:10:28'  },
        { phonenumber: '8667275188', patientchoice: 'DutyDoctor rs:1000/', timestamp: '2022-01-02 12:10:38' },
        { phonenumber: '9014349359', patientchoice: 'ChiefDoctor rs:4000/-', timestamp: '2022-01-01 12:01:10' },
        { phonenumber: '8667275188', patientchoice: 'DutyDoctor rs:1000/', timestamp: '2022-01-02  12:00:00' },
        { phonenumber: '9014349359', patientchoice: 'ChiefDoctor rs:4000/-', timestamp: '2022-01-01 11:00:00' },
        { phonenumber: '8667275188', patientchoice: 'DutyDoctor rs:1000/', timestamp: '2022-01-02 10:58:55' },
        { phonenumber: '8667275188', patientchoice: 'DutyDoctor rs:1000/', timestamp: '2022-01-02  10:30:45' },
        { phonenumber: '9014349359', patientchoice: 'ChiefDoctor rs:4000/-', timestamp: '2022-01-01 10:10:10' },
        { phonenumber: '8667275188', patientchoice: 'DutyDoctor rs:1000/', timestamp: '2022-01-02  09:10:01' },
        // Add more sample data if needed
      ],
    };
  },
  computed: {
    paginatedItems() {
      const start = (this.pagination.page - 1) * this.pagination.itemsPerPage;
      const end = start + this.pagination.itemsPerPage;
      return this.reportData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.reportData.length / this.pagination.itemsPerPage);
    },
  },
  methods: {
    updatedate(event) {
      this.serachDate = event.target.value;
    },
    searchReport() {
      const filteredReport = this.reportData.filter((item) => {
        return item.expectedDate === this.searchDate;
      });
      this.pagination.page = 1;
      this.reportData = filteredReport;
    },
    toggleTable(tableName) {
      switch (tableName) {
        case 'patientBooking':
          this.reportData = this.originalReportData;
          break;
        case 'queriedPatient':
          this.reportData = this.originalReportData.map((item) => ({ phonenumber: item.phonenumber, patientchoice: item.patientchoice }));
          break;
        case 'rejectedPatient':
          // Show only the PhoneNumber column for Rejected Patient
          this.reportData = this.originalReportData.map((item) => ({ phonenumber: item.phonenumber }));
          break;
        // Add more cases if needed
      }
      this.selectedTable = tableName;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.pagination.page = page;
      }
    },
  },
};
</script>

<style scoped>
@import '@/styles/chatbot.css'
</style>
