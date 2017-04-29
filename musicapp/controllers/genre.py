import json
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework.decorators import api_view,renderer_classes
from rest_framework.renderers import JSONRenderer
from musicapp.models import MusicGenre
from django.http import HttpResponse
from datetime import datetime
import logging
logger = logging.getLogger()


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def total_genres(request):
    try:
        genres = MusicGenre.objects.all()
        count = len(genres)
        print count
        tracks_json = {
            "count": count,
        }
        return HttpResponse(json.dumps(tracks_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while fetching total genres"}
        return HttpResponse(error_json, content_type="application/json")


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def get_generes(request):
    try:
        all_genres =[]
        page_number = int(request.GET['pageNumber'])
        limit = int(request.GET['pageLimit'])
        start = (page_number*limit)-limit
        end = page_number*limit
        genres = MusicGenre.objects.all()[start:end]
        print page_number,limit
        for genre in genres:
            all_genres.append(
                {
                    "id": genre.music_genre_id,
                    "name": genre.name,
                }
            )
        genres_json = {
            "data": all_genres
        }
        return HttpResponse(json.dumps(genres_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while fetching genres records"}
        return HttpResponse(error_json, content_type="application/json")


@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def add_genres(request):
    try:
        created_at = datetime.now()
        updated_at = datetime.now()
        genre_data = request.data['addDetails']
        print genre_data
        name = genre_data['name']
        print name
        genre = MusicGenre(name=name, created_at=created_at, updated_at=updated_at)
        genre.save()
        total_genres = len(MusicGenre.objects.all())
        genres_json = {
            "id": genre.music_genre_id,
            "name": genre.name,
            "count": total_genres
        }
        return HttpResponse(json.dumps(genres_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while adding genre record."}
        return HttpResponse(error_json, content_type="application/json")


@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def edit_genres(request):
    try:
        updated_at = datetime.now()
        genre_data = request.data['editDetails']
        genre_id = request.data['genreId']
        name = genre_data['name']
        print genre_data,genre_id
        print name
        genre = MusicGenre.objects.get(music_genre_id=genre_id)
        genre.name = name
        genre.save(update_fields=['name'])
        genres_json = {
            "id": genre.music_genre_id,
            "name": genre.name,
        }
        return HttpResponse(json.dumps(genres_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while editing genre records"}
        return HttpResponse(error_json, content_type="application/json")


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def get_genre(request):
    try:
        genre_id = request.GET['genreId']
        genre = MusicGenre.objects.get(music_genre_id=genre_id)
        genres_json = {
            "id": genre.music_genre_id,
            "name": genre.name,
        }
        return HttpResponse(json.dumps(genres_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while fetching genre record"}
        return HttpResponse(json.dumps(error_json, cls=DjangoJSONEncoder), content_type="application/json")