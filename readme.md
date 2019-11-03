```
ffmpeg -y  -i source.mp4   -force_key_frames "expr:gte(t,n_forced*2)"   -sc_threshold 0   -c:v libx264 -b:v 1500k   -c:a copy   -hls_time 2   -hls_playlist_type vod   -hls_segment_type fmp4   -hls_segment_filename "output%d.m4s"   output.m3u8
```