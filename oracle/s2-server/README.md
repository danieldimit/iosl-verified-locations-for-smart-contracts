
# EXAMPLE Requests

### Convert Geofence in polygons and cell ids

```bash
 curl -i localhost:8180/s2/polygon/ -H "Content-Type: application/json" -H "Accept: application/json" -d '{"geofence":[{"lat":"13.1", "lon":"15.2"}, {"lat":"14.1", "lon":"15.2"}, {"lat":"14.1", "lon":"16.2"}, {"lat":"13.1", "lon":"16.2"} ]}'
```

### Convert Cell Id in 4 latlon points

```bash
curl -i localhost:8180/s2/1231720727346937856 -H "Accept: application/json"
```

# Run inside a container

```
docker build -t s2-server . && docker run -it -p 8180:8180 s2-server
```