/* ==========================================
   Clinic On - Authentication & Guard System
   ========================================== */

const Auth = {
  login(email, password, remember = true) {
    const users = ClinicStore.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (user) {
      ClinicStore.setSession(user, remember);
      ClinicApp.toast(`Welcome back, ${user.name}!`, 'success');
      
      setTimeout(() => {
        Auth.redirectToRoleDashboard(user.role);
      }, 500);
      return { success: true, user };
    } else {
      ClinicApp.toast('Invalid email or password.', 'danger');
      return { success: false, message: 'Invalid credentials' };
    }
  },

  register(userData) {
    const users = ClinicStore.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    
    if (existing) {
      ClinicApp.toast('An account with this email already exists.', 'danger');
      return { success: false };
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: userData.role
    };

    if (userData.role === 'patient') {
      const newPatient = ClinicStore.savePatient({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
        gender: userData.gender,
        address: userData.address,
        bloodGroup: userData.bloodGroup || 'O+',
        status: 'Active',
        lastAppointment: 'None'
      });
      newUser.patId = newPatient.id;
    } else if (userData.role === 'doctor') {
      const newDoctor = ClinicStore.saveDoctor({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        specialization: userData.specialization || 'General Physician',
        department: userData.department || 'General Medicine',
        experience: userData.experience || '1 Year',
        fee: '$100',
        rating: 5.0,
        status: 'Active',
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80'
      });
      newUser.docId = newDoctor.id;
    }

    ClinicStore.saveUser(newUser);
    ClinicStore.setSession(newUser);

    ClinicApp.toast('Registration successful!', 'success');
    setTimeout(() => {
      Auth.redirectToRoleDashboard(newUser.role);
    }, 600);
    return { success: true };
  },

  logout() {
    ClinicStore.clearSession();
    ClinicApp.toast('You have been logged out.', 'info');
    setTimeout(() => {
      // Determine relative path based on location
      const path = window.location.pathname;
      if (path.includes('/admin/') || path.includes('/doctor/') || path.includes('/patient/')) {
        window.location.href = '../login.html';
      } else {
        window.location.href = 'login.html';
      }
    }, 400);
  },

  redirectToRoleDashboard(role) {
    const isSubdir = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/doctor/') || window.location.pathname.includes('/patient/');
    const prefix = isSubdir ? '../' : './';
    
    if (role === 'admin') {
      window.location.href = prefix + 'admin/dashboard.html';
    } else if (role === 'doctor') {
      window.location.href = prefix + 'doctor/dashboard.html';
    } else if (role === 'patient') {
      window.location.href = prefix + 'patient/dashboard.html';
    } else {
      window.location.href = prefix + 'index.html';
    }
  },

  checkRouteGuard(requiredRole = null) {
    const session = ClinicStore.getSession();
    const currentPath = window.location.pathname;
    
    // Auth route guards for protected areas
    if (currentPath.includes('/admin/') && (!session || session.role !== 'admin')) {
      ClinicApp.toast('Access denied. Admin privileges required.', 'danger');
      window.location.href = '../login.html';
      return false;
    }

    if (currentPath.includes('/doctor/') && (!session || session.role !== 'doctor')) {
      ClinicApp.toast('Access denied. Doctor login required.', 'danger');
      window.location.href = '../login.html';
      return false;
    }

    if (currentPath.includes('/patient/') && (!session || session.role !== 'patient')) {
      ClinicApp.toast('Access denied. Patient login required.', 'danger');
      window.location.href = '../login.html';
      return false;
    }

    return true;
  }
};

// Auto-run route protection guard
document.addEventListener('DOMContentLoaded', () => {
  Auth.checkRouteGuard();
  
  // Render user info in topbar if available
  const session = ClinicStore.getSession();
  if (session) {
    const userNames = document.querySelectorAll('.user-display-name');
    userNames.forEach(el => el.textContent = session.name);
    
    const userRoles = document.querySelectorAll('.user-display-role');
    userRoles.forEach(el => el.textContent = session.role.toUpperCase());

    const userAvatars = document.querySelectorAll('.user-display-avatar');
    userAvatars.forEach(el => {
      el.textContent = session.name.split(' ').map(n => n[0]).join('');
    });
  }

  // Bind logout buttons
  const logoutBtns = document.querySelectorAll('.btn-logout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
    });
  });
});
