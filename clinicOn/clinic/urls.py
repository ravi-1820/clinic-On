from django.urls import path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    # Public Pages
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('doctors/', views.doctors, name='doctors'),
    path('doctor-details/', views.doctor_details, name='doctor_details'),
    path('departments/', views.departments, name='departments'),
    path('contact/', views.contact, name='contact'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('forgot-password/', views.forgot_password, name='forgot_password'),
    path('otp-verify/', views.otp_verify, name='otp_verify'),
    path('update-password/', views.update_password, name='update_password'),

    # Admin Portal Pages
    path('admin/', RedirectView.as_view(url='/admin/dashboard/', permanent=False)),
    path('admin/dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin/appointments/', views.admin_appointments, name='admin_appointments'),
    path('admin/doctors/', views.admin_doctors, name='admin_doctors'),
    path('admin/patients/', views.admin_patients, name='admin_patients'),
    path('admin/departments/', views.admin_departments, name='admin_departments'),
    path('admin/reports/', views.admin_reports, name='admin_reports'),
    path('admin/settings/', views.admin_settings, name='admin_settings'),

    # Doctor Portal Pages
    path('doctor/', RedirectView.as_view(url='/doctor/dashboard/', permanent=False)),
    path('doctor/dashboard/', views.doctor_dashboard, name='doctor_dashboard'),
    path('doctor/appointments/', views.doctor_appointments, name='doctor_appointments'),
    path('doctor/patients/', views.doctor_patients, name='doctor_patients'),
    path('doctor/patient-details/', views.doctor_patient_details, name='doctor_patient_details'),
    path('doctor/prescriptions/', views.doctor_prescriptions, name='doctor_prescriptions'),
    path('doctor/medical-records/', views.doctor_medical_records, name='doctor_medical_records'),
    path('doctor/profile/', views.doctor_profile, name='doctor_profile'),

    # Patient Portal Pages
    path('patient/', RedirectView.as_view(url='/patient/dashboard/', permanent=False)),
    path('patient/dashboard/', views.patient_dashboard, name='patient_dashboard'),
    path('patient/book-appointment/', views.patient_book_appointment, name='patient_book_appointment'),
    path('patient/appointments/', views.patient_appointments, name='patient_appointments'),
    path('patient/doctors/', views.patient_doctors, name='patient_doctors'),
    path('patient/medical-history/', views.patient_medical_history, name='patient_medical_history'),
    path('patient/prescriptions/', views.patient_prescriptions, name='patient_prescriptions'),
    path('patient/profile/', views.patient_profile, name='patient_profile'),

    # Backward compatibility redirects for legacy .html URLs -> clean Django routes
    path('index.html', RedirectView.as_view(url='/', permanent=False)),
    path('about.html', RedirectView.as_view(url='/about/', permanent=False)),
    path('doctors.html', RedirectView.as_view(url='/doctors/', permanent=False)),
    path('doctor-details.html', RedirectView.as_view(url='/doctor-details/', permanent=False)),
    path('departments.html', RedirectView.as_view(url='/departments/', permanent=False)),
    path('contact.html', RedirectView.as_view(url='/contact/', permanent=False)),
    path('login.html', RedirectView.as_view(url='/login/', permanent=False)),
    path('logout.html', RedirectView.as_view(url='/logout/', permanent=False)),
    path('register.html', RedirectView.as_view(url='/register/', permanent=False)),
    path('forgot-password.html', RedirectView.as_view(url='/forgot-password/', permanent=False)),
    path('otp-verify.html', RedirectView.as_view(url='/otp-verify/', permanent=False)),
    path('update-password.html', RedirectView.as_view(url='/update-password/', permanent=False)),

    path('admin/dashboard.html', RedirectView.as_view(url='/admin/dashboard/', permanent=False)),
    path('admin/appointments.html', RedirectView.as_view(url='/admin/appointments/', permanent=False)),
    path('admin/doctors.html', RedirectView.as_view(url='/admin/doctors/', permanent=False)),
    path('admin/patients.html', RedirectView.as_view(url='/admin/patients/', permanent=False)),
    path('admin/departments.html', RedirectView.as_view(url='/admin/departments/', permanent=False)),
    path('admin/reports.html', RedirectView.as_view(url='/admin/reports/', permanent=False)),
    path('admin/settings.html', RedirectView.as_view(url='/admin/settings/', permanent=False)),

    path('doctor/dashboard.html', RedirectView.as_view(url='/doctor/dashboard/', permanent=False)),
    path('doctor/appointments.html', RedirectView.as_view(url='/doctor/appointments/', permanent=False)),
    path('doctor/patients.html', RedirectView.as_view(url='/doctor/patients/', permanent=False)),
    path('doctor/patient-details.html', RedirectView.as_view(url='/doctor/patient-details/', permanent=False)),
    path('doctor/prescriptions.html', RedirectView.as_view(url='/doctor/prescriptions/', permanent=False)),
    path('doctor/medical-records.html', RedirectView.as_view(url='/doctor/medical-records/', permanent=False)),
    path('doctor/profile.html', RedirectView.as_view(url='/doctor/profile/', permanent=False)),

    path('patient/dashboard.html', RedirectView.as_view(url='/patient/dashboard/', permanent=False)),
    path('patient/book-appointment.html', RedirectView.as_view(url='/patient/book-appointment/', permanent=False)),
    path('patient/appointments.html', RedirectView.as_view(url='/patient/appointments/', permanent=False)),
    path('patient/doctors.html', RedirectView.as_view(url='/patient/doctors/', permanent=False)),
    path('patient/medical-history.html', RedirectView.as_view(url='/patient/medical-history/', permanent=False)),
    path('patient/prescriptions.html', RedirectView.as_view(url='/patient/prescriptions/', permanent=False)),
    path('patient/profile.html', RedirectView.as_view(url='/patient/profile/', permanent=False)),
]
