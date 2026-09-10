import logging
import random
from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.conf import settings
from .models import User

logger = logging.getLogger(__name__)

#==================================
#      Public Views
#==================================
def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def doctors(request):
    doctors = User.objects.filter(role='doctor')
    return render(request, 'doctors.html', {'doctors': doctors})

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
                country_code = request.POST.get('country_code', '').strip()
                raw_phone = request.POST.get('phone', '').strip()
                if country_code and not raw_phone.startswith('+'):
                    full_phone = f"{country_code} {raw_phone}".strip()
                else:
                    full_phone = raw_phone

                User.objects.create(
                    full_name=request.POST['full_name'],
                    email=request.POST['email'],
                    phone=full_phone,
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

def forgot_password(request):
    if request.method == "POST":
        try:
            user = User.objects.get(email=request.POST['email'])
            otp = random.randint(100000, 999999)
            request.session['otp'] = otp
            request.session['email'] = user.email

            # Send OTP to user's email address via Gmail
            subject = "Password Reset OTP - Clinic On"
            message = f"Hello {user.full_name},\n\nYour 6-digit OTP for password reset is: {otp}\n\nPlease do not share this OTP with anyone.\n\nClinic On Team"
            from_email = settings.EMAIL_HOST_USER
            send_mail(subject, message, from_email, [user.email])

            return redirect('otp_verify')
        except User.DoesNotExist:
            msg = "Email does not exist!"
            return render(request, 'forgot-password.html', {'msg': msg})
        except Exception as e:
            msg = f"Email sending failed: {e}"
            return render(request, 'forgot-password.html', {'msg': msg})
    else:
        return render(request, 'forgot-password.html')


def otp_verify(request):
    email = request.session.get('email')
    if not email:
        return redirect('forgot_password')

    if request.method == "POST":
        # Handle resend OTP
        if request.POST.get('action') == 'resend':
            otp = random.randint(100000, 999999)
            request.session['otp'] = otp
            subject = "New Password Reset OTP - Clinic On"
            message = f"Your new 6-digit OTP is: {otp}\n\nClinic On Team"
            send_mail(subject, message, settings.EMAIL_HOST_USER, [email])
            msg1 = "New OTP has been sent to your email!"
            return render(request, 'otp-verify.html', {'msg1': msg1, 'email': email})

        user_otp = request.POST.get('otp', '').strip()
        session_otp = str(request.session.get('otp', ''))

        if user_otp == session_otp:
            request.session['is_verified'] = True
            return redirect('update_password')
        else:
            msg = "Invalid OTP, please try again!"
            return render(request, 'otp-verify.html', {'msg': msg, 'email': email})
    else:
        return render(request, 'otp-verify.html', {'email': email})


def update_password(request):
    email = request.session.get('email')
    is_verified = request.session.get('is_verified')
    if not email or not is_verified:
        return redirect('forgot_password')

    if request.method == "POST":
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if password == confirm_password:
            try:
                user = User.objects.get(email=email)
                user.password = password
                user.save()

                # Clear reset session
                if 'otp' in request.session:
                    del request.session['otp']
                if 'email' in request.session:
                    del request.session['email']
                if 'is_verified' in request.session:
                    del request.session['is_verified']

                return render(request, 'update-password.html', {'success': True})
            except:
                msg = "User does not exist!"
                return render(request, 'update-password.html', {'msg': msg})
        else:
            msg = "Passwords do not match!"
            return render(request, 'update-password.html', {'msg': msg})
    else:
        return render(request, 'update-password.html')




#==================================
#      Admin Portal Views
#==================================
def admin_dashboard(request):
    doctors = User.objects.filter(role='doctor')
    patients = User.objects.filter(role='patient')
    return render(request, 'admin/dashboard.html', {
        'doctors': doctors,
        'patients': patients,
        'total_doctors': doctors.count(),
        'total_patients': patients.count(),
    })

def admin_appointments(request):
    return render(request, 'admin/appointments.html')

def admin_doctors(request):
    doctors = User.objects.filter(role='doctor')
    return render(request, 'admin/doctors.html', {'doctors': doctors})

def admin_patients(request):
    patients = User.objects.filter(role='patient')
    return render(request, 'admin/patients.html', {'patients': patients})

def admin_departments(request):
    return render(request, 'admin/departments.html')

def admin_reports(request):
    return render(request, 'admin/reports.html')

def admin_settings(request):
    return render(request, 'admin/settings.html')


#==================================
#      Doctor Portal Views
#==================================
def doctor_dashboard(request):
    patients = User.objects.filter(role='patient')
    user = None
    if request.session.get('email'):
        try:
            user = User.objects.get(email=request.session['email'])
        except User.DoesNotExist:
            pass
    return render(request, 'doctor/dashboard.html', {'user': user, 'patients': patients})

def doctor_appointments(request):
    return render(request, 'doctor/appointments.html')

def doctor_patients(request):
    patients = User.objects.filter(role='patient')
    return render(request, 'doctor/patients.html', {'patients': patients})

def doctor_patient_details(request):
    return render(request, 'doctor/patient-details.html')

def doctor_prescriptions(request):
    return render(request, 'doctor/prescriptions.html')

def doctor_medical_records(request):
    return render(request, 'doctor/medical-records.html')

def doctor_profile(request):
    user = None
    if request.session.get('email'):
        try:
            user = User.objects.get(email=request.session['email'])
        except User.DoesNotExist:
            pass
    return render(request, 'doctor/profile.html', {'user': user})


#==================================
#      Patient Portal Views
#==================================
def patient_dashboard(request):
    doctors = User.objects.filter(role='doctor')
    user = None
    if request.session.get('email'):
        try:
            user = User.objects.get(email=request.session['email'])
        except User.DoesNotExist:
            pass
    return render(request, 'patient/dashboard.html', {'user': user, 'doctors': doctors})

def patient_book_appointment(request):
    doctors = User.objects.filter(role='doctor')
    return render(request, 'patient/book-appointment.html', {'doctors': doctors})

def patient_appointments(request):
    return render(request, 'patient/appointments.html')

def patient_doctors(request):
    doctors = User.objects.filter(role='doctor')
    return render(request, 'patient/doctors.html', {'doctors': doctors})

def patient_medical_history(request):
    return render(request, 'patient/medical-history.html')

def patient_prescriptions(request):
    return render(request, 'patient/prescriptions.html')

def patient_profile(request):
    user = None
    if request.session.get('email'):
        try:
            user = User.objects.get(email=request.session['email'])
        except User.DoesNotExist:
            pass
    return render(request, 'patient/profile.html', {'user': user})
