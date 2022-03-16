import random
from datetime import timedelta
from typing import List

from django.shortcuts import get_object_or_404

# Create your views here.
from django.http import HttpResponse, HttpRequest
import json

from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from .models import Interaction, Message


@csrf_exempt
def index(request: HttpRequest):
    if request.method == "GET":
        obj_to_dump = {
            "method": request.method,
            "otherstuff": {
                'a': [
                    request.path,
                    request.path,
                    request.content_type,
                    request.COOKIES,
                    list(request.__dict__.keys()),
                ],
                'FORW': request.META.get('HTTP_X_FORWARDED_FOR'),
                'reqmetaremote': request.META.get('REMOTE_ADDR')
            }
        }
        response = HttpResponse(json.dumps(obj_to_dump), content_type="application/json")
        response['Age'] = 999
        return response
    elif request.method == "POST":
        obj_to_dump = {
            "method": request.method,
            "otherstuff": {
                'a': [
                    request.path,
                    request.path,
                    request.content_type,
                    request.COOKIES,
                    list(request.__dict__.keys())
                ]
            }
        }
        response = HttpResponse(json.dumps(obj_to_dump), content_type="application/json")
        response['Age'] = 999
        return response


@csrf_exempt
def interaction_detail(request: HttpRequest, pk: int):
    """
    Shows details of the interaction
    :param request:
    :param pk:
    :return:
    """
    obj: Interaction = get_object_or_404(Interaction, pk=pk)
    messages: List[Message] = obj.message_set.all()
    serializeable_obj = [{'text': x.text, 'is_denise': x.is_denise, 'order': x.order} for x in
                         messages]
    return HttpResponse(json.dumps(serializeable_obj), content_type='application/json')


@csrf_exempt
def initiate_interaction(request: HttpRequest):
    """
    Initiates an interaction:
        Parameters in POST:
            1) Session id
            2) Remote ip
    """
    if request.method == "POST":
        params = json.loads(request.body)
        print("Initiate params ", params)
        session_id = params['session_id']
        remote_ip = params['remote_ip']
        date_start = timezone.now()
        date_end = timezone.now() + timedelta(seconds=1)
        same_session_id_interactions = list(Interaction.objects.filter(session_id=session_id))
        if len(same_session_id_interactions) == 0:
            Interaction.objects.create(session_id=session_id, remote_ip=remote_ip,
                                       date_start=date_start, date_end=date_end)
        else:
            # Update the session info (should never happen)
            same_session_id_interactions[0].date_start = date_start
            same_session_id_interactions[0].date_end = date_end
            same_session_id_interactions[0].save()
        return HttpResponse("Ok done", status=200)
    else:
        return HttpResponse(status=400)


@csrf_exempt
def advance_interaction(request: HttpRequest):
    """
    Registers a user's message encoded in a json.
    Encoded in a json input of a POST request should be
        1) The session_id
        2) The message to sent at the field message.

    Returns a json object with Denise's response
    if successful
    :param request:
    :return:
    """
    if request.method == "POST":
        params = json.loads(request.body)
        session_id = params['session_id']
        interaction = Interaction.objects.filter(session_id=session_id)[0]
        curr_order = max( [x.order for x in interaction.message_set.all()] + [-1])
        message = params['message']
        Message.objects.create(interaction = interaction, order=curr_order + 1, is_denise=False,
                               text=message)

        response = denise_response(message, session_id)
        Message.objects.create(interaction=interaction, order=curr_order + 2, is_denise=True,
                               text=response)
        content = {'message' : response}
        return HttpResponse(json.dumps(content), status=200, content_type='application/json')
    else:
        return HttpResponse(status=400)

def denise_response(last_text, session_id):
    responses = [
        'Hi! How are you?',
        'Hello! I wanted to talk to you about something',
        "You look like an interesting person, Let's talk",
        'Heyyy, how are ya',
        'Yoo',
        'Hahaha that was nice',
        "Hello there!",
        "Good to see you",
        "You look like a charming person",
        "Tell me more about yourself",
        "How do you like me so far? Am i good?",
        "Am I a nice talker?",
        "Do you like me?",
    ]
    res = random.choice(responses)
    print("Denise returning ", res)
    return res

@csrf_exempt
def info(request: HttpRequest):
    res = {
        'version' : "0.0.2",
        'ninteractions' : len(Interaction.objects.all())
    }
    return HttpResponse(json.dumps(res), content_type='application/json')

@csrf_exempt
def keep_alive(request: HttpRequest):
    """
    Keeps alive the session (updates the date end)
    POST requirements:
        1 json object with the property of session_id
    """
    if request.method == "POST":
        params = json.loads(request.body)
        print("Keep alive params ", params)
        session_id = params['session_id']
        interaction = Interaction.objects.filter(session_id=session_id)[0]
        interaction.date_end = timezone.now() + timedelta(seconds=1)
        interaction.save()
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400)

