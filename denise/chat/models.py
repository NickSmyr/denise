

from django.db import models


class Interaction(models.Model):
    date_start = models.DateTimeField('Interaction time start')
    date_end = models.DateTimeField('Interaction time end')
    remote_ip = models.GenericIPAddressField()
    session_id = models.UUIDField("Session id")

    def duration(self):
        """
        Returns the duration in seconds
        :return:
        """
        return (self.date_end - self.date_start).seconds

    def __str__(self):
        return f"Interaction from {self.remote_ip} with duration {self.duration()} sec"


class Message(models.Model):
    interaction = models.ForeignKey(Interaction, on_delete=models.CASCADE)
    order = models.IntegerField('order')
    is_denise = models.BooleanField('Message is from Denise')
    text = models.TextField()

    def __str__(self):
        return f"Denise:{self.is_denise}::{self.text}::order:{self.order}"
