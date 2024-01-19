<template>
  <div>
    <Header />
    <div class="profile-container">
      <div class="form-group">
        <div class="profile-fields">

       <div class="username-container">
            <label for="username">Username:</label>
            <span>{{ user.loggedInUser ? displayUsername : 'Loading...' }}</span>
          </div>
          
          <label for="oldPassword">Old Password:</label>
    <input :type="showoldPassword ? 'text' : 'password'" v-model="user.oldPassword" id="oldPassword" placeholder="Old password" />
    <span class="eye-toggle" @click="toggleOldPasswordVisibility('oldPassword')">
      <i :class="eyeIconClassoldPassword">
                  <link rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
                </i>
    </span>

          <label for="newPassword">New Password:</label>
          <input :type="shownewPassword ? 'text' : 'password'" v-model="user.newPassword" id="newPassword" placeholder="New password" />
    <span class="eye-toggle" @click="toggleNewPasswordVisibility('newPassword')">
      <i :class="eyeIconClassnewPassword">
                  <link rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
                </i>
    </span>

          <label for="confirmPassword">Confirm Password:</label>
           <input :type="showconfirmPassword ? 'text' : 'password'" v-model="user.confirmPassword" id="confirmPassword" placeholder="Confirm password" />
    <span class="eye-toggle" @click="toggleConfirmPasswordVisibility('confirmPassword')">
      <i :class="eyeIconClassconfirmPassword">
                  <link rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
                </i>
    </span>

          <button @click="updatePassword">Update Password</button>
          <div v-if="passwordMismatchAlert" class="alert">
            {{ passwordMismatchAlertMessage }}
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        username: "", // Placeholder for the actual username
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
        showoldPassword: false,
        shownewPassword:false,
        showconfirmPassword:false,
        passwordMismatchAlert: false,

    };
  },

  computed: {
eyeIconClassoldPassword(){
  return this.showoldPassword ? 'fas fa-eye-slash':'fas fa-eye';
 
},
eyeIconClassnewPassword(){
  return this.shownewPassword ? 'fas fa-eye-slash':'fas fa-eye';
 
},
eyeIconClassconfirmPassword(){
  return this.showconfirmPassword ? 'fas fa-eye-slash':'fas fa-eye';
 
},

    displayUsername() {
      return this.user.loggedInUser.name || "Loading...";
    },
  },
  mounted() {
    // Retrieve user details from session storage
    const storedUser = sessionStorage.getItem('loggedInUser','$oid');
    if (storedUser) {
      const sourceData = JSON.parse(JSON.parse(storedUser).source);

      this.user.loggedInUser = {
      name: sourceData.username,
    };
    }
  },
  methods: {
    async updatePassword() {
  // Check if new password and confirm password match
  if (this.user.newPassword !== this.user.confirmPassword) {
    // Show an alert message for mismatched passwords
    this.passwordMismatchAlert = true;
    return;
  }

  if (this.user.oldPassword === this.user.newPassword) {
    // Show an alert message for the same old and new password
    this.passwordMismatchAlert = true;
    this.passwordMismatchAlertMessage =
    'Old password and new password cannot be the same.';
    return;
  }
    // Call the API to reset password
    await this.callPasswordUpdateAPI("http://localhost:8080/mannit/resetpwd");

  // Reset password fields after updating
  this.user.oldPassword = "";
  this.user.newPassword = "";
  this.user.confirmPassword = "";

  // Reset the password mismatch alert
  this.passwordMismatchAlert = false;
},

async callPasswordUpdateAPI(apiEndpoint) {
  try {
    const requestBody = {
      username: this.user.loggedInUser.name,
      password: this.user.oldPassword,  // Assuming oldPassword is the current password
      new_password: this.user.newPassword,
    };

    console.log('Request Payload:', JSON.stringify(requestBody));

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseData = await response.json();

    console.log('Response:', responseData);

    if (response.ok) {
      console.log('Password updated successfully');
    } else {
      if (responseData.errorCode === '105') {
        // Handle specific error code for password criteria not met
        console.error('Password does not meet the criteria');
        this.passwordMismatchAlert = true;
        this.passwordMismatchAlertMessage = responseData.errorMsg;
      } else {
        console.error('Failed to update password:', response.statusText);
      }
    }
  } catch (error) {
    console.error('Error updating password:', error);
  }
},

    toggleOldPasswordVisibility() {
      this.showoldPassword = !this.showoldPassword;
    },
    toggleNewPasswordVisibility() {
      this.shownewPassword = !this.shownewPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showconfirmPassword = !this.showconfirmPassword;
    },
    

  },
};
</script>

<style scoped>
@import '@/styles/profile.css';
</style>
