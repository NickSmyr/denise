import json
from uuid import uuid4

# Create your tests here.

from django.test import TestCase
from django.urls import reverse

from .models import Interaction, Message

class TestNormalUseCase(TestCase):

    def test_multiple_initializations(self):
        """
        Multiple initializations with the same uuid should not create new entries
        while with different uuids it should create new entries
        :return:
        """
        SESSION_ID = uuid4().hex
        post_args = {
            'session_id': SESSION_ID,
            'remote_ip': '::ffff:35.191.9.169'
        }
        # Create one interaction
        url = reverse('chat:initiate')
        self.assertTrue(len(Interaction.objects.all()) == 0)
        response = self.client.post(url, data=post_args, content_type='application/json')
        self.assertTrue(len(Interaction.objects.all()) == 1)
        self.assertEqual(response.status_code, 200)
        response = self.client.post(url, data=post_args, content_type='application/json')
        self.assertTrue(len(Interaction.objects.all()) == 1)
        self.assertEqual(response.status_code, 200)

        #Create new Session id
        SESSION_ID = uuid4().hex
        post_args = {
            'session_id': SESSION_ID,
            'remote_ip': '::ffff:35.191.9.169'
        }
        response = self.client.post(url, data=post_args, content_type='application/json')
        self.assertTrue(len(Interaction.objects.all()) == 2)
        self.assertEqual(response.status_code, 200)


    def test_future_question(self):
        """
        The detail view of a question with a pub_date in the future
        returns a 404 not found.
        """
        SESSION_ID = uuid4().hex
        post_args = {
            'session_id' : SESSION_ID,
            'remote_ip' : '::ffff:35.191.9.169'
        }
        # Create one interaction
        url = reverse('chat:initiate')
        self.assertTrue(len(Interaction.objects.all()) == 0)
        response = self.client.post(url, data=post_args, content_type='application/json')
        self.assertTrue(len(Interaction.objects.all()) == 1)
        self.assertEqual(response.status_code, 200)

        # Keep the end date for the interaction for later testing
        date_start = Interaction.objects.get(session_id = SESSION_ID).date_start
        date_end_initial = Interaction.objects.get(session_id = SESSION_ID).date_end

        currInteaction = Interaction.objects.all()[0]
        # Advance interaction
        post_args = {
            'session_id': SESSION_ID,
            'message': 'Hello Denise'
        }
        url = reverse("chat:advance")
        response = self.client.post(url, data=post_args, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = json.loads(response.content)
        denise_response = response['message']
        # Test order field
        messages = list(list(Interaction.objects.filter(session_id = SESSION_ID))[
            0].message_set.all())
        message = [x for x in messages if x.text == denise_response][0]
        self.assertTrue(message.order==1)
        self.assertTrue(len(denise_response) > 0 and type(denise_response)==str)

        # Advance once more
        post_args = {
            'session_id': SESSION_ID,
            'message': 'Nice to meet you too'
        }
        url = reverse("chat:advance")
        response = self.client.post(url, data=post_args, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = json.loads(response.content)
        denise_response = response['message']
        # Test order field
        messages = list(list(Interaction.objects.filter(session_id=SESSION_ID))[
                            0].message_set.all())
        # Two responses may have the same text
        messages_filtered = [x for x in messages if x.text == denise_response]
        messages_filtered = sorted(messages_filtered, key=lambda x : x.order, reverse=True)
        message = messages_filtered[0]
        self.assertTrue(message.order == 3)
        self.assertTrue(len(denise_response) > 0 and type(denise_response) == str)

        # Test keep alive
        post_args = {
            'session_id': SESSION_ID,
        }
        url = reverse("chat:keep_alive")
        response = self.client.post(url, data=post_args, content_type='application/json')
        date_end_final = Interaction.objects.get(session_id = SESSION_ID).date_end
        self.assertTrue(response.status_code == 200)
        # Assert first duration smaller than final
        self.assertTrue((date_end_initial - date_start).total_seconds() < (date_end_final-
                                                                   date_start).total_seconds())




class QuestionIndexViewTests(TestCase):

    def test_two_past_questions(self):
        pass


class QuestionModelTests(TestCase):

    def test_was_published_recently_with_recent_question(self):
        pass