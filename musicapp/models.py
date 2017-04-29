from __future__ import unicode_literals

from django.db import models


class MusicTrack(models.Model):
    music_track_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200, null=True)
    rating = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "music_track"


class MusicGenre(models.Model):
    music_genre_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "music_genre"


class TrackGenre(models.Model):
    track_genre_id = models.AutoField(primary_key=True)
    music_track = models.ForeignKey(MusicTrack, on_delete=models.CASCADE)
    music_genre = models.ForeignKey(MusicGenre, on_delete=models.CASCADE)

    class Meta:
        db_table = "track_genre"
