import logging
from django.shortcuts import render,redirect
from .models import User

logger = logging.getLogger(__name__)

# Public Views
def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def doctors(request):
    return render(request, 'doctors.html')

def doctor_details(request):
    return render(request, 'doctor-details.html')

def departments(request):
    return render(request, 'departments.html')

def contact(request):
    return render(request, 'contact.html')

def register_view(request):
    if request.method == "POST":
        try:
            user = User.objects.get(email=request.POST['email'])
            msg = "Email already exist!!"
            return render(request, 'register.html', {'msg': msg})
        except:
            if request.POST['password'] == request.POST['confirm_password']:
                User.objects.create(
                    full_name=request.POST['full_name'],
                    email=request.POST['email'],
                    phone=request.POST['phone'],
                    date_of_birth=request.POST['date_of_birth'],
                    gender=request.POST['gender'],
                    blood_group=request.POST['blood_group'],
                    address=request.POST['address'],
                    password=request.POST['password'],
                    role=request.POST['role']
                )
                msg1 = "Signup Successfully!"
                return render(request, 'register.html', {'msg1': msg1})
            else:
                msg = "Password & confirm password does not match!"
                return render(request, 'register.html', {'msg': msg})
    else:
        return render(request, 'register.html')

def login_view(request):
    if request.method == "POST":
        try:
            user = User.objects.get(email=request.POST['email'])
            if user.password == request.POST['password']:
                request.session['email'] = user.email
                request.session['name'] = user.full_name
                request.session['role'] = user.role
                request.session['user_id'] = user.id

                if user.role == 'doctor':
                    return redirect('doctor_dashboard')
                elif user.role == 'admin':
                    return redirect('admin_dashboard')
                else:
                    return redirect('index')
            else:
                msg = "Password does not match!"
                return render(request, 'login.html', {'msg': msg})
        except:
            msg = "Email does not exist!"
            return render(request, 'login.html', {'msg': msg})
    else:
        return render(request, 'login.html')

def logout_view(request):
    try:
        del request.session['email']
        del request.session['name']
        del request.session['role']
        del request.session['user_id']
    except:
        pass
    return redirect('login')




# Admin Portal Views
def admin_dashboard(request):
    return render(request, 'admin/dashboard.html')

def admin_appointments(request):
    return render(request, 'admin/appointments.html')

def admin_doctors(request):
    return render(request, 'admin/doctors.html')

def admin_patients(request):
    return render(request, 'admin/patients.html')

def admin_departments(request):
    return render(request, 'admin/departments.html')

def admin_reports(request):
    return render(request, 'admin/reports.html')

def admin_settings(request):
    return render(request, 'admin/settings.html')


# Doctor Portal Views
def doctor_dashboard(request):
    return render(request, 'doctor/dashboard.html')

def doctor_appointments(request):
    return render(request, 'doctor/appointments.html')

def doctor_patients(request):
    return render(request, 'doctor/patients.html')

def doctor_patient_details(request):
    return render(request, 'doctor/patient-details.html')

def doctor_prescriptions(request):
    return render(request, 'doctor/prescriptions.html')

def doctor_medical_records(request):
    return render(request, 'doctor/medical-records.html')

def doctor_profile(request):
    return render(request, 'doctor/profile.html')


# Patient Portal Views
def patient_dashboard(request):
    return render(request, 'patient/dashboard.html')

def patient_book_appointment(request):
    return render(request, 'patient/book-appointment.html')

def patient_appointments(request):
    return render(request, 'patient/appointments.html')

def patient_doctors(request):
    return render(request, 'patient/doctors.html')

def patient_medical_history(request):
    return render(request, 'patient/medical-history.html')

def patient_prescriptions(request):
    return render(request, 'patient/prescriptions.html')

def patient_profile(request):
    return render(request, 'patient/profile.html')
