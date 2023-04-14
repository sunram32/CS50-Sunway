from django.forms import TextInput, EmailInput, FileInput, PasswordInput
from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import *
import django

class UserForm(UserCreationForm):
    # customizing the widget for passwords did not work in the widgets dictionary, thus they are customized here
    password1 = forms.CharField(
        label='Enter password', 
        widget=forms.PasswordInput(attrs={
            'class': "form-control mb-3"
            })
        )
    password2 = forms.CharField(
        label='Confirm password', 
        widget=forms.PasswordInput(attrs={
            'class': "form-control mb-3"
            })
        )
    class Meta:
        model = django.contrib.auth.get_user_model()
        fields = ['username', 'password1', 'password2', 'first_name', 'last_name', 'email', 'picture']
        widgets = {
            'username': TextInput(attrs={
                'class': "form-control mb-3"
            }),
            'first_name': TextInput(attrs={
                'class': "form-control mb-3"
            }),
            'last_name': TextInput(attrs={
                'class': "form-control mb-3"
            }),
            'email': EmailInput(attrs={
                'class': "form-control mb-3"
            }),
            'picture': FileInput(attrs={
                'class': "form-control mb-3"
            }),
        }
        help_texts = {
            'username': None,
        }