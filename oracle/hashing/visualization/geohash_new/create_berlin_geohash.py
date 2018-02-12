import geohash
from polygon_geohasher.polygon_geohasher import polygon_to_geohashes, geohashes_to_polygon
from shapely.geometry import Polygon, mapping

from area import area
import itertools

def compress(hashes):
    len_hash = len(hashes[0])
    new_prefix = True
    prefix = ""
    for i in range(0, len_hash):
        for j in range(0, len(hashes)-1):

            if hashes[j][i] != hashes[j+1][i]:
                new_prefix = False
        if new_prefix:
            prefix = hashes[0][:i+1]
    for i in range(1, len_hash - len(prefix)):
        base32chars = 'bcdefgjhkmnpqrstuvwxyz0123456789'
        l = [prefix + ''.join(x) for x in itertools.product(base32chars, repeat=i)]
        for p in l:
            count = len([x for x in hashes if p in x])
            if count == (32 ** (len_hash - len(p))):
                hashes = [x for x in hashes if not p in x]
                hashes.append(p)

    return hashes

def read_fence():
    with open("fence_berlin.txt") as fp:
        line = fp.readline()

        x = line.replace("(", "")
        x = x.replace(")", "")
        cords = x.split(",")
        latlon = []
        for i in range(0, len(cords), 2):
            latlon.append((float(cords[i]), float(cords[i + 1])))
        return latlon

def create_geojson(polygon):
    coordinates = [[]]

    for point in polygon:
        coordinates[0].append([point[0], point[1]])
    obj = {'type':'Polygon','coordinates':coordinates}
    return obj

def generate_geohash():

    fence = read_fence()
    precision = 7

    polygon = Polygon(fence)
    real_area = area(create_geojson(mapping(polygon)["coordinates"][0])) / 1000000

    geohashes_polygon = polygon_to_geohashes(polygon, precision, False)
    polygon = geohashes_to_polygon(geohashes_polygon)

    perc_area = 100 * (area(create_geojson(mapping(polygon)["coordinates"][0])) / 1000000) / real_area
    print(perc_area)
    points = []
    for hash in compress(list(geohashes_polygon)):
        bbox = geohash.bbox(hash)
        lat1 = bbox['s']
        lat2 = bbox['n']
        lon1 = bbox['w']
        lon2 = bbox['e']
        points.append(lat1)
        points.append(lon1)
        points.append(lat2)
        points.append(lon1)
        points.append(lat2)
        points.append(lon2)
        points.append(lat1)
        points.append(lon2)
    f = open("fences_points.txt", "w")
    f.write(str(points))
    f.close()

generate_geohash()
