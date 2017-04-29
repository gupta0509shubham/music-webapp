from django.conf.urls import url
import views
from musicapp.controllers import track, genre

urlpatterns = [
    url(r'^$', views.home, name='home'),

    # Track Specific URL's
    url(r'^total_tracks_genres/$', track.total_tracks_and_genres, name='total_tracks'),
    url(r'^tracks/$', track.get_tracks, name='get_tracks'),
    url(r'^add_tracks/$', track.add_tracks, name='add_tracks'),
    url(r'^get_track', track.get_track, name='get_track'),

    # Genre Specific URL's
    url(r'^genres/$', genre.get_generes, name='get_genres'),
    url(r'^total_genres/$', genre.total_genres, name='total_genres'),
    url(r'^add_genres/$', genre.add_genres, name='add_genres'),
    url(r'^edit_genres/$', genre.edit_genres, name='edit_genres'),
    url(r'^get_genre', genre.get_genre, name='get_genre')
]
