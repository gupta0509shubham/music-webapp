import json
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework.decorators import api_view,renderer_classes
from rest_framework.renderers import JSONRenderer
from musicapp.models import MusicTrack,TrackGenre,MusicGenre
from django.http import HttpResponse
import logging
from datetime import datetime
myhandler = logging.StreamHandler()  # writes to stderr
myformatter = logging.Formatter(fmt='%(levelname)s: %(message)s')
myhandler.setFormatter(myformatter)
logger = logging.getLogger()
logger.addHandler(myhandler)


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def total_tracks_and_genres(request):
    try:
        tracks = MusicTrack.objects.all()
        count = len(tracks)
        genres_list = []
        genres = MusicGenre.objects.all()
        for row in genres:
            genres_list.append({
                'id': row.music_genre_id,
                'name': row.name
            })
        tracks_json = {
            "count": count,
            "genres": genres_list
        }
        return HttpResponse(json.dumps(tracks_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while fetching total tracks records"}
        return HttpResponse(error_json, content_type="application/json")


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def get_tracks(request):
    try:
        page_number = int(request.GET['pageNumber'])
        limit = int(request.GET['pageLimit'])
        start = (page_number*limit)-limit
        end = page_number*limit
        all_tracks =[]
        tracks = MusicTrack.objects.all()[start:end]
        for track in tracks:
            all_genres = []
            genres = TrackGenre.objects.filter(music_track=track.music_track_id)
            for genre in genres:
                all_genres.append(
                    {
                        "id": genre.music_genre_id,
                        "name": genre.music_genre.name
                    }
                )
            all_tracks.append(
                {
                    "id": track.music_track_id,
                    "title": track.title,
                    "rating": track.rating,
                    "genres": all_genres
                }
            )
        tracks_json = {
            "data": all_tracks,
            "count": len(all_tracks)
        }
        return HttpResponse(json.dumps(tracks_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while fetching tracks records"}
        return HttpResponse(error_json, content_type="application/json")


@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def add_tracks(request):
    try:
        genre_list = []
        created_at = datetime.now()
        updated_at = datetime.now()
        track_data = request.data['addDetails']
        name = track_data['name']
        rating = track_data['rating']
        genres = track_data['genres']
        track = MusicTrack(title=name, rating=rating, created_at=created_at, updated_at=updated_at)
        track.save()
        for genre in genres:
            genre_obj = MusicGenre.objects.get(music_genre_id=genre)
            track_genre = TrackGenre(music_track=track, music_genre=genre_obj)
            track_genre.save()

        track_genres = TrackGenre.objects.filter(music_track=track.music_track_id)
        for genre in track_genres:
            genre_list.append({
                "id": genre.music_genre.music_genre_id,
                "name": genre.music_genre.name
            })
        total_tracks = len(MusicTrack.objects.all())
        tracks_json = {
            "id": track.music_track_id,
            "title": track.title,
            "rating": track.rating,
            "genres": genre_list,
            "count": total_tracks
        }
        return HttpResponse(json.dumps(tracks_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while adding track records"}
        return HttpResponse(error_json, content_type="application/json")


@api_view(['GET'])
@renderer_classes((JSONRenderer,))
def get_track(request):
    try:
        genre_list = []
        track_id = request.GET['trackId']
        track = MusicTrack.objects.get(music_track_id=track_id)
        genres = TrackGenre.objects.filter(music_track=track_id)

        for genre in genres:
            genre_list.append({
                "id": genre.music_genre.music_genre_id,
                "name": genre.music_genre.name
            })

        tracks_json = {
            "id": track.music_track_id,
            "name": track.title,
            "rating": track.rating,
            "genres": genre_list
        }
        return HttpResponse(json.dumps(tracks_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while fetching track record"}
        return HttpResponse(json.dumps(error_json, cls=DjangoJSONEncoder), content_type="application/json")


@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def edit_track(request):
    try:
        updated_at = datetime.now()
        track_data = request.data['editDetails']
        track_id = request.data['trackId']
        name = track_data['name']
        rating = track_data['rating']
        print track_data, track_id
        print name
        track = MusicTrack.objects.get(music_track_id=track_id)
        track.title = name
        track.rating = rating
        track.updated_at = updated_at
        track.save(update_fields=['title', 'rating', 'updated_at'])
        tracks_json = {
            "id": track.music_track_id,
            "name": track.title,
            "rating": track.rating
        }
        return HttpResponse(json.dumps(tracks_json, cls=DjangoJSONEncoder), content_type="application/json")
    except Exception as error:
        logger.error(error)
        error_json = {"msg": "An error occured while editing track records"}
        return HttpResponse(error_json, content_type="application/json")