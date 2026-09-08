/* ==========================================================================
   Clinic On - Admin Portal Logic (Sapphire Blue & Clinical Teal Color System)
   ========================================================================== */

const Admin = {
  initLayout() {
    Auth.checkRouteGuard('admin');
  },

  initDashboard() {
    this.initLayout();

    const doctors = ClinicStore.getDoctors();
    const patients = ClinicStore.getPatients();
    const appointments = ClinicStore.getAppointments();

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === todayStr || true);
    const pendingAppointments = appointments.filter(a => a.status === 'Pending');

    // Minimal Metric Blocks
    const elDoctorsCount = document.getElementById('adminStatDoctors');
    const elPatientsCount = document.getElementById('adminStatPatients');
    const elTodayCount = document.getElementById('adminStatTodayAppts');
    const elPendingCount = document.getElementById('adminStatPendingAppts');

    if (elDoctorsCount) elDoctorsCount.textContent = doctors.length;
    if (elPatientsCount) elPatientsCount.textContent = patients.length;
    if (elTodayCount) elTodayCount.textContent = todayAppointments.length;
    if (elPendingCount) elPendingCount.textContent = pendingAppointments.length;

    // Charts initialization with Medical Sapphire Blue & Teal Palette
    if (window.Chart) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const textColor = isDark ? '#94A3B8' : '#64748B';
      const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

      const ctx1 = document.getElementById('appointmentChart');
      if (ctx1) {
        new Chart(ctx1, {
          type: 'line',
          data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Appointments',
              data: [14, 22, 18, 28, 25, 34, 20],
              borderColor: '#6366F1',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              fill: true,
              tension: 0.35,
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { color: gridColor }, ticks: { color: textColor } },
              y: { grid: { color: gridColor }, ticks: { color: textColor } }
            }
          }
        });
      }

      const ctx2 = document.getElementById('deptChart');
      if (ctx2) {
        new Chart(ctx2, {
          type: 'doughnut',
          data: {
            labels: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'],
            datasets: [{
              data: [35, 20, 15, 18, 12],
              backgroundColor: ['#6366F1', '#10B981', '#06B6D4', '#F59E0B', '#8B5CF6'],
              borderWidth: 0
            }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: textColor } } } }
        });
      }
    }

    this.renderRecentAppointmentsTable(appointments.slice(0, 5));
  },

  renderRecentAppointmentsTable(list) {
    const tbody = document.getElementById('adminRecentAppointmentsTbody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No appointments found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(a => `
      <tr>
        <td class="fw-bold">${a.id}</td>
        <td>
          <div class="fw-semibold">${a.patientName}</div>
          <small class="text-muted">${a.patientPhone || ''}</small>
        </td>
        <td>${a.doctorName}</td>
        <td><span class="badge badge-info-custom">${a.department}</span></td>
        <td>${a.date} <small class="text-muted">${a.time}</small></td>
        <td><span class="badge-${a.status.toLowerCase()}">${a.status}</span></td>
        <td>
          <div class="dropdown">
            <button class="btn-action-more" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu dropdown-menu-end shadow border">
              <li><a class="dropdown-item text-success" href="#" onclick="Admin.updateApptStatus('${a.id}', 'Confirmed')"><i class="bi bi-check-circle me-2"></i>Confirm</a></li>
              <li><a class="dropdown-item text-primary" href="#" onclick="Admin.updateApptStatus('${a.id}', 'Completed')"><i class="bi bi-check2-all me-2"></i>Complete</a></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="Admin.updateApptStatus('${a.id}', 'Cancelled')"><i class="bi bi-x-circle me-2"></i>Cancel</a></li>
            </ul>
          </div>
        </td>
      </tr>
    `).join('');
  },

  updateApptStatus(id, newStatus) {
    ClinicStore.updateAppointment(id, { status: newStatus });
    ClinicApp.toast(`Appointment ${id} updated to ${newStatus}.`, 'success');
    
    if (window.location.pathname.includes('dashboard')) {
      this.initDashboard();
    } else if (window.location.pathname.includes('appointments')) {
      this.initAppointmentsPage();
    }
  },

  initDoctorsPage() {
    this.initLayout();
    this.renderDoctorsTable();

    const searchInput = document.getElementById('adminDocSearch');
    const deptSelect = document.getElementById('adminDocDeptFilter');

    if (searchInput) searchInput.addEventListener('input', () => this.renderDoctorsTable());
    if (deptSelect) deptSelect.addEventListener('change', () => this.renderDoctorsTable());

    const docForm = document.getElementById('saveDoctorForm');
    if (docForm) {
      docForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docId = document.getElementById('modalDocId').value;
        const name = document.getElementById('modalDocName').value.trim();
        const spec = document.getElementById('modalDocSpec').value.trim();
        const dept = document.getElementById('modalDocDept').value;
        const exp = document.getElementById('modalDocExp').value.trim();
        const phone = document.getElementById('modalDocPhone').value.trim();
        const email = document.getElementById('modalDocEmail').value.trim();
        const fee = document.getElementById('modalDocFee').value.trim();

        if (!name || !spec || !phone || !email) {
          ClinicApp.toast('Please fill all required fields.', 'danger');
          return;
        }

        ClinicStore.saveDoctor({
          id: docId || undefined,
          name,
          specialization: spec,
          department: dept,
          experience: exp || '5 Years',
          phone,
          email,
          fee: fee || '$150',
          rating: 4.9,
          status: 'Active',
          image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'
        });

        ClinicApp.toast(docId ? 'Doctor updated successfully!' : 'Doctor added successfully!', 'success');

        const modalEl = document.getElementById('doctorModal');
        if (modalEl && bootstrap.Modal.getInstance(modalEl)) bootstrap.Modal.getInstance(modalEl).hide();

        docForm.reset();
        this.renderDoctorsTable();
      });
    }
  },

  renderDoctorsTable() {
    const tbody = document.getElementById('adminDoctorsTbody');
    if (!tbody) return;

    const search = (document.getElementById('adminDocSearch')?.value || '').toLowerCase();
    const dept = document.getElementById('adminDocDeptFilter')?.value || '';

    const doctors = ClinicStore.getDoctors().filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search) || d.specialization.toLowerCase().includes(search);
      const matchDept = !dept || d.department === dept;
      return matchSearch && matchDept;
    });

    if (doctors.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No doctors found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = doctors.map(d => `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2.5">
            <img src="${d.image}" alt="${d.name}" class="rounded-circle" style="width:36px; height:36px; object-fit:cover;">
            <div>
              <div class="fw-semibold">${d.name}</div>
              <small class="text-muted">${d.email}</small>
            </div>
          </div>
        </td>
        <td><span class="badge badge-info-custom">${d.specialization}</span></td>
        <td>${d.department}</td>
        <td>${d.experience}</td>
        <td>${d.phone}</td>
        <td><span class="badge bg-success-subtle text-success">${d.status}</span></td>
        <td>
          <div class="dropdown">
            <button class="btn-action-more" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu dropdown-menu-end shadow border">
              <li><a class="dropdown-item" href="#" onclick="Admin.editDoctor('${d.id}')"><i class="bi bi-pencil me-2"></i>Edit Doctor</a></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="Admin.deleteDoctor('${d.id}')"><i class="bi bi-trash me-2"></i>Delete</a></li>
            </ul>
          </div>
        </td>
      </tr>
    `).join('');
  },

  editDoctor(id) {
    const doc = ClinicStore.getDoctors().find(d => d.id === id);
    if (!doc) return;

    document.getElementById('modalDocId').value = doc.id;
    document.getElementById('modalDocName').value = doc.name;
    document.getElementById('modalDocSpec').value = doc.specialization;
    document.getElementById('modalDocDept').value = doc.department;
    document.getElementById('modalDocExp').value = doc.experience;
    document.getElementById('modalDocPhone').value = doc.phone;
    document.getElementById('modalDocEmail').value = doc.email;
    document.getElementById('modalDocFee').value = doc.fee;

    const modalEl = document.getElementById('doctorModal');
    if (modalEl) new bootstrap.Modal(modalEl).show();
  },

  deleteDoctor(id) {
    if (confirm('Delete this doctor record?')) {
      ClinicStore.deleteDoctor(id);
      ClinicApp.toast('Doctor removed.', 'info');
      this.renderDoctorsTable();
    }
  },

  initPatientsPage() {
    this.initLayout();
    this.renderPatientsTable();

    const search = document.getElementById('adminPatSearch');
    if (search) search.addEventListener('input', () => this.renderPatientsTable());
  },

  renderPatientsTable() {
    const tbody = document.getElementById('adminPatientsTbody');
    if (!tbody) return;

    const searchVal = (document.getElementById('adminPatSearch')?.value || '').toLowerCase();
    const patients = ClinicStore.getPatients().filter(p => p.name.toLowerCase().includes(searchVal) || p.phone.includes(searchVal));

    if (patients.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No patients found.</td></tr>`;
      return;
    }

    tbody.innerHTML = patients.map(p => `
      <tr>
        <td class="fw-bold">${p.id}</td>
        <td>
          <div class="fw-semibold">${p.name}</div>
          <small class="text-muted">${p.email}</small>
        </td>
        <td>${p.age} / ${p.gender}</td>
        <td><span class="badge bg-danger-subtle text-danger fw-bold">${p.bloodGroup}</span></td>
        <td>${p.phone}</td>
        <td>${p.lastAppointment || 'N/A'}</td>
        <td>
          <div class="dropdown">
            <button class="btn-action-more" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu dropdown-menu-end shadow border">
              <li><a class="dropdown-item" href="#" onclick="Admin.viewPatientModal('${p.id}')"><i class="bi bi-eye me-2"></i>View Patient Profile</a></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="Admin.deletePatient('${p.id}')"><i class="bi bi-trash me-2"></i>Delete</a></li>
            </ul>
          </div>
        </td>
      </tr>
    `).join('');
  },

  viewPatientModal(id) {
    const pat = ClinicStore.getPatients().find(p => p.id === id);
    if (!pat) return;
    alert(`Patient Profile:\n\nName: ${pat.name}\nAge/Gender: ${pat.age} / ${pat.gender}\nBlood Group: ${pat.bloodGroup}\nPhone: ${pat.phone}\nAddress: ${pat.address}`);
  },

  deletePatient(id) {
    if (confirm('Delete this patient record?')) {
      ClinicStore.deletePatient(id);
      ClinicApp.toast('Patient record removed.', 'info');
      this.renderPatientsTable();
    }
  },

  initAppointmentsPage() {
    this.initLayout();
    this.renderAppointmentsTable();

    document.getElementById('adminApptStatusFilter')?.addEventListener('change', () => this.renderAppointmentsTable());
    document.getElementById('adminApptSearch')?.addEventListener('input', () => this.renderAppointmentsTable());
  },

  renderAppointmentsTable() {
    const tbody = document.getElementById('adminAppointmentsTbody');
    if (!tbody) return;

    const statusFilter = document.getElementById('adminApptStatusFilter')?.value || '';
    const search = (document.getElementById('adminApptSearch')?.value || '').toLowerCase();

    const appointments = ClinicStore.getAppointments().filter(a => {
      const matchStatus = !statusFilter || a.status === statusFilter;
      const matchSearch = a.patientName.toLowerCase().includes(search) || a.doctorName.toLowerCase().includes(search) || a.id.toLowerCase().includes(search);
      return matchStatus && matchSearch;
    });

    if (appointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">No appointments found.</td></tr>`;
      return;
    }

    tbody.innerHTML = appointments.map(a => `
      <tr>
        <td class="fw-bold">${a.id}</td>
        <td>
          <div class="fw-semibold">${a.patientName}</div>
          <small class="text-muted">${a.patientPhone || ''}</small>
        </td>
        <td>${a.doctorName}</td>
        <td>${a.department}</td>
        <td>${a.date} <small class="text-muted">${a.time}</small></td>
        <td><span class="badge badge-info-custom">${a.type || 'General'}</span></td>
        <td><span class="badge-${a.status.toLowerCase()}">${a.status}</span></td>
        <td>
          <div class="dropdown">
            <button class="btn-action-more" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></button>
            <ul class="dropdown-menu dropdown-menu-end shadow border">
              <li><a class="dropdown-item text-success" href="#" onclick="Admin.updateApptStatus('${a.id}', 'Confirmed')"><i class="bi bi-check-circle me-2"></i>Confirm</a></li>
              <li><a class="dropdown-item text-primary" href="#" onclick="Admin.updateApptStatus('${a.id}', 'Completed')"><i class="bi bi-check2-all me-2"></i>Complete</a></li>
              <li><a class="dropdown-item text-danger" href="#" onclick="Admin.updateApptStatus('${a.id}', 'Cancelled')"><i class="bi bi-x-circle me-2"></i>Cancel</a></li>
            </ul>
          </div>
        </td>
      </tr>
    `).join('');
  },

  initDepartmentsPage() {
    this.initLayout();
    this.renderDepartmentsGrid();

    const form = document.getElementById('addDepartmentForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('deptNameInput').value.trim();
        const head = document.getElementById('deptHeadInput').value.trim();
        const desc = document.getElementById('deptDescInput').value.trim();

        if (!name || !desc) return;

        ClinicStore.saveDepartment({
          name,
          head: head || 'Dr. Specialist',
          desc,
          icon: 'bi-hospital',
          doctorsCount: 3
        });

        ClinicApp.toast('Department created!', 'success');
        form.reset();
        const modalEl = document.getElementById('deptModal');
        if (modalEl && bootstrap.Modal.getInstance(modalEl)) bootstrap.Modal.getInstance(modalEl).hide();
        this.renderDepartmentsGrid();
      });
    }
  },

  renderDepartmentsGrid() {
    const container = document.getElementById('adminDeptGrid');
    if (!container) return;

    const depts = ClinicStore.getDepartments();
    container.innerHTML = depts.map(d => `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 p-4">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="pastel-icon-box bg-pastel-blue m-0" style="width:40px; height:40px; font-size:1.2rem;">
              <i class="bi ${d.icon}"></i>
            </div>
            <button class="btn btn-sm btn-ghost text-danger" onclick="Admin.deleteDept('${d.id}')"><i class="bi bi-trash"></i></button>
          </div>
          <h5 class="fw-bold mb-1">${d.name}</h5>
          <p class="text-muted fs-7 mb-3">${d.desc}</p>
          <div class="border-top pt-2 mt-auto d-flex justify-content-between text-muted fs-7">
            <span>Head: ${d.head}</span>
            <span class="fw-bold text-primary">${d.doctorsCount} Doctors</span>
          </div>
        </div>
      </div>
    `).join('');
  },

  deleteDept(id) {
    if (confirm('Delete department?')) {
      ClinicStore.deleteDepartment(id);
      ClinicApp.toast('Department removed.', 'info');
      this.renderDepartmentsGrid();
    }
  }
};
