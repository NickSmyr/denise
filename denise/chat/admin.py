from django.contrib import admin

# Register your models here.

from django.contrib import admin

from .models import Interaction, Message


class MessageInline(admin.TabularInline):
    model = Message
    extra = 3


class InteractionAdmin(admin.ModelAdmin):

    list_filter = ['date_start']
    search_fields = ['remote_ip']
    inlines = [MessageInline]
    list_display = ('remote_ip', 'date_start' , 'duration')

admin.site.register(Interaction, InteractionAdmin)
admin.site.register(Message)